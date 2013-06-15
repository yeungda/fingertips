;(function() {
  window.Demo = window.Demo || {};

  var space = 22 * 2.5
  var pois = []
  for (var x = 0; x < 2200; x += space) {
    for (var y = 0; y < 2200; y += space) {
      pois.push({
        x: x + (Math.random() * space), y: y + (Math.random() * space), w: 22, h: 22
      })
    }
  }
  function find(rectangle) {
    function between(x, min, max) {
      return x >= min && x <= max
    }
    return pois.filter(function(poi) {
      return between(poi.x, rectangle.x, rectangle.x + rectangle.w) && 
             between(poi.y, rectangle.y, rectangle.y + rectangle.h)
    })
  }
  Demo.Pois = {
    find: find
  }
})();
