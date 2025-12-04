var ctx;
var x = -200;

document.addEventListener("DOMContentLoaded", function () {
  startcanvas();
});

function startcanvas() {
  var c = document.getElementById("canvasid");
  ctx = c.getContext("2d");

  redraw();
}

function redraw() {
  ctx.clearRect(0, 0, 100, 100);

  x++;

  ctx.beginPath();
  ctx.moveTo(50, 20);
  ctx.lineTo(x, 100);
  ctx.stroke();

  window.requestAnimationFrame(redraw);
}
