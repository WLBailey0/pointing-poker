import { io } from "socket.io-client";

const socket = io("http://35.208.238.206:8080");

window.addEventListener("beforeunload", () => {
    socket.disconnect();
  });

export default socket;
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3001");

// window.addEventListener("beforeunload", () => {
//     socket.disconnect();
//   });

// export default socket;
