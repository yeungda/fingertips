;(function() {
  window.Demo = window.Demo || {};
  Demo.Renderer = function(canvas) {
    var pois = {}
    var ctx = canvas.getContext("2d");
    function drawLines() {
      if (pois.length < 150) {
        var l = null, r = null;
        ctx.beginPath();
        for (var i = 0; i < pois.length; i++) {
          l = r;
          r = pois[i]
          if (l && r) {
            ctx.lineTo(r.x, r.y);
          } else if (r) {
            ctx.moveTo(r.x, r.y);
          }
        }
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgb(233,233,233)';
        ctx.stroke();
        ctx.moveTo(0,0);
      }
    }
    function drawRectangles() {
      for (var i = 0; i < pois.length; i++) {
        var poi = pois[i]
        ctx.fillStyle = poi.c;
        ctx.translate(poi.x, poi.y)
        ctx.rotate(poi.r)
        ctx.fillRect(poi.w / -2, poi.h / -2, poi.w, poi.h);
        ctx.rotate(-1 * poi.r)
        ctx.translate(poi.x * -1, poi.y * -1)
      }
    }

    function drawDebug() {
      ctx.font = "14pt Helvetica"
      ctx.fillStyle = "gray";
      ctx.fillText('POIs: ' + pois.length,10,30)
    }

    function clear() {
      ctx.fillStyle = "white";
      ctx.fillRect(0,0,canvas.width,canvas.height)
    }

    function render() {
      clear()
      drawLines()
      drawRectangles()
      drawDebug()
      pois = null
    }
    function setPois(p) {
      var needsRedraw = pois == null
      pois = p
      if (needsRedraw) {
        window.requestAnimFrame(render)
      }
    }
    return {
      render: render,
      setPois: setPois
    }
  }
})();
