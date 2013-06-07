document.addEventListener( "DOMContentLoaded",function() {
  document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
  });

  function Point(x,y) {
    return {
      x: x,
      y: y
    }
  }
  var pointHeight = 44;
  var pointWidth = 44;
  var p = Point(0,0);

  var box = document.getElementById('box');
  box.addEventListener('mousemove', function(e) {
    p = Point(e.clientX, e.clientY)
  })

  var point = document.getElementById('point')
  function render() {
    point.setAttribute('style', 'top: ' + (p.y - (pointHeight / 2)) + 'px; left: ' + (p.x - (pointWidth / 2)) + 'px;')
    window.requestAnimationFrame(render)
  }
  render()
})

