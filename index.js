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

    function diffTouches(a,b) {
      console.log('a')
      console.log(a)
      console.log('b')
      console.log(b)
      return {
        x: b[0].clientX - a[0].clientX,
        y: b[0].clientY - a[0].clientY
      }
    }

    (function() {
      function assertEqual(a,b) {
        if (a !== b) {
          throw a + ' not eq ' + b
        }
      }
      function test(name, t) {
        console.log(name)
        t()
      }

      test('single finger no move', function() {
        var d = diffTouches(
          [{identifier: 1, clientX: 0, clientY: 0}], 
          [{identifier: 1, clientX: 0, clientY: 0}])
        assertEqual(d.x, 0)
        assertEqual(d.y, 0)
      })
      test('single finger move right', function() {
        var d = diffTouches(
          [{identifier: 1, clientX: 0, clientY: 0}], 
          [{identifier: 1, clientX: 1, clientY: 0}])
        assertEqual(d.x, 1)
      })
      test('single finger move left', function() {
        var d = diffTouches(
          [{identifier: 1, clientX: 1, clientY: 0}], 
          [{identifier: 1, clientX: 0, clientY: 0}])
        assertEqual(d.x, -1)
      })
      test('single finger move up', function() {
        var d = diffTouches(
          [{identifier: 1, clientX: 0, clientY: 1}], 
          [{identifier: 1, clientX: 0, clientY: 0}])
        assertEqual(d.y, -1)
      })
      test('single finger move down', function() {
        var d = diffTouches(
          [{identifier: 1, clientX: 0, clientY: 0}], 
          [{identifier: 1, clientX: 0, clientY: 1}])
        assertEqual(d.y, 1)
      })

      test('single finger move ignoring extra finger', function() {
        var d = diffTouches(
          [{identifier: 1, clientX: 0, clientY: 0}], 
          [{identifier: 1, clientX: 1, clientY: 0}, {identifier: 2, clientX: 10, clientY: 10}])
        assertEqual(d.x, 1)
        assertEqual(d.y, 0)
      })
    })()

    function finger() {
      var s = {
        touches: null
      }
      function toTouches(eTouches) {
        var a = []
        for (var i = 0; i < eTouches.length; i++) {
          var eT = eTouches[i]
          a.push({
            identifier: eT.identifier,
            clientX: eT.clientX,
            clientY: eT.clientY
          })
        }
        return a
      }
      e.addEventListener('touchmove', function(e) {
        var t = toTouches(e.targetTouches)
        if (s.touches) {
          callback(diffTouches(s.touches, t))
        }
        s.touches = t
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
    console.log(d)
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

