import getSocket from "../../socket";

const socket = getSocket();
socket.emit("time");
socket.emit("online");

var difference = 0;

socket.on("game:clock", serverTime => difference = serverTime - new Date().getTime());

export const getDate = () => new Date().getTime() + difference;