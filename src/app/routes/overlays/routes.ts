import { lazy } from "react";
import { z } from "zod";
import { rootRoute } from "../__root";

const validateSide = (val: string) => z.enum(["red", "blue"] as const).parse(val);

const overlayRoute = rootRoute.createRoute({ path: "overlays" });

// Team Routes
const TeamPage = lazy(() => import("./team/team.page"));
const teamRoute = overlayRoute.createRoute({
  path: "team/$side",
  component: TeamPage,
  parseParams: (params) => ({ side: validateSide(params.side) }),
  stringifyParams: ({ side }) => ({ side: `${side}` }),
});

// Map Routes
const MapVectorPage = lazy(() => import("./map/map.vector.page"));
const MapSmallPage = lazy(() => import("./map/map.small.page"));
const MapSplashPage = lazy(() => import("./map/map.splash.page"));
const mapRoute = overlayRoute.createRoute({ path: "map" });
const mapVectorRoute = mapRoute.createRoute({ path: "vector", component: MapVectorPage });
const mapSmallRoute = mapRoute.createRoute({ path: "small", component: MapSmallPage });
const mapSplashRoute = mapRoute.createRoute({ path: "splash", component: MapSplashPage });
const allMapRoutes = mapRoute.addChildren([mapVectorRoute, mapSmallRoute, mapSplashRoute]);

// Player Routes
const playerSearch = z.object({
  hideNames: z.boolean().optional(),
  playerGap: z.number().optional(),
  teamGap: z.number().optional(),
  px: z.number().optional(),
  py: z.number().optional(),
  p: z.number().optional(),
});

const PlayerAllPage = lazy(() => import("./player/player.scene.page"));
const PlayerTeamPage = lazy(() => import("./player/player.team.page"));
const PlayerSoloPage = lazy(() => import("./player/player.solo.page"));
const playerRoute = overlayRoute.createRoute({ path: "players" });
const playerAllRoute = playerRoute.createRoute({
  path: "/",
  component: PlayerAllPage,
  validateSearch: playerSearch,
});
const playerTeamRoute = playerRoute.createRoute({
  path: "$side",
  caseSensitive: true,
  component: PlayerTeamPage,
  validateSearch: playerSearch,
  parseParams: (params) => ({ side: validateSide(params.side) }),
  stringifyParams: (params) => ({ side: `${params.side}` }),
});

const playerSoloRoute = playerRoute.createRoute({
  path: "$side/$playerIndex",
  component: PlayerSoloPage,
  validateSearch: playerSearch,
  parseParams: (params) => ({
    side: validateSide(params.side),
    playerIndex: z.preprocess(Number, z.number().int().min(1).max(5)).parse(params.playerIndex),
  }),
  stringifyParams: (params) => ({ playerIndex: `${params.playerIndex}`, side: `${params.side}` }),
});

const allPlayerRoutes = playerRoute.addChildren([playerAllRoute, playerSoloRoute, playerTeamRoute]);

export const allOverlayRoutes = overlayRoute.addChildren([
  teamRoute,
  allMapRoutes,
  allPlayerRoutes,
]);
export default allOverlayRoutes;
