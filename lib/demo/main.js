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

  var world = {x: 0, y: 0, w: 2000, h: 2000}

  var next = {x: 0, y: 0, w: box.width, h: box.height, r: 0,pois:[]}
  addPois(next)

  function addPois(rectangle) {
    rectangle.pois = Demo.Pois.find(expand(rectangle, 44)).map(function(poi) {
      return {
        x: poi.x - rectangle.x,
        y: poi.y - rectangle.y,
        w: poi.w,
        h: poi.h
      }
    })
  }
  function expand(rectangle, distance) {
    return {
      x: rectangle.x - distance,
      y: rectangle.y - distance,
      w: rectangle.w + (distance * 2),
      h: rectangle.h + (distance * 2)
    }
  }
  Multitouch.bind(box, function(d) {
    next = {
      x: within(next.x - d.x, 0, world.w - next.w),
      y: within(next.y - d.y, 0, world.h - next.h),
      w: next.w, 
      h: next.h,
    }
    addPois(next)
  })

  var ctx = box.getContext("2d");
  ctx.fillStyle="#eee";
  function render() {
    ctx.clearRect(0,0,box.width,box.height)
    next.pois.forEach(function(poi) {
      ctx.translate(poi.x, poi.y)
      ctx.fillRect(poi.w / -2, poi.h / -2, poi.w, poi.h);
      ctx.translate(-1 * poi.x, -1 * poi.y)
    })
    
    window.requestAnimFrame(render)
  }
  render()
})

