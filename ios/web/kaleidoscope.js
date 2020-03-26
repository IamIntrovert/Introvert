/* eslint-disable */
// algorithm taken from here
// https://github.com/tiesluiten/HuisfeestVisual/blob/master/Kaleidoscope
const PVector = p5.Vector;
const BORDER_WIDTH = 60;
const startTime = Date.now();
let nPalettes = 10;
let palettes = [];
let framesPerPalette = 500;
let nBlackPalettes = 2;
let colorParam = 0;
let counter = 0;
let renderTimer = null;
let blackPalettesSet = false;
let fastPhaseChange = true;
let phasorInc = 1.0 / 500.0;
let phasorInc2 = 1.0 / 90000.0;
let nAngles = 4;
let nPointsPerFrame = 350;
let active = true;
let angles = [];
let w;
let p1;
let p2;
let centerPoint;

const palettesSource = [
  [
    { r: 199, g: 255, b: 234 },
    { r: 255, g: 228, b: 111 },
    { r: 192, g: 183, b: 118 },
    { r: 115, g: 92, b: 102 },
    { r: 52, g: 32, b: 33 }
  ],
  [
    { r: 105, g: 210, b: 231 },
    { r: 167, g: 219, b: 216 },
    { r: 224, g: 228, b: 204 },
    { r: 243, g: 134, b: 48 },
    { r: 250, g: 105, b: 0 }
  ],
  [
    { r: 249, g: 236, b: 220 },
    { r: 186, g: 164, b: 169 },
    { r: 118, g: 106, b: 149 },
    { r: 69, g: 60, b: 115 },
    { r: 29, g: 17, b: 91 }
  ],
  [
    { r: 114, g: 113, b: 152 },
    { r: 3, g: 148, b: 231 },
    { r: 61, g: 222, b: 254 },
    { r: 213, g: 134, b: 246 },
    { r: 255, g: 205, b: 221 }
  ],
  [
    { r: 218, g: 204, b: 177 },
    { r: 49, g: 27, b: 30 },
    { r: 185, g: 155, b: 145 },
    { r: 192, g: 39, b: 33 },
    { r: 255, g: 80, b: 43 }
  ],
  [
    { r: 207, g: 240, b: 158 },
    { r: 168, g: 219, b: 168 },
    { r: 121, g: 189, b: 154 },
    { r: 59, g: 134, b: 134 },
    { r: 11, g: 72, b: 107 }
  ],
  [
    { r: 73, g: 73, b: 106 },
    { r: 210, g: 251, b: 120 },
    { r: 193, g: 59, b: 254 },
    { r: 88, g: 33, b: 212 },
    { r: 73, g: 205, b: 246 }
  ],
  [
    { r: 251, g: 248, b: 243 },
    { r: 214, g: 166, b: 143 },
    { r: 236, g: 0, b: 66 },
    { r: 116, g: 26, b: 26 },
    { r: 39, g: 21, b: 17 }
  ],
  [
    { r: 232, g: 243, b: 248 },
    { r: 219, g: 230, b: 236 },
    { r: 194, g: 203, b: 206 },
    { r: 164, g: 188, b: 194 },
    { r: 129, g: 168, b: 184 }
  ],
  [
    { r: 0, g: 160, b: 176 },
    { r: 106, g: 74, b: 60 },
    { r: 204, g: 51, b: 63 },
    { r: 235, g: 104, b: 65 },
    { r: 237, g: 201, b: 81 }
  ],
  [
    { r: 179, g: 150, b: 154 },
    { r: 249, g: 210, b: 215 },
    { r: 67, g: 19, b: 45 },
    { r: 60, g: 42, b: 54 },
    { r: 40, g: 17, b: 37 }
  ],
  [
    { r: 192, g: 197, b: 189 },
    { r: 255, g: 0, b: 191 },
    { r: 255, g: 0, b: 84 },
    { r: 255, g: 12, b: 0 },
    { r: 62, g: 59, b: 60 }
  ],
  [
    { r: 215, g: 6, b: 178 },
    { r: 189, g: 88, b: 251 },
    { r: 153, g: 151, b: 247 },
    { r: 186, g: 183, b: 248 },
    { r: 196, g: 215, b: 210 }
  ],
  [
    { r: 79, g: 69, b: 79 },
    { r: 131, g: 33, b: 103 },
    { r: 115, g: 0, b: 230 },
    { r: 246, g: 4, b: 38 },
    { r: 221, g: 184, b: 19 }
  ],
  [
    { r: 65, g: 62, b: 74 },
    { r: 115, g: 98, b: 110 },
    { r: 179, g: 129, b: 132 },
    { r: 240, g: 180, b: 158 },
    { r: 247, g: 228, b: 190 }
  ],
  [
    { r: 52, g: 56, b: 56 },
    { r: 0, g: 95, b: 107 },
    { r: 0, g: 140, b: 158 },
    { r: 0, g: 180, b: 204 },
    { r: 0, g: 223, b: 252 }
  ],
  [
    { r: 208, g: 214, b: 229 },
    { r: 204, g: 165, b: 211 },
    { r: 218, g: 86, b: 170 },
    { r: 151, g: 64, b: 191 },
    { r: 105, g: 39, b: 92 }
  ],
  [
    { r: 50, g: 50, b: 50 },
    { r: 255, g: 0, b: 102 },
    { r: 255, g: 0, b: 30 },
    { r: 198, g: 0, b: 0 },
    { r: 0, g: 44, b: 47 }
  ],
  [
    { r: 23, g: 56, b: 24 },
    { r: 248, g: 153, b: 140 },
    { r: 251, g: 172, b: 108 },
    { r: 252, g: 243, b: 79 },
    { r: 224, g: 235, b: 100 }
  ],
  [
    { r: 252, g: 168, b: 140 },
    { r: 255, g: 148, b: 140 },
    { r: 186, g: 124, b: 129 },
    { r: 99, g: 96, b: 117 },
    { r: 62, g: 59, b: 80 }
  ],
  [
    { r: 79, g: 69, b: 79 },
    { r: 174, g: 35, b: 173 },
    { r: 115, g: 0, b: 230 },
    { r: 0, g: 230, b: 192 },
    { r: 201, g: 230, b: 0 }
  ],
  [
    { r: 25, g: 6, b: 91 },
    { r: 82, g: 8, b: 168 },
    { r: 156, g: 8, b: 182 },
    { r: 217, g: 3, b: 118 },
    { r: 252, g: 57, b: 163 }
  ],
  [
    { r: 200, g: 0, b: 211 },
    { r: 255, g: 10, b: 111 },
    { r: 192, g: 183, b: 118 },
    { r: 115, g: 92, b: 102 },
    { r: 52, g: 32, b: 33 }
  ],
  [
    { r: 200, g: 0, b: 211 },
    { r: 255, g: 10, b: 96 },
    { r: 250, g: 217, b: 39 },
    { r: 17, g: 199, b: 172 },
    { r: 11, g: 0, b: 201 }
  ],
  [
    { r: 254, g: 237, b: 209 },
    { r: 207, g: 170, b: 162 },
    { r: 199, g: 47, b: 70 },
    { r: 251, g: 101, b: 130 },
    { r: 53, g: 7, b: 0 }
  ],
  [
    { r: 170, g: 143, b: 134 },
    { r: 135, g: 157, b: 180 },
    { r: 140, g: 102, b: 153 },
    { r: 228, g: 84, b: 31 },
    { r: 102, g: 0, b: 0 }
  ],
  [
    { r: 71, g: 76, b: 60 },
    { r: 2, g: 255, b: 74 },
    { r: 147, g: 255, b: 74 },
    { r: 198, g: 253, b: 53 },
    { r: 224, g: 252, b: 25 }
  ],
  [
    { r: 179, g: 216, b: 242 },
    { r: 245, g: 122, b: 78 },
    { r: 118, g: 150, b: 65 },
    { r: 22, g: 66, b: 65 },
    { r: 10, g: 33, b: 64 }
  ],
  [
    { r: 223, g: 242, b: 255 },
    { r: 250, g: 252, b: 217 },
    { r: 250, g: 255, b: 162 },
    { r: 159, g: 237, b: 255 },
    { r: 73, g: 182, b: 255 }
  ],
  [
    { r: 0, g: 168, b: 198 },
    { r: 64, g: 192, b: 203 },
    { r: 249, g: 242, b: 231 },
    { r: 174, g: 226, b: 57 },
    { r: 143, g: 190, b: 0 }
  ],
  [
    { r: 54, g: 2, b: 35 },
    { r: 126, g: 0, b: 80 },
    { r: 93, g: 0, b: 194 },
    { r: 203, g: 140, b: 6 },
    { r: 249, g: 205, b: 113 }
  ],
  [
    { r: 48, g: 37, b: 76 },
    { r: 93, g: 12, b: 225 },
    { r: 133, g: 120, b: 254 },
    { r: 227, g: 196, b: 229 },
    { r: 77, g: 200, b: 249 }
  ],
  [
    { r: 40, g: 21, b: 17 },
    { r: 91, g: 0, b: 31 },
    { r: 131, g: 12, b: 14 },
    { r: 175, g: 69, b: 83 },
    { r: 255, g: 125, b: 89 }
  ],
  [
    { r: 85, g: 98, b: 112 },
    { r: 78, g: 205, b: 196 },
    { r: 199, g: 244, b: 100 },
    { r: 255, g: 107, b: 107 },
    { r: 196, g: 77, b: 88 }
  ],
  [
    { r: 2, g: 106, b: 216 },
    { r: 25, g: 221, b: 203 },
    { r: 205, g: 252, b: 245 },
    { r: 246, g: 249, b: 197 },
    { r: 204, g: 159, b: 54 }
  ],
  [
    { r: 27, g: 103, b: 107 },
    { r: 81, g: 149, b: 72 },
    { r: 136, g: 196, b: 37 },
    { r: 190, g: 242, b: 2 },
    { r: 234, g: 253, b: 230 }
  ],
  [
    { r: 236, g: 208, b: 120 },
    { r: 217, g: 91, b: 67 },
    { r: 192, g: 41, b: 66 },
    { r: 84, g: 36, b: 55 },
    { r: 83, g: 119, b: 122 }
  ],
  [
    { r: 27, g: 23, b: 24 },
    { r: 87, g: 21, b: 159 },
    { r: 14, g: 68, b: 229 },
    { r: 75, g: 114, b: 70 },
    { r: 223, g: 218, b: 63 }
  ],
  [
    { r: 179, g: 204, b: 87 },
    { r: 236, g: 240, b: 129 },
    { r: 255, g: 190, b: 64 },
    { r: 239, g: 116, b: 111 },
    { r: 171, g: 62, b: 91 }
  ],
  [
    { r: 197, g: 1, b: 137 },
    { r: 147, g: 1, b: 128 },
    { r: 110, g: 1, b: 122 },
    { r: 81, g: 0, b: 104 },
    { r: 62, g: 0, b: 100 }
  ],
  [
    { r: 96, g: 107, b: 169 },
    { r: 77, g: 128, b: 171 },
    { r: 131, g: 121, b: 157 },
    { r: 199, g: 145, b: 157 },
    { r: 254, g: 178, b: 132 }
  ],
  [
    { r: 255, g: 227, b: 129 },
    { r: 251, g: 255, b: 129 },
    { r: 183, g: 178, b: 234 },
    { r: 141, g: 129, b: 255 },
    { r: 155, g: 147, b: 118 }
  ],
  [
    { r: 15, g: 21, b: 52 },
    { r: 249, g: 16, b: 119 },
    { r: 95, g: 28, b: 136 },
    { r: 92, g: 26, b: 254 },
    { r: 29, g: 59, b: 254 }
  ],
  [
    { r: 214, g: 176, b: 104 },
    { r: 255, g: 167, b: 0 },
    { r: 255, g: 78, b: 0 },
    { r: 255, g: 0, b: 42 },
    { r: 255, g: 0, b: 111 }
  ],
  [
    { r: 73, g: 10, b: 61 },
    { r: 189, g: 21, b: 80 },
    { r: 233, g: 127, b: 2 },
    { r: 248, g: 202, b: 0 },
    { r: 138, g: 155, b: 15 }
  ],
  [
    { r: 121, g: 123, b: 113 },
    { r: 255, g: 92, b: 66 },
    { r: 255, g: 36, b: 0 },
    { r: 194, g: 27, b: 0 },
    { r: 61, g: 10, b: 1 }
  ],
  [
    { r: 80, g: 108, b: 158 },
    { r: 138, g: 188, b: 213 },
    { r: 110, g: 159, b: 251 },
    { r: 54, g: 141, b: 218 },
    { r: 16, g: 101, b: 194 }
  ],
  [
    { r: 213, g: 77, b: 187 },
    { r: 193, g: 116, b: 198 },
    { r: 150, g: 156, b: 232 },
    { r: 123, g: 71, b: 156 },
    { r: 108, g: 58, b: 145 }
  ],
  [
    { r: 253, g: 234, b: 197 },
    { r: 250, g: 181, b: 145 },
    { r: 238, g: 108, b: 78 },
    { r: 194, g: 68, b: 85 },
    { r: 84, g: 65, b: 106 }
  ],
  [
    { r: 29, g: 1, b: 105 },
    { r: 29, g: 32, b: 252 },
    { r: 0, g: 87, b: 239 },
    { r: 1, g: 143, b: 231 },
    { r: 3, g: 164, b: 253 }
  ],
  [
    { r: 0, g: 0, b: 0 },
    { r: 0, g: 0, b: 0 },
    { r: 0, g: 0, b: 0 },
    { r: 0, g: 0, b: 0 },
    { r: 0, g: 0, b: 0 }
  ]
];

