const video = document.getElementById('video');
const predictionText = document.getElementById('prediction');

// Kamera starten
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
})
.catch(err => console.error("Kamera Fehler:", err));

// ml5 MobileNet laden
let classifier;
ml5.imageClassifier('MobileNet')
.then(c => {
    classifier = c;
    predictionText.textContent = "KI geladen, scanne Szene...";
    analyzeFrame();
});

// Bildanalyse jede Sekunde
function analyzeFrame() {
    if(!classifier) return;
    classifier.classify(video, (err, results) => {
        if(err) { console.error(err); return; }

        // Ergebnisse sortieren nach Wahrscheinlichkeit
        const top = results[0];
        predictionText.textContent = `Objekt: ${top.label} (${Math.round(top.confidence*100)}%)`;

        // Grobe Geografie schätzen
        const geoGuess = estimateLocation(top.label);
        predictionText.textContent += ` | KI Vermutung: ${geoGuess}`;
        
        setTimeout(analyzeFrame, 1000); // alle 1s analysieren
    });
}

// Vereinfachte KI-Geo-Schätzung (nur grob)
function estimateLocation(label) {
    label = label.toLowerCase();
    if(label.includes("palm") || label.includes("beach")) return "Tropische Region / Küste";
    if(label.includes("snow") || label.includes("mountain")) return "Alpen / Skigebiet";
    if(label.includes("building") || label.includes("street")) return "Stadt / Urban";
    if(label.includes("forest") || label.includes("tree")) return "Wald / Mitteleuropa";
    return "Unbekannte Region";
}