;(function() {
  window.Demo = window.Demo || {};

  function generate(width, height) {
    function randomGray() {
      var shade = Math.floor((Math.random() * 85) + 170).toString(16)
      return "#" + shade + shade + shade
    }
    var space = 22 * 3
    var pois = []
    for (var x = 0; x < width; x += space) {
      for (var y = 0; y < height; y += space) {
        pois.push({
          x: x + (Math.random() * space), y: y + (Math.random() * space), w: 22, h: 22, c: randomGray(), r: 0
        })
      }
    }
    return pois;
  }

  var pois = generate(3000, 3000);
  
  function find(rectangle) {
    var rotation = rectangle.r * -1
    var rectangle = Transform.rotate(rectangle, rotation)
    function between(x, min, max) {
      return x >= min && x <= max
    }
    return pois.filter(function(poi) {
      var rotatedPoi = Transform.rotate(poi, rotation)
      return between(rotatedPoi.x, rectangle.x, rectangle.x + rectangle.w) && 
             between(rotatedPoi.y, rectangle.y, rectangle.y + rectangle.h)
    })
  }
  Demo.Pois = {
    find: find
  }
})();
