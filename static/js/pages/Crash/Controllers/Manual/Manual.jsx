import React, { useState } from "react";
import { useSelector } from "react-redux";

import { formatNum } from "../../../../utils/helper/formatNum";

import Input from "../../../../components/UIkit/Input/Input";

import getSocket from "../../../../socket";

import { placeBet, cashout } from "../../../../utils/services/crash";

import "../../../../config";

const Manual = () => {

  const { currency, name, game, screen_width } = useSelector(state => state.global_info);
  var { balance, previous_bet, max_win, min_bet, max_bet } = global.config;

  var myBet = (game?.bets || []).find(bet => bet.username === name);
  var mobileMode = screen_width < 780;

  var buttonText = "Place Bet";
  var buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
  var buttonDisabled = true;

  const [betAmount, setBetAmount] = useState("");
  const [betErrorState, setBetErrorState] = useState("");
  const [multiplierAmount, setMultiplierAmount] = useState("");
  const [multiplierErrorState, setMultiplierErrorState] = useState("");
  const [targetProfit, setTargetProfit] = useState("N/A");

  const socket = getSocket();

  socket.on("game:house", data => {
    var sol = formatNum(data.sol * 0.04);
    var usdc = formatNum(data.usdc * 0.04);
    var dust = formatNum(data.dust * 0.04);
    var forge = formatNum(data.forge * 0.04);
    var puff = formatNum(data.puff * 0.04);
    var jelly = formatNum(data.jelly * 0.04);
    global.config.max_win = { sol, usdc, dust, forge, puff, jelly };
  });

  const placeBetFunc = () => placeBet(betAmount, multiplierAmount, currency);

  const cashoutFunc = () => cashout();

  const onChangeBetInput = (event) => {

    const bet = event.target.value;

    if (parseFloat(bet) <= min_bet[currency]) {
      buttonText = "Place Bet";
      buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
      buttonDisabled = true;
      return setBetErrorState("*Minimum bet is " + min_bet[currency] + " " + currency.toUpperCase());
    }

    if (parseFloat(bet) > balance[currency]) {
      buttonText = "Place Bet";
      buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
      buttonDisabled = true;
      return setBetErrorState("*Insufficient funds");
    }
    
    if (parseFloat(bet) > max_bet[currency]) {
      buttonText = "Place Bet";
      buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
      buttonDisabled = true;
      return setBetErrorState("*Maximum bet is " + max_bet[currency] + " " + currency.toUpperCase());
    }

    if (bet !== "" && multiplierAmount !== "") setTargetProfit((formatNum(bet * multiplierAmount - bet) !== 0 ? formatNum(bet * multiplierAmount - bet) : "~ 0") + " " + currency.toUpperCase());
    else setTargetProfit("N/A");

    setBetErrorState("");

    setBetAmount(bet);

    if (bet === "") {
      buttonText = "Place Bet";
      buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
      buttonDisabled = true;
    }

    return;
    
  };

  const onChangeMultiplierInput = (event) => {

    const multiplier = event.target.value;

    if (parseFloat(multiplier) < 1.01) {
      buttonText = "Place Bet";
      buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
      buttonDisabled = true;
      return setMultiplierErrorState("*Minimum multiplier is 1.01");
    }

    if (betAmount !== "" && multiplier !== "") setTargetProfit((formatNum(betAmount * multiplier - betAmount) !== 0 ? formatNum(betAmount * multiplier - betAmount) : "~ 0") + " " + currency.toUpperCase());
    else setTargetProfit("N/A");
    
    setMultiplierErrorState("");

    setMultiplierAmount(multiplier);
    return;

  };

  const halfBet = () => {
    if (betAmount === "" || betAmount === 0) return;
    var newBetAmount = betAmount * 0.5;
    setBetAmount(newBetAmount);
    document.getElementById("bet-amount").value = newBetAmount;
  };

  const doubleBet = () => {
    if (betAmount === "" || betAmount === 0) return;
    var newBetAmount = betAmount * 2;
    setBetAmount(newBetAmount);
    document.getElementById("bet-amount").value = newBetAmount;
  };

  const previousBet = () => {
    setBetAmount(previous_bet || betAmount);
    document.getElementById("bet-amount").value = betAmount;
  };
  
  const maxBet = () => {
    var newBetAmount = balance[currency];
    setBetAmount(newBetAmount);
    document.getElementById("bet-amount").value = newBetAmount;
  };

  const minBet = () => {
    var newBetAmount = 0.000001;
    setBetAmount(newBetAmount);
    document.getElementById("bet-amount").value = newBetAmount;
  };

  if (game && game.status === "preparation" && myBet) {
    buttonText = (<><i className="fas fa-spinner fa-spin"></i></>);
    buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
    buttonDisabled = true;
  }

  if (game && ((game.status !== "preparation" && !myBet) || game.status === "crashed")) {
    buttonText = "Game In Progress";
    buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
    buttonDisabled = true;
  }

  if (myBet && myBet.retrievedMultiplier) {
    buttonText = "You Won";
    buttonStyle = { background: "#18aa6d", borderColor: "none", cursor: "not-allowed" };
    buttonDisabled = true;
  }

  if (game && game.status === "preparation" && betAmount !== "" && !isNaN(betAmount) && betErrorState === "" && multiplierErrorState === "" && !myBet) {
    buttonText = "Place Bet";
    buttonStyle = { background: "#18aa6d", borderColor: "none", cursor: "pointer" };
    buttonDisabled = false;
  }

  if (game && game.status === "started" && myBet && !myBet.retrievedMultiplier) {
    buttonText = "Cash Out";
    buttonStyle = { background: "#18aa6d", borderColor: "none", cursor: "pointer" };
    buttonDisabled = false;
  }

  if (game && game.status === "crashed" && myBet && !myBet.retrievedMultiplier) {
    buttonText = "You Lost";
    buttonStyle = { background: "#fa5353", borderColor: "none", cursor: "not-allowed" };
    buttonDisabled = true;
  }

  return (
    <>
      <div className="content">
        <div className="input-item">
          <span>Bet <span className="error">{betErrorState}</span></span>
          <Input
            type="number"
            id={"bet-amount"}
            label={currency.toUpperCase()}
            placeholder={"1.5"}
            style={{ marginTop: "2px", width: "100%" }}
            onChange={onChangeBetInput}
          />
        </div>
        <div className="bet-buttons">
          <button className="solcrash-primary-button" onClick={() => {halfBet()}}>0.5x</button>
          <button className="solcrash-primary-button" onClick={() => {doubleBet()}}>2x</button>
          <button className="solcrash-primary-button" onClick={() => {previousBet()}}>Redo</button>
          <button className="solcrash-primary-button" onClick={() => {maxBet()}}>Max</button>
          <button className="solcrash-primary-button" onClick={() => {minBet()}}>Min</button>
        </div>
        <div className="input-item">
          <span>Cash Out <span className="error">{multiplierErrorState}</span></span>
          <Input
            type="number"
            label={"X"}
            placeholder={"1.01"}
            style={{ marginTop: "2px", width: "100%" }}
            onChange={onChangeMultiplierInput}
          />
        </div>
        <button className="solcrash-primary-button place-bet" style={buttonStyle} disabled={buttonDisabled} onClick={buttonText !== "Cash Out" ? placeBetFunc : cashoutFunc}>{buttonText}</button>
        {!mobileMode && (
          <div className="small-statistic">
            <span className="item">
              <span className="label">Target Profit:</span>
              <span className="value">{targetProfit}</span>
            </span>
            <span className="item">
              <span className="label">Max Win:</span>
              <span className="value" id="maxWin">{max_win[currency]} {currency.toUpperCase()}</span>
            </span>
          </div>
        )}
      </div>
    </>
  );
  
};

export default Manual;
