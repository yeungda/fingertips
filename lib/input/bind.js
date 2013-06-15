;(function() {
  Multitouch = window.Multitouch || {};
  Multitouch.bind = function(e, callback) {
    var inertia = Multitouch.Inertia(callback)
    Multitouch.keyboard(e, inertia)
    Multitouch.mouse(e, inertia)
    Multitouch.finger(e, inertia)
  }
})();
