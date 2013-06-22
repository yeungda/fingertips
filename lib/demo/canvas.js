;(function() {
  window.Demo = window.Demo || {};
  Demo.Canvas = function(id, onresize) {
    var box = document.getElementById(id);
    function boxInit() {
      var beforeW = box.width
      var beforeH = box.height
      box.width = box.clientWidth
      box.height = box.clientHeight
      onresize(box.width / beforeW, box.height / beforeH)
    }
    boxInit()
    function resize() {
      boxInit()
    }
    window.onresize = resize

    function toRect() {
      return {
        w: box.width,
        h: box.height
      }
    }

    function dom() {
      return box;
    }

    return {
      toRect: toRect,
      dom: dom
    }
  }
})();
