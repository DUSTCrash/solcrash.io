export const formatNum = (num) => {
  num = parseFloat(num);
  var rounded = num.toFixed(4);
  return parseFloat(rounded);
};