let v = 0;
let heading = 0;

const map = L.map('map').setView([0, 0], 18);

// Darkmode Tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Pfeil Icon (CSS-Rotation)
const arrowIcon = L.divIcon({
    className: 'arrow-icon',
    html: '<div class="arrow"></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

let marker = L.marker([0, 0], { icon: arrowIcon }).addTo(map);

function updatePosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const speed = position.coords.speed;
    heading = position.coords.heading || 0;

    marker.setLatLng([lat, lon]);
    map.setView([lat, lon]);

    if (speed !== null && !isNaN(speed)) {
        v = speed * 3.6;
    } else {
        v = 0;
    }

    document.getElementById("speed").textContent =
        Math.round(v).toString().padStart(3, "0");

    // Pfeil drehen
    const arrow = document.querySelector(".arrow");
    if (arrow) {
        arrow.style.transform = `rotate(${heading}deg)`;
    }
}

setInterval(() => {
    navigator.geolocation.getCurrentPosition(
        updatePosition,
        (err) => console.error(err),
        { enableHighAccuracy: true }
    );
}, 1000);
