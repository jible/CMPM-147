/* exported generateGrid, drawGrid */
/* global placeTile */
let waterTileIndices = []; // Array to store water tile indices
let waterTileTimers = []; // Array to store timers for each water tile
let waterTileChangeInterval = 3000; // Change interval for water tiles (in milliseconds)

function generateGrid(numCols, numRows) {
  let grid = [];

  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }

  // Generate terrain using Perlin noise
  let noiseScale = 0.1; // Adjust this value to control the terrain smoothness
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      let noiseValue = noise(i * noiseScale, j * noiseScale);
      if (noiseValue < 0.4) {
        grid[i][j] = "d"; // Dirt area
      } else if (noiseValue < 0.6) {
        grid[i][j] = "_"; // Grass area
      } else {
        grid[i][j] = "w"; // Water/beach area
        waterTileIndices.push(floor(random(4))); // Initialize water tile index
        waterTileTimers.push(random(waterTileChangeInterval)); // Initialize timer
      }
    }
  }

  // Sprinkle trees randomly
  let treeDensity = 0.02; // Adjust this value to control the density of trees
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j] === "_") { // Only sprinkle trees on grassy areas
        if (random() < treeDensity) {
          grid[i][j] = "t"; // Place a tree
        }
      }
    }
  }

  // Make some shapes
  return grid;
}

function drawGrid(grid) {
  background(128);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == "_") {
        placeTile(i, j, floor(random(0, 4)), 6); 
      } else if (grid[i][j] == "w") {
        let index = i * grid[0].length + j;
        let currentTileIndex = waterTileIndices[index];
        placeTile(i, j, currentTileIndex, 13);
        drawContext(grid, i, j, "_", 10, 4);
        drawContext(grid, i, j, "t", 10, 4);
        drawContext(grid, i, j, "_", 5, 7);
        drawContext(grid, i, j, "d", 10, 4);
        drawContext(grid, i, j, "p", 5, 13);
      } else if (grid[i][j] == "p") {
        placeTile(i, j, floor(random(1, 3)), floor(random(18, 19)));
        drawContext(grid, i, j, "_", 5, 7);
      } else if (grid[i][j] == "t") {
        placeTile(i, j, floor(random(0, 4)), 6); 
        placeTile(i, j, 14, 6);
      } else if (grid[i][j] == "d") {
        placeTile(i, j, floor(random(0, 4)), 4); 
        drawContext(grid, i, j, "_", 5, 7);
      }
    }
  }

  // Update water tile timers and indices
  for (let i = 0; i < waterTileTimers.length; i++) {
    waterTileTimers[i] -= deltaTime;
    if (waterTileTimers[i] <= 0) {
      waterTileIndices[i] = floor(random(4)); // Update water tile index
      waterTileTimers[i] = waterTileChangeInterval; // Reset timer
    }
  }
}

/*If location i,j is inside the grid (not out of bounds), does grid[i][j]==target? Otherise, return false.*/
function gridCheck(grid, i, j, target) {
  if (i < grid.length && j < grid[0].length && i > 0 && j > 0) {
    if (grid[i][j] == target) {
      return true;
    }
  }
  return false;
}

/*Form a 4-bit code using gridCheck on the north/south/east/west neighbors of i,j for the target code. 
You might us an example like (northBit<<0)+(southBit<<1)+(eastBit<<2)+(westBit<<3).*/

function gridCode(grid, i, j, target) {
  // re-written with chatgpt
  // In the order: North, South, East, West
  let n = gridCheck(grid, i - 1, j, target) ? 1 : 0;
  let s = gridCheck(grid, i + 1, j, target) ? 1 : 0;
  let e = gridCheck(grid, i, j + 1, target) ? 1 : 0;
  let w = gridCheck(grid, i, j - 1, target) ? 1 : 0;
  return (n << 0) + (s << 1) + (e << 2) + (w << 3);
}

/* Get the code for this location and target. 
Use the code as an array index to get a pair of tile offset numbers. 
const [tiOffset, tjOffset] = lookup[code]; placeTile(i, j, ti + tiOffset, tj + tjOffset);
*/

function drawContext(grid, i, j, target, dti, dtj) {
  let code = gridCode(grid, i, j, target);
  for (let index = 0; index < lookup[code].length; index++) {
    let [tiOffset, tjOffset] = lookup[code][index];
    placeTile(i, j, dti + tiOffset, dtj + tjOffset);
  }
}



/*A global variable referring to an array of 16 elements. 
Fill this with hand-typed tile offset pairs, e.g. [2,1], 
so that drawContext does not need to handle any special cases
*/

let north = [0, -1];
let south = [0, 1];
let east = [1, 0];
let west = [-1, 0];

// Order: always draw north, then east, then west, then south
const lookup = [
  [], // 0000, this means all of the tiles are the same, so no change
  [north], // 0001, so just the north bit is different
  [south], // 0010, south
  [north, south], // 0011, north, south   edge case
  [east], // 0100, east
  [[1, -1]], // 0101, east north
  [[1, 1]], // 0110, east south
  [[1, -1],[1, 1],], // 0111, east north south   edge case
  [west], // 1000, west
  [[-1, -1]], //west north
  [[-1, 1]], // 1010, west south
  [[-1, -1],[-1, 1],], // 1011, west, southh north
  [west, east], // 1100, west east
  [[-1, -1],[1, -1],], // 1101 west east north
  [[-1, 1],[1, 1]], // 1110 west east south
  [[-1, 1],[1, 1],], // 1111, west east south north
];
