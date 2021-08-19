var overlay;

DebugOverlay.prototype = new google.maps.OverlayView();

function initialize() {
    var mapOptions = {
        zoom: 18,
        center: new google.maps.LatLng(45.2, -76.5),
    };

    var map = new google.maps.Map(
        document.getElementById("map-canvas"),
        mapOptions
    );
    var swBound = new google.maps.LatLng(45.17013888888889, -76.88273333333333);
    var neBound = new google.maps.LatLng(45.42063611111111, -76.27168888888889);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);

    console.log(map);
    var srcImage = "http://127.0.0.1:5500/map_overlay.png";

    overlay = new DebugOverlay(bounds, srcImage, map);

    var markerA = new google.maps.Marker({
        position: swBound,
        map: map,
        draggable: true,
    });

    var markerB = new google.maps.Marker({
        position: neBound,
        map: map,
        draggable: true,
    });

    google.maps.event.addListener(markerA, "drag", function() {
        var newPointA = markerA.getPosition();
        var newPointB = markerB.getPosition();
        var newBounds = new google.maps.LatLngBounds(newPointA, newPointB);
        overlay.updateBounds(newBounds);
    });

    google.maps.event.addListener(markerB, "drag", function() {
        var newPointA = markerA.getPosition();
        var newPointB = markerB.getPosition();
        var newBounds = new google.maps.LatLngBounds(newPointA, newPointB);
        overlay.updateBounds(newBounds);
    });

    google.maps.event.addListener(markerA, "dragend", function() {
        var newPointA = markerA.getPosition();
        var newPointB = markerB.getPosition();
        console.log("point1" + newPointA);
        console.log("point2" + newPointB);
    });

    google.maps.event.addListener(markerB, "dragend", function() {
        var newPointA = markerA.getPosition();
        var newPointB = markerB.getPosition();
        console.log("point1" + newPointA);
        console.log("point2" + newPointB);
    });
}

function DebugOverlay(bounds, image, map) {
    this.bounds_ = bounds;
    this.image_ = image;
    this.map_ = map;
    this.div_ = null;
    this.setMap(map);
}

DebugOverlay.prototype.onAdd = function() {
    var div = document.createElement("div");
    div.style.borderStyle = "solid";
    div.style.borderColor = "red";
    div.style.borderWidth = "2px";
    div.style.position = "absolute";
    var img = document.createElement("img");
    img.src = this.image_;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.opacity = "0.5";
    img.style.blendMode = "Overlay";
    img.style.position = "absolute";
    div.appendChild(img);
    this.div_ = div;
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
};

DebugOverlay.prototype.draw = function() {
    var overlayProjection = this.getProjection();
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
    var div = this.div_;
    div.style.left = sw.x + "px";
    div.style.top = ne.y + "px";
    div.style.width = ne.x - sw.x + "px";
    div.style.height = sw.y - ne.y + "px";
};

DebugOverlay.prototype.updateBounds = function(bounds) {
    this.bounds_ = bounds;
    this.draw();
};

DebugOverlay.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
};

initialize();
//google.maps.event.addDomListener(window, 'load', initialize);