import {
  authenticate,
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http";
import { CreateDigitalAssetLicenseSchema } from "./digital-asset-licenses/validators";
import { CreateDigitalAssetSchema, UpdateDigitalAssetSchema } from "./digital-assets/validators";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/*",
      middlewares: [authenticate("user", ["bearer"])],
    },
    {
      matcher: "/admin/digital-assets",
      method: ["POST"],
      middlewares: [validateAndTransformBody(CreateDigitalAssetSchema)],
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
  ],
});
