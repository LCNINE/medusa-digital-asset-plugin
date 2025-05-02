import { defineMiddlewares } from "@medusajs/framework";
import { adminMiddlewares } from "./admin/middleware-definitions";
import { storeMiddlewares } from "./store/library/middlewares-definitions";

export default defineMiddlewares({
  routes: [...adminMiddlewares.routes, ...storeMiddlewares.routes],
});
