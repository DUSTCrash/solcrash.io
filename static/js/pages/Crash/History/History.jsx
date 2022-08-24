import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import cn from "classnames";

import { setOnline } from "../../../store/reducers/global_info/global_info";

import getSocket from "../../../socket";

import { formatNum } from "../../../utils/helper/formatNum";

import "../../../config";

import "./history.scss";

const History = () => {

  const dispatch = useDispatch();
  const { online, game } = useSelector(state => state.global_info);
  var publicKey = window.crashProvider?.publicKey?.toString();

  var totalBetsSum = 0;
  (game?.bets || []).forEach(bet => totalBetsSum += !isNaN(bet.betAmount) && bet.currency === "sol" ? parseFloat(bet.betAmount) : 0);

  const myBet = game?.bets && game.bets.length > 0 ? game.bets.filter(bet => bet.userAddress === publicKey) : [];

  var retrievedBets = (game?.bets || []).filter(bet => bet.userAddress !== publicKey && bet.retrievedMultiplier);
  retrievedBets = retrievedBets.sort((a, b) => b.betAmount - a.betAmount);

  var notRetrievedBets = (game?.bets || []).filter(bet => bet.userAddress !== publicKey && !bet.retrievedMultiplier);
  notRetrievedBets = notRetrievedBets.sort((a, b) => b.betAmount - a.betAmount);

  const allBets = myBet.concat(notRetrievedBets, retrievedBets);

  if (formatNum(totalBetsSum) === 0 && totalBetsSum !== 0) totalBetsSum = "~ 0";
  else totalBetsSum = formatNum(totalBetsSum);

  useEffect(() => {
    const socket = getSocket();
    socket.on("game:online", total => dispatch(setOnline(total)));
  }, []);

  return (
    <div className="history-container">
      <div className="table-container">
        <table className="history">
          <thead>
            <tr>
              <th></th>
              <th>User</th>
              <th>Bet</th>
              <th>Multiplier</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {allBets && allBets.length !== 0 && allBets.map(bet => {
                const className = cn("bet", { won: bet.retrievedMultiplier, lost: !bet.retrievedMultiplier && game?.status === "crashed" });
                var profit = "-";
                if (bet.retrievedMultiplier) {
                  profit = formatNum((bet.retrievedMultiplier * bet.betAmount - bet.betAmount));
                  if (profit === 0) profit = "~ 0";
                }
                else if (game?.status === "crashed") profit = -1 * bet.betAmount;
                var img = "https://i.imgur.com/LnkpZvw.png";
                if (bet.currency === "usdc") img = "https://i.imgur.com/NDeT6kr.png";
                else if (bet.currency === "dust") img = "https://i.imgur.com/rKepYVZ.png";
                else if (bet.currency === "forge") img = "https://i.imgur.com/UqT0mmf.png";
                else if (bet.currency === "puff") img = "https://i.imgur.com/aftEdgN.jpg";
                else if (bet.currency === "jelly") img = "https://i.imgur.com/wHdaWHS.png";
                return (
                  <tr className={className} key={Math.random()}>
                    <th><img src={img} /></th>
                    <th>{bet.username}</th>
                    <th>{bet.betAmount < 1 && (bet.betAmount.toString().length  > 6 || bet.betAmount.toString().includes("e")) ? "~ " + formatNum(bet.betAmount)  + " " + bet.currency.toUpperCase() : formatNum(bet.betAmount)  + " " + bet.currency.toUpperCase()}</th>
                    <th>{bet.retrievedMultiplier ? bet.retrievedMultiplier + "x" : "-"}</th>
                    <th>{bet.retrievedMultiplier ? profit + " " + bet.currency.toUpperCase(): "-"}</th>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="history-footer">
        <div className="history-footer__item">
          <span className="white">Online:</span>
          <span className="green" id="totalOnline">{online}</span>
        </div>
        <div className="history-footer__item">
          <span className="white">Playing:</span>
          <span className="green">{allBets.length}</span>
        </div>
        <div className="history-footer__item">
          <span className="white">Betting:</span>
          <span className="green">{totalBetsSum}</span>
          <span className="white">SOL</span>
        </div>
      </div>
    </div>
  );
  
};

export default History;
