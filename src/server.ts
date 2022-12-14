import "dotenv/config"
import express from "express"
import http from "http"
import { join } from "path"
import { initRouter } from "./lib/router"
import { State } from "./lib/state"

const { PORT = 3001 } = process.env

async function initServer() {
  const app = express()
  const server = http.createServer(app)
  const state = new State(server)

  // Middleware that parses json and looks at requests
  // where the Content-Type header matches the type option.
  app.use(express.json())

  // Serve API requests from the router
  app.use("/api", initRouter(state))

  // Serve app production bundle
  app.use(express.static("dist/app"))

  // Handle client routing, return all requests to the app
  app.get("*", (_req, res) => {
    res.sendFile(join(__dirname, "app/index.html"))
  })

  server.listen(PORT, () => {
    const msg = `
    =======================================================

      Server listening at ${state.hostUrl}

    =======================================================
    `
    console.log(msg)
  })

  state.init(true)
}

initServer()
