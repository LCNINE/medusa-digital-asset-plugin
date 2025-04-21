import {
    defineMiddlewares,
    authenticate,
} from "@medusajs/framework/http"

export default defineMiddlewares({
    routes: [
        {
            matcher: "/store/library/*",
            middlewares: [authenticate("customer", ["session", "bearer"])],
        },
    ],
})