import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { CreateFileDTO } from "@medusajs/framework/types";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils";
import { DIGITAL_ASSET } from "../../../modules/digital-asset";
import DigitalAssetService from "../../../modules/digital-asset/service";
import { CreateDigitalAssetType, DeleteBatchDigitalAssetType } from "./validators";

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    const deletedAtParam = req.query.deleted_at;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const search = (req.query.search as string) || "";
    const excludeVariantId = req.query.exclude_variant_id as string;
    const statusFilters = (req.query.status as string[]) || [];
    const orderBy = req.query.order as string;

    let filters: any = {};

    //  "all"이 오면 모든 항목(삭제됨 + 활성) 표시
    if (
      deletedAtParam === "all" ||
      (Array.isArray(deletedAtParam) && deletedAtParam.includes("all"))
    ) {
      filters.$or = [{ deleted_at: null }, { deleted_at: { $ne: null } }];
    } else if (
      // 삭제된 항목만 표시
      deletedAtParam === "true" ||
      (Array.isArray(deletedAtParam) && deletedAtParam.includes("true"))
    ) {
      filters.deleted_at = { $ne: null };
      console.log("삭제된 항목만 표시");
    } else {
      // 삭제되지 않은 항목만 표시
      filters.deleted_at = null;
    }

    if (search) {
      filters = {
        ...filters,
        $or: [{ name: { $like: `%${search}%` } }, { id: { $like: `%${search}%` } }],
      };
    }

    if (statusFilters && statusFilters.length > 0) {
      const mimeTypeFilters = Array.isArray(statusFilters) ? statusFilters : [statusFilters];

      if (mimeTypeFilters.length > 0) {
        const mimeTypeConditions = mimeTypeFilters.map((filter) => {
          if (filter.endsWith("/")) {
            return { $like: `${filter}%` };
          }
          return filter;
        });

        filters = {
          ...filters,
          mime_type: { $or: mimeTypeConditions },
        };
      }
    }

    if (excludeVariantId) {
      const { data: linkedAssets } = await query.graph({
        entity: "digital_asset_product_variant",
        fields: ["*"],
        filters: {
          product_variant_id: excludeVariantId,
        },
      });

      if (linkedAssets && linkedAssets.length > 0) {
        const linkedAssetIds = linkedAssets.map((link) => link.digital_asset_id);

        filters = {
          ...filters,
          id: { $nin: linkedAssetIds },
        };
      }
    }

    const digitalAssetService: DigitalAssetService = req.scope.resolve(DIGITAL_ASSET);

    let orderOptions = {};
    if (orderBy) {
      const desc = orderBy.startsWith("-");
      const field = desc ? orderBy.substring(1) : orderBy;

      const allowedSortFields = ["id", "name", "created_at", "updated_at"];

      if (allowedSortFields.includes(field)) {
        orderOptions = {
          order: {
            [field]: desc ? "DESC" : "ASC",
          },
        };
      }
    }

    const { data: digital_assets, metadata: { count } = {} } = await query.graph({
      entity: DIGITAL_ASSET,
      fields: [
        "id",
        "name",
        "file_url",
        "thumbnail_url",
        "mime_type",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      filters: filters,
      pagination: {
        skip: offset,
        take: limit,
        ...orderOptions,
      },
    });

    return res.status(200).json({
      digital_assets,
      pagination: {
        count: count || 0,
        offset,
        limit,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function POST(req: MedusaRequest<CreateDigitalAssetType>, res: MedusaResponse) {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const file = files?.file?.[0];
  const thumbnail = files?.thumbnail?.[0];

  if (!file) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "No file was uploaded");
  }

  const uploadFiles: CreateFileDTO[] = [];

  uploadFiles.push({
    filename: file.originalname,
    mimeType: file.mimetype,
    content: file.buffer.toString("binary"),
    access: "private" as const,
  });

  if (thumbnail) {
    uploadFiles.push({
      filename: thumbnail.originalname,
      mimeType: thumbnail.mimetype,
      content: thumbnail.buffer.toString("binary"),
      access: "public" as const,
    });
  }

  try {
    const { result } = await uploadFilesWorkflow(req.scope).run({
      input: {
        files: uploadFiles.map((file) => ({
          ...file,
          access: file.access as "private" | "public",
        })),
      },
    });

    const mainFileInfo = result[0];
    const thumbnailFileInfo = thumbnail ? result[1] : undefined;

    const digitalAssetService: DigitalAssetService = req.scope.resolve(DIGITAL_ASSET);
    const digitalAsset = await digitalAssetService.createDigitalAssets({
      name: req.body.name,
      file_id: mainFileInfo.id,
      mime_type: file.mimetype,
      file_url: mainFileInfo.url,
      thumbnail_url: thumbnailFileInfo?.url,
    });

    res.status(200).json({
      digital_asset: digitalAsset,
    });
  } catch (error) {
    console.error("디지털 자산 업로드 오류:", error);
    res.status(500).json({
      message: error.message || "파일 업로드 중 오류가 발생했습니다",
      code: error.type || "unknown_error",
    });
  }
}

export async function DELETE(req: MedusaRequest<DeleteBatchDigitalAssetType>, res: MedusaResponse) {
  const { ids } = req.body;

  if (!ids) {
    return res.status(400).json({
      message: "ids is required",
    });
  }

  const digitalAssetService: DigitalAssetService = req.scope.resolve(DIGITAL_ASSET);

  const deletedAssets = await digitalAssetService.softDeleteDigitalAssets(ids);

  return res.status(200).json({
    message: "디지털 자산 삭제가 완료되었습니다.",
  });
}
