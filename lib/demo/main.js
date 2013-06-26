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

