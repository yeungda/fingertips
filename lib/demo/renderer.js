;(function() {
  window.Demo = window.Demo || {};
  Demo.Renderer = function(canvas) {
    var pois = {}
    var ctx = canvas.getContext("2d");
    function render() {
      ctx.fillStyle = "rgba(230,255,230,0.4)";
      //ctx.fillStyle = "white";
      ctx.fillRect(0,0,canvas.width,canvas.height)
      var ps = pois
      for (var i = 0; i < ps.length; i++) {
        var poi = ps[i]
        ctx.fillStyle = poi.c;
        ctx.translate(poi.x, poi.y)
        ctx.rotate(poi.r)
        ctx.fillRect(poi.w / -2, poi.h / -2, poi.w, poi.h);
        ctx.rotate(-1 * poi.r)
        ctx.translate(poi.x * -1, poi.y * -1)
      }
      
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
