;(function() {
  Multitouch = window.Multitouch || {};
  Multitouch.bind = function(e, callback) {
    Multitouch.mouse(e, callback)
    Multitouch.finger(e, callback)
  }
})();
