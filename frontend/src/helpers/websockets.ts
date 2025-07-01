import { apiCall } from "./api";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
const websocketURL = `${WS_URL}/ws/chat/`;

class WebSocketHandler {
  private socket: WebSocket;
  private url: string;
  public addMessage: (message: string) => void = () => 0;

  constructor(url: string) {
    this.url = url;
    this.socket = new WebSocket(url);
    this.initialize();
  }

  private initialize() {
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onerror = this.onError.bind(this);
    this.socket.onclose = this.onClose.bind(this);
  }

  private onOpen(event: Event) {
    console.log("WebSocket connection opened:", event);
  }

  private onMessage(event: MessageEvent) {
    console.log("Message received: ", event.data);
    const data = JSON.parse(event.data);
    this.addMessage(data.message);
  }

  private onError(event: Event) {
    console.error("WebSocket error:", event);
  }

  private onClose(event: CloseEvent) {
    console.log("WebSocket connection closed:", event);
  }

  public sendMessage(message: string, language: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      const msg = { message: message, language: language };
      const sendMsg = JSON.stringify(msg);
      this.socket.send(sendMsg);
    } else {
      console.error(
        "WebSocket is not open. Ready state:",
        this.socket.readyState
      );
    }
  }

  public closeConnection() {
    this.socket.close();
  }
}

export default WebSocketHandler;

const getWebSocketConnection = async (
  addMessage: (message: string) => void
) => {
  const res = await apiCall("/ws-auth/auth_for_ws_connection");
  const uuid = await res!.json();

  console.log("UUID:", uuid.uuid);

  const url = `${websocketURL}?uuid=${uuid.uuid}`;

  console.log("WebSocket URL:", url);

  const wsConn = new WebSocketHandler(url);
  wsConn.addMessage = addMessage;

  return wsConn;
};

export { getWebSocketConnection };
