;(function() {
  window.Demo = window.Demo || {};

  var space = 22 * 3
  var pois = []
  for (var x = 0; x < 3000; x += space) {
    for (var y = 0; y < 3000; y += space) {
      var shade = Math.floor((Math.random() * 85) + 170).toString(16)
      pois.push({
        x: x + (Math.random() * space), y: y + (Math.random() * space), w: 22, h: 22, c: "#" + shade + shade + shade, r: 0
      })
    }
  }
  
  function find(rectangle) {
    var rotation = rectangle.r * -1
    var rectangle = Transform.rotate(rectangle, rotation)
    function between(x, min, max) {
      return x >= min && x <= max
    }
    return pois.map(function(poi) {
      var rotatedPoi = Transform.rotate(poi, rotation)
      rotatedPoi.c = poi.c
      return rotatedPoi
    }).filter(function(poi) {
      return between(poi.x, rectangle.x, rectangle.x + rectangle.w) && 
             between(poi.y, rectangle.y, rectangle.y + rectangle.h)
    })
  }
  Demo.Pois = {
    find: find
  }
})();
