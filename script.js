const barcodeEl = document.getElementById("barcode");
const qrcodeEl = document.getElementById("qrcode");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const freqInput = document.getElementById("freqInput");

let interval;

function randomString(length=12) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let str = "";
    for(let i=0;i<length;i++){
        str += chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return str;
}

function generateCodes() {
    const codeData = randomString(12);
    const qrData = randomString(20);

    // Barcode
    JsBarcode(barcodeEl, codeData, {format: "CODE128", lineColor:"#00d1b2", width:2, height:80, displayValue:true});

    // QR-Code
    QRCode.toCanvas(qrcodeEl, qrData, {width:150, color:{dark:"#00d1b2", light:"#1c1c1c"}});
}

// Start Button
startBtn.addEventListener("click", () => {
    const freq = parseFloat(freqInput.value);
    if(isNaN(freq) || freq <= 0) return;

    clearInterval(interval);
    generateCodes(); // sofort generieren
    interval = setInterval(generateCodes, 1000/freq);
});

// Stop Button
stopBtn.addEventListener("click", () => {
    clearInterval(interval);
});

// Erstmal Codes generieren
generateCodes();
