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
    }
    function toRect() {
      return viewport;
    }
    return {
      transform: transform,
      toRect: toRect
    }
  }
})();

