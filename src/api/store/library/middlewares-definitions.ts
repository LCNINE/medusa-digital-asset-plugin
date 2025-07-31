import { authenticate } from "@medusajs/framework/http";

export const storeMiddlewares = {
  routes: [
    {
      matcher: "/store/*",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
  ],
};
