import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createDigitalAssetLicenseWorkFlow } from "../../../workflows/digital-asset-license/workflows/create-digital-asset-licenses";
import { updateDigitalAssetLicenseWorkFlow } from "../../../workflows/digital-asset-license/workflows/update-digital-asset-licenses";
import { CreateDigitalAssetLicenseType, UpdateDigitalAssetLicenseType } from "./validators";
import { DIGITAL_ASSET } from "../../../modules/digital-asset";
import DigitalAssetService from "../../../modules/digital-asset/service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { license_id, customer_id, order_item_id } = req.query as {
    license_id?: string;
    customer_id?: string;
    order_item_id?: string;
  };

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const isExercisedRaw = req.query.is_exercised;
    const isExercised =
      isExercisedRaw === "true" ? true : isExercisedRaw === "false" ? false : undefined;

    const { data: licenses, metadata: { count, skip, take } = {} } = await query.graph({
      entity: "digital_asset_license",
      fields: ["id", "digital_asset_id", "customer_id", "order_item_id", "is_exercised"],
      filters: {
        ...(license_id && { id: license_id }),
        ...(customer_id && { customer_id }),
        ...(order_item_id && { order_item_id }),
        ...(isExercised !== undefined && { is_exercised: isExercised }),
      },
      pagination: {
        skip: offset,
        take: limit,
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
  console.log("input:", input);

  try {
    const { result } = await createDigitalAssetLicenseWorkFlow(req.scope).run({ input });
    console.log("result:", result);
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

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { license_id } = req.query;

  try {
    if (!license_id || typeof license_id !== "string" || license_id.trim() === "") {
      throw new Error("required license_id");
    }

    const digitalAssetLicenseService: DigitalAssetService = req.scope.resolve(DIGITAL_ASSET);
    await digitalAssetLicenseService.softDeleteDigitalAssetLicenses([license_id as string]);
    return res.status(200).json({ success: true, message: "license deleted successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
