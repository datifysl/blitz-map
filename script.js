const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');
const alarmSound = document.getElementById('alarmSound');

let objectDetector;
let alarmTriggered = false;

// Kamera starten
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        });
    } catch (err) {
        console.error(err);
        statusText.textContent = `Kamera Fehler: ${err.message}`;
    }
}

// KI laden
async function initDetector() {
    try {
        objectDetector = await ml5.objectDetector('cocossd');
        statusText.textContent = "KI bereit, scanne Szene...";
        detectLoop();
    } catch (err) {
        console.error(err);
        statusText.textContent = "Fehler beim Laden der KI";
    }
}

// Hauptloop
function detectLoop() {
    if (!objectDetector) return;

    objectDetector.detect(video)
    .then(results => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        let personFound = false;

        results.forEach(obj => {
            if (obj.label === "person") {
                personFound = true;
                drawPersonBox(obj);
            }
        });

        if (personFound && !alarmTriggered) {
            alarmTriggered = true;
            if (alarmSound.src) alarmSound.play();
            statusText.textContent = "🚨 Person erkannt! 🚨";
            statusText.style.color = "#ff4c4c";
        } else if (!personFound) {
            alarmTriggered = false;
            statusText.textContent = "Keine Person erkannt";
            statusText.style.color = "#00ff94";
        }

        setTimeout(detectLoop, 400);
    })
    .catch(err => console.error(err));
}

// Rechteck um Person zeichnen
function drawPersonBox(obj) {
    ctx.strokeStyle = "#ff4c4c";
    ctx.lineWidth = 4;
    ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
    ctx.font = "18px Verdana";
    ctx.fillStyle = "#ff4c4c";
    ctx.fillText("Person", obj.x, obj.y > 20 ? obj.y-5 : obj.y+15);
}

// Init
initCamera();
initDetector();
