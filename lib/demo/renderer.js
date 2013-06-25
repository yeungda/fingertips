;(function() {
  window.Demo = window.Demo || {};
  Demo.Renderer = function(canvas) {
    var pois = {}
    var ctx = canvas.getContext("2d");
    function drawLines() {
      if (pois.length < 600) {
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
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'rgba(153,153,153,.1)';
        ctx.stroke();
        ctx.moveTo(0,0);
      }
    }
    function drawRectangles() {
      ctx.fillStyle = "rgba(230,255,230,0.4)";
      //ctx.fillStyle = "white";
      ctx.fillRect(0,0,canvas.width,canvas.height)
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
    function render() {
      drawLines()
      drawRectangles()
      window.requestAnimFrame(render)
    }
    function setPois(p) {
      pois = p
    }
    return {
      render: render,
      setPois: setPois
    }
  }
})();
