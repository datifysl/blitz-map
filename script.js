const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');
const alarmSound = document.getElementById('alarmSound');

let detector;
let alarmActive = false;

// Kamera starten
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    });
})
.catch(err => {
    console.error(err);
    statusText.textContent = "Kamera Fehler: " + err.message;
});

// COCO-SSD laden
ml5.objectDetector('cocossd')
.then(d => {
    detector = d;
    statusText.textContent = "KI bereit, scanne Szene...";
    detectFrame();
})
.catch(err => {
    console.error(err);
    statusText.textContent = "Fehler beim Laden von COCO-SSD";
});

// Frame für Frame prüfen
function detectFrame() {
    if (!detector) return;
    detector.detect(video, (err, results) => {
        if(err) { console.error(err); return; }

        // Video auf Canvas zeichnen
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        let personDetected = false;
        results.forEach(obj => {
            if(obj.label === "person") {
                personDetected = true;
                ctx.strokeStyle = "#FF3333";
                ctx.lineWidth = 4;
                ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
                ctx.font = "18px Arial";
                ctx.fillStyle = "#FF3333";
                ctx.fillText("Person", obj.x, obj.y > 20 ? obj.y-5 : obj.y+15);
            }
        });

        if(personDetected && !alarmActive) {
            alarmActive = true;
            if(alarmSound.src) alarmSound.play();
            statusText.textContent = "🚨 Person erkannt! 🚨";
            statusText.style.color = "#ff3333";
        } else if(!personDetected) {
            alarmActive = false;
            statusText.textContent = "Keine Person erkannt";
            statusText.style.color = "#f0f0f0";
        }

        setTimeout(detectFrame, 500);
    });
}
