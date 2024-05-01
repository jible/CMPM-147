"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;
let pathBlocks= {}

let frontPath = [0,0]

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  pathBlocks = {};
  frontPath = [0,0]
  pathBlocks[[0,0]] = true
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}



let directionVectors = [[0,1],[1,0],[0,-1],[-1,0]] // n, w ,s ,e 

pathBlocks[[0,0]] = true;
let prevDirection = 0


function p3_updatePath(){
  let distance = floor(random( 1, 20)); // travel a random distance
  let direction =  floor(random(0,3));  // in a random direction
  if (direction == (prevDirection + 2)%4){ // face different direction if attempting to go backwards
    direction = (direction+1)%4
  }
  prevDirection = direction; // Store this direction as the new previous for next call
  for (let i = 0; i <distance; i++){ // draw in all of the path blocks 
    console.log (" direction:" + direction)
    console.log (" path:" + frontPath)
    console.log (" vector:" + directionVectors)
    
    console.log( ([frontPath[0] + (directionVectors[direction][0])*i, frontPath[1] + (directionVectors[direction][1])*i ]))
    pathBlocks[[frontPath[0] + directionVectors[direction][0]*i, frontPath[1] + directionVectors[direction][1]*i ]] = true // if an index in pathblock is true, it will be drawn in yellow
    if ( i == distance -1 ) { // if this is the last one, list it as the new latest block
      frontPath = [frontPath[0] + (directionVectors[direction][0])*i, frontPath[1] + (directionVectors[direction][1])*i ]
    }
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

function p3_drawBefore() {}




function p3_drawTile(i, j) {
  noStroke();
  randomSeed(floor(fnv1a(i,j)) * worldSeed)
  let r = 0;
  let g = 0;
  let b = 0;
  if (pathBlocks[[i,j]]){
    // make it yellow
    
    g = green = floor(random(0,50))+205;
    b =0
    r = floor(random(0,50))+205;
  } else{
    // make it green
    
    g = floor(random(0,50))+205;
    b =0
    r = floor(random(0,50))+100;
  }

  
  
  fill(r,g,b);
  
  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  // let n = clicks[[i, j]] | 0;
  // if (n % 2 == 1) {
  //   fill(0, 0, 0, 32);
  //   ellipse(0, 0, 10, 5);
  //   translate(0, -10);
  //   fill(255, 255, 100, 128);
  //   ellipse(0, 0, 10, 10);
  // }

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
