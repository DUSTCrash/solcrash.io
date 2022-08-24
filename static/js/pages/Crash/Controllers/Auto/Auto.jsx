import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Input from "../../../../components/UIkit/Input/Input";
import Checkbox from "../../../../components/UIkit/Checkbox/Checkbox";
import Button from "../../../../components/UIkit/Button/Button";

import { formatNum } from "../../../../utils/helper/formatNum";
import { placeAutoBet, cashout } from "../../../../utils/services/crash";
import { toast } from "../../../../utils/toast/toast";

import "../../../../config";

const formConfig = {
  increase_loss: { checked: false, value: null },
  increase_win: { checked: false, value: null },
  reset_win: { checked: false },
  reset_loss: { checked: false },
  stop_after: { checked: false, value: null },
  bet: { value: null },
  ogBet: { value: null },
  multiplier: { value: null },
  bets: 0
};

const Auto = ({ visible }) => {

  const { name, game, screen_width, currency } = useSelector(state => state.global_info);
  var { balance, max_win, min_bet, max_bet } = global.config;

  var myBet = (game?.bets || []).find(bet => bet.username === name);
  var mobileMode = screen_width < 780;

  var buttonText = "Start";
  var buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
  var buttonDisabled = true;

  var cashoutButtonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
  var cashoutButtonDisabled = true;

  const [betErrorState, setBetErrorState] = useState("");
  const [multiplierErrorState, setMultiplierErrorState] = useState("");
  const [winIncreaseErrorState, setWinIncreaseErrorState] = useState("");
  const [lossIncreaseErrorState, setLossIncreaseErrorState] = useState("");
  const [stopAfterErrorState, setStopAfterErrorState] = useState("");
  const [targetProfit, setTargetProfit] = useState("N/A");

  const [form, setForm] = useState(formConfig);
  const [working, setWorking] = useState(false);
  const [workingForm, setWorkingForm] = useState(null);
  const [triggerBet, setTriggerBet] = useState(false);

  const onChangeBetInput = (event) => {

    const bet = event.target.value;

    if (parseFloat(bet) <= min_bet[currency]) {
      buttonText = "Start";
      buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
      buttonDisabled = true;
      return setBetErrorState("*Minimum bet is" + min_bet[currency] + " " + currency.toUpperCase());
    }

    if (parseFloat(bet) > balance[currency]) {
      buttonText = "Start";
      buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
      buttonDisabled = true;
      return setBetErrorState("*Insufficient funds");
    }
    
    if (parseFloat(bet) > max_bet[currency]) {
      buttonText = "Start";
      buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
      buttonDisabled = true;
      return setBetErrorState("*Maximum bet is " + max_bet[currency] + " " + currency.toUpperCase());
    }

    if (bet !== "" && form.multiplier.value) setTargetProfit((formatNum(bet * form.multiplier.value - bet) !== 0 ? formatNum(bet * form.multiplier.value - bet) : "~ 0") + " " + currency.toUpperCase());
    else setTargetProfit("N/A");

    setBetErrorState("");

    setForm({ ...form, ["bet"]: { ...form["bet"], value: parseFloat(bet) } });

    if (bet === "") {
      buttonText = "Start";
      buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
      buttonDisabled = true;
    }

    return;
    
  };

  const onChangeMultiplierInput = (event) => {

    const multiplier = event.target.value;

    if (parseFloat(multiplier) < 1.01) {
      buttonText = "Start";
      buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
      buttonDisabled = true;
      return setMultiplierErrorState("*Minimum multiplier is 1.01");
    }

    if (form.bet.value && multiplier !== "") setTargetProfit((formatNum(form.bet.value * multiplier - form.bet.value) !== 0 ? formatNum(form.bet.value * multiplier - form.bet.value) : "~ 0") + " " + currency.toUpperCase());
    else setTargetProfit("N/A");

    setMultiplierErrorState("");

    setForm({ ...form, ["multiplier"]: { ...form["multiplier"], value: parseFloat(multiplier) } });

    return;

  };

  const setCheckboxValue = ({ field, checked }) => setForm({ ...form, [field]: { ...form[field], checked } });

  const updateWinIncreaseMultiplierInputValue = ({ field, value }) => {

    const increase = value;

    if (parseFloat(increase) < 0) {
      buttonText = "Start";
      buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
      buttonDisabled = true;
      return setWinIncreaseErrorState("*Must be greater than or equal to 0");
    }

    setWinIncreaseErrorState("");

    setForm({ ...form, [field]: { ...form[field], value: parseFloat(increase) } });
    return;    
    
  };

  const updateLossIncreaseMultiplierInputValue = ({ field, value }) => {

    const increase = value;

    if (parseFloat(increase) < 0) {
      buttonText = "Start";
      buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
      buttonDisabled = true;
      return setLossIncreaseErrorState("*Must be greater than 0");
    }

    setLossIncreaseErrorState("");

    setForm({ ...form, [field]: { ...form[field], value: parseFloat(increase) } });
    return;    
    
  };

  const updateStopAfterInputValue = ({ field, value }) => {

    const stopAfter = value;

    if (parseInt(stopAfter) < 1) {
      buttonText = "Start";
      buttonStyle = { background: "#1a2733", borderColor: "none", cursor: "not-allowed" };
      buttonDisabled = true;
      return setStopAfterErrorState("*Must be at least 1");
    }

    setStopAfterErrorState("");

    setForm({ ...form, [field]: { ...form[field], value: parseInt(stopAfter) } });
    return;    
    
  };

  const cashoutFunc = () => cashout();

  useEffect(async () => {

    if (!working) return;

    if (game?.status === "preparation" && !myBet && (sessionStorage.getItem("tried") === "false" || !sessionStorage.getItem("tried"))) {
      sessionStorage.setItem("tried", "true");
      placeAutoBet(Number(workingForm.bet.value), Number(workingForm.multiplier.value), currency, setWorking);
    }

    if (game?.status === "crashed" && myBet) {

      sessionStorage.setItem("tried", "false");
      const isYourBetWin = !!game?.bets.find(element => element.userAddress === myBet.userAddress)?.retrievedMultiplier;
      var error = null;
      var newBet = null;

      var bets = workingForm.bets;
      if (workingForm.stop_after.checked && bets === workingForm.stop_after.value - 1) {
        setWorkingForm({ ...workingForm, bets: 0 });
        sessionStorage.setItem("tried", "false");
        return setWorking(false);
      }

      setWorkingForm({ ...workingForm, bets: bets + 1 });

      if (isYourBetWin && workingForm.increase_win.checked) {
        newBet = parseFloat(workingForm.bet.value) * parseFloat(workingForm.increase_win.value);
        if (newBet > balance[currency]) error = "Insufficient funds";
        else if (newBet > max_bet[currency]) error = "Maximum bet is " + max_bet[currency] + " " + currency.toUpperCase();
        else if (newBet < min_bet[currency]) error = "Minimum bet is " + min_bet[currency] + " " + currency.toUpperCase();
        if (error) {
          toast.errorMessage(error);
          setWorkingForm({ ...workingForm, bets: 0 });
          sessionStorage.setItem("tried", "false");
          return setWorking(false);
        } else {
          setTargetProfit(formatNum(newBet * form.multiplier.value - newBet));
          setWorkingForm({ ...workingForm, bet: { ...workingForm.bet, value: parseFloat(newBet) } });
        }
      }

      if (!isYourBetWin && workingForm.increase_loss.checked) {
        newBet = parseFloat(workingForm.bet.value) * parseFloat(workingForm.increase_loss.value);
        if (newBet > balance[currency]) error = "Insufficient funds";
        else if (newBet > max_bet[currency]) error = "Maximum bet is " + max_bet[currency] + " " + currency.toUpperCase();
        else if (newBet < min_bet[currency]) error = "Minimum bet is " + min_bet[currency] + " " + currency.toUpperCase();
        if (error) {
          toast.errorMessage(error);
          setWorkingForm({ ...workingForm, bets: 0 });
          sessionStorage.setItem("tried", "false");
          return setWorking(false);
        } else {
          setTargetProfit(formatNum(newBet * form.multiplier.value - newBet));
          setWorkingForm({ ...workingForm, bet: { ...workingForm.bet, value: parseFloat(newBet) } });
        }
      }

      if (isYourBetWin && workingForm.reset_win.checked) {
        newBet = parseFloat(workingForm.ogBet.value);
        if (newBet > balance[currency]) error = "Insufficient funds";
        if (error) {
          toast.errorMessage(error);
          setWorkingForm({ ...workingForm, bets: 0 });
          sessionStorage.setItem("tried", "false");
          return setWorking(false);
        } else {
          setTargetProfit(formatNum(newBet * form.multiplier.value - newBet));
          setWorkingForm({ ...workingForm, bet: { ...workingForm.bet, value: parseFloat(newBet) } });
        }
      }

      if (!isYourBetWin && workingForm.reset_loss.checked) {
        newBet = parseFloat(workingForm.ogBet.value);
        if (newBet > balance[currency]) error = "Insufficient funds";
        if (error) {
          toast.errorMessage(error);
          setWorkingForm({ ...workingForm, bets: 0 });
          sessionStorage.setItem("tried", "false");
          return setWorking(false);
        } else {
          setTargetProfit(formatNum(newBet * form.multiplier.value - newBet));
          setWorkingForm({ ...workingForm, bet: { ...workingForm.bet, value: parseFloat(newBet) } });
        }
      }

    }

  }, [game, triggerBet]);

  if (!visible) return <></>;

  if (form["bet"].value && form["bet"].value !== "" && !isNaN(form["bet"].value) && betErrorState === "" && form["multiplier"].value && form["multiplier"].value !== "" && !isNaN(form["multiplier"].value) && multiplierErrorState === "" && !myBet) {
    buttonText = "Start";
    buttonStyle = { background: "#18aa6d", borderColor: "none", cursor: "pointer" };
    buttonDisabled = false;
  }

  if (game && game.status === "started" && myBet && !myBet.retrievedMultiplier) {
    cashoutButtonStyle = { background: "#18aa6d", borderColor: "none", cursor: "pointer" };
    cashoutButtonDisabled = false;
  }

  return (
    <div className="content">
      <div className="input-item">
        <span>Bet <span className="error">{betErrorState}</span></span>
        <Input
          type="number"
          label={currency.toUpperCase()}
          className={"input-auto-mode"}
          placeholder={"1.5"}
          style={{ marginTop: "2px", width: "100%" }}
          onChange={(e) => onChangeBetInput(e)}
        />
      </div>
      <div className="input-item">
        <span>Cash Out <span className="error">{multiplierErrorState}</span></span>
        <Input
          type="number"
          label={"X"}
          className={"input-auto-mode"}
          placeholder={"1.01"}
          style={{ marginTop: "2px", width: "100%" }}
          onChange={(e) => onChangeMultiplierInput(e)}
        />
      </div>
      <div className="input-item">
        <span>Increase bet on win <span className="error">{winIncreaseErrorState}</span></span>
        <div className="row">
          <Checkbox checked={form.increase_win.checked} onClick={() => setCheckboxValue({ field: "increase_win", checked: !form.increase_win.checked })} />
          <Input
            type="number"
            label={"X"}
            className={"input-auto-mode"}
            placeholder={"0.5"}
            style={{ marginTop: "2px", width: "100%" }}
            value={form.increase_win.value || form.increase_win.value === 0 ? form.increase_win.value : ""}
            onChange={(e) => updateWinIncreaseMultiplierInputValue({ field: "increase_win", value: e.target.value })}
          />
        </div>
      </div>
      <div className="input-item">
        <span>Increase bet on loss <span className="error">{lossIncreaseErrorState}</span></span>
        <div className="row">
          <Checkbox checked={form.increase_loss.checked} onClick={() => setCheckboxValue({ field: "increase_loss", checked: !form.increase_loss.checked })} />
          <Input
            type="number"
            label={"X"}
            className={"input-auto-mode"}
            placeholder={"0.5"}
            style={{ marginTop: "2px", width: "100%" }}
            value={form.increase_loss.value || form.increase_loss.value === 0 ? form.increase_loss.value : ""}
            onChange={(e) => updateLossIncreaseMultiplierInputValue({ field: "increase_loss", value: e.target.value })}
          />
        </div>
      </div>
      <div className="input-item">
        <span>Reset bet on win</span>
        <div className="row">
          <Checkbox checked={form.reset_win.checked} onClick={() => setCheckboxValue({ field: "reset_win", checked: !form.reset_win.checked })} />
        </div>
      </div>
      <div className="input-item">
        <span>Reset bet on loss</span>
        <div className="row">
          <Checkbox checked={form.reset_loss.checked} onClick={() => setCheckboxValue({ field: "reset_loss", checked: !form.reset_loss.checked })} />
        </div>
      </div>
      <div className="input-item">
        <span>Stop after <span className="error">{stopAfterErrorState}</span></span>
        <div className="row">
          <Checkbox checked={form.stop_after.checked} onClick={() => setCheckboxValue({ field: "stop_after", checked: !form.stop_after.checked })} />
          <Input
            type="number"
            label={"X"}
            className={"input-auto-mode"}
            placeholder={"0.5"}
            style={{ marginTop: "2px", width: "100%" }}
            value={form.stop_after.value || form.stop_after.value === 0 ? form.stop_after.value : ""}
            onChange={(e) => updateStopAfterInputValue({ field: "stop_after", value: e.target.value })}
          />
        </div>
      </div>
      <div className="auto-buttons">
        {!working && (
          <Button
            disabled={buttonDisabled}
            onClick={() => {
              setWorking(true);
              setWorkingForm(form);
              setTriggerBet((v) => !v);
              setForm({ ...form, ["ogBet"]: { ...form["ogBet"], value: form.bet.value } });
            }}
            style={buttonStyle}
          >{buttonText}</Button>
        )}
        {working && (<Button className="red" onClick={() => setWorking(false)}>STOP</Button>)}
        <Button style={cashoutButtonStyle} disabled={cashoutButtonDisabled} onClick={cashoutFunc}>Cash Out</Button>
      </div>
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
  );

};

export default Auto;
