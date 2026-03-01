let v = 0;

const map = L.map('map').setView([0, 0], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

let marker = L.marker([0, 0]).addTo(map);

function updatePosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const speed = position.coords.speed;

    marker.setLatLng([lat, lon]);
    map.setView([lat, lon]);

    if (speed !== null && !isNaN(speed)) {
        v = speed * 3.6;
    } else {
        v = 0;
    }

    document.getElementById("speed").textContent = v.toFixed(2);
}

setInterval(() => {
    navigator.geolocation.getCurrentPosition(
        updatePosition,
        (err) => console.error(err),
        { enableHighAccuracy: true }
    );
}, 1000);