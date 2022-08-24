import { GRAPH } from "../../../utils/constants/crash";

const SCALE_SCOP_X = 4;
const SCALE_SCOP_Y = 4;

const normalFillRect = (shapeData) => {

  const { x, y, width, height, ctx, canvas, color } = shapeData;
  ctx.fillStyle = color;
  if (x <= 0 || y >= canvas.height - 20) return;

  const finalXCoord = x + 40;
  const finalYCoord = canvas.height - y - 5;

  ctx.fillRect(finalXCoord, finalYCoord, width, height);

};

export const drawGraph = (data) => {

  const { game, ctx, canvas, rewriteGameField, currentGameTime, graphStoppedTime } = data;
  if (!game) return;

  if (game.status === "crashed" && !game.crashPoint) return;

  const graphTime = graphStoppedTime ? graphStoppedTime : currentGameTime;
  if (game.status !== "crashed") rewriteGameField();
  if (game.status === "preparation") return;

  const count = Math.floor((graphTime / 1000) * 60);

  const widthIsAbroad = !!((count / 10) * SCALE_SCOP_X >= canvas.width - 20);
  const heightIsAbroad = !!(GRAPH(count / 10) * SCALE_SCOP_Y + 15 >= canvas.height - 15);
  const isGraphAbroad = widthIsAbroad || heightIsAbroad;

  let lastMatchingElement = { x: null, y: null, index: null };
  let translatedCoords = { x: null, y: null };

  if (isGraphAbroad) {

    for (let i = 0; i < count; i++) {

      const x = i / 10;
      const y = GRAPH(x);
      const xCoord = x * SCALE_SCOP_X;
      const yCoord = y * SCALE_SCOP_Y;

      const xIsNotAbroad = translatedCoords.x ? xCoord - translatedCoords.x <= canvas.width - 20 : xCoord <= canvas.width - 20;
      const yIsNotAbroad = translatedCoords.y ? yCoord - translatedCoords.y <= canvas.height - 15 : yCoord <= canvas.height - 15;
      const coordsIsNotAbroad = xIsNotAbroad && yIsNotAbroad;

      if (coordsIsNotAbroad) {
        translatedCoords = { x: ((count - i) / 10) * SCALE_SCOP_X, y: GRAPH((count - i) / 10) * SCALE_SCOP_Y };
        lastMatchingElement = {
          x: Math.floor(translatedCoords.x ? xCoord - translatedCoords.x : xCoord),
          y: Math.floor(translatedCoords.y ? yCoord - translatedCoords.y : yCoord),
          index: i
        };
      }

    }

  }

  for (let i = 0; i < count; i++) {
    const x = i / 10;
    const y = GRAPH(x);
    if (isGraphAbroad) {
      const xCoord = x * SCALE_SCOP_X - translatedCoords.x;
      const yCoord = y * SCALE_SCOP_Y - translatedCoords.y;
      normalFillRect({ x: xCoord, y: yCoord, width: 2, height: 2, ctx, canvas, lastMatchingElement, color: game?.status === "crashed" ? "#ff5757" : "#18aa6d" });
    } else  normalFillRect({ x: x * SCALE_SCOP_X, y: y * SCALE_SCOP_Y, width: 2, height: 2, ctx, canvas, color: game?.status === "crashed" ? "#ff5757" : "#18aa6d" });
  }
  
};
