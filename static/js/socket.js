import { io } from "socket.io-client";

import { SOCKET_SERVER_URL } from "./utils/constants/constants";

let socket = io(SOCKET_SERVER_URL);

const getSocket = () => {
  if (!socket) socket = io(SOCKET_SERVER_URL, { transports: ["websocket"]});
  return socket;
};

export default getSocket;