function getAngleFromCenter(v) {
  return Math.atan2(v.y - height / 2, v.x - width / 2);
}

function getVCoordinates(v, d, a) {
  return new PVector(v.x + d * Math.cos(a), v.y + d * Math.sin(a));
}

class Phasor {
  constructor(inc) {
    this.inc = inc;
    this.phase = 0;
  }

  update() {
    this.phase += this.inc;

    //Phase from 1 to -1 and back
    while (Math.abs(this.phase) >= 1) {
      this.inc = this.inc * -1;
      this.phase += this.inc;
    }
  }
}

class Walker {
  constructor(x, y) {
    this.v = new PVector(x, y);
  }

  update(isFast = false) {
    let gauss = isFast ? 0.5 : p2.phase * random(2);
    const angle = angles[int(random(angles.length))];

    this.v = getVCoordinates(this.v, gauss, angle);

    const newDist = dist(this.v.x, this.v.y, width / 2, height / 2);
    const offset = width / 2;

    if (newDist > offset) {
      this.v.x = width / 2 + random(0, offset);
      this.v.y = height / 2 + random(0, offset);
    }

    let a = getAngleFromCenter(this.v);
    let d = dist(this.v.x, this.v.y, width / 2, height / 2);
    noStroke();

    const palette = palettes[colorParam];
    fill(palette.getNorm(Math.abs(p1.phase)), map(d, 0, width / 2, 0, 125));

    gauss = random(0.5, 0.8);
    for (let i = 0; i < nReflections; i++) {
      let thisAngle = a + (TWO_PI / nReflections) * i;
      let thisV = getVCoordinates(centerPoint, d, thisAngle);

      this.drawFigure(thisV.x, thisV.y, gauss);

      thisV = getVCoordinates(centerPoint, d, PI - thisAngle);
      this.drawFigure(thisV.x, thisV.y, gauss);
    }
  }

