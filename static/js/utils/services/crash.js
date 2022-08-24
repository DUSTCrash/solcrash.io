import Crash from "../api/crash";

import { toast } from '../../utils/toast/toast';

import { setGame } from "../../store/reducers/global_info/global_info";

import { setCrashLoading, setError } from "../../store/reducers/global_info/global_info";

import getSocket from "../../socket";

import "../../config";

export const getCurrentCrashGame = () => {

  return async (dispatch) => {

   

  }

};

export const placeBet = async (bet, multiplier, currency) => {
  
    const socket = getSocket();

    try {
      await Crash.placeBet(bet, multiplier, currency);
      global.config.previous_bet = Number(bet);
    } catch (err) {
      if (err.response.data === "Sorry you got disconnected, try again.") socket.emit("room:join", localStorage.getItem("token"));
      toast.errorMessage(err.response.data);
    }

};

export const placeAutoBet = async (bet, multiplier, currency, setWorking) => {

    const socket = getSocket();
    const balance = global.config.balance;

    if (balance[currency] < bet) {
      setWorking(false);
      return;
    }

    try {
      await Crash.placeBet(bet, multiplier, currency);
      global.config.previous_bet = Number(bet);
    } catch (err) {
      if (err.response.data === "Sorry you got disconnected, try again.") socket.emit("room:join", localStorage.getItem("token"));
      setWorking(false);
      toast.errorMessage(err.response.data);
    }

};

export const cashout = async () => {
    try { await Crash.cashout(); }
    catch (err) { toast.errorMessage(err.response.data); }
};
