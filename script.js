let v = 0; // Geschwindigkeit in km/h

// Leaflet Karte
const map = L.map('map').setView([0, 0], 18);

// Darkmode Tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap & CartoDB'
}).addTo(map);

// Pfeil Marker
const arrowIcon = L.divIcon({
    className: 'arrow-icon',
    html: '<div class="arrow"></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

let marker = L.marker([0, 0], { icon: arrowIcon }).addTo(map);

let lastHeading = 0;

function updatePosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const speed = position.coords.speed;   // m/s
    const heading = position.coords.heading; // Grad (0 = Norden)

    marker.setLatLng([lat, lon]);
    map.setView([lat, lon]);

    // Geschwindigkeit in km/h
    if (speed !== null && !isNaN(speed)) {
        v = speed * 3.6;
    } else {
        v = 0;
    }
    document.getElementById("speed").textContent =
        Math.round(v).toString().padStart(3, "0");

    // Pfeil Rotation
    const arrow = document.querySelector(".arrow");
    if (arrow && heading !== null && !isNaN(heading)) {
        // Smooth Rotation
        let diff = heading - lastHeading;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        lastHeading += diff * 0.2; // sanfte Bewegung
        arrow.style.transform = `rotate(${lastHeading}deg)`;
    }
}

// Jede Sekunde aktualisieren
setInterval(() => {
    navigator.geolocation.getCurrentPosition(
        updatePosition,
        (err) => console.error(err),
        { enableHighAccuracy: true }
    );
}, 1000);
