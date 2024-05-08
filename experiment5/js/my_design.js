/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


function getInspirations() {
  return [
    {
      name: "The Bigweld Ball", 
      assetUrl: "./img/bigweldHigherResBigger.jpg",
      shape: "circle"
    },
    {
      name: "JJK Spoiler", 
      assetUrl: "./img/exp05inspo3.jpg",
      shape: "line"
    },
    {
      name: "Cube", 
      assetUrl: "./img/cube.png",
      shape: "triangle"
    },
    {
      name: "Naruto",
      assetUrl: "./img/naruto.png",
      shape: "line"
    },
    {
      name: "Phineas",
      assetUrl: "./img/phineas.jpg",
      shape: "triangle"
    },
  ];
}

function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 8, inspiration.image.height / 8);
  
  let design = {
    bg: 128,
    fg: []
  }

  switch (inspiration.shape) {
    case "square":
      for(let i = 0; i < 100; i++) {
        design.fg.push({x: random(width),
                        y: random(height),
                        w: random(width/2),
                        h: random(height/2),
                        fill: random(255)})
      }
    case "triangle":
      let sideLength = width/4

      for(let i = 0; i < 500; i++) {
        // Random position for the center of the triangle
        let centerX = random(width);
        let centerY = random(height);

        // Random rotation angle in radians
        let rotation = random(TWO_PI);

        // Calculate vertices of equilateral triangle
        let x1 = centerX;
        let y1 = centerY - sqrt(3) * sideLength / 3;
        let x2 = centerX - sideLength / 2;
        let y2 = centerY + sqrt(3) * sideLength / 6;
        let x3 = centerX + sideLength / 2;
        let y3 = centerY + sqrt(3) * sideLength / 6;

        // Store triangle data
        design.fg.push({
          centerX: centerX,
          centerY: centerY,
          rotation: rotation,
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          x3: x3,
          y3: y3,
          color: color(random(255), random(255), random(255))
        });
      }
      break
    case "line":
      for(let i = 0; i < 1500; i++) {
        let x = random(width)
        let y = random(height)
        
        design.fg.push({x: x,
                        y: y,
                        width: random(width/2),
                        thickness: random(-3,3),
                        color: random(255)})
      }
      break;
    case "circle":
      for(let i = 0; i < 300; i++) {
        design.fg.push({x: random(width),
                        y: random(height),
                        d: random(-1, 1),
                        fill: random(255)})
      }
      break
    default:
      break
  }
  
  return design;
}

function renderDesign(design, inspiration) {
  
  background(design.bg);
  noStroke();

  switch (inspiration.shape) {
    case "square":
      for(let box of design.fg) {
        fill(box.fill, 128);
        rect(box.x, box.y, box.w, box.h);
      }
    case "triangle":
      for (let tri of design.fg) {
        fill(tri.color, 128)
        triangle(tri.x1, tri.y1, tri.x2, tri.y2, tri.x3, tri.y3)
      }
      break
    case "line":
      for (let line of design.fg) {
        //stroke(line.color);
        fill(line.color,128)
        rect(line.x,line.y,line.width,  line.thickness);
      }
      break
    case "circle":
      for(let circle of design.fg) {
        fill(circle.fill, 128);
        ellipse(circle.x, circle.y, circle.d, circle.d);
      }
      break
    default:
      break
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);

  switch (inspiration.shape) {
    case "square":
      for(let box of design.fg) {
        box.fill = mut(box.fill, 0, 255, rate);
        box.x = mut(box.x, 0, width, rate);
        box.y = mut(box.y, 0, height, rate);
        box.w = mut(box.w, 0, width/2, rate);
        box.h = mut(box.h, 0, height/2, rate);
      }
    case "triangle":
      for (let tri of design.fg) {
        // Mutate center x and center y
        tri.centerX = triangleMut(tri.centerX, 0, width, rate);
        tri.centerY = triangleMut(tri.centerY, 0, height, rate);

        // Calculate vertices of equilateral triangle based on mutated center
        let sideLength = width / 4
        let offset = sqrt(3) * sideLength / 6;

        tri.x1 = tri.centerX;
        tri.y1 = tri.centerY - offset;
        tri.x2 = tri.centerX - sideLength / 2;
        tri.y2 = tri.centerY + offset / 2;
        tri.x3 = tri.centerX + sideLength / 2;
        tri.y3 = tri.centerY + offset / 2;

        // Mutate rotation
        tri.rotation = triangleMut(tri.rotation, 0, TWO_PI, rate);

        // Calculate rotated vertices of equilateral triangle based on mutated rotation
        let rotatedX1 = tri.centerX + cos(tri.rotation) * (tri.x1 - tri.centerX) - sin(tri.rotation) * (tri.y1 - tri.centerY);
        let rotatedY1 = tri.centerY + sin(tri.rotation) * (tri.x1 - tri.centerX) + cos(tri.rotation) * (tri.y1 - tri.centerY);
        let rotatedX2 = tri.centerX + cos(tri.rotation) * (tri.x2 - tri.centerX) - sin(tri.rotation) * (tri.y2 - tri.centerY);
        let rotatedY2 = tri.centerY + sin(tri.rotation) * (tri.x2 - tri.centerX) + cos(tri.rotation) * (tri.y2 - tri.centerY);
        let rotatedX3 = tri.centerX + cos(tri.rotation) * (tri.x3 - tri.centerX) - sin(tri.rotation) * (tri.y3 - tri.centerY);
        let rotatedY3 = tri.centerY + sin(tri.rotation) * (tri.x3 - tri.centerX) + cos(tri.rotation) * (tri.y3 - tri.centerY);

        // Update vertices
        tri.x1 = rotatedX1;
        tri.y1 = rotatedY1;
        tri.x2 = rotatedX2;
        tri.y2 = rotatedY2;
        tri.x3 = rotatedX3;
        tri.y3 = rotatedY3;

        // Mutate color
        tri.color = triangleMut(tri.color, 0, 255, rate);
      }
      break
    case "line":
      for (let line of design.fg) {
        line.color = mut(line.color, 0, 255, rate)
        line.x = mut(line.x, 0,width , rate)
        line.y = mut(line.y, 0,height , rate)
        line.width = mut(line.width, 0,width/2 , rate)
      }
    case "circle":
      for(let circle of design.fg) {
        circle.fill = mut(circle.fill, 0, 255, rate);
        circle.x = mut(circle.x, 0, width, rate);
        circle.y = mut(circle.y, 0, height, rate);
        circle.d = mut(circle.d, 0, width, rate);
      }
    default:
      break
  }
}

function triangleMut(num, min, max, rate) {
  let mutationRange = rate * (max - min); // Calculate mutation range based on the allowed range and the mutation rate
  let mutatedNum = num + randomGaussian(0, mutationRange / 10); // Add a Gaussian-distributed mutation to the current value
  return constrain(mutatedNum, min, max); // Constrain the mutated value within the allowed range
}

function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}