export interface WSNotification<T> {
  type: "notification",
  method: string,
  data: T,
}

export interface WSRequest<T> {
  id?: number,
  type: "request",
  method: string,
  data: T,
}

export interface WSSuccessResponse<T> {
  id: number,
  type: "response",
  status: "success",
  data: T,
}

export interface WSErrorResponse<T> {
  id: number,
  type: "response",
  status: "error",
  code: number,
  message: string,
  data: T,
}

type NotificationListener = (notification: WSNotification<any>) => void
interface NotificationListeners {
  [index: string]: NotificationListener[]
}

type PromiseResolveFunc = (value: WSSuccessResponse<any>) => void;
type PromiseRejectFunc = (reason: WSErrorResponse<any>) => void;
type PromiseCallbacks = {
  resolve: PromiseResolveFunc,
  reject: PromiseRejectFunc,
}

class NchatWebSocket {
  static websocketUrl = NchatWebSocket.getWebsocketUrl();

  webSocket: WebSocket;
  isAuthMessageSent = false;
  requestId = 0;
  requestPromiseCallbacks: PromiseCallbacks[] = [];
  notificationListeners: NotificationListeners = {};

  static getWebsocketUrl(): string {
    let location = window.location;
    let url = (location.protocol === "https:" ? "wss:" : "ws:");
    url += "//" + location.host + "/api/v1/chat";
    return url;
  }

  static createWebSocket(): Promise<NchatWebSocket> {
    const webSocket = new WebSocket(this.websocketUrl, "nchat");
    return new Promise((resolve, reject) => {
      webSocket.addEventListener("open", (event: Event) => {
        const nchatWebSocket = new NchatWebSocket(webSocket);
        resolve(nchatWebSocket);
      })
      webSocket.addEventListener("error", (event: Event) => {
        reject(event);
      })
    });
  }

  constructor(webSocket: WebSocket) {
    this.handleMessageReceived = this.handleMessageReceived.bind(this);
    this.webSocket = webSocket;
    this.webSocket.addEventListener("message", this.handleMessageReceived);
  }

  handleMessageReceived(event: MessageEvent) {
    const data: WSNotification<any> | WSSuccessResponse<any> | WSErrorResponse<any> =
      JSON.parse(event.data);
    if (data.type === "response") {
      const callbacks = this.requestPromiseCallbacks[data.id];
      if (typeof callbacks === 'undefined') {
        return;
      }

      if (data.status === "success") {
        callbacks.resolve(data);
      } else {
        callbacks.reject(data);
      }
    } else if (data.type === "notification") {
      const listeners = this.notificationListeners[data.method];
      if (typeof listeners === "undefined") {
        return;
      }

      for (const listener of listeners) {
        listener(data);
      }
    }
  }

  addNotificationListener(method: string, listener: NotificationListener) {
    if (this.notificationListeners.hasOwnProperty(method)) {
      this.notificationListeners[method]?.push(listener);
    } else {
      this.notificationListeners[method] = [listener];
    }
  }

  sendRequest<T, S>(request: WSRequest<T>):
    Promise<WSSuccessResponse<S>> {
    const id = this.getNextId();
    request.id = id;

    this.webSocket.send(JSON.stringify(request));

    return new Promise((resolve, reject) => {
      this.registerPromise(id, resolve, reject);
    });
  }

  close() {
    this.webSocket.close();
  }

  private registerPromise(id: number, resolve: PromiseResolveFunc, reject: PromiseRejectFunc) {
    this.requestPromiseCallbacks[id] = {
      resolve: resolve,
      reject: reject
    };
  }

  private getNextId(): number {
    return this.requestId++;
  }
}

export default NchatWebSocket;