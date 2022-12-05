import { AppShell } from "@mantine/core";
import { Outlet } from "@tanstack/react-router";
import SideNav from "../../comps/side_nav";

const DashboardLayout = () => {
  return (
    <AppShell navbar={<SideNav />}>
      <div>
        <Outlet />
      </div>
    </AppShell>
  );
};

export default DashboardLayout;
