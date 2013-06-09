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

      if (diffs.length === 0) {
        return {x: 0, y: 0}
      } else if (diffs.length === 1) {
        return diffs[0]
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
        return {
          x: moveX,
          y: moveY
        }
      } else {
        throw 'unsupported touch length: ' + a.length
      }
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
        console.log(name)
        var d = diffTouches(a,b)
        if (expected.x) {
          assertEqual(d.x, expected.x)
        }
        if (expected.y) {
          assertEqual(d.y, expected.y)
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
            id: eT.identifier,
            x: eT.clientX,
            y: eT.clientY
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

