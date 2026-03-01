const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

let audioCtx;
let interval;

// Tiefer Kick
function playKick(time) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(60, time); // tiefer Kick
    osc.type = "sine";
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.25);
}

// Snare / Clap
function playSnare(time) {
    const bufferSize = audioCtx.sampleRate * 0.25;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-5 * i / bufferSize);
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    noise.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(time);
}

// HiHat / Rhythmus
function playHiHat(time) {
    const bufferSize = audioCtx.sampleRate * 0.05;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.3 + Math.random()*0.2, time); // kleine Variation
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    noise.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(time);
}

// Bassline (tiefe Noten)
const bassNotes = [65.41, 73.42, 82.41, 87.31]; // C2-D2-E2-F2
function playBass(time) {
    const note = bassNotes[Math.floor(Math.random()*bassNotes.length)];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(note, time);
    osc.type = "square";
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.5);
}

// Lead / Melodie (sparsam)
const leadNotes = [261.63, 293.66, 329.63, 349.23, 392.00]; // C4-G4
function playLead(time) {
    if(Math.random() < 0.3){ // nicht jede Note
        const note = leadNotes[Math.floor(Math.random()*leadNotes.length)];
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(note, time);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.35);
    }
}

// Beat Pattern generieren
function generateBeat() {
    const now = audioCtx.currentTime;
    const step = 0.25; // Viertelnoten

    for(let i=0; i<16; i++){
        const time = now + i*step;

        // Kick auf 1,3 + kleine Variation
        if(i%4===0 || i%4===2) playKick(time + Math.random()*0.02);

        // Snare auf 2,4 + kleine Variation
        if(i%4===1 || i%4===3) playSnare(time + Math.random()*0.02);

        // HiHat schneller mit Zufall
        if(i%2===0) playHiHat(time);
        
        // Bass jede 4 Schritte
        if(i%4===0) playBass(time);

        // Lead zufällig
        playLead(time);
    }
}

// Start Button
startBtn.addEventListener("click", ()=>{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    generateBeat();
    interval = setInterval(generateBeat, 4000);
});

// Stop Button
stopBtn.addEventListener("click", ()=> clearInterval(interval));
