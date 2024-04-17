// sketch.js - purpose and description here
// Author: James Milestone
// Date: 4/16

/* exported setup, draw */







let canvasWidth = 900;
let canvasHeight = 900;
let numPoints = 40; // Number of points for island shape
let scaleDownFactor = 0.6; // Scale down factor for inner island shape
let minRadius = 70; // Minimum radius of the island (slightly larger)
let maxRadius = 200; // Maximum radius of the island (slightly larger)
let numIslands = 150; // Number of islands to spawn (increased)
let spawnRange = 1500; // Range for island spawning
let islands = [];
let cameraX = 0;
let cameraY = 0;
let cameraSpeed = 5; // Speed of camera movement
let islandSpacing = 50; // Spacing between islands in a bunch (reduced)
let minIslandBunch = 1;
let maxIslandBunch = 50; // Number of islands per bunch (increased)

// Globals
let canvasContainer;
var centerHorz, centerVert;
let seed = 1;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  generateIslands();
}
  


function generateIslands() {
  let prevIslandX = 0;
  let prevIslandY = 0;

  for (let i = 0; i < numIslands; i++) {
    let centerX, centerY;
    let currentBunchSize = floor(random(minIslandBunch, maxIslandBunch + 1)); // Randomize bunch size

    if (i % currentBunchSize === 0) {
      // Random position for the first island in the bunch
      centerX = random(-spawnRange, spawnRange);
      centerY = random(-spawnRange, spawnRange);
    } else {
      // Generate position close to the previous island
      centerX = prevIslandX + random(-islandSpacing, islandSpacing);
      centerY = prevIslandY + random(-islandSpacing, islandSpacing);
      // Constrain position within spawn range
      centerX = constrain(centerX, -spawnRange, spawnRange);
      centerY = constrain(centerY, -spawnRange, spawnRange);
    }

    let noiseOffset = random(1000);
    let yellowPoints = generatePoints(centerX, centerY, noiseOffset, true);
    let greenPoints = generatePoints(centerX, centerY, noiseOffset, false);
    islands.push({ x: centerX, y: centerY, yellow: yellowPoints, green: greenPoints });

    prevIslandX = centerX;
    prevIslandY = centerY;
  }
}

function draw() {
  background(100, 149, 237); // Blue background
  noStroke(); // Remove stroke

  // Move camera based on user input
  if (keyIsDown(87)) { // W key
    if (cameraY - cameraSpeed >= -spawnRange) {
      cameraY -= cameraSpeed;
    }
  }
  if (keyIsDown(83)) { // S key
    if (cameraY + cameraSpeed <= spawnRange) {
      cameraY += cameraSpeed;
    }
  }
  if (keyIsDown(65)) { // A key
    if (cameraX - cameraSpeed >= -spawnRange) {
      cameraX -= cameraSpeed;
    }
  }
  if (keyIsDown(68)) { // D key
    if (cameraX + cameraSpeed <= spawnRange) {
      cameraX += cameraSpeed;
    }
  }

  translate(-cameraX, -cameraY);

  // Draw yellow parts of islands
  fill(255, 255, 0); // Yellow fill color
  for (let island of islands) {
    drawPoints(island.yellow);
  }

  // Draw green parts of islands
  fill(50, 205, 50); // Green fill color
  for (let island of islands) {
    drawPoints(island.green);
  }

  // Draw mountains (brown circles) at the center of each island
  fill(139, 69, 19); // Brown fill color
  for (let island of islands) {
    ellipse(island.x, island.y, 40, 40); // Draw a brown circle at the center of the island
  }
}

function generatePoints(centerX, centerY, noiseOffset, isYellow) {
  let points = [];
  for (let i = 0; i < numPoints; i++) {
    let angle = map(i, 0, numPoints, 0, TWO_PI);
    let noiseValue = noise(i * 0.1 + noiseOffset); // Generate noise value for randomness with offset
    let randomRadius;
    if (isYellow) {
      randomRadius = map(noiseValue, 0, 1, minRadius, maxRadius); // Vary radius using noise
    } else {
      randomRadius = map(noiseValue, 0, 1, minRadius * scaleDownFactor, maxRadius * scaleDownFactor); // Vary radius using noise
    }
    let x = centerX + cos(angle) * randomRadius;
    let y = centerY + sin(angle) * randomRadius;
    points.push(createVector(x, y));
  }
  return points;
}

function drawPoints(points) {
  beginShape();
  for (let point of points) {
    vertex(point.x, point.y);
  }
  endShape(CLOSE);
}








































































