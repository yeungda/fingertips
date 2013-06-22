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

  var viewport = Demo.Viewport({
    x: (world.w / 2) - (box.width / 2), 
    y: (world.h / 2) - (box.height / 2), 
    w: box.width, 
    h: box.height, 
    r: 0, 
    pois:[]
  })

  function find(rectangle) {
    var rotation = rectangle.r * -1
    var rotatedRectangle = Transform.rotate(rectangle, rotation)
    return Demo.Pois.find(Transform.expand(rectangle, 44)).map(function(poi) {
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

    var worldD = scalePixelsToWorld(canvasD, box, viewport.toRect())
    viewport.transform(worldD, box, world)
    renderer.setPois(find(viewport.toRect()))
  }
  Multitouch.bind(box, input)

  var renderer = Demo.Renderer(box)
  renderer.setPois(find(viewport.toRect()))
  renderer.render()
})

