import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getMultiplierFromTime } from "../../../utils/constants/crash";
import { getDate } from "../../../utils/helper/getServer";
import { formatNum } from "../../../utils/helper/formatNum";

import "../../../config";

const Multiplier = () => {

  var { name, game, currency } = useSelector(state => state.global_info);
  const [amountIndicator, setAmountIndicator] = useState({ label: "", style: {}, show: false });
  const [multiplierIndicator, setMultiplierIndicator] = useState({ label: "", style: {}, show: false });

  var userAddress = window.crashProvider?.publicKey?.toString();
  if (!name) name = "Wallet (" + userAddress?.slice(0, 4) + "..." + userAddress?.slice(-4) + ")";

  var myBet = (game?.bets || []).find(bet => bet.username === name);

  useEffect(() => {

    const drawIndicators = ({ currentGameTime }) => {

      if (game.status === "preparation") {
        setAmountIndicator({ ...amountIndicator, show: false });
        setMultiplierIndicator({ ...multiplierIndicator, show: false });
        return;
      }

      if (!!myBet && !myBet.isWon && game.status === "crashed")
        setAmountIndicator({ ...amountIndicator, show: true, label: "", style: { color: "#ff5757", fontFamily: "monospace" } });
      
      const currentMultiplier = getMultiplierFromTime(currentGameTime / 1000) < 1 ? "1.00" : getMultiplierFromTime(currentGameTime / 1000);

      if (game.status === "crashed" && game.crashPoint) {
        var crashPoint = game.crashPoint?.toFixed(2);
        setMultiplierIndicator({ ...multiplierIndicator, show: true, label: "Crashed @ " + (crashPoint || "") + "x", style: { color: "#ff5757", fontFamily: "monospace" } });
      } else if (game.status === "crashed") setMultiplierIndicator({ ...multiplierIndicator, show: true, label: "Next game loading", style: { color: "#ff5757", fontFamily: "monospace" } });
      else setMultiplierIndicator({ ...multiplierIndicator, show: true, label: currentMultiplier + "x", style: { color: "#fdfdfd", fontFamily: "monospace" } });

      if (game.status !== "started" && game.status !== "retrieved_bet") return;

      if (!!myBet && game.status !== "crashed") {
        var profit = myBet.isWon ? "+ " + myBet.profit : "+ " + (formatNum(Number(currentMultiplier) * myBet.betAmount) !== 0 ? formatNum(Number(currentMultiplier) * myBet.betAmount) : "~ 0");
        setAmountIndicator({ ...amountIndicator, show: true, style: { color: "#18aa6d", fontFamily: "monospace" }, label: profit + " " + currency.toUpperCase() });
      }

    };

    const interval = setInterval(() => {
      const currentGameTime = Math.abs(game.startedAt - getDate());
      drawIndicators({ currentGameTime });
    }, 1000 / 30);

    return () => clearInterval(interval);

  }, [game]);

  return (
    <div className="crash-container__graph__indicators">
      {multiplierIndicator.show && (
        <span className="crash-indicators-row">
          <span className="coef" style={multiplierIndicator.style}>{multiplierIndicator.label}</span>
        </span>
      )}
      {amountIndicator.show && (<span className="amount" style={amountIndicator.style}>{amountIndicator.label}</span>)}
    </div>
  );
  
};

export default Multiplier;
