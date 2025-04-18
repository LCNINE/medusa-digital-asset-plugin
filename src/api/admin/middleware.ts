import {
    authenticate,
    defineMiddlewares
} from "@medusajs/framework/http"
  
  export default defineMiddlewares({
    routes: [
      {
        matcher: "/admin/*",
        middlewares: [authenticate("admin", ["bearer"])],
      },
    ],
  })