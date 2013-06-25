;(function() {
  window.Demo = window.Demo || {};
  Demo.Grid = function(maxX, maxY, a) {
    function minmax(x,min,max) {
      return Math.max(Math.min(x, max), min)
    }
    function toIndex(x, y) {
      var divisor = 100
      return [Math.floor(minmax(x,0,maxX) / divisor), Math.floor(minmax(y, 0, maxY) / divisor)]
    }
    var maxIndex = toIndex(maxX, maxY)
    var matrix = new Array(maxIndex[0] + 1)
    for (var i = 0; i < matrix.length; i++) {
      matrix[i] = new Array(maxIndex[1] + 1)
      for (var j = 0; j < matrix[i].length; j++) {
        matrix[i][j] = []
      }
    }

    for (var i = 0; i < a.length; i++) {
      var poi = a[i]
      var index = toIndex(poi.x, poi.y)
      matrix[index[0]][index[1]].push(poi)
    }

    function find(r) {
      var minIndex = toIndex(r[0][0], r[0][1])
      var maxIndex = toIndex(r[1][0], r[1][1])
      var r = []
      for (var x = minIndex[0]; x <= maxIndex[0]; x++) {
        for (var y = minIndex[1]; y <= maxIndex[1]; y++) {
          r = r.concat(matrix[x][y])
        }
      }
      return r
    }
    return {
      find: find
    }
  }
})();
