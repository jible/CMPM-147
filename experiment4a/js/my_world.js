"use strict";

/* global XXH */
/* exported --
    p3_buildRadiusChange
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
let buildRadius =2;

function p3_buildRadiusChange(rad){
  buildRadius = rad;
}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j, h) { 
  // whenever the mouse is down over a tile, this happens- it changes the height by x. It changes the surrounding tiles by a smaller factor
  // This is sooooo sloppy, but basically it itterates through the surrounding tiles and makes them increase in height 
  let range = buildRadius; // How many tiles in each direction it moves up with each click
  let key = [i, j];
  let vertDif = 0;
  let horzDif = 0;
  for ( let x =i-range; x<=i+range; x++){
    for (let y= j-range; y<= j+range; y++){
      if ( x != i || y != j){
        key = [x,y]
        vertDif = j-y;
        horzDif = i-x; 
        if ( clicks[key]){
          clicks[key]+= h* 1/Math.sqrt(vertDif* vertDif + horzDif*horzDif);
        } else { clicks[key] = h* Math.sqrt(vertDif* vertDif + horzDif*horzDif)}
      }
      
    }
    
  }
  key = [i,j]
  if ( clicks[key]){clicks[key]+= h*1.2} else { clicks[key] = h*1.1}
  
}

function p3_drawBefore() {}

// ty chatgpt
// This makes a unique number, given the seed
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
  /* This makes super cool mosaic looking thing
  randomSeed(floor(worldSeed * (i ^ j)));
  */
  
  
  randomSeed(worldSeed*floor(fnv1a(i, j)));
  let r = 0
  let g = 0
  let b = 0
  if ( clicks[[i,j]]){ 
    if (clicks[[i,j]] >0){// Water Level 
      g = floor(random(0, 50));
      b =floor(random(100, 200))
    }else if ( clicks[[i,j]] <= -50 ){ // mountain Level
      g = floor(random(0,50))+100;
      b =floor(random(0,50))
      r = floor(random(0,50))+100;
    }else if ( clicks[[i,j]] <= -8 ){ // grassy Level
      g = floor(random(0,50))+205;
      b =0
      r = floor(random(0,50))+100;
    } else if (clicks[ [ i,j]] < 0 ){
      g = green = floor(random(0,50))+205;
      b =0
      r = floor(random(0,50))+205;
    }
    
  } else { // sandy
    g = green = floor(random(0,50))+205;
    b =0
    r = floor(random(0,50))+205;
  }
  
  
  
  fill(r,g,b);

  
 
  let n = clicks[[i, j]] | 0;
  
  push();

  beginShape();
  vertex(-tw, 0 + n);
  vertex(0, th+ n);
  vertex(tw, 0 + n);
  vertex(0, -th+ n);
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
