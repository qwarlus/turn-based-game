const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let config = {
    minCellsOnSide: 11,
    gridBgColor: 'black',
    gridFgColor: 'white',
    gridLineWidth: 2,
    playerCharImg: null,
}

// config = { minCellsOnSide: 20, gridBgColor: 'green', gridFgColor: 'limegreen', gridLineWidth: 1, }

let state = {
    cameraPosition: { h: 0, v: 0 },
    playerPosition: { h: 0, v: 0 },
}

let cellSize, shortSide;

window.addEventListener('resize', prepareCanvas);
window.addEventListener('keydown', handleKeys);

prepareCanvas();

function handleKeys(e) {
    if (e.key === 'ArrowLeft') {
        state.playerPosition.col -= 1;
    } else if (e.key === 'ArrowRight') {
        state.playerPosition.col += 1;
    } else if (e.key === 'ArrowUp') {
        state.playerPosition.row -= 1;
    } else if (e.key === 'ArrowDown') {
        state.playerPosition.row += 1;
    } else {
        return
    }
    render();
}

function render() {
    drawGrid();
    drawCharacter();
}

function prepareCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.backgroundColor = config.gridBgColor;
    document.body.appendChild(canvas);
    document.body.style.margin = 0;

    cellSize = Math.min(canvas.width, canvas.height) / config.minCellsOnSide;
    shortSide = canvas.width < canvas.height ? "width" : "height";
    render();
}

function drawGrid() {
    let shiftX = 0;
    let shiftY = 0;

    if (shortSide === "width") {
        const maxRows = Math.floor(canvas.height / cellSize);
        shiftY = (canvas.height - maxRows) / 2;
    } else {
        shiftX = (canvas.width % cellSize) / 2;
    }
    ctx.strokeStyle = config.gridFgColor;
    ctx.lineWidth = config.gridLineWidth;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = shiftX; x < canvas.width + 1; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = shiftY; y < canvas.height + 1; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawCharacter() {
    const { row, col } = getRowCol(state.playerPosition);
    const { x, y } = getCellCoords(row, col);

    if (config.playerCharImg) {
        ctx.drawImage(config.playerCharImg, x, y, cellSize, cellSize);
    } else {
        drawCircle(x, y, cellSize, cellSize, 'limegreen');
    }
}

function getRowCol(position) {
    const { h, v } = position;
    const cameraOffset = getCameraOffset();
    const col = h + cameraOffset.h;
    const row = v + cameraOffset.v;

    return { row, col };
}

function getCameraOffset() {
    const v = (rowCount - 1) / 2;
    const h = (colCount - 1) / 2;
    return { h, v }
}


function getCellCoords(row, col) {
    let shiftX = 0;
    let shiftY = 0;

    if (shortSide === "width") {
        shiftY = (canvas.height % cellSize) / 2;
    } else {
        shiftX = (canvas.width % cellSize) / 2;
    }
    const x = col * cellSize + shiftX;
    const y = row * cellSize + shiftY;

    return { x, y };
}

function drawCircle(x, y, width, height, color) {
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, width / 2, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}