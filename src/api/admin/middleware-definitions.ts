import {
  authenticate,
  validateAndTransformBody,
} from "@medusajs/framework/http";
import type { MiddlewareRoute } from "@medusajs/framework/http";
import multer from "multer";
import {
  CreateDigitalAssetLicenseSchema,
  UpdateDigitalAssetLicenseSchema,
} from "./digital-asset-licenses/validators";
import {
  CreateDigitalAssetSchema,
  DeleteBatchDigitalAssetSchema,
  UpdateDigitalAssetSchema,
} from "./digital-assets/validators";

const upload = multer({ storage: multer.memoryStorage() });
const authenticateAdmin = authenticate("user", ["session", "bearer"]);

export const adminMiddlewares: { routes: MiddlewareRoute[] } = {
  routes: [
    {
      matcher: "/admin/digital-assets",
      middlewares: [authenticateAdmin],
    },
    {
      matcher: "/admin/digital-assets/*",
      middlewares: [authenticateAdmin],
    },
    {
      matcher: "/admin/digital-asset-licenses",
      middlewares: [authenticateAdmin],
    },
    {
      matcher: "/admin/digital-asset-licenses/*",
      middlewares: [authenticateAdmin],
    },
    {
      matcher: "/admin/digital-assets",
      method: ["POST"],
      middlewares: [
        upload.fields([
          { name: "file", maxCount: 1 },
          { name: "thumbnail", maxCount: 1 },
        ]),
        validateAndTransformBody(CreateDigitalAssetSchema),
      ],
    },
    {
      matcher: "/admin/digital-assets/batch-delete",
      method: ["POST"],
      middlewares: [validateAndTransformBody(DeleteBatchDigitalAssetSchema)],
    },
    {
      matcher: "/admin/digital-assets/:id",
      method: ["PATCH"],
      middlewares: [
        upload.fields([
          { name: "file", maxCount: 1 },
          { name: "thumbnail", maxCount: 1 },
        ]),
        validateAndTransformBody(UpdateDigitalAssetSchema),
      ],
    },
    {
      matcher: "/admin/digital-asset-licenses",
      method: ["POST"],
      middlewares: [validateAndTransformBody(CreateDigitalAssetLicenseSchema)],
    },
    {
      matcher: "/admin/digital-asset-licenses/*",
      method: ["PATCH"],
      middlewares: [validateAndTransformBody(UpdateDigitalAssetLicenseSchema)],
    },
  ],
};
