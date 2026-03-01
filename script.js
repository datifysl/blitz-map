const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

let audioCtx;
let interval;

// Kick Drum
function playKick(time){
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(60 + Math.random()*10, time);
    osc.type = "sine";
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.25);
}

// Snare/Clap
function playSnare(time){
    const bufferSize = audioCtx.sampleRate*0.25;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++) data[i] = (Math.random()*2-1)*Math.exp(-4*i/bufferSize);
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.7+Math.random()*0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time+0.2);
    noise.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(time);
}

// HiHat
function playHiHat(time){
    const bufferSize = audioCtx.sampleRate*0.05;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++) data[i] = (Math.random()*2-1);
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.2+Math.random()*0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time+0.05);
    noise.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(time);
}

// Bassline
const bassNotes = [55, 65.41, 73.42, 82.41]; // A1-C2-D2-E2
function playBass(time){
    const note = bassNotes[Math.floor(Math.random()*bassNotes.length)];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(note, time);
    gain.gain.setValueAtTime(0.25+Math.random()*0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time+0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time+0.5);
}

// Lead / Melodie
const leadNotes = [261.63, 293.66, 329.63, 349.23, 392.00]; // C4-G4
function playLead(time){
    if(Math.random()<0.35){
        const note = leadNotes[Math.floor(Math.random()*leadNotes.length)];
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(note, time);
        gain.gain.setValueAtTime(0.1+Math.random()*0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time+0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time+0.35);
    }
}

// Beat Generator
function generateBeat(){
    const now = audioCtx.currentTime;
    const step = 0.25; // Viertelnoten
    for(let i=0;i<16;i++){
        const time = now + i*step;
        if(i%4===0) playKick(time + Math.random()*0.02);
        if(i%4===1 || i%4===3) playSnare(time + Math.random()*0.02);
        if(i%2===0) playHiHat(time);
        if(i%4===0) playBass(time);
        playLead(time);
    }
}

// Start / Stop
startBtn.addEventListener("click", ()=>{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    generateBeat();
    interval = setInterval(generateBeat,4000);
});

stopBtn.addEventListener("click",()=> clearInterval(interval));
