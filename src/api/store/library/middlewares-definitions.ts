import { authenticate } from "@medusajs/framework/http";

export const storeMiddlewares = {
  routes: [
    {
      matcher: "/store/library/*",
      middlewares: [authenticate("store", ["session", "bearer"])],
    },
  ],
};
