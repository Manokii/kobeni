import { lazy } from "react"
import { rootRoute } from "./__root"

const Home = lazy(() => import("./home/home.page"))

export const indexRoute = rootRoute.createRoute({
  path: "/",
  component: Home,
})
