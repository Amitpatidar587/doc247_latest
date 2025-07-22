// src/socket.js
import { io } from "socket.io-client";
// const SOCKET_URL = "http://192.168.29.86:3001";
const SOCKET_URL = "https://socket.doc247.ca";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});
