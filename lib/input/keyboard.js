;(function() {

  Multitouch = window.Multitouch || {};

  Multitouch.keyboard = function(el, delegate) {
    document.body.addEventListener('keydown', function(e) {
      var diff = {x:0,y:0,r:0,d:0}
      if (e.keyCode === 37) {
        diff.x += 5
        delegate.change(diff)
      } else if (e.keyCode === 38) {
        diff.y += 5
        delegate.change(diff)
      } else if (e.keyCode === 39) {
        diff.x -= 5
        delegate.change(diff)
      } else if (e.keyCode === 40) {
        diff.y -= 5
        delegate.change(diff)
      }
    })
  }
})();
