export function drawBackground(ctx, canvas, bgSrc) {
  if (!bgSrc) return;

  const bgImg = new Image();
  bgImg.src = bgSrc;

  bgImg.onload = () => {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  };
}