  drawFigure(centerX, centerY, size) {
    switch (random(6)) {
      case 0:
        ellipse(centerX, centerY, size, size);
        break;

      case 1:
        quad(
          centerX - size,
          centerY,
          centerX + size,
          centerY,
          centerX,
          centerY - size,
          centerX,
          centerY + size
        );
        break;

      case 2:
        triangle(
          centerX,
          centerY,
          centerY + size,
          centerX + size / 2,
          centerY,
          centerX - size / 2
        );
        break;

      case 3:
        quad(
          centerX - 2 * size,
          centerY,
          centerX + size,
          centerY,
          centerX,
          centerY - 2 * size,
          centerX,
          centerY + 2 * size
        );
        break;

      case 4:
        triangle(
          centerX,
          centerY,
          centerY + size,
          centerX + 2 * size,
          centerY,
          centerX - 2 * size
        );
        break;

      case 5:
        rect(centerX, centerY, 2 * size, size);
        break;

      default:
        ellipse(centerX, centerY, size, size);
        break;
    }
  }
}

class Palette {
  constructor() {
    this.colors = [];
  }

  add(c) {
    this.colors.push(c);
  }

  getNorm(p) {
    let index = int(p * this.colors.length);
    let c1 = this.colors[index % this.colors.length];
    let c2 = this.colors[(index + 1) % this.colors.length];

    return lerpColor(c1, c2, p);
  }
}

