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

  var box = document.getElementById('box');
  box.width = box.clientWidth
  box.height = box.clientHeight

  var world = {x: 0, y: 0, w: 4000, h: 4000}

  var viewport = {x: (world.w / 2) - (box.width / 2), y: (world.h / 2) - (box.height / 2), w: box.width, h: box.height, r: 0,pois:[]}
  addPois(viewport)

  function addPois(rectangle) {
    rectangle.pois = Demo.Pois.find(expand(rectangle, 44)).map(function(poi) {
      return translateAndScale(poi, rectangle, box)
    })
  }

  function expand(rectangle, distance) {
    return {
      x: rectangle.x - distance,
      y: rectangle.y - distance,
      w: rectangle.w + (distance * 2),
      h: rectangle.h + (distance * 2),
      r: rectangle.r
    }
  }

  function translateAndScale(rectangle, from, to) {
    var scale = to.width / from.w
    return {
      x: (rectangle.x - from.x) * scale,
      y: (rectangle.y - from.y) * scale,
      w: rectangle.w * scale,
      h: rectangle.h * scale,
      c: rectangle.c
    }
  }

  function scalePixelsToWorld(diff, from, to) {
    var scale = to.w / from.width
    return {
      x: diff.x * scale,
      y: diff.y * scale,
      d: diff.d * scale,
      r: diff.r,
      originX: diff.originX * scale,
      originY: diff.originY * scale,
    }
  }

  function translate(rectangle, x, y) {
    return {
      x: rectangle.x + x,
      y: rectangle.y + y,
      w: rectangle.w,
      h: rectangle.h,
      r: rectangle.r
    }
  }

  function scale(r, s) {
    return {
      x: r.x * s,
      y: r.y * s,
      w: r.w * s,
      h: r.h * s,
      r: r.r
    }
  }

  function input(canvasD) {
    console.log(canvasD)
    canvasD.d *= 8
    if (!canvasD.originX) {
      canvasD.originX = box.width / 2
    }
    if (!canvasD.originY) {
      canvasD.originY = box.height / 2
    }

    var worldD = scalePixelsToWorld(canvasD, box, viewport)
    var xFromOrigin = viewport.x + worldD.originX
    var yFromOrigin = viewport.y + worldD.originY
    var translatedViewport = translate(viewport, xFromOrigin * -1, yFromOrigin * -1)
    var scaleFactor = (viewport.w - worldD.d) / viewport.w
    var scaledAndTranslatedViewport = scale(translatedViewport, scaleFactor)
    if (scaledAndTranslatedViewport.w >= box.width && 
        scaledAndTranslatedViewport.w <= world.w &&
        scaledAndTranslatedViewport.h >= box.height &&
        scaledAndTranslatedViewport.h <= world.h) {
      viewport = translate(scaledAndTranslatedViewport, xFromOrigin, yFromOrigin)
    }

    viewport = {
      x: within(viewport.x - worldD.x, 0, world.w - viewport.w),
      y: within(viewport.y - worldD.y, 0, world.h - viewport.h),
      w: within(viewport.w, box.width, world.w), 
      h: within(viewport.h, box.height, world.h),
      r: viewport.r + worldD.r
    }
    addPois(viewport)
  }
  input = timeable('input', input)
  Multitouch.bind(box, input)

  var ctx = box.getContext("2d");
  function render() {
    //ctx.fillStyle = "rgba(230,255,230,0.5)";
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,box.width,box.height)
    var ps = viewport.pois
    for (var i = 0; i < ps.length; i++) {
      var poi = ps[i]
      ctx.fillStyle = poi.c;
      ctx.translate(poi.x, poi.y)
      ctx.fillRect(poi.w / -2, poi.h / -2, poi.w, poi.h);
      ctx.translate(poi.x * -1, poi.y * -1)
    }
    
    window.requestAnimFrame(render)
  }
  render = timeable('render', render)
  render()
  function timeable(name, f) {
    return function() {
      var start = new Date().getTime()
      f.apply(this, arguments)
      var end = new Date().getTime()
      //console.log(name + ": " + (end - start))
    }
  }
})

