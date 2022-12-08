import { createContext } from "react"
import type { Socket } from "socket.io-client"
import { socket } from "./socket.instance"

export const socketContext = createContext<Socket>(socket)
