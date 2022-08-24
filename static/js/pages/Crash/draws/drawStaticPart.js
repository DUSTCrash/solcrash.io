export const drawStaticPart = data => {

  const { canvas, ctx } = data;

  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#fff";
  ctx.moveTo(40, canvas.height);
  ctx.lineTo(40, 30);
  ctx.moveTo(40, canvas.height - 1.5);
  ctx.lineTo(canvas.width, canvas.height - 1.5);
  ctx.stroke();

};
