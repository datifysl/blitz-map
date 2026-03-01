const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

let audioCtx;
let interval;

// Drum-Samples
function playKick(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(100, time);
    osc.type = "sine";
    gain.gain.setValueAtTime(1.0, time); // lauter
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25); // etwas länger
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.25);
}

function playSnare(time) {
    const bufferSize = audioCtx.sampleRate * 0.25;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-4 * i / bufferSize);
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.8, time); // lauter
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    noise.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(time);
}

function playHiHat(time) {
    const bufferSize = audioCtx.sampleRate * 0.05;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    noise.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(time);
}

// Lead / Melodie
const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // C-Dur

function playLead(time) {
    const note = notes[Math.floor(Math.random() * notes.length)];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(note, time);
    gain.gain.setValueAtTime(0.25, time); // hörbar
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.35);
}

// Beat generieren
function generateBeat() {
    const now = audioCtx.currentTime;
    const beatInterval = 0.25; // Viertel-Noten

    for (let i = 0; i < 16; i++) {
        const time = now + i * beatInterval;

        if (i % 4 === 0 || i % 4 === 2) playKick(time);   // Kick auf 1 & 3
        if (i % 4 === 1 || i % 4 === 3) playSnare(time); // Snare auf 2 & 4
        playHiHat(time);                                   // HiHat auf jeden Schritt
        if (Math.random() < 0.5) playLead(time);          // Lead zufällig
    }
}

// Start Button
startBtn.addEventListener("click", () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    generateBeat(); // sofort starten
    interval = setInterval(generateBeat, 4000); // Loop
});

// Stop Button
stopBtn.addEventListener("click", () => clearInterval(interval));
