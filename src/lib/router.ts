import express from "express";
import { resolve } from "path";
import { State } from "./state";

export function initRouter(state: State) {
  const router = express.Router();

  router.get("/static", (req, res) => {
    res.sendFile(resolve(__dirname, `./../${req.query.path}`));
  });

  router.get("/agents", (_, res) => {
    res.send(Object.fromEntries(state.agents));
  });

  router.get("/status", (_, res) => {
    res.send(state.status);
  });

  router.get("/", (_, res) => {
    res.send({ ...state, agents: Object.fromEntries(state.agents) });
  });

  router.post("/reset", async () => {
    state.reset();
    return { message: "A reset was requested", success: true };
  });

  return router;
}
