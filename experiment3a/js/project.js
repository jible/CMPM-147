/* exported generateGrid, drawGrid */
/* global placeTile */

function generateGrid(numCols, numRows) {
  let grid = [];
  
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }
  let rooms = 0;

  let start = [0, 0];
  let end = [0, 0];
  for (let i = 0; i < 20; i++) {
    // Try to make rooms 20 times
    let length = floor(random(3, 12));
    let height = floor(random(3, 12));
    let top = floor(random(0, numRows - 5));
    let left = floor(random(0, numCols - 5));
    if (checkSquare(grid, top, left, length, height)) {
      // Make sure a room can be placed here
      end = generateRoom(grid, top, left, length, height);
      // If a room is placeable, place it. End is a random point in this room to connect to other rooms
      if (rooms != 0) {
        // if this isn't the first room, connect to the previous room
        //It is a random point on the current room to connect to the previous
        makePath(grid, start, end);
      }
      start = [
        floor(random(left, left + length)),
        floor(random(top, top + height)),
      ];
      // This will be the start for the next room.
      //I use a new random number to make sure the paths don't connect very often. Otherwise, i would recycle the previous room's end.
      rooms++;
    }
  }
  return grid;
}



function makePath(grid, start, end) {
  let current = start.slice(); // Create a copy of start
  while (current[0] !== end[0] || current[1] !== end[1]) {
    if (
      (Math.floor(Math.random() * 2) == 1 && current[0] !== end[0]) ||
      current[1] == end[1]
    ) {
      // If 50/50 or unable to walk horizontally, walk vertically
      if (current[0] < end[0]) {
        current[0]++;
      } else {
        current[0]--;
      }
    } else {
      if (current[1] < end[1]) {
        // walk towards end
        current[1]++;
      } else {
        current[1]--;
      }
    }

    // after walking
    if (gridCheck(grid, current[0], current[1], "_")) {
      grid[current[0]][current[1]] = "r"; // Update grid with "p" at current position
    }
  }
}

function checkSquare(grid, top, left, length, height) {
  // This checks the area of a potential square and makes sure nothing else is there.
  for (let i = left; i <= left + length; i++) {
    for (let j = top; j <= top + height; j++) {
      if (!gridCheck(grid, i, j, "_")) {
        return false;
      }
    }
  }
  return true;
}

function generateRoom(grid, top, left, length, height) {
  // Make a room starting at (top,left) of length and height respectively.
  for (let i = left; i <= left + length; i++) {
    for (let j = top; j < top + height; j++) {
      grid[i][j] = "r";
    }
  }
  return [floor(random(left, left + length)), floor(random(top, top + height))]; // This is a random point within the square for the next path to connect to.
}

function drawGrid(grid) {
  background(128);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == "_") {
        placeTile(i, j, floor(random(0, 4)), 9); //random(0, 4)), 10
      } else if (grid[i][j] == "w") {
        placeTile(i, j, floor(random(4)), 13);
      } else if (grid[i][j] == "r") {
        drawContext(grid, i, j, "r", 10, 10)
      }else if (grid[i][j] == "p") {
        placeTile(i, j, floor(random(0,3)), 15);
        if ( !gridCheck(grid, i,j,"p") && ! gridCheck(grid,i,j,"r")){
          placeTile(i, j, );
        }
      }
      
      
    }
  }
}

/*If location i,j is inside the grid (not out of bounds), does grid[i][j]==target? Otherise, return false.*/
function gridCheck(grid, i, j, target) {
  if (i < grid.length && j < grid[0].length && i > 0 && j > 0) {
    if (grid[i][j] == target){
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
  let n = gridCheck(grid, i - 1, j, target) ? 0 : 1;
  let s = gridCheck(grid, i + 1, j, target) ? 0 : 1;
  let e = gridCheck(grid, i, j + 1, target) ? 0 : 1;
  let w = gridCheck(grid, i, j - 1, target) ? 0 : 1;
  return (n << 0) + (s << 1) + (e << 2) + (w << 3);
}

function pathcheck(grid, i, j) {
  // re-written with chatgpt
  // In the order: North, South, East, West
  let n = gridCheck(grid, i - 1, j, "p") ? 1 : 0;
  let s = gridCheck(grid, i + 1, j, "p") ? 1 : 0;
  let e = gridCheck(grid, i, j + 1, "p") ? 1 : 0;
  let w = gridCheck(grid, i, j - 1, "p") ? 1 : 0;
  return (n << 0) + (s << 1) + (e << 2) + (w << 3);
}

/* Get the code for this location and target. 
Use the code as an array index to get a pair of tile offset numbers. 
const [tiOffset, tjOffset] = lookup[code]; placeTile(i, j, ti + tiOffset, tj + tjOffset);
*/

function drawContext(grid, i, j, target, dti, dtj) {
  if (pathcheck(grid,i,j) != 0){
    placeTile(i, j, floor(random(0, 3)), 15);
  } else {
    placeTile(i, j, floor(random(0, 4)), 10);
    let code = gridCode(grid, i, j, target);
    for ( let index = 0; index < lookup [code].length; index ++){
      let [tiOffset, tjOffset] = lookup[code][index];
      placeTile(i, j, dti + tiOffset, dtj + tjOffset);
    }
  }
  
}

/*A global variable referring to an array of 16 elements. 
Fill this with hand-typed tile offset pairs, e.g. [2,1], 
so that drawContext does not need to handle any special cases
*/

let north =  [ 0,-1 ];
let south =  [ 0, 1 ];
let east =   [ 1, 0 ];
let west =   [-1, 0 ];

// Order: always draw north, then east, then west, then south
const lookup = [
  [], // 0000, this means all of the tiles are the same, so no change
  [north], // 0001, so just the north bit is different
  [south], // 0010, south
  [ north, south], // 0011, north, south   edge case
  [east], // 0100, east
  [[1,-1] ], // 0101, east north
  [ [1,1] ], // 0110, east south
  [[1,-1], [1,1] ], // 0111, east north south   edge case
  [west], // 1000, west
  [[-1,-1]], //west north
  [[-1,1]], // 1010, west south
  [[-1,-1], [-1,1]], // 1011, west, southh north
  [west, east], // 1100, west east
  [north,east,west], // 1101 west east north      This also works for this index [[-1,-1], [1,-1]]l. I liked the aesthetic for this one more.
  [[-1,1], [1,1]], // 1110 west east south
  [[-1,1], [1,1]], // 1111, west east south north
];


