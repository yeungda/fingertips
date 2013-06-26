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
;(function() {
  window.Demo = window.Demo || {};
  Demo.Canvas = function(id, onresize) {
    var box = document.getElementById(id);
    function boxInit() {
      var beforeW = box.width
      var beforeH = box.height
      box.width = box.clientWidth
      box.height = box.clientHeight
      onresize(box.width / beforeW, box.height / beforeH)
    }
    boxInit()
    function resize() {
      boxInit()
    }
    window.onresize = resize

    function toRect() {
      return {
        w: box.width,
        h: box.height
      }
    }

    function dom() {
      return box;
    }

    return {
      toRect: toRect,
      dom: dom
    }
  }
})();
;(function() {
  window.Demo = window.Demo || {};
  Demo.Diff = {
    transform: function(diff, from, to) {
      var scale = to.w / from.w
      var transformedOrigin = Transform.rotate(
        Transform.scale({x: diff.originX, y: diff.originY}, scale),
        to.r
      )
      var transformedDiff = Transform.rotate(
        Transform.scale({x: diff.x, y: diff.y, w: diff.d, h: diff.d}, scale),
        to.r
      )
      return {
        x: transformedDiff.x,
        y: transformedDiff.y,
        d: transformedDiff.w,
        r: diff.r,
        originX: transformedOrigin.x,
        originY: transformedOrigin.y,
      }
    }
  }
})();
;(function() {
  window.Demo = window.Demo || {};
  Demo.Grid = function(maxX, maxY, a) {
    function minmax(x,min,max) {
      return Math.max(Math.min(x, max), min)
    }
    function toIndex(x, y) {
      var divisor = 100
      return [Math.floor(minmax(x,0,maxX) / divisor), Math.floor(minmax(y, 0, maxY) / divisor)]
    }
    var maxIndex = toIndex(maxX, maxY)
    var matrix = new Array(maxIndex[0] + 1)
    for (var i = 0; i < matrix.length; i++) {
      matrix[i] = new Array(maxIndex[1] + 1)
      for (var j = 0; j < matrix[i].length; j++) {
        matrix[i][j] = []
      }
    }

    for (var i = 0; i < a.length; i++) {
      var poi = a[i]
      var index = toIndex(poi.x, poi.y)
      matrix[index[0]][index[1]].push(poi)
    }

    function find(r) {
      var minIndex = toIndex(r[0][0], r[0][1])
      var maxIndex = toIndex(r[1][0], r[1][1])
      var r = []
      for (var x = minIndex[0]; x <= maxIndex[0]; x++) {
        for (var y = minIndex[1]; y <= maxIndex[1]; y++) {
          r = r.concat(matrix[x][y])
        }
      }
      return r
    }
    return {
      find: find
    }
  }
})();
document.addEventListener( "DOMContentLoaded",function() {
  var canvas = Demo.Canvas('box', function(w,h) {
    if (viewport) {
      viewport.resize(w,h)
      input({x:0, y:0, d:0, r:0})
    }
  })

  var world = {x: 0, y: 0, w: 10000, h: 10000}

  var canvasRect = canvas.toRect()
  var viewport = Demo.Viewport({
    x: (world.w / 2) - (canvasRect.w / 2), 
    y: (world.h / 2) - (canvasRect.h / 2), 
    w: canvasRect.w, 
    h: canvasRect.h, 
    r: 0, 
  })

  var renderer = Demo.Renderer(canvas.dom())
  renderer.setPois(find(canvas, viewport.toRect()))
  renderer.render()

  function find(canvas, rectangle) {
    var rotation = rectangle.r * -1
    var rotatedRectangle = Transform.rotate(rectangle, rotation)
    return Demo.Pois.find(rectangle).map(function(poi) {
      var result = poi
      var result = Transform.rotate(result, rotation)
      var result = Transform.translate(result, rotatedRectangle.x * -1, rotatedRectangle.y * -1)
      var result = Transform.scale(result, canvas.toRect().w / rotatedRectangle.w)
      result.c = poi.c
      return result
    })
  }

  function input(canvasD) {
    var canvasRect = canvas.toRect()
    canvasD.d *= 4
    if (!canvasD.originX) {
      canvasD.originX = canvasRect.w / 2
    }
    if (!canvasD.originY) {
      canvasD.originY = canvasRect.h / 2
    }

    var worldD = Demo.Diff.transform(canvasD, canvasRect, viewport.toRect())
    viewport.transform(worldD, canvasRect, world)
    renderer.setPois(find(canvas, viewport.toRect()))
  }
  Multitouch.init(document)
  Multitouch.bind(canvas.dom(), input)

})

