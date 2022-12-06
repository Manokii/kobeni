import { rootRoute } from "./__root";

export const indexRoute = rootRoute.createRoute({
  path: "/",
  component: Home,
});

function Home() {
  return (
    <div>
      <div>test</div>
    </div>
  );
}
