import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

import { getDate } from "../../../utils/helper/getServer";
import { PREPARATION_TIME } from "../../../utils/constants/crash";

const ProgressBar = () => {

  const { game } = useSelector(state => state.global_info);
  const [progress, setProgress] = useState({ progressBarVisible: false, progressBarLabel: "", progressLineStyles: null });
  const dropAllStyles = useCallback(() => setProgress({ ...progress, progressBarVisible: false }), []);

  const drawPreparationMode = ({ timeToStart }) => {

    const percent = (timeToStart / PREPARATION_TIME) * 100;
    const timeSeconds = moment(timeToStart).format("ss");

    let timeMs = Math.floor(timeToStart % 1000).toFixed(2).split("").slice(0, 2).join("");
    if (timeMs.length === 1) timeMs = "0" + timeMs;
    if (timeMs.length === 0) timeMs = "00";

    setProgress({
      ...progress,
      progressBarVisible: true,
      progressLineStyles: {
        background: "#18aa6d",
        display: "block",
        width: timeToStart > 0 ? (percent > 100 ? 100 : percent) + "%" : "0%",
      },
      progressBarLabel: "Next Round In: " + (timeSeconds >= 0 && timeSeconds < 10 ? timeSeconds + ":" + timeMs : "00:00")
    });

  };

  const drawProgressHeader = ({ timeToStart, game }) => {
    if (game?.status === "preparation" && !!timeToStart) return drawPreparationMode({ timeToStart });
    return dropAllStyles();
  };

  useEffect(() => {

    const interval = setInterval(() => {
      const timeToStart = game && game.startedAt - getDate();
      drawProgressHeader({ timeToStart, game });
    }, 1000 / 10);

    return () => clearInterval(interval);

  }, [game]);

  return (
    <>
      {progress.progressBarVisible && (
        <div className="status-progress-bar">
          <div className="crash-progress" style={progress.progressLineStyles}></div>
          <span>{progress.progressBarLabel}</span>
        </div>
      )}
    </>
  );
  
};

export default ProgressBar;
