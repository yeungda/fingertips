;(function() {
  Multitouch = window.Multitouch || {};
  Multitouch.bind = function(e, callback) {
    var inertia = Multitouch.Inertia(callback)
    Multitouch.keyboard(e, inertia)
    Multitouch.mouse(e, inertia)
    Multitouch.finger(e, inertia)
  }
})();
;(function() {
  Multitouch = window.Multitouch || {};
  function diffTouches(a,b) {
    var moves = {}
    for (var i = 0; i < b.length; i++) {
      var touch = b[i]
      if (moves[touch.id] === undefined) {
        moves[touch.id] = []
      }
      moves[touch.id].push(touch)
    }
    for (var i = 0; i < a.length; i++) {
      var touch = a[i]
      if (moves[touch.id] === undefined) {
        moves[touch.id] = []
      }
      moves[touch.id].push(touch)
    }
    var diffs = Object.keys(moves).reduce(function(d, id) {
      var move = moves[id]
      if (move.length === 2) {
        d.push({
          x: move[0].x - move[1].x,
          y: move[0].y - move[1].y
        })
      }
      return d
    },[])

    var diff = {x: 0, y: 0, d: 0, r: 0}
    if (diffs.length === 0) {
      // no change
    } else if (diffs.length === 1) {
      diff.x = diffs[0].x
      diff.y = diffs[0].y
    } else if (diffs.length === 2) {
      var firstMoveX = diffs[0].x
      var secondMoveX = diffs[1].x
      var firstMoveY = diffs[0].y
      var secondMoveY = diffs[1].y

      var moveX, moveY;
      if (firstMoveX > 0 && secondMoveX > 0) {
        moveX = Math.min(firstMoveX, secondMoveX)
      } else if (firstMoveX < 0 && secondMoveX < 0) {
        moveX = Math.max(firstMoveX, secondMoveX)
      } else {
        moveX = 0
      }

      if (firstMoveY > 0 && secondMoveY > 0) {
        moveY = Math.min(firstMoveY, secondMoveY)
      } else if (firstMoveY < 0 && secondMoveY < 0) {
        moveY = Math.max(firstMoveY, secondMoveY)
      } else {
        moveY = 0
      }
      diff.x = moveX
      diff.y = moveY

      var dimensions = [
       {w: a[0].x - a[1].x, 
        h:a[0].y - a[1].y},
       {w: b[0].x - b[1].x, 
        h:b[0].y - b[1].y}
      ]
      function square(x) { return x * x }
      var metrics = dimensions.map(function(x) {
        return {
          d: Math.sqrt(square(x.w) + square(x.h)),
          a: Math.atan(x.h / x.w)
        }
      })
      var rotation = metrics[1].a - metrics[0].a
      
      diff.d = metrics[1].d - metrics[0].d
      if (rotation <= Math.PI / -2) {
        diff.r = Math.PI + rotation
      } else if (rotation >= Math.PI / 2) {
        diff.r = -1 * Math.PI + rotation
      } else {
        diff.r = rotation
      }

      diff.originX = (a[0].x + a[1].x) / 2
      diff.originY = (a[0].y + a[1].y) / 2
    } else {
      throw 'unsupported touch length: ' + a.length
    }
    return diff
  }

  (function() {
    function assertEqual(a,b) {
      if (a !== b) {
        throw a + ' not eq ' + b
      }
    }
    function diffTest(name, g, expected) {
      var a = [], b = [];

      for (var y = 0; y < g.length; y++) {
        var row = g[y]
        for (var x = 0; x < row.length; x++) {
          var cell = row[x]
          for (var c = 0; c < cell.length; c++) {
            var touch = cell[c]
            var input = ((touch < 0) ? a : b)
            input.push({id: Math.abs(touch), x: x, y: y})
          }
        }
      }
      console.log("Test: " + name)
      var d = diffTouches(a,b)
      for (var k in expected) {
        assertEqual(d[k], expected[k])
      }
    }

    diffTest('single finger no move', 
             [[[-1,1]]],
             {x: 0, y: 0})
    diffTest('single finger move right', 
             [[[-1],[1]]],
             {x: 1})
    diffTest('single finger move left', 
              [[[1],[-1]]],
              {x: -1})
    diffTest('single finger move up', 
             [[[ 1]],
              [[-1]]],
             {y: -1})
    diffTest('single finger move down',
             [[[-1]],
              [[ 1]]],
             {y: 1})

    diffTest('single finger move right, ignore second finger coming in', 
             [[[-1],[1]],
              [[ 2],[ ]]],
             {x: 1, y: 0})

    diffTest('two fingers no move', 
             [[[-1,1],[-2,2]]],
        {x: 0, y: 0})

    diffTest('two fingers both move right at same distance', 
             [[[-1],[1],[-2],[2]]],
             {x: 1, y: 0})

    diffTest('two fingers both move right, left moves further', 
             [[[-1],[],[1],[-2],[2]]],
             {x: 1, y: 0})

    diffTest('two fingers both move right, right moves further', 
             [[[-1],[1],[-2],[],[2]]],
             {x: 1, y: 0})

    diffTest('two fingers both move left at same distance', 
             [[[1],[-1],[2],[-2]]],
             {x: -1, y: 0})

    diffTest('two fingers both move left, left moves further', 
             [[[1],[],[-1],[2],[-2]]],
             {x: -1, y: 0})

    diffTest('two fingers both move left, right moves further', 
             [[[1],[-1],[2],[],[-2]]],
             {x: -1, y: 0})

    diffTest('two fingers both move down at same distance', 
             [[[-1]],
              [[ 1]],
              [[-2]],
              [[ 2]]],
             {x: 0, y: 1})

    diffTest('two fingers both move down, top moves further', 
             [[[-1]],
              [[  ]],
              [[ 1]],
              [[-2]],
              [[ 2]]],
             {x: 0, y: 1})

    diffTest('two fingers both move down, bottom moves further', 
             [[[-1]],
              [[ 1]],
              [[-2]],
              [[  ]],
              [[ 2]]],
             {x: 0, y: 1})

    diffTest('two fingers both move up at same distance', 
             [[[ 1]],
              [[-1]],
              [[ 2]],
              [[-2]]],
             {x: 0, y: -1})

    diffTest('two fingers both move up, top moves further', 
             [[[ 1]],
              [[  ]],
              [[-1]],
              [[ 2]],
              [[-2]]],
             {x: 0, y: -1})

    diffTest('two fingers both move up, bottom moves further', 
             [[[ 1]],
              [[-1]],
              [[ 2]],
              [[  ]],
              [[-2]]],
             {x: 0, y: -1})

    diffTest('two fingers move toward each left and right',
             [[[-1],[1],[2],[-2]]],
             {x: 0, y: 0})
    diffTest('two fingers move apart from each other left and right',
             [[[1],[-1],[-2],[2]]],
             {x: 0, y: 0})
    diffTest('two fingers move toward each up and down',
             [[[-1]],
              [[ 1]],
              [[ 2]],
              [[-2]]],
             {x: 0, y: 0})
    diffTest('two fingers move apart from each other up and down',
             [[[ 1]],
              [[-1]],
              [[-2]],
              [[ 2]]],
             {x: 0, y: 0})

    diffTest('two fingers to one finger, no movement',
             [[[1,-1, -2]]],
             {x: 0, y: 0})

    diffTest('two fingers the left is still, the right moves left',
             [[[-1, 1],[2],[-2]]],
             {d: -1})
    diffTest('two fingers the left is still, the right moves right',
             [[[1, -1],[-2],[2]]],
             {d: 1})
    diffTest('two fingers the left moves right, the right is still',
             [[[-1],[1],[-2,2]]],
             {d: -1})
    diffTest('two fingers the left moves left, the right is still',
             [[[1],[-1],[-2,2]]],
             {d: 1})
    diffTest('two fingers the top is still, the bottom moves up',
             [[[-1, 1]],
              [[    2]],
              [[   -2]]],
             {d: -1})
    diffTest('two fingers the top is still, the bottom moves down',
             [[[-1, 1]],
              [[   -2]],
              [[    2]]],
             {d: 1})
    diffTest('two fingers the top is still, the bottom moves down and right',
             [[[-1, 1],[  ],[ ]],
              [[     ],[-2],[ ]],
              [[     ],[  ],[2]]],
             {d: Math.sqrt(2)})
    diffTest('two fingers the left is still, the right moves down',
             [[[-1, 1],[-2]],
              [[     ],[ 2]]],
             {r: Math.PI / 4})
    diffTest('two fingers the left is still, the right moves up',
             [[[     ],[ 2]],
              [[-1, 1],[-2]]],
             {r: -Math.PI / 4})
    diffTest('two fingers the left is still, the right moves above, anti clockwise',
             [[[    2],[-2]],
              [[-1, 1],[  ]]],
             {r: -Math.PI / 4})
    diffTest('two fingers the left is still, the right from 1.5 o clock to 3 o clock',
             [[[     ],[-2]],
              [[-1, 1],[ 2]]],
             {r: Math.PI / 4})
    diffTest('two fingers the left is still, the right moves below, clockwise',
             [[[-1, 1],[  ]],
              [[    2],[-2]]],
             {r: Math.PI / 4})
    diffTest('two fingers the left is still, the right moves below, clockwise',
             [[[ ],[-1, 1]],
              [[2],[   -2]]],
             {r: Math.PI / 4})
    diffTest('two fingers the bottom is still, the right from 1.5 o clock to 10.5 o clock',
             [[[2],[    ],[-2]],
              [[ ],[-1,1],[  ]]],
             {r: Math.PI / -2})

  })()

  Multitouch.finger = function(e, delegate) {
    var s = {
      touches: null
    }
    function toTouches(eTouches) {
      var a = []
      for (var i = 0; i < eTouches.length; i++) {
        var eT = eTouches[i]
        a.push({
          id: eT.identifier,
          x: eT.clientX,
          y: eT.clientY
        })
      }
      return a
    }
    e.addEventListener('touchstart', function(e) {
      if (e.targetTouches.length === 1) {
        delegate.handsOn()
      }
    })
    e.addEventListener('touchmove', function(e) {
      var t = toTouches(e.targetTouches)
      if (s.touches) {
        delegate.change(diffTouches(s.touches, t))
      }
      s.touches = t
    })
    e.addEventListener('touchend', function(e) {
      if (e.targetTouches.length === 0) {
        delegate.letgo()
      }
    })
  }
})();
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

;(function() {
  Multitouch = window.Multitouch || {};
  Multitouch.init = function(document) {
    function preventDefault(e) {
      e.preventDefault();
    }
    document.body.addEventListener('touchmove', preventDefault)
    document.body.addEventListener('mousewheel', preventDefault)
  }
})();
;(function() {

  Multitouch = window.Multitouch || {};

  Multitouch.keyboard = function(el, delegate) {
    document.body.addEventListener('keydown', function(e) {
      var diff = {x:0,y:0,r:0,d:0}
      if (e.keyCode === 37) {
        diff.x += 5
        delegate.change(diff)
      } else if (e.keyCode === 38) {
        diff.y += 5
        delegate.change(diff)
      } else if (e.keyCode === 39) {
        diff.x -= 5
        delegate.change(diff)
      } else if (e.keyCode === 40) {
        diff.y -= 5
        delegate.change(diff)
      }
    })
  }
})();
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
