;(function() {
  Multitouch = window.Multitouch || {};
  function nearlyZero(i) {
    return i > -.1 && i < .1
  }
  Multitouch.inertia = function(diff, callback) {
    var d = {
      x: diff.x,
      y: diff.y,
      d: diff.d,
      r: diff.r
    }
    var drag = .1
    function degrade() {
      d.x *= (1 - drag)
      d.y *= (1 - drag)
      d.d *= (1 - drag)
      d.r *= (1 - drag)

      if (!(nearlyZero(d.x) && nearlyZero(d.y) && nearlyZero(d.d) && nearlyZero(d.r))) {
        callback(d)
        window.setTimeout(degrade, 1000 / 60)
      }
    }
    degrade()
  }
})();

