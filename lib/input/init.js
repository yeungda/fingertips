;(function() {
  Multitouch = window.Multitouch || {};
  Multitouch.init = function(document) {
    function preventDefault(e) {
      e.preventDefault();
    }
    document.body.addEventListener('touchmove', preventDefault)
    document.body.addEventListener('mousewheel', preventDefault)
  }
})();
