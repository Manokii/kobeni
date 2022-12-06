import { createRouteConfig, Outlet } from "@tanstack/react-router";

export const rootRoute = createRouteConfig({
  component: () => {
    return <Outlet />;
  },
});
