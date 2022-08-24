export const FPS = 60;
export const GRAPH = (x) => 0.006 * Math.pow(x, 2);

const SCALE_SCOP_Y = 4;

export const PREPARATION_TIME = 10 * 1000;

export const getTimeFromMultiplier = multiplier => {
  return Math.log2(Math.pow(multiplier, 10));
};

export const getMultiplierFromTime = time => {
  return Math.pow(2, time / 10).toFixed(2);
};

export const calculateYCoordFromMultiplier = ({ multiplier, canvasHeight }) => {
  const timing = getTimeFromMultiplier(multiplier);
  const count = Math.floor(timing * 60);
  const y = canvasHeight - GRAPH(count / 10) * SCALE_SCOP_Y - 5;
  return y;
};

export const MULTIPLIERS = (canvasHeight) => [
  {
    value: 2,
    timing: getTimeFromMultiplier(2.0),
    static: true,
    startPosition: calculateYCoordFromMultiplier({ canvasHeight, multiplier: 2 }),
  },
  {
    value: 3,
    timing: getTimeFromMultiplier(3.0),
    static: true,
    startPosition: calculateYCoordFromMultiplier({ canvasHeight, multiplier: 3 }),
  },
  {
    value: 4,
    timing: getTimeFromMultiplier(4),
    static: true,
    startPosition: calculateYCoordFromMultiplier({ canvasHeight, multiplier: 4 }),
  },
  {
    value: 5,
    timing: getTimeFromMultiplier(4),
    static: true,
    startPosition: calculateYCoordFromMultiplier({ canvasHeight, multiplier: 5 }),
  },
  {
    value: 10,
    timing: getTimeFromMultiplier(10),
    startPosition: 30,
  },
  {
    value: 20,
    timing: getTimeFromMultiplier(20),
    startPosition: 30,
  },
  {
    value: 30,
    timing: getTimeFromMultiplier(30),
    startPosition: 30,
  },
  {
    value: 40,
    timing: getTimeFromMultiplier(40),
    startPosition: 30,
  },
  {
    value: 50,
    timing: getTimeFromMultiplier(50),
    startPosition: 30,
  },
  {
    value: 100,
    timing: getTimeFromMultiplier(100),
    startPosition: 30,
  },
  {
    value: 200,
    timing: getTimeFromMultiplier(200),
    startPosition: 30,
  },
  {
    value: 300,
    timing: getTimeFromMultiplier(300),
    startPosition: 30,
  },
  {
    value: 400,
    timing: getTimeFromMultiplier(400),
    startPosition: 30,
  },
  {
    value: 500,
    timing: getTimeFromMultiplier(500),
    startPosition: 30,
  },
  {
    value: 1000,
    timing: getTimeFromMultiplier(1000),
    startPosition: 30,
  },
  {
    value: 2000,
    timing: getTimeFromMultiplier(2000),
    startPosition: 30,
  },
  {
    value: 3000,
    timing: getTimeFromMultiplier(3000),
    startPosition: 30,
  },
  {
    value: 4000,
    timing: getTimeFromMultiplier(4000),
    startPosition: 30,
  },
  {
    value: 5000,
    timing: getTimeFromMultiplier(5000),
    startPosition: 30,
  },
  {
    value: 6000,
    timing: getTimeFromMultiplier(6000),
    startPosition: 30,
  },
  {
    value: 7000,
    timing: getTimeFromMultiplier(7000),
    startPosition: 30,
  },
  {
    value: 8000,
    timing: getTimeFromMultiplier(8000),
    startPosition: 30,
  },
  {
    value: 9000,
    timing: getTimeFromMultiplier(9000),
    startPosition: 30,
  },
  {
    value: 10000,
    timing: getTimeFromMultiplier(10000),
    startPosition: 30,
  },
];

export const DISTANCE_BETWEEN_NEXT_MULTIPLIER = 100;
