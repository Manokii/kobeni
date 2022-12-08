import { io } from "socket.io-client"
import { globalDispatch, setState, State } from "../redux"

const URL = `${window.location.hostname}:${import.meta.env.PORT || 3001}`

export const socket = io(URL)

socket.on("agentSelect", (newState: State) => {
  globalDispatch(setState(newState))
})
