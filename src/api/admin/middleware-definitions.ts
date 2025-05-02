import { authenticate, validateAndTransformBody } from "@medusajs/framework/http";
import multer from "multer";
import {
  CreateDigitalAssetLicenseSchema,
  UpdateDigitalAssetLicenseSchema,
} from "./digital-asset-licenses/validators";
import { CreateDigitalAssetSchema, UpdateDigitalAssetSchema } from "./digital-assets/validators";

const upload = multer({ storage: multer.memoryStorage() });

const debugLogMiddleware = (req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Files:", req.files);
  next();
};

export const adminMiddlewares = {
  routes: [
    {
      matcher: "/admin/*",
      middlewares: [authenticate("user", ["session", "bearer"])],
    },
    {
      matcher: "/admin/digital-assets",
      method: ["POST"],
      middlewares: [
        debugLogMiddleware,
        upload.array("files"),
        validateAndTransformBody(CreateDigitalAssetSchema),
      ],
    },
    {
      matcher: "/admin/digital-assets/:id",
      method: ["PATCH"],
      middlewares: [validateAndTransformBody(UpdateDigitalAssetSchema)],
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
