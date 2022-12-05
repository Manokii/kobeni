import { createReactRouter } from "@tanstack/react-router";
import { indexRoute } from "./routes";
import { dashboardIndexRoute, dashboardRoute } from "./routes/dashboard";
import { rootRoute } from "./routes/__root";

const routeConfig = rootRoute.addChildren([
  indexRoute,
  dashboardRoute.addChildren([dashboardIndexRoute]),
]);
export const router = createReactRouter({ routeConfig });

declare module "@tanstack/react-router" {
  interface RegisterRouter {
    router: typeof router;
  }
}
