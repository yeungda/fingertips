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
  Multitouch.init(document)

  function within(x, min, max) {
    return Math.min(Math.max(x, min), max)
  }

  var viewport = {}
  var box = document.getElementById('box');
  function boxInit() {
    box.width = box.clientWidth
    box.height = box.clientHeight
  }
  boxInit()
  function resize() {
    boxInit()
    input({x: 0, y: 0, d: 0, r: 0, originX: 0, originY: 0})
  }
  window.onresize = resize

  var world = {x: 0, y: 0, w: 3000, h: 3000}

  var viewport = {
    x: (world.w / 2) - (box.width / 2), 
    y: (world.h / 2) - (box.height / 2), 
    w: box.width, 
    h: box.height, 
    r: 0, 
    pois:[]
  }
  addPois(viewport)

  function addPois(rectangle) {
    var rotation = rectangle.r * -1
    var rotatedRectangle = Transform.rotate(rectangle, rotation)
    rectangle.pois = Demo.Pois.find(Transform.expand(rectangle, 44)).map(function(poi) {
      var result = poi
      var result = Transform.rotate(result, rotation)
      var result = Transform.translate(result, rotatedRectangle.x * -1, rotatedRectangle.y * -1)
      var result = Transform.scale(result, box.width / rotatedRectangle.w)
      result.c = poi.c
      return result
    })
  }

  function scalePixelsToWorld(diff, from, to) {
    var scale = to.w / from.width
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

  function input(canvasD) {
    canvasD.d *= 4
    if (!canvasD.originX) {
      canvasD.originX = box.width / 2
    }
    if (!canvasD.originY) {
      canvasD.originY = box.height / 2
    }

    var worldD = scalePixelsToWorld(canvasD, box, viewport)
    var xFromOrigin = viewport.x + worldD.originX
    var yFromOrigin = viewport.y + worldD.originY
    viewport = Transform.translate(viewport, xFromOrigin * -1, yFromOrigin * -1)
    var scaleFactor = (viewport.w - worldD.d) / viewport.w
    var scaledAndTranslatedViewport = Transform.scale(viewport, scaleFactor)
    if (scaledAndTranslatedViewport.w >= box.width && 
        scaledAndTranslatedViewport.w <= world.w &&
        scaledAndTranslatedViewport.h >= box.height &&
        scaledAndTranslatedViewport.h <= world.h) {
      viewport = scaledAndTranslatedViewport
    }
    viewport = Transform.rotate(viewport, -1 * worldD.r)
    viewport = Transform.translate(viewport, xFromOrigin, yFromOrigin)
    viewport = {
      x: viewport.x - worldD.x,
      y: viewport.y - worldD.y,
      w: within(viewport.w, box.width, world.w), 
      h: within(viewport.h, box.height, world.h),
      r: viewport.r
    }
    addPois(viewport)
    renderer.setViewport(viewport)
  }
  input = timeable('input', input)
  Multitouch.bind(box, input)


  function Renderer(canvas) {
    var viewport = {}
    var ctx = canvas.getContext("2d");
    function render() {
      ctx.fillStyle = "rgba(230,255,230,0.4)";
      //ctx.fillStyle = "white";
      ctx.fillRect(0,0,canvas.width,canvas.height)
      var ps = viewport.pois
      for (var i = 0; i < ps.length; i++) {
        var poi = ps[i]
        ctx.fillStyle = poi.c;
        ctx.translate(poi.x, poi.y)
        ctx.rotate(poi.r)
        ctx.fillRect(poi.w / -2, poi.h / -2, poi.w, poi.h);
        ctx.rotate(-1 * poi.r)
        ctx.translate(poi.x * -1, poi.y * -1)
      }
      
      window.requestAnimFrame(render)
    }
    function setViewport(vp) {
      viewport = vp
    }
    return {
      render: render,
      setViewport: setViewport
    }
  }

  var renderer = Renderer(box)
  renderer.setViewport(viewport)
  renderer.render()

  function timeable(name, f) {
    return function() {
      var start = new Date().getTime()
      f.apply(this, arguments)
      var end = new Date().getTime()
      //console.log(name + ": " + (end - start))
    }
  }
})

;(function() {
  window.Demo = window.Demo || {};

  var space = 22 * 3
  var pois = []
  for (var x = 0; x < 3000; x += space) {
    for (var y = 0; y < 3000; y += space) {
      var shade = Math.floor((Math.random() * 85) + 170).toString(16)
      pois.push({
        x: x + (Math.random() * space), y: y + (Math.random() * space), w: 22, h: 22, c: "#" + shade + shade + shade, r: 0
      })
    }
  }
  
  function find(rectangle) {
    var rotation = rectangle.r * -1
    var rectangle = Transform.rotate(rectangle, rotation)
    function between(x, min, max) {
      return x >= min && x <= max
    }
    return pois.filter(function(poi) {
      var rotatedPoi = Transform.rotate(poi, rotation)
      return between(rotatedPoi.x, rectangle.x, rectangle.x + rectangle.w) && 
             between(rotatedPoi.y, rectangle.y, rectangle.y + rectangle.h)
    })
  }
  Demo.Pois = {
    find: find
  }
})();
;(function() {
  Transform = window.Transform || {};
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
