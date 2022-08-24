import depositSoundRes from "../../assets/sounds/deposit.mp3";
import withdrawSoundRes from "../../assets/sounds/withdraw.mp3";

import cashoutSoundRes from "../../assets/sounds/cashout.mp3";

export const SERVER_URL = "https://solcrash.io";
export const SOCKET_SERVER_URL = "https://solcrash.io";

export const HOUSE = new window.solanaWeb3.PublicKey("5MG5tWfcoDN1p1UTPtKemkZbzvYxNkhtUh1YeRpBtawh");

export const depositAudio = new Audio(depositSoundRes);
export const withdrawAudio = new Audio(withdrawSoundRes);

export const cashoutAudio = new Audio(cashoutSoundRes);