function processMessages(e) {
  let message = {};
  try {
    message = JSON.parse(JSON.stringify(e.data));
  } catch (e) {
    console.log(e);
  }
  switch (message.type) {
    case "save":
      clearInterval(renderTimer);

      const $canvas = document.querySelector("canvas");
      if ($canvas) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            data: $canvas.toDataURL("image/jpeg"),
            size: width,
            canvasSize: width
          })
        );
      }
      break;

    case "stop":
      active = false;
      break;

    case "start":
      active = true;
      break;

    case "clear":
      clear();
      break;

    default:
      break;
  }
}

function generatePalette(isBlackPalette = false) {
  const palette = new Palette();
  const paletteSource = palettesSource[isBlackPalette ? 50 : int(random(50))];

  paletteSource.forEach(sourceColor =>
    palette.add(color(sourceColor.r, sourceColor.g, sourceColor.b))
  );

  return palette;
}

function setupPalettes() {
  for (let i = 0; i < nPalettes; i++) {
    palettes.push(generatePalette());
  }
}

function addBlackPalettes() {
  for (let i = 0; i < nBlackPalettes; i++) {
    palettes[int(random(nPalettes))] = generatePalette(true);
  }
}

function setup() {
  centerPoint = new PVector(width / 2, height / 2);
  window.addEventListener("message", processMessages);

  angles = new Array(nAngles);
  for (let i = 0; i < angles.length; i++) {
    angles[i] = (i / nAngles) * TWO_PI;
  }

  w = new Walker(width / 2, height / 2);
  p1 = new Phasor(phasorInc);
  p2 = new Phasor(phasorInc2);

  setupPalettes();
  createCanvas(width, height);

  renderTimer = setInterval(() => {
    drawScene();
  }, 30);
}

function drawScene() {
  if (!active) return;

  if (counter > framesPerPalette) {
    colorParam = int(random(nPalettes));
    counter = 0;
  }

  for (let i = 0; i < nPointsPerFrame; i++) {
    p1.update();
    p2.update();
    w.update(fastPhaseChange);
  }

  // Add black palettes
  const currentTime = Date.now();
  const timeDelta = currentTime - startTime;
  if (!blackPalettesSet && timeDelta >= 15000) {
    addBlackPalettes();
    blackPalettesSet = true;
    fastPhaseChange = false;
  } else if (timeDelta >= 210000) {
    // Stop generation in 3.5 minutes
    active = false;
  }

  noFill();
  stroke(0);
  strokeWeight(2.4 * BORDER_WIDTH);
  ellipse(
    width / 2,
    height / 2,
    width + 2 * BORDER_WIDTH,
    height + 2 * BORDER_WIDTH
  );

  counter += random(40);
}
