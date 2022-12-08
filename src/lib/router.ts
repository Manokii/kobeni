import express from "express"
import { resolve } from "path"
import { State } from "./state"

export function initRouter(state: State) {
  const router = express.Router()

  router.get("/", (_, res) => res.send(state.toJSON()))
  router.get("/static", (req, res) => res.sendFile(resolve(__dirname, `./../${req.query.path}`)))
  router.get("/status", (_, res) => res.send(state.status))

  //  Agents --------------------------------------
  router.get("/agents", (_, res) => res.send(state.sanitizedAgents()))
  router.get("/agents/:agent", (req, res) => {
    const agent = req.params.agent
    const data = state.agents.get(agent)
    if (!agent) return res.status(404).send({ message: "Agent not found" })
    res.send(data)
  })

  //  Weapons --------------------------------------
  router.get("/weapons", (_, res) => res.send(state.sanitizedWeapons()))
  router.get("/weapons/:weapon", (req, res) => {
    const weapon = req.params.weapon
    const data = state.weapons.get(weapon)
    if (!data) return res.status(404).send({ message: "Weapon not found" })
    res.send(data)
  })

  // Maps --------------------------------------
  router.get("/maps", (_, res) => res.send(state.sanitizedMaps()))
  router.get("/maps/:map", (req, res) => {
    const map = state.maps.get(req.params.map)
    if (!map) return res.status(404).send({ message: "Map not found" })
    res.send(map)
  })

  // Reset --------------------------------------
  router.post("/reset", (_, res) => {
    state.reset({ init: true })
    res.send({ message: "A reset was requested", success: true })
  })

  //

  return router
}
