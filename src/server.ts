import "dotenv/config";
import express from "express";
import { State } from "lib/state";
import { join } from "path";
import { initRouter } from "./lib/router";

export const { PORT = 3001 } = process.env;

async function initServer() {
  const state = new State();
  const app = express();

  // Middleware that parses json and looks at requests
  // where the Content-Type header matches the type option.
  app.use(express.json());

  // Serve API requests from the router
  app.use("/api", initRouter(state));

  // Serve app production bundle
  app.use(express.static("dist/app"));

  // Handle client routing, return all requests to the app
  app.get("*", (_req, res) => {
    res.sendFile(join(__dirname, "app/index.html"));
  });

  app.listen(PORT, () => {
    console.log(`Server listening at ${state.hostUrl}`);
  });

  await state.init();
}

initServer();
