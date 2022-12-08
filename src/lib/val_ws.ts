import Websocket from "ws"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

type MessageTypes = Record<string, number>
const MESSAGE_TYPES: MessageTypes = {
  WELCOME: 0,
  PREFIX: 1,
  CALL: 2,
  CALLRESULT: 3,
  CALLERROR: 4,
  SUBSCRIBE: 5,
  UNSUBSCRIBE: 6,
  PUBLISH: 7,
  EVENT: 8,
}

export type MessageData = {
  data: Record<string, unknown>
  eventType: string
  uri: string
}
type Message = [number, string, MessageData]
type BuffMessage = { type: "Buffer"; data: number[] }
const defaultMessage: Message = [0, "EmptyMessage", { data: {}, eventType: "", uri: "" }]

const stringMessage = JSON.stringify(defaultMessage)
const blockedMsgUri = ["/voice-chat/", "/chat/"]

type Callback = (...data: unknown[]) => void

export class RiotWSProtocol extends Websocket {
  session: unknown = null
  constructor(url: string) {
    console.log("Connecting to", url)
    super(url)
    this.on("message", this._onMessage.bind(this))
  }

  close() {
    super.close()
    this.session = null
  }

  terminate() {
    super.terminate()
    this.session = null
  }

  subscribe(topic: string, callback: Callback) {
    super.addListener(topic, callback)
    this._send(MESSAGE_TYPES.SUBSCRIBE, topic)
  }

  unsubscribe(topic: string, callback: Callback) {
    super.removeListener(topic, callback)
    this._send(MESSAGE_TYPES.UNSUBSCRIBE, topic)
  }

  _send(type: MessageTypes[string], message: string) {
    super.send(JSON.stringify([type, message]), (err) => {
      if (err) console.error(err)
      console.log("sent", [type, message])
    })
  }

  _onMessage(message: Buffer | string | object) {
    const msg: Message | BuffMessage = JSON.parse(
      typeof message === "object" ? JSON.stringify(message) : message || stringMessage
    )

    let tempMsg: Message = defaultMessage

    if (Array.isArray(msg)) {
      tempMsg = msg
    } else {
      tempMsg = JSON.parse(Buffer.from(msg.data).toString() || stringMessage) as Message
    }

    const [type, ...data] = tempMsg
    switch (type) {
      case MESSAGE_TYPES.WELCOME: {
        this.session = data[0]
        break
      }

      case MESSAGE_TYPES.CALLRESULT: {
        console.log("Unknown call", data)
        break
      }

      case MESSAGE_TYPES.TYPE_ID_CALLERROR: {
        console.log("Unknown call error", data)
        break
      }

      case MESSAGE_TYPES.EVENT: {
        const [topic, payload] = data
        if (blockedMsgUri.some((uri) => payload.uri.includes(uri))) return
        console.log("Received", topic, { data: payload.data })
        if (payload.uri.includes("/product-session/v1/session-heartbeats/")) {
          this.emit("heartbeat", payload)
        }
        this.emit(topic, payload)
        break
      }

      default:
        console.log("Unknown type", [type, data])
        break
    }
  }
}

/** HOW TO USE */
// const ws = new RiotWSProtocol('wss://riot:Vb4qOZdKanoA-9UB9gAN_Q@localhost:60588/');

// ws.on('open', () => {
//     ws.subscribe('OnJsonApiEvent', console.log);
// });
