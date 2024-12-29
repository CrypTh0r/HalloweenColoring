const color = document.querySelector('.color');
const pumpkinPaths = document.querySelectorAll('.fil1');
const face = document.querySelectorAll('.fil2');
const stem = document.querySelectorAll('.fil3');
const svg = document.querySelector('svg');

let currentPumpkinColor = null;
let currentFaceColor = null;

function darkenColor(color, percent) {
    const num = parseInt(color.replace("#",""), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) - amt,
          G = (num >> 8 & 0x00FF) - amt,
          B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

function createGradient(gradientId, currentColor) {
    const darkerColor = darkenColor(currentColor, 30); // 30% darker
    return `
        <radialGradient id='${gradientId}'>
            <stop offset='10%' stop-color='${currentColor}' />
            <stop offset='95%' stop-color='${darkerColor}' />
        </radialGradient>
    `;
}

function updateGradient(gradientId, currentColorVar) {
    const newColor = color.value;
    if (newColor !== currentColorVar) {
        currentColorVar = newColor;
        const gradient = createGradient(gradientId, currentColorVar);
        
        const defsElement = svg.querySelector('defs') || svg.insertAdjacentElement('afterbegin', document.createElementNS("http://www.w3.org/2000/svg", "defs"));
        const gradientElement = defsElement.querySelector(`#${gradientId}`);

        if (gradientElement) {
            gradientElement.outerHTML = gradient;
        } else {
            defsElement.innerHTML += gradient;
        }
    }
    return currentColorVar;
}

function applyPumpkinGradient(element) {
    currentPumpkinColor = updateGradient('pumpkinGradient', currentPumpkinColor);
    element.style.fill = 'url(#pumpkinGradient)';
}

function applyFaceGradient(element) {
    currentFaceColor = updateGradient('faceGradient', currentFaceColor);
    element.style.fill = 'url(#faceGradient)';
}

pumpkinPaths.forEach((p) => {
    p.addEventListener('click', () => applyPumpkinGradient(p));
});

face.forEach((f) => {
    f.addEventListener('click', () => applyFaceGradient(f));
});

stem.forEach((s) => {
    s.addEventListener('click', () => {
        s.style.fill = color.value;
    });
});


const downloadButton = document.createElement('button');
downloadButton.textContent = 'Save colored pumpkin';
document.body.appendChild(downloadButton);

downloadButton.addEventListener('click', function() {
    const svg = document.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'pumpkin.png';
        downloadLink.href = pngFile;
        downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
});

downloadButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #444;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
`;

function initialColor() {
    color.value = '#FFA500'; 
    pumpkinPaths.forEach(applyPumpkinGradient);
	  color.value = '#ffea00';
    face.forEach(applyFaceGradient);
    stem.forEach(s => s.style.fill = 'rgb(115, 83, 28)'); 
}

function resetToWhite() {
    pumpkinPaths.forEach(p => p.style.fill = '#FFFFFF');
    face.forEach(f => f.style.fill = '#FFFFFF');
    stem.forEach(s => s.style.fill = '#FFFFFF');
}

window.addEventListener('load', () => {
    initialColor();
    
    setTimeout(resetToWhite, 1500);
});