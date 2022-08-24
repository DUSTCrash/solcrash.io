import axios from "axios";
import { SERVER_URL } from "../constants/constants";

import getSocket from "../../socket";

const socket = getSocket();

class Crash {

  static async getCurrentGame() {
    return axios.get(SERVER_URL + "/game");
  }

  static async placeBet(bet, multiplier, currency) {
    socket.emit("bet:new", { token: localStorage.getItem("token"), betAmount: parseFloat(bet), initialMultiplier: parseFloat(multiplier), currency });
    return;
  }

  static async cashout() {
    socket.emit("cashout:new", { token: localStorage.getItem("token") });
    return;
  }

}

export default Crash;
