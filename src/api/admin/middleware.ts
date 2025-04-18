import {
    authenticate,
    defineMiddlewares,
    validateAndTransformBody
} from "@medusajs/framework/http"
import { CreateDigitalAssetSchema, UpdateDigitalAssetSchema } from "./digital-assets/validators"
  
export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/*",
      middlewares: [authenticate("admin", ["bearer"])],
    },
    {
      matcher: "/admin/digital-assets",
      method: "POST",
      middlewares: [
        authenticate("admin", ["bearer"]),
        validateAndTransformBody(CreateDigitalAssetSchema),
      ],
    },
    {
      matcher: "/admin/digital-assets",
      method: "PATCH",
      middlewares: [
        authenticate("admin", ["bearer"]),
        validateAndTransformBody(UpdateDigitalAssetSchema),
      ],
    },
  ],
})