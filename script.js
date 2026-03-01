const barcodeEl = document.getElementById("barcode");
const qrcodeEl = document.getElementById("qrcode");
const generateBtn = document.getElementById("generateBtn");
const autoTick = document.getElementById("autoTick");

let interval;

function randomString(length=10) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let str = "";
    for(let i=0; i<length; i++) {
        str += chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return str;
}

function generateCodes() {
    const codeData = randomString(12); // Barcode Daten
    const qrData = randomString(20);   // QR-Code Daten

    // Barcode generieren
    JsBarcode(barcodeEl, codeData, {format: "CODE128", lineColor:"#00d1b2", width:2, height:80, displayValue:true});

    // QR-Code generieren
    QRCode.toCanvas(qrcodeEl, qrData, {width:150, color: {dark:"#00d1b2", light:"#1c1c1c"}});
}

// Button
generateBtn.addEventListener("click", generateCodes);

// Sekündliche Generierung
autoTick.addEventListener("change", e => {
    if(e.target.checked) {
        generateCodes(); // sofort generieren
        interval = setInterval(generateCodes, 1000);
    } else {
        clearInterval(interval);
    }
});

// Erstmal Codes generieren
generateCodes();
