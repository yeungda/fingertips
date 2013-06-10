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

  var next = {x:200,y:200,w:44,h:44};
  var previous = {x:0,y:0,w:0,h:0};

  Multitouch.bind(box, function(d) {
    next.w = within(next.w + d.d, 11, 44 * 4)
    next.h = within(next.h + d.d, 11, 44 * 4)
    next.x = within(next.x + d.x, 0, box.width)
    next.y = within(next.y + d.y, 0, box.height)
  })

  var ctx = box.getContext("2d");
  ctx.fillStyle="white";
  function render() {
    ctx.clearRect(previous.x,previous.y,previous.w, previous.h)
    ctx.fillRect(next.x, next.y, next.w, next.h);
    previous.x = next.x - 1
    previous.y = next.y - 1
    previous.w = next.w + 2
    previous.h = next.h + 2
    window.requestAnimFrame(render)
  }
  render()
})

