import getSeededRandom from './seededRandom.js';

// Make an instance of two and place it on the page.
const params = {
    fullscreen: true,
    autostart: true
};
let elem = document.body;
let two = new Two(params).appendTo(elem);

let rand = getSeededRandom('acba');
const randSI = (min = 0, max = 1) => Math.floor(rand() * (max - min + 1)) + min;
const randS = (min = 0, max = 1) => rand() * (max - min) + min;

const leafTexture = two.makeTexture("./tree/leaf.png");

const angMin = 0.01;
const angMax = 0.7;
const lengMin = 0.7;
const lengMax = 0.8;
const widthMin = 0.6;
const widthMax = 0.8;
const trunkMin = two.width / 40;
const trunkMax = trunkMin + 20;
const maxBranches = 300;
const leafSize = 0.1; // Much larger leaf size
const leafVariation = 0.3; // Adds some size variation to leaves

const lenTwig = 9;
const widthTwig = 5;

const windX = -1;
const windY = 0;
const bendability = 1;
const windStrength = 0.01 * bendability * ((200 ** 2) / (two.height ** 2));
const windBendRectSpeed = 0.01;
const windBranchSpring = 0.98;
const gustProbability = 1/100;

let windCycle = 0;
let windCycleGust = 0;
let windCycleGustTime = 0;
let currentWind = 0;
let windFollow = 0;
let windActual = 0;
let treeSeed = Math.random() * 10000 | 0;
let branchCount = 0;
let maxTrunk = 0;
let treeGrow = 0.1;
let done = 0;
const leaves = two.makeGroup();
const branches = two.makeGroup();

function makeLeaf(x, y, dir, size) {
    const actualSize = size * (1 + randS(-leafVariation, leafVariation));
    // let leaf = new Two.Sprite(leafTexture, x, y, 0, 0, 60);
    let leaf = two.makeSprite(leafTexture, x, y, 0, 0, 60);
    leaves.add(leaf);
    leaf.rotation = (dir + Math.PI / 2 + randS(-1, 1)); // Add slight random rotation
    leaf.scale = actualSize / 20;
}

function drawTree(seed) {
    branchCount = 0;
    treeGrow += 0.02;
    rand = getSeededRandom(seed.toString());
    maxTrunk = randSI(trunkMin, trunkMax);
    if (done) {
        
    }
    makeBranches(two.width / 2, two.height, -Math.PI / 2, two.height / 4, maxTrunk);
}


function makeBranches(x, y, dir, leng, width) {
    branchCount++;
    const treeGrowVal = (treeGrow > 1 ? 1 : treeGrow < 0.1 ? 0.1 : treeGrow) ** 2;
    
    // const xx = Math.cos(dir) * leng * treeGrowVal;
    // const yy = Math.sin(dir) * leng * treeGrowVal;
    // const windSideWayForce = windX * yy - windY * xx;
    
    // dir += (windStrength * windActual) * ((1 - width / maxTrunk) ** bendability) * windSideWayForce;
    
    const endX = x + Math.cos(dir) * leng * treeGrowVal;
    const endY = y + Math.sin(dir) * leng * treeGrowVal;
    var branch = two.Line(x, y, endX, endY)
    branch.linewidth = width;
    branch.fill = 'brown';
    branch.stroke = '#4B3621';
    branches.add(branch);

    // Draw leaves on thinner branches
    // if (width < 5) { // Increased threshold for more leaves
    //     makeLeaves(endX, endY, dir, leafSize);
    // }
    
    if (branchCount < maxBranches && leng > lenTwig && width > widthTwig) {
        const rDir = randSI() ? -1 : 1;
        treeGrow -= 0.2;
        
        makeBranches(
            endX, endY,
            dir + randS(angMin, angMax) * rDir,
            leng * randS(lengMin, lengMax),
            width * randS(widthMin, widthMax)
        );
        
        makeBranches(
            endX, endY,
            dir + randS(angMin, angMax) * -rDir,
            leng * randS(lengMin, lengMax),
            width * randS(widthMin, widthMax)
        );

        if (randSI()) {
            makeBranches(
                endX, endY,
                dir,
                leng * randS(lengMin, lengMax),
                width * randS(widthMin, widthMax)
            );
        }
        
        treeGrow += 0.2;
    }
}

function updateWind() {
    if (Math.random() < gustProbability) {
        windCycleGustTime = (Math.random() * 10 + 1) | 0;
    }
    if (windCycleGustTime > 0) {
        windCycleGustTime--;
        windCycleGust += windCycleGustTime/20;
    } else {
        windCycleGust *= 0.99;
    }        
    windCycle += windCycleGust;
    currentWind = (Math.sin(windCycle/40) * 0.6 + 0.4) ** 2;
    currentWind = currentWind < 0 ? 0 : currentWind;
    windFollow += (currentWind - windActual) * windBendRectSpeed;
    windFollow *= windBranchSpring;
    windActual += windFollow;
}

// Don’t forget to tell two to draw everything to the screen
// two.bind('update', update)
// two.play();
//
// function update() {
//     two.clear();
//     updateWind();
//     drawTree(treeSeed);
// }
// drawTree(treeSeed);

function drawLeaves() {
    for (let i = 0; i < 200; i++) {
        let x = randSI(0, two.width);
        let y = randSI(0, two.height);
        let dir = randS(0, Math.PI*2);
        makeLeaf(x, y, dir, leafSize);
    }
}

drawLeaves();
// setTimeout(function() { debugger; }, 5000)

// function renderLeaves() {
//     for (leaf in leaves.Children) {
        
//     }

// }

// window.addEventListener("click", () => {
//     console.log('click!');
//     console.log("branchCount: ", branchCount)
//     console.log(randSI())
//     treeSeed = Math.random() * 10000 | 0;
//     treeGrow = 2;
//     console.log("new seed: ", treeSeed);
//     console.log("num branches group: ", branches.children.length)
// });
