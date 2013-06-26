;(function() {
  window.Demo = window.Demo || {};

  function generate(width, height) {
    function grayFor(z) {
      var shade = Math.floor((z * 8) + 175).toString(16)
      return "#" + shade + shade + shade
    }
    var space = 22 * 3
    var pois = []
    for (var x = 0; x < width; x += space) {
      for (var y = 0; y < height; y += space) {
        var z = Math.round(Math.random() * 10)
        pois.push({
          x: x + (Math.random() * space), y: y + (Math.random() * space), w: 12 * (z / 2), h: 12 * (z / 2), c: grayFor(z), r: 0, z: z
        })
      }
    }
    return pois;
  }

  var grid = Demo.Grid(10000, 10000, generate(10000, 10000))
  
  function coveringRectangleOf(rectangle) {
    var flatR = Transform.rotate(rectangle, rectangle.r * -1)
    var points = [
      [flatR.x, flatR.y],
      [flatR.x + flatR.w, flatR.y],
      [flatR.x, flatR.y + flatR.h],
      [flatR.x + flatR.w, flatR.y + flatR.h],
    ]
    var rPoints = Transform.rotatePoints(points, rectangle.r)
    var min = rPoints.reduce(function(result, p) {
      if (result[0] === null || result[0] > p[0]) {
        result[0] = p[0]
      }
      if (result[1] === null || result[1] > p[1]) {
        result[1] = p[1]
      }
      return result
    }, [null, null])
    var max = rPoints.reduce(function(result, p) {
      if (result[0] === null || result[0] < p[0]) {
        result[0] = p[0]
      }
      if (result[1] === null || result[1] < p[1]) {
        result[1] = p[1]
      }
      return result
    }, [null, null])
    return [min, max]
  }

  function find(rectangle) {
    var rotation = rectangle.r * -1
    var flatR = Transform.rotate(rectangle, rotation)
    function between(x, min, max) {
      return x >= min && x <= max
    }
    var poisNearRectangle = grid.find(coveringRectangleOf(rectangle))
    var found = []
    for (var i = 0; i < poisNearRectangle.length; i++) {
      var poi = poisNearRectangle[i]
      var rotatedPoi = Transform.rotate(poi, rotation)
      if (between(rotatedPoi.x, flatR.x, flatR.x + flatR.w) && 
             between(rotatedPoi.y, flatR.y, flatR.y + flatR.h)) {
          var z = rectangle.w / document.width * 1.5
          if (poi.z >= Math.min(z, 9)) {
            found.push(poi)
          }
      }
    }
    return found
  }
  Demo.Pois = {
    find: find
  }
})();
