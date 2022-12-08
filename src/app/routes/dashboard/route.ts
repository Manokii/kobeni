import { lazy } from "react"
import { rootRoute } from "../__root"

const LayoutLazy = lazy(() => import("./layout"))
const MainPage = lazy(() => import("./main.page"))

export const dashboardRoute = rootRoute.createRoute({ path: "dashboard", component: LayoutLazy })
export const dashboardIndexRoute = dashboardRoute.createRoute({ path: "/", component: MainPage })
export const allDashboardRoutes = dashboardRoute.addChildren([dashboardIndexRoute])

export default allDashboardRoutes
