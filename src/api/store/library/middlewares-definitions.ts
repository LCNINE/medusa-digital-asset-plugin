import { authenticate } from "@medusajs/framework/http";
import type { MiddlewareRoute } from "@medusajs/framework/http";

const authenticateCustomer = authenticate("customer", ["session", "bearer"], {
  allowUnauthenticated: true,
  allowUnregistered: true,
});

export const storeMiddlewares: { routes: MiddlewareRoute[] } = {
  routes: [
    {
      matcher: "/store/library",
      middlewares: [authenticateCustomer],
    },
    {
      matcher: "/store/library/*",
      middlewares: [authenticateCustomer],
    },
  ],
};
