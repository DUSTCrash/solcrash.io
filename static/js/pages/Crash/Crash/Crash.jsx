import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import cn from "classnames";

import Spinner from "../../../components/UI/Spinner/Spinner";
import Graph from "../Graph/Graph";

import { setGame, setCrashLoading } from "../../../store/reducers/global_info/global_info";

import getSocket from "../../../socket";
import { getCurrentCrashGame } from "../../../utils/services/crash";

import { cashoutAudio } from "../../../utils/constants/constants";

import { toast } from "../../../utils/toast/toast";

import "../../../config";

import "./crash.scss";

const Crash = () => {

  const dispatch = useDispatch();
  var { crash_loading, error, name, game } = useSelector(state => state.global_info);
  var { gameHistory, history } = global.config;
  const cashoutAudioRef = useRef(cashoutAudio);
  
  var userAddress = window.crashProvider?.publicKey?.toString();
  if (!name) name = "Wallet (" + userAddress?.slice(0, 4) + "..." + userAddress?.slice(-4) + ")";

  useEffect(() => {

    const socket = getSocket();

    socket.emit("room:join", localStorage.getItem("token"));

    dispatch(setCrashLoading(true));

    socket.on("game:current", (data) => {
        const { game, maxWin, minBet, maxBet, history } = data;
        game.startedAt = new Date(game.startedAt);
        global.config.max_win = maxWin;
        global.config.min_bet = minBet;
        global.config.max_bet = maxBet;
        global.config.gameHistory = history;
        dispatch(setGame(game));
        dispatch(setCrashLoading(false));
    });

    socket.on("room:error", (error) => toast.errorMessage(error));

    socket.on("game:preparation", (startAt) => dispatch(setGame({ status: "preparation", startedAt: new Date(startAt), bets: [] })));

    socket.on("game:joined", () => {
      const { storedGame } = global.config;
      if (!storedGame) return;
      var updated = JSON.parse(JSON.stringify(storedGame));
      updated.status = "started";
      updated.startedAt = new Date(storedGame.startedAt);
      dispatch(setGame(updated));
    });

    socket.on("game:started", () => {
      const { storedGame } = global.config;
      if (!storedGame) return;
      var updated = JSON.parse(JSON.stringify(storedGame));
      updated.status = "started";
      updated.startedAt = new Date(storedGame.startedAt);
      dispatch(setGame(updated));
    });

    socket.on("game:crashed", (data) => {

      const { storedGame } = global.config;
      if (!storedGame) return;
      var updated = JSON.parse(JSON.stringify(storedGame));
      updated.status = "crashed";
      updated.crashPoint = data.crashPoint;
      updated.startedAt = new Date(storedGame.startedAt);
      dispatch(setGame(updated));

      var currentHistory = global.config.gameHistory;
      currentHistory.reverse();
      currentHistory.push({ hash: data.hash, crash: data.crashPoint });
      if (currentHistory.length > 20) currentHistory.shift();
      currentHistory = currentHistory.filter((value, i, self) => i === self.findIndex(element => element.hash === value.hash));
      currentHistory.reverse();
      global.config.gameHistory = currentHistory;

      return;

    });

    socket.on("bet", bet => {
      const { storedGame } = global.config;
      if (!storedGame) return;
      var updated = JSON.parse(JSON.stringify(storedGame));
      if (!updated.bets) updated.bets = [];
      updated.bets.push(bet);
      updated.bets = updated.bets.filter((value, i, self) => i === self.findIndex(element => (element.username === value.username)));
      updated.startedAt = new Date(storedGame.startedAt);
      dispatch(setGame(updated));
    });

    socket.on("bet:error", error => {
      toast.errorMessage(error);
    });

    socket.on("cashout", cashout => {
      // if (name === cashout.username) cashoutAudioRef.current?.play();
      const { storedGame } = global.config;
      if (!storedGame) return;
      var updated = JSON.parse(JSON.stringify(storedGame));
      (updated.bets || []).forEach(bet => bet.username === cashout.username ? bet.retrievedMultiplier = cashout.retrievedMultiplier : null);
      updated.startedAt = new Date(storedGame.startedAt);
      dispatch(setGame(updated));
      return;
    });

    socket.on("cashout:error", error => {
      toast.errorMessage(error);
    });

  }, []);

  useEffect(() => {

    const socket = getSocket();

    socket.on("history", bet => {
      const newHistory = history ? [...history] : [];
      newHistory.unshift(bet);
      global.config.history = newHistory;
    });

    return () => socket.on("history", () => {});

  }, [history]);

  if (crash_loading || !game || Object.keys(game).length === 0)
    return (
      <section className="crash-game__game" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner />
      </section>
    );

  if (error)
    return (
      <section className="crash-game__game">
        <h2 className="global-error" style={{ color: "red" }}>Refresh the page</h2>
        </section>
    );

  return (
    <section className="crash-game__game">
      <Graph />
      <div className="last-games">
        {gameHistory && gameHistory.length !== 0 && gameHistory.slice(0, 15).map(element => (
            <span
              key={element.hash}
              className={cn({
                red: +element.crash < 2,
                green: +element.crash >= 2 && +element.crash < 50,
                yellow: +element.crash >= 50,
              })}
            > {element.crash + "x"} </span>
          ))}
      </div>
    </section>
  );

};

export default Crash;
