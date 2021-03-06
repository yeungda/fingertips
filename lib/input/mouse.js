;(function() {
  Multitouch = window.Multitouch || {};
  Multitouch.mouse = function(e, delegate) {
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
      diff: null
    }
    e.addEventListener('mousedown', function(e) {
      s.mouseDown = true
      s.lastPosition = Point(e.clientX, e.clientY)
      delegate.handsOn()
    })
    e.addEventListener('mouseup', function(e) {
      delegate.letgo()
      s.mouseDown = false
      s.lastPosition = null
    })
    e.addEventListener('mousewheel', function(e) {
      delegate.change({
        x: 0,
        y: 0,
        d: (e.wheelDeltaY / 40) * -1,
        r: 0,
        originX: e.clientX,
        originY: e.clientY
      })
    })
    e.addEventListener('mouseout', function(e) {
      if (s.mouseDown) {
        delegate.letgo()
      }
      s.mouseDown = false
      s.lastPosition = null
    })
    e.addEventListener('mousemove', function(e) {
      s.mouseIn = true
      if (s.mouseDown) {
        var p = Point(e.clientX, e.clientY)
        if (s.lastPosition) {
          var l = s.lastPosition;
          var x = p.x - l.x;
          var y = p.y - l.y;
          s.diff = {
            x: x,
            y: y,
            d: 0,
            r: 0
          }
          delegate.change(s.diff)
        }
        s.lastPosition = p;
      }
    })
  }
})();
