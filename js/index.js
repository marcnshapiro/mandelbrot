var xmin = -2;
var xmax = 1;
var ymin = -1;
var ymax = 1;
var iterations = 1000;
var canvas;

function mandelIter(cx, cy) {
  var x = 0.0;
  var y = 0.0;
  var xx = 0;
  var yy = 0;
  var xy = 0;
 
  var i = iterations;
  while (i-- && xx + yy <= 4) {
    xy = x * y;
    xx = x * x;
    yy = y * y;
    x = xx - yy + cx;
    y = xy + xy + cy;
  }
  return iterations - i;
}
 
function mandelbrot() {
  var width = canvas.width;
  var height = canvas.height;

  var ctx = canvas.getContext('2d');
  var img = ctx.getImageData(0, 0, width, height);
  var pix = img.data;

  $("#xmin").html(xmin.toFixed(7));
  $("#xmax").html(xmax.toFixed(7));
  $("#ymin").html(ymin.toFixed(7));
  $("#ymax").html(ymax.toFixed(7));

  for (var ix = 0; ix < width; ++ix) {
    for (var iy = 0; iy < height; ++iy) {
      var x = xmin + (xmax - xmin) * ix / (width - 1);
      var y = ymin + (ymax - ymin) * iy / (height - 1);
      var i = mandelIter(x, y);
      var ppos = 4 * (width * iy + ix);
 
      if (i > iterations) {
        pix[ppos] = 0;
        pix[ppos + 1] = 0;
        pix[ppos + 2] = 0;
      } else {
        var c = 3 * Math.log(i) / Math.log(iterations - 1.0);
 
        if (c < 1) {
          pix[ppos + 2] = 255 * c;
          pix[ppos + 1] = 0;
          pix[ppos] = 0;
        }
        else if ( c < 2 ) {
          pix[ppos+ 2] = 255;
          pix[ppos + 1] = 255 * (c - 1);
          pix[ppos] = 0;
        } else {
          pix[ppos+ 2] = 255;
          pix[ppos + 1] = 255;
          pix[ppos] = 255 * (c - 2);
        }
      }
      pix[ppos + 3] = 255;
    }
  }
 
  ctx.putImageData(img, 0, 0);
}

function zoom(e) {
  var btn = e.button;
  var x = e.offsetX;
  var y = e.offsetY;
  var xRange = xmax - xmin;
  var yRange = ymax - ymin;
  var cX = xmin + x / 900 * xRange;
  var cY = ymin+ y / 600 * yRange;

  switch (btn) {
    case 0:
        xmin = cX - xRange / 4;
        xmax = cX + xRange / 4;
        ymin = cY - yRange / 4;
        ymax = cY + yRange / 4;

        mandelbrot();
        break;
    case 1:
        xmin = cX - xRange / 2;
        xmax = cX + xRange / 2;
        ymin = cY - yRange / 2;
        ymax = cY + yRange / 2;

        mandelbrot();
        break;
    case 2:
        xmin = cX - xRange;
        xmax = cX + xRange;
        ymin = cY - yRange;
        ymax = cY + yRange;

        mandelbrot();
        break;
  }
  return false;
}

$(document).ready( function() {
  $("#reset").on("click", function() {xmin = -2; xmax = 1; ymin = -1; ymax = 1; mandelbrot();});

  canvas = document.getElementById('canvas');

  mandelbrot();
});
