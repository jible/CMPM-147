"use strict";

/* global XXH */
/* exported --
    p3_buildRadiusChange
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_gameStep
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}



let worldSeed;






function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  resetlife();
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function resetTiles(key){
  
  clicks = {}
}

function p3_tileClicked(i, j) { 
  // whenever the mouse is down over a tile, this happens- it changes the tile from on to off or the reverse
  // Toggle the state of the tile at coordinates (i, j)
  
  if (!clicks[i]) {
    clicks[i] = [];
  }
  clicks[i][j] = true
}


function p3_tileErased(i,j){
  if (clicks[i] && clicks[i][j]) {
    
    clicks[i][j] = false
  }
  
}




let chunkSize = 40;
let currentChunk = [0, 0];
let loadedChunks = {};

function p3_chunkUpdate() {
  let world_pos = screenToWorld([0, 0], [camera_offset.x, camera_offset.y]);

  let newChunkX = Math.floor(world_pos[0] / chunkSize);
  let newChunkY = Math.floor(world_pos[1] / chunkSize);

  if (newChunkX !== currentChunk[0] || newChunkY !== currentChunk[1]) {
    currentChunk[0] = newChunkX;
    currentChunk[1] = newChunkY;

    loadSurroundingChunks();
  }
}

function loadSurroundingChunks() {
  for (let x = currentChunk[0] - 1; x <= currentChunk[0] + 1; x++) {
    for (let y = currentChunk[1] - 1; y <= currentChunk[1] + 1; y++) {
      if (!loadedChunks[x]) {
        loadedChunks[x] = {};
      }

      if (!loadedChunks[x][y]) {
        loadedChunks[x][y] = true;
        loadChunk(x * chunkSize, y * chunkSize);
      }
    }
  }
}

function loadChunk(chunkX, chunkY) {
  // Load randomly placed tiles within the chunk
  p3_generateRandomTiles(chunkX, chunkY, chunkSize);
}

function p3_generateRandomTiles(minX, minY, range) {
  let maxTiles = 250;
  let minTiles = 180;

  for (let i = 0; i < Math.floor(random(minTiles, maxTiles)); i++) {
    let x = Math.floor(random(minX, minX + range));
    let y = Math.floor(random(minY, minY + range));

    if (!clicks[x]) {
      clicks[x] = {};
    }

    clicks[x][y] = true;
  }
}


function resetlife(){
  clicks = {}
  currentChunk = [0,0]
  loadedChunks = {}
  p3_chunkUpdate();
}


function p3_drawBefore() {}

function p3_gameStep() {
  let tempLive = {};

  for (let i in clicks) {
    for (let j in clicks[i]) {
      liveCheckNeighbors(parseInt(i), parseInt(j), tempLive);
    }
  }

  clicks = tempLive;
}

function liveCheckNeighbors(i, j, tempLive) {
  let neighbors = 0;

  for (let x = i - 1; x <= i + 1; x++) {
    for (let y = j - 1; y <= j + 1; y++) {
      if (x !== i || y !== j) { // Exclude the cell itself
        if (clicks[x] && clicks[x][y]) { // Check if neighbor is alive
          neighbors++;
        } else {
          deadCheckNeighbors(x, y, tempLive);
        }
      }
    }
  }

  if ((neighbors === 2 || neighbors === 3) && clicks[i] && clicks[i][j]) {
    tempLive[i] = tempLive[i] || {};
    tempLive[i][j] = true;
  }
}

function deadCheckNeighbors(i, j, live) {
  let neighbors = 0;

  for (let x = i - 1; x <= i + 1; x++) {
    for (let y = j - 1; y <= j + 1; y++) {
      if (x !== i || y !== j) { // Exclude the cell itself
        if (clicks[x] && clicks[x][y]) { // Check if neighbor is alive
          neighbors++;
        }
      }
    }
  }

  if (neighbors === 3) {
    live[i] = live[i] || {};
    live[i][j] = true;
  }
}


function fnv1a(x, y) {
  let hash = 2166136261; // FNV offset basis
  let str = `${x},${y}`;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i); // XOR the hash with the current byte
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24); // Multiply by the FNV prime
  }
  return hash >>> 0; // Convert to unsigned integer (32 bits)
}



function p3_drawTile(i, j) {
  noStroke();
  
  randomSeed(worldSeed*floor(fnv1a(i, j)));
  
  let r = 255;
  let g = 255;
  let b = 255;
  
  if (clicks[i]?.[j]) {
    r = floor(random(0,255));
    g = floor(random(0,255));
    b = floor(random(0,255));
  }
  fill(r, g, b);

  let n = 0;
  
  push();

  beginShape();
  vertex(-tw, 0 + n);
  vertex(0, th + n);
  vertex(tw, 0 + n);
  vertex(0, -th + n);
  endShape(CLOSE);

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);
  
  
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}
