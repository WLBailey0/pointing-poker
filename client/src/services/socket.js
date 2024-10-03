// src/services/socket.js
import { io } from "socket.io-client";

const socket = io("http://35.208.238.206:8080");

window.addEventListener("beforeunload", () => {
    socket.disconnect();
  });

export default socket;
