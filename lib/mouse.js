;(function() {
  Multitouch = window.Multitouch || {};
  Multitouch.mouse = function(e, callback) {
    function Point(x,y) {
      return {
        x: x,
        y: y
      }
    }
    var s = {
      mouseDown: false,
      mouseIn: false,
      lastPosition: null,
    }
    e.addEventListener('mousedown', function(e) {
      s.mouseDown = true
      s.lastPosition = Point(e.x, e.y)
      s.xDistance = 0
    })
    e.addEventListener('mouseup', function(e) {
      s.mouseDown = false
      s.lastPosition = null
    })
    e.addEventListener('mousewheel', function(e) {
      callback({
        x: 0,
        y: 0,
        d: (e.wheelDeltaY / 40) * -1
      })
    })
    e.addEventListener('mousemove', function(e) {
      s.mouseIn = true
      if (s.mouseDown) {
        var p = Point(e.x, e.y)
        if (s.lastPosition) {
          var l = s.lastPosition;
          var x = p.x - l.x;
          var y = p.y - l.y;
          callback({
            x: x,
            y: y,
            d: 0
          })
        }
        s.lastPosition = p;
      }
    })
  }
})();
