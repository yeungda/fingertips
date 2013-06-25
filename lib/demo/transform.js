;(function() {
  Transform = window.Transform || {};

  Transform.rotatePoints = function(points, angle) {
    return points.map(function(p) {
      return [
        p[0] * Math.cos(angle) - p[1] * Math.sin(angle),
        p[1] * Math.cos(angle) + p[0] * Math.sin(angle)
      ]
    })
  }
  Transform.rotate = function(r, a) {
    return {
      x: r.x * Math.cos(a) - r.y * Math.sin(a),
      y: r.y * Math.cos(a) + r.x * Math.sin(a),
      w: r.w,
      h: r.h,
      r: r.r + a
    }
  }

  Transform.translate = function(r, x, y) {
    return {
      x: r.x + x,
      y: r.y + y,
      w: r.w,
      h: r.h,
      r: r.r
    }
  }

  Transform.scale = function(r, s) {
    return {
      x: r.x * s,
      y: r.y * s,
      w: r.w * s,
      h: r.h * s,
      r: r.r,
    }
  }

  Transform.expand = function(r, distance) {
    return {
      x: r.x - distance,
      y: r.y - distance,
      w: r.w + (distance * 2),
      h: r.h + (distance * 2),
      r: r.r
    }
  }
})();
