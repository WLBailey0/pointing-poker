import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

window.addEventListener("beforeunload", () => {
    socket.disconnect();
  });

export default socket;
