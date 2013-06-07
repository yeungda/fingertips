document.addEventListener( "DOMContentLoaded",function() {
  document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
  });

  function Point(x,y) {
    return {
      x: x,
      y: y
    }
  }
  var pointHeight = 44;
  var pointWidth = 44;

  function differences(e, callback) {

    var state = {
      mouseDown: false,
      mouseIn: false,
      lastPosition: null
    }
    e.addEventListener('mousedown', function(e) {
      state.mouseDown = true
    })
    e.addEventListener('mouseup', function(e) {
      state.mouseDown = false
      state.lastPosition = null
    })
    e.addEventListener('mouseout', function(e) {
      state.mouseIn = false
      state.lastPosition = null
    })
    e.addEventListener('mousein', function(e) {
      state.mouseIn = true
    })
    e.addEventListener('mousemove', function(e) {
      state.mouseIn = true
      var p = Point(e.clientX, e.clientY)
      if (state.mouseDown && state.mouseIn && state.lastPosition) {
        var l = state.lastPosition;
        var s = 1;
        var x = p.x - l.x;
        var y = p.y - l.y;
        callback({
          x: x,
          y: y,
          s: s
        })
      }
      state.lastPosition = p;
    })
  }

  function transform(p,d) {
    return Point(p.x + d.x, p.y + d.y)
  }

  var box = document.getElementById('box');
  var pointPosition = Point(200,200)
  differences(box, function(d) {
    console.log(d)
    pointPosition = transform(pointPosition, d)
  })

  var point = document.getElementById('point')
  function render() {
    point.setAttribute('style', 'top: ' + (pointPosition.y - (pointHeight / 2)) + 'px; left: ' + (pointPosition.x - (pointWidth / 2)) + 'px;')
    window.requestAnimationFrame(render)
  }
  render()
})

