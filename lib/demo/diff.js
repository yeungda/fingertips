;(function() {
  window.Demo = window.Demo || {};
  Demo.Diff = {
    transform: function(diff, from, to) {
      var scale = to.w / from.w
      var transformedOrigin = Transform.rotate(
        Transform.scale({x: diff.originX, y: diff.originY}, scale),
        to.r
      )
      var transformedDiff = Transform.rotate(
        Transform.scale({x: diff.x, y: diff.y, w: diff.d, h: diff.d}, scale),
        to.r
      )
      return {
        x: transformedDiff.x,
        y: transformedDiff.y,
        d: transformedDiff.w,
        r: diff.r,
        originX: transformedOrigin.x,
        originY: transformedOrigin.y,
      }
    }
  }
})();
