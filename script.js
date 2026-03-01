const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

let audioCtx;
let interval;
let rapInterval;

// Zufällige Rap-Lines
const rapLines = [
    "Yo check den Beat, alles generativ!",
    "Flow wie Souly, immer fresh.",
    "Bass tief, Snare punchy, Kick on time.",
    "Rhythmus groovt, wir bleiben high.",
    "Loop wiederholt, Variation immer dabei."
];

// Beatfunktionen
function playKick(time){
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(60, time);
    osc.type = "sine";
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time+0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time+0.25);
}

function playSnare(time){
    const bufferSize = audioCtx.sampleRate*0.25;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++) data[i] = (Math.random()*2-1)*Math.exp(-4*i/bufferSize);
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time+0.25);
    noise.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(time);
}

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

const bassNotes = [55,65.41,73.42,82.41];
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

const leadNotes = [261.63,293.66,329.63,349.23,392.00];
function playLead(time){
    if(Math.random()<0.35){
        const note = leadNotes[Math.floor(Math.random()*leadNotes.length)];
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(note, time);
        gain.gain.setValueAtTime(0.1+Math.random()*0.15,time);
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
    const step = 0.25;
    for(let i=0;i<16;i++){
        const time = now + i*step;
        if(i%4===0) playKick(time + Math.random()*0.02);
        if(i%4===1 || i%4===3) playSnare(time + Math.random()*0.02);
        if(i%2===0) playHiHat(time);
        if(i%4===0) playBass(time);
        playLead(time);
    }
}

// TTS Rap Trigger
function rapLine(){
    const text = rapLines[Math.floor(Math.random()*rapLines.length)];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.2; // schneller = rappiger
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

// Start / Stop
startBtn.addEventListener("click",()=>{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    generateBeat();
    interval = setInterval(generateBeat,4000);
    rapLine(); // sofort erste Line
    rapInterval = setInterval(rapLine,4000); // neue Line pro Beat-Loop
});

stopBtn.addEventListener("click",()=>{
    clearInterval(interval);
    clearInterval(rapInterval);
});
