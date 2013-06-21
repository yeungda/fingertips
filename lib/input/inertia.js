;(function() {
  Multitouch = window.Multitouch || {};
  function nearlyZero(i) {
    return Math.abs(i) < .1
  }

  var drag = .1

  Multitouch.Inertia = function(callback) {
    var d = null
    var inertiaSimulatorId = null
    function stop() {
      if (inertiaSimulatorId) {
        window.clearTimeout(inertiaSimulatorId)
      }
    }
    function archive(diff) {
      return {
        x: diff.x,
        y: diff.y,
        d: diff.d,
        r: diff.r,
        originX: diff.originX,
        originY: diff.originY,
        t: new Date().getTime()
      }
    }

    function start() {
      function simulateInertia() {
        d.x *= (1 - drag)
        d.y *= (1 - drag)
        d.d *= (1 - drag)
        d.r *= (1 - drag)

        if (!(nearlyZero(d.x) && nearlyZero(d.y) && nearlyZero(d.d) && nearlyZero(d.r))) {
          callback(archive(d))
          inertiaSimulatorId = window.setTimeout(simulateInertia, 1000 / 60)
        }
      }
      simulateInertia()
    }

    function handsOn() {
      stop()
      d = {x: 0, y: 0, d: 0, r: 0, t: 0}
    }

    function letgo() {
      stop()
      start()
    }

    function change(diff) {
      stop()
      d = archive(diff)
      callback(archive(d))
    }
    return {
      letgo: letgo,
      handsOn: handsOn,
      change: change
    }
  }

})();

