window.requestAnimFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

document.addEventListener( "DOMContentLoaded",function() {
  function preventDefault(e) {
    e.preventDefault();
  }
  document.body.addEventListener('touchmove', preventDefault)
  document.body.addEventListener('mousewheel', preventDefault)

  function Point(x,y) {
    return {
      x: x,
      y: y
    }
  }

  function listen(e, callback) {

    function mouse() {
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
        console.log(e)
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
              y: y
            })
          }
          s.lastPosition = p;
        }
      })
    }

    function finger() {
      var s = {
        fingerId: null,
        fingerDown: false,
        lastPosition: null
      }
      e.addEventListener('touchstart', function(e) {
        if (!s.fingerDown) {
          s.fingerDown = true
          s.fingerId = e.targetTouches[0].identifier
        }
        console.log('fingerdown')
      })
      e.addEventListener('touchend', function(e) {
        if (!findTouchById(e.targetTouches, s.fingerId)) {
          s.fingerDown = false
          s.lastPosition = null
          s.fingerId = null
          console.log('fingerup')
        }
      })
      function findTouchById(touches, id) {
        for (var i = 0; i < touches.length; i++ ) {
          if (touches[i].identifier === id) {
            return touches[i]
          }
        }
      }
      e.addEventListener('touchmove', function(e) {
        if (s.fingerDown) {
          var t = findTouchById(e.targetTouches, s.fingerId)
          var p = Point(t.clientX, t.clientY)
          if (s.lastPosition) {
            var l = s.lastPosition;
            var x = p.x - l.x;
            var y = p.y - l.y;
            callback({
              x: x,
              y: y
            })
          }
          s.lastPosition = p
        }
      })
    }

    mouse()
    finger()
  }

  function transform(p,d) {
    return Point(p.x + d.x, p.y + d.y)
  }

  var box = document.getElementById('box');
  var pointPosition = Point(200,200)
  listen(box, function(d) {
    pointPosition = transform(pointPosition, d)
  })

  var point = document.getElementById('point')
  var pointHeight = 44;
  var pointWidth = 44;
  function render() {
    point.setAttribute('style', 'top: ' + (pointPosition.y - (pointHeight / 2)) + 'px; left: ' + (pointPosition.x - (pointWidth / 2)) + 'px;')
    window.requestAnimFrame(render)
  }
  render()
})

