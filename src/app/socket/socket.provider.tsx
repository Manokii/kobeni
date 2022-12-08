import { PropsWithChildren } from "react"
import { socketContext } from "./socket.context"
import { socket } from "./socket.instance"

const SocketProvider = ({ children }: PropsWithChildren) => {
  return <socketContext.Provider value={socket}>{children}</socketContext.Provider>
}

export default SocketProvider
