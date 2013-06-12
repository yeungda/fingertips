;(function() {
  Multitouch = window.Multitouch || {};
  Multitouch.bind = function(e, callback) {
    var inertia = Multitouch.Inertia(callback)
    Multitouch.mouse(e, inertia)
    Multitouch.finger(e, inertia)
  }
})();
