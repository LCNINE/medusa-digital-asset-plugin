import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { DIGITAL_ASSET } from "../../../modules/digital-asset";
import DigitalAssetService from "../../../modules/digital-asset/service";
import { createDigitalAssetLicenseWorkFlow } from "../../../workflows/digital-asset-license/workflows/create-digital-asset-licenses";
import { updateDigitalAssetLicenseWorkFlow } from "../../../workflows/digital-asset-license/workflows/update-digital-asset-licenses";
import { CreateDigitalAssetLicenseType, UpdateDigitalAssetLicenseType } from "./validators";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { license_id, customer_id, order_item_id, search, order } = req.query as {
    license_id?: string;
    customer_id?: string;
    order_item_id?: string;
    search?: string;
    order?: string;
  };

  const statusFilters = (req.query.status as string[]) || [];
  const deleted_at = (req.query.deleted_at as string[]) || [];
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const isExercisedRaw = req.query.is_exercised;
    const isExercised =
      isExercisedRaw === "true" ? true : isExercisedRaw === "false" ? false : undefined;

    let filters: any = {
      ...(license_id && { id: license_id }),
      ...(customer_id && { customer_id }),
      ...(order_item_id && { order_item_id }),
      ...(isExercised !== undefined && { is_exercised: isExercised }),
    };

    if (search) {
      filters = {
        ...filters,
        $or: [
          { id: { $like: `%${search}%` } },
          { customer_id: { $like: `%${search}%` } },
          { order_item_id: { $like: `%${search}%` } },
        ],
      };
    }

    if (statusFilters && statusFilters.length > 0) {
      const statusConditions = statusFilters.map((status) => {
        if (status === "exercised") {
          return { is_exercised: true };
        } else if (status === "not_exercised") {
          return { is_exercised: false };
        }
        return {};
      });

      if (statusConditions.length > 0) {
        filters = {
          ...filters,
          $or: statusConditions,
        };
      }
    }

    if (deleted_at && deleted_at.length > 0) {
      filters = {
        ...filters,
        deleted_at: { $ne: null },
      };
    } else {
      filters = {
        ...filters,
        deleted_at: null,
      };
    }

    let orderOptions = {};
    if (order) {
      const desc = order.startsWith("-");
      const field = desc ? order.substring(1) : order;

      const allowedSortFields = ["id", "customer_id", "created_at", "updated_at", "is_exercised"];

      if (allowedSortFields.includes(field)) {
        orderOptions = {
          order: {
            [field]: desc ? "DESC" : "ASC",
          },
        };
      }
    }

    const { data: licenses, metadata: { count, skip, take } = {} } = await query.graph({
      entity: "digital_asset_license",
      fields: ["*"],
      filters: filters,
      pagination: {
        skip: offset,
        take: limit,
        ...orderOptions,
      },
    });

    return res.status(200).json({
      licenses,
      pagination: {
        count,
        skip,
        take,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function POST(req: MedusaRequest<CreateDigitalAssetLicenseType>, res: MedusaResponse) {
  const input = req.body;

  try {
    const { result } = await createDigitalAssetLicenseWorkFlow(req.scope).run({ input });

    return res.status(201).json({ license: result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function PATCH(
  req: MedusaRequest<UpdateDigitalAssetLicenseType>,
  res: MedusaResponse,
) {
  const { license_id } = req.query;
  const updateData = req.body;

  try {
    if (!license_id || typeof license_id !== "string" || license_id.trim() === "") {
      throw new Error("required license_id");
    }

    const newLicense = {
      ...updateData,
      id: license_id,
    };

    const { result } = await updateDigitalAssetLicenseWorkFlow(req.scope).run({
      input: newLicense,
    });

    return res.status(200).json({ license: result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function DELETE(req: MedusaRequest<{ ids: string[] }>, res: MedusaResponse) {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      message: "유효한 라이센스 ID 배열이 필요합니다",
    });
  }

  try {
    const digitalAssetService: DigitalAssetService = req.scope.resolve(DIGITAL_ASSET);

    await digitalAssetService.deleteDigitalAssetLicenses(ids);

    return res.status(200).json({
      success: true,
      message: "라이센스가 성공적으로 삭제되었습니다",
    });
  } catch (error) {
    console.error(`❌ 라이센스 삭제 오류:`, error);
    return res.status(500).json({
      message: `라이센스 삭제 중 오류가 발생했습니다: ${error.message}`,
    });
  }
}