;(function() {
  window.Demo = window.Demo || {};

  function generate(width, height) {
    function randomGray() {
      var shade = Math.floor((Math.random() * 85) + 170).toString(16)
      return "#" + shade + shade + shade
    }
    var space = 22 * 3
    var pois = []
    for (var x = 0; x < width; x += space) {
      for (var y = 0; y < height; y += space) {
        pois.push({
          x: x + (Math.random() * space), y: y + (Math.random() * space), w: 22, h: 22, c: randomGray(), r: 0
        })
      }
    }
    return pois;
  }

  var grid = Demo.Grid(10000, 10000, generate(10000, 10000))
  
  function coveringRectangleOf(rectangle) {
    var flatR = Transform.rotate(rectangle, rectangle.r * -1)
    var points = [
      [flatR.x, flatR.y],
      [flatR.x + flatR.w, flatR.y],
      [flatR.x, flatR.y + flatR.h],
      [flatR.x + flatR.w, flatR.y + flatR.h],
    ]
    var rPoints = Transform.rotatePoints(points, rectangle.r)
    var min = rPoints.reduce(function(result, p) {
      if (result[0] === null || result[0] > p[0]) {
        result[0] = p[0]
      }
      if (result[1] === null || result[1] > p[1]) {
        result[1] = p[1]
      }
      return result
    }, [null, null])
    var max = rPoints.reduce(function(result, p) {
      if (result[0] === null || result[0] < p[0]) {
        result[0] = p[0]
      }
      if (result[1] === null || result[1] < p[1]) {
        result[1] = p[1]
      }
      return result
    }, [null, null])
    return [min, max]
  }

  function find(rectangle) {
    var rotation = rectangle.r * -1
    var flatR = Transform.rotate(rectangle, rotation)
    function between(x, min, max) {
      return x >= min && x <= max
    }
    var poisNearRectangle = grid.find(coveringRectangleOf(rectangle))
    var found = []
    for (var i = 0; i < poisNearRectangle.length; i++) {
      var poi = poisNearRectangle[i]
      var rotatedPoi = Transform.rotate(poi, rotation)
      if (between(rotatedPoi.x, flatR.x, flatR.x + flatR.w) && 
             between(rotatedPoi.y, flatR.y, flatR.y + flatR.h)) {
          found.push(poi)
      }
    }
    return found
  }
  Demo.Pois = {
    find: find
  }
})();
;(function() {
  window.Demo = window.Demo || {};
  Demo.Renderer = function(canvas) {
    var pois = {}
    var ctx = canvas.getContext("2d");
    function drawLines() {
      if (pois.length < 600) {
        var l = null, r = null;
        ctx.beginPath();
        for (var i = 0; i < pois.length; i++) {
          l = r;
          r = pois[i]
          if (l && r) {
            ctx.lineTo(r.x, r.y);
          } else if (r) {
            ctx.moveTo(r.x, r.y);
          }
        }
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'rgba(153,153,153,.1)';
        ctx.stroke();
        ctx.moveTo(0,0);
      }
    }
    function drawRectangles() {
      ctx.fillStyle = "rgba(230,255,230,0.4)";
      //ctx.fillStyle = "white";
      ctx.fillRect(0,0,canvas.width,canvas.height)
      for (var i = 0; i < pois.length; i++) {
        var poi = pois[i]
        ctx.fillStyle = poi.c;
        ctx.translate(poi.x, poi.y)
        ctx.rotate(poi.r)
        ctx.fillRect(poi.w / -2, poi.h / -2, poi.w, poi.h);
        ctx.rotate(-1 * poi.r)
        ctx.translate(poi.x * -1, poi.y * -1)
      }
    }

    function drawDebug() {
      ctx.font = "14pt Helvetica"
      ctx.fillStyle = "gray";
      ctx.fillText('POIs: ' + pois.length,10,30)
    }

    function render() {
      drawLines()
      drawRectangles()
      drawDebug()
      window.requestAnimFrame(render)
    }
    function setPois(p) {
      pois = p
    }
    return {
      render: render,
      setPois: setPois
    }
  }
})();
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
;(function() {
  window.Demo = window.Demo || {};

  Demo.Viewport = function(init) {
    function within(x, min, max) {
      return Math.min(Math.max(x, min), max)
    }
    var viewport = init;
    function transform(worldD, box, world) {
      var xFromOrigin = viewport.x + worldD.originX
      var yFromOrigin = viewport.y + worldD.originY
      viewport = Transform.translate(viewport, xFromOrigin * -1, yFromOrigin * -1)
      var scaleFactor = (viewport.w - worldD.d) / viewport.w
      var scaledAndTranslatedViewport = Transform.scale(viewport, scaleFactor)
      if (scaledAndTranslatedViewport.w >= box.w && 
          scaledAndTranslatedViewport.w <= world.w &&
          scaledAndTranslatedViewport.h >= box.h &&
          scaledAndTranslatedViewport.h <= world.h) {
        viewport = scaledAndTranslatedViewport
      }
      viewport = Transform.rotate(viewport, -1 * worldD.r)
      viewport = Transform.translate(viewport, xFromOrigin, yFromOrigin)
      viewport = {
        x: viewport.x - worldD.x,
        y: viewport.y - worldD.y,
        w: within(viewport.w, box.w, world.w), 
        h: within(viewport.h, box.h, world.h),
        r: viewport.r
      }
    }
    function resize(scaleWidth, scaleHeight) {
      viewport.w *= scaleWidth
      viewport.h *= scaleHeight
    }
    function toRect() {
      return viewport;
    }
    return {
      transform: transform,
      resize: resize,
      toRect: toRect
    }
  }
})();

