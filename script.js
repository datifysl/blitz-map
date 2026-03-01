const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

let audioCtx;
let interval;

// Drum-Samples (synthetisch erzeugt)
function playKick(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(100, time);
    osc.type = "sine";
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.2);
}

function playSnare(time) {
    const bufferSize = audioCtx.sampleRate * 0.2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-5 * i / bufferSize);
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    noise.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(time);
}

// Hi-Hat
function playHiHat(time) {
    const bufferSize = audioCtx.sampleRate * 0.05;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    noise.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(time);
}

// Melodie / Lead
const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // C Dur

function playLead(time) {
    const note = notes[Math.floor(Math.random() * notes.length)];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(note, time);
    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.3);
}

// Generative Sequenz
function generateBeat() {
    const now = audioCtx.currentTime;
    const beatInterval = 0.25; // Viertel-Noten
    
    for (let i = 0; i < 16; i++) { // 16 Schritte Loop
        const time = now + i * beatInterval;

        // Kick auf 1 und 3
        if (i % 4 === 0 || i % 4 === 2) playKick(time);
        // Snare auf 2 und 4
        if (i % 4 === 1 || i % 4 === 3) playSnare(time);
        // Hi-Hat auf jeden Schritt
        playHiHat(time);
        // Lead zufällig
        if (Math.random() < 0.4) playLead(time);
    }
}

// Loop starten
startBtn.addEventListener("click", () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    generateBeat();
    interval = setInterval(generateBeat, 4000); // ca 16 Schritte pro Loop
});

// Stop Button
stopBtn.addEventListener("click", () => {
    clearInterval(interval);
});
