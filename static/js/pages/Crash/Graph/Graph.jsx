import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import ProgressBar from "../ProgressBar/ProgressBar";
import Multiplier from "../Multiplier/Multiplier";

import { getDate } from "../../../utils/helper/getServer";
import { FPS, getMultiplierFromTime } from "../../../utils/constants/crash";
import { drawGraph } from "../draws/drawGraph";
import { drawStaticPart } from "../draws/drawStaticPart";
import { drawSideMultipliers } from "../draws/drawSideMultipliers";

import "../../../config";

const Graph = () => {

  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const { screen_width } = useSelector(state => state.global_info);

  useEffect(() => {

    const crashGraphElement = canvasContainerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = crashGraphElement.clientWidth - 20;
    canvas.height = crashGraphElement.clientHeight - 10;

    const rewriteGameField = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawStaticPart({ ctx, canvas });
    };

    const draw = () => {
      
      const { storedGame } = global.config;
      const startDate = storedGame?.startedAt;
      const currentGameTime = getDate() - startDate;

      const currentMultiplier = getMultiplierFromTime(currentGameTime / 1000) < 1 ? "1.00" : getMultiplierFromTime(currentGameTime / 1000);
      const graphStoppedTime = storedGame?.crashPoint;

      drawGraph({ canvas, ctx, currentGameTime, rewriteGameField, game: storedGame, graphStoppedTime, currentMultiplier });
      drawSideMultipliers({ ctx, canvas, game: storedGame, propCurrentGameTime: currentMultiplier, canvasHeight: canvasRef?.current?.offsetHeight });

    };

    const drawInterval = setInterval(draw, 1000 / FPS);
    return () => clearInterval(drawInterval);

  }, [screen_width, canvasRef]);

  return (
    <div className="crash-container__graph">
      <div className="crash-canvas-container" ref={canvasContainerRef}>
        <canvas id="crash-canvas" ref={canvasRef} />
        <Multiplier />
      </div>
      <ProgressBar />
    </div>
  );
  
};

export default Graph;
