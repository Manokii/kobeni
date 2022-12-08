import { useContext } from "react"
import { socketContext } from "./socket.context"

export const useSocket = () => useContext(socketContext)
