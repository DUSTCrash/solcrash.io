import { MULTIPLIERS as MULTIPLIERS_FUNCTION, DISTANCE_BETWEEN_NEXT_MULTIPLIER, getTimeFromMultiplier, calculateYCoordFromMultiplier, FPS } from "../../../utils/constants/crash";

const canvas = document.getElementById("crash-canvas");
const canvasStartHeight = canvas ? canvas.offsetHeight : 0;
let MULTIPLIERS = MULTIPLIERS_FUNCTION(canvasStartHeight);
const lastStaticMultiplier = MULTIPLIERS.filter(element => element.static).slice(-1)[0];

let positions = canvasStartHeight && +canvasStartHeight !== 0 ? {
  1: calculateYCoordFromMultiplier({ canvasHeight: canvasStartHeight, multiplier: 2 }),
  2: calculateYCoordFromMultiplier({ canvasHeight: canvasStartHeight, multiplier: 3 }),
  3: calculateYCoordFromMultiplier({ canvasHeight: canvasStartHeight, multiplier: 4 }),
  4: calculateYCoordFromMultiplier({ canvasHeight: canvasStartHeight, multiplier: 5 })
} : null;
let speed = 0;

let currentVisibleMultipliers = MULTIPLIERS.filter(element => element.static);
const currentMultipliersIncludesMultiplier = (multiplier) => !!currentVisibleMultipliers.find(element => element.value === multiplier.value);

export const drawSideMultipliers = data => {

  const { ctx, canvas, game, propCurrentGameTime, canvasHeight } = data;
  const crash = game;

  if (canvasHeight !== 0 && !positions) {
    positions = {
      1: calculateYCoordFromMultiplier({ canvasHeight, multiplier: 2 }),
      2: calculateYCoordFromMultiplier({ canvasHeight, multiplier: 3 }),
      3: calculateYCoordFromMultiplier({ canvasHeight, multiplier: 4 }),
      4: calculateYCoordFromMultiplier({ canvasHeight, multiplier: 5 })
    };
    MULTIPLIERS = MULTIPLIERS_FUNCTION(canvasHeight);
  }

  ctx.clearRect(0, 0, 35, canvas.height);
  var currentGameTime = getTimeFromMultiplier(propCurrentGameTime);

  if ((crash?.status !== "started" && crash?.status !== "crashed") || currentGameTime < lastStaticMultiplier.timing) {

    positions = {
      1: calculateYCoordFromMultiplier({ canvasHeight, multiplier: 2 }),
      2: calculateYCoordFromMultiplier({ canvasHeight, multiplier: 3 }),
      3: calculateYCoordFromMultiplier({ canvasHeight, multiplier: 4 }),
      4: calculateYCoordFromMultiplier({ canvasHeight, multiplier: 5 })
    };
    currentVisibleMultipliers = MULTIPLIERS.filter(element => element.static);
    speed = 0;

    var screen_width = window.innerWidth;
    var desktopVersion = screen_width > 1350;
    var laptopVersion = screen_width > 750;

    ctx.beginPath();
    ctx.font = desktopVersion || laptopVersion ? "12px Inter" : "10px Inter";

    ctx.fillStyle = "#ffffff";
    ctx.fillText("5x", 8, positions[4]);
    ctx.fillText("4x", 8, positions[3]);
    ctx.fillText("3x", 8, positions[2]);
    ctx.fillText("2x", 8, positions[1]);
    ctx.stroke();
    return;

  }

  var lastMultiplierWeSee = null;
  var oldMultipliers = MULTIPLIERS.filter(element => element.timing < currentGameTime || element.static);
  if (oldMultipliers.length !== 0) lastMultiplierWeSee = oldMultipliers.slice(-1)[0];

  var nextMultiplierToSee = null;
  var nextMultiplier = MULTIPLIERS.find(element => element.timing > currentGameTime && !element.static);
  if (nextMultiplier && !currentMultipliersIncludesMultiplier(nextMultiplier)) nextMultiplierToSee = nextMultiplier;

  speed = nextMultiplierToSee ? DISTANCE_BETWEEN_NEXT_MULTIPLIER / Math.abs(lastMultiplierWeSee.timing - nextMultiplierToSee.timing) / FPS : 0;
  if (crash.status === "crashed") speed = 0;

  positions = {
    1: positions[1] + speed,
    2: positions[2] + speed,
    3: positions[3] + speed,
    4: positions[4] + speed
  };

  if (nextMultiplierToSee && Math.abs(nextMultiplierToSee.timing - currentGameTime) < 1 / 20) {
    currentVisibleMultipliers.shift();
    if (nextMultiplierToSee > currentVisibleMultipliers) currentVisibleMultipliers.push(nextMultiplierToSee);
    positions[1] = positions[2];
    positions[2] = positions[3];
    positions[3] = positions[4];
    positions[4] = nextMultiplierToSee.startPosition;
  }

  var screen_width = window.innerWidth;
  var desktopVersion = screen_width > 1350;
  var laptopVersion = screen_width > 750;

  ctx.beginPath();
  ctx.font = desktopVersion || laptopVersion ? "12px Inter" : "10px Inter";
  canvas.fillStyle = "#2e3765";
  currentVisibleMultipliers.forEach((element, i) => {
    ctx.fillText(element.value >= 100 ? element.value : parseInt(element.value) + "x", 8, positions[i + 1]);
  });
  ctx.stroke();

};