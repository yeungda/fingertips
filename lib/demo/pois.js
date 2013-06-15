;(function() {
  window.Demo = window.Demo || {};

  var space = 22 * 3
  var pois = []
  for (var x = 0; x < 4200; x += space) {
    for (var y = 0; y < 4200; y += space) {
      var shade = Math.floor((Math.random() * 155) + 100).toString(16)
      pois.push({
        x: x + (Math.random() * space), y: y + (Math.random() * space), w: 22, h: 22, c: "#" + shade + shade + shade
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
