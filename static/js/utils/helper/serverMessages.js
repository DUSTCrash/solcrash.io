import getSocket from "../../socket";
import { toast } from "../toast/toast";

const { deposit_audio, withdraw_audio } = global.config;

const socket = getSocket();

var setDepositState = null;
var setWithdrawState = null;
var setRebateState = null;

socket.on("deposit:success", (amount) => {

    toast.successMessage("Deposited " + amount);
    
    var { sound_on } = global.config;
    if (sound_on) deposit_audio?.play();

    setDepositState({
      disable: true,
      style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" },
      value: "Deposit Funds",
    });

});

socket.on("deposit:queued", () => {

  toast.successMessage("Your deposit is queued. It can take up to 5 minutes to credit your account.");

  setDepositState({
    disable: true,
    style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" },
    value: "Deposit Funds",
  });

  return;

});

socket.on("deposit:error", async (error) => {

    toast.errorMessage(error);

    setDepositState({
      disable: false,
      style: { background: "#18aa6d", borderColor: "none", cursor: "pointer" },
      value: "Deposit Funds",
    });

    return;

});

socket.on("withdraw:success", (amount) => {

  toast.successMessage("Withdrew " + amount);

  var { sound_on } = global.config;
  if (sound_on) withdraw_audio?.play();

  setWithdrawState({
    disable: true,
    style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" },
    value: "Withdraw Funds",
  });

});

socket.on("withdraw:queued", () => {

  toast.successMessage("Your withdrawal is queued. It can take up to 5 minutes to send your funds.");

  setWithdrawState({
    disable: true,
    style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" },
    value: "Withdraw Funds",
  });

  return;

});

socket.on("withdraw:error", async (error) => {

  toast.errorMessage(error);

  setWithdrawState({
    disable: false,
    style: { background: "#18aa6d", borderColor: "none", cursor: "pointer" },
    value: "Withdraw Funds",
  });

  return;

});

socket.on("rebate:success", ({ amount, currency }) => {

  toast.successMessage("Claimed " + amount + " " + currency.toUpperCase());

  setRebateState({
    disable: true,
    style: { background: "#1a2733", borderColor: "none", cursor: "not-allowed" },
    value: "Select Currency",
  });

});

socket.on("rebate:error", async (error) => {

  toast.errorMessage(error);

  setRebateState({
    disable: false,
    style: { background: "#1a2733", borderColor: "none", cursor: "pointer" },
    value: "Select Currency",
  });

  return;

});

export const controlDepositState = (controller) => setDepositState = controller;
export const controlWithdrawState = (controller) => setWithdrawState = controller;
export const controlRebateState = (controller) => setRebateState = controller;