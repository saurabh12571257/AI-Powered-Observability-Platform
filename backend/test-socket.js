const { io } = require("socket.io-client");

const socket = io("http://localhost:30007");

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("new-log", (log) => {
  console.log("New log received:", log);
});
