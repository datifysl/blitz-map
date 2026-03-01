const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

let audioCtx;
let interval;

function playRandomTone(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Zufällige Frequenz zwischen 50Hz und 5000Hz
    const freq = Math.random() * 4950 + 50;
    osc.frequency.setValueAtTime(freq, time);

    // Zufällige Wellenform
    const waveforms = ["sine", "square", "sawtooth", "triangle"];
    osc.type = waveforms[Math.floor(Math.random() * waveforms.length)];

    // Zufällige Dauer zwischen 0.05s und 1.5s
    const duration = Math.random() * 1.45 + 0.05;

    // Zufällige Lautstärke zwischen 0.05 und 0.6
    gain.gain.setValueAtTime(Math.random() * 0.55 + 0.05, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + duration);
}

// Zufälliger Klang-Layer Generator
function generateRandomLayer() {
    const now = audioCtx.currentTime;

    // 5-15 Töne pro Layer
    const count = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < count; i++) {
        const offset = Math.random() * 1.5; // verteile über 1.5 Sekunden
        playRandomTone(now + offset);
    }
}

// Start / Stop
startBtn.addEventListener("click", () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    generateRandomLayer();
    interval = setInterval(generateRandomLayer, 1500); // neue Layer alle 1.5 Sekunden
});

stopBtn.addEventListener("click", () => clearInterval(interval));
