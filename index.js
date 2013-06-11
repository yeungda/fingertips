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

  var next = {x:0,y:0,w:44,h:44,r:0};
  var previous = {x:0,y:0,w:0,h:0,r:0};

  Multitouch.bind(box, function(d) {
    next.w = within(next.w + d.d, 11, 44 * 4)
    next.h = within(next.h + d.d, 11, 44 * 4)
    next.x = within(next.x + d.x, 0, box.width)
    next.y = within(next.y + d.y, 0, box.height)
    next.r = next.r + d.r
  })

  var ctx = box.getContext("2d");
  ctx.fillStyle="white";
  function render() {
    ctx.translate(previous.x, previous.y)
    ctx.rotate(previous.r)
    ctx.clearRect((previous.w / -2) - 1, (previous.h / -2) - 1, previous.w + 2, previous.h + 2)
    ctx.rotate(-1 * previous.r)
    ctx.translate(-1 * previous.x, -1 * previous.y)

    ctx.translate(next.x, next.y)
    ctx.rotate(next.r)
    ctx.fillRect(next.w / -2, next.h / -2, next.w, next.h);
    ctx.rotate(-1 * next.r)
    ctx.translate(-1 * next.x, -1 * next.y)

    previous.x = next.x
    previous.y = next.y
    previous.w = next.w
    previous.h = next.h
    previous.r = next.r

    window.requestAnimFrame(render)
  }
  render()
})

