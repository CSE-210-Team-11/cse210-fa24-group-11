import { randFloat, randInt, reseed } from "./seededRandom.js";

// Make an instance of two and place it on the page.
const params = {
	type: Two.Types.canvas,
	fullscreen: true,
	autostart: true,
};
const elem = document.body;
const two = new Two(params).appendTo(elem);

const leafTexture = two.makeTexture("./tree/leaf.png");

const angMin = 0.3;
const angMax = 0.8;
const lengMin = 0.6;
const lengMax = 0.7;
const widthMin = 0.6;
const widthMax = 0.8;
const maxDepth = 6;
const trunkMin = two.width / 50;
const trunkMax = trunkMin + 20;
const maxBranches = 300;
const leafSize = 0.1; // Much larger leaf size
const leafVariation = 0.3; // Adds some size variation to leaves

const lenTwig = 9;
const widthTwig = 5;

const windX = -1;
const windY = 0;
const bendability = 1;
const windStrength = 0.01 * bendability * (200 ** 2 / two.height ** 2);
const windBendRectSpeed = 0.01;
const windBranchSpring = 0.98;
const gustProbability = 1 / 100;

let windCycle = 0;
let windCycleGust = 0;
let windCycleGustTime = 0;
let currentWind = 0;
let windFollow = 0;
let windActual = 0;
let treeSeed = ((Math.random() * 10000) | 0).toString();
let branchCount = 0;
let maxTrunk = 0;
let treeGrow = 0.1;
const done = 0;
const leaves = two.makeGroup();
const branches = two.makeGroup();

const baseLeaf = two.makeSprite(leafTexture, 0, 0);

function makeLeaf(x, y, dir, size) {
	const actualSize = size * (1 + randFloat(-leafVariation, leafVariation));
	// let leaf = new Two.Sprite(leafTexture, x, y);
	// let leaf = two.makeSprite(leafTexture, x, y);
	const leaf = two.makeCircle(x, y, 10);
	// leaves.add(leaf);
	leaf.fill = "green";
	leaf.noStroke();
	leaf.rotation = dir + Math.PI / 2 + randFloat(-1, 1); // Add slight random rotation
	// leaf.scale = actualSize / 20;
}

/**
 * Draws the tree on the canvas
 * @param {string} seed - The seed for the random function
 */
function drawTree(seed) {
	branchCount = 0;
	treeGrow += 0.02;
	reseed(seed);
	maxTrunk = randInt(trunkMin, trunkMax);

	makeBranches(
		two.width / 2,
		two.height,
		-Math.PI / 2,
		// adjust the length of the trunk according to max depth
		two.height / (maxDepth + 2),
		maxTrunk,
		0,
	);
}

/**
 * Renders one branch of the tree
 * @param {number} x - The x coordinate of the starting point
 * @param {number} y - The y coordinate of the starting point
 * @param {number} endX - The x coordinate of the ending point
 * @param {number} endY - The y coordinate of the ending point
 * @param {number} width - The width of the branch
 */
function renderBranch(x, y, endX, endY, width) {
	const branch = two.makeLine(x, y, endX, endY);
	branch.linewidth = width;
	branch.fill = "brown";
	branch.stroke = "#4B3621";
}

/**
 * Recursively generates branches of the tree
 * @param {number} x - The x coordinate of the starting point
 * @param {number} y - The y coordinate of the starting point
 * @param {number} dir - The direction of the branch
 * @param {number} leng - The length of the branch
 * @param {number} width - The width of the branch
 * @param {number} depth - The depth of the branch
 */
function makeBranches(x, y, dir, leng, width, depth) {
	branchCount++;

	const treeGrowVal = (treeGrow > 1 ? 1 : treeGrow < 0.1 ? 0.1 : treeGrow) ** 2;

	const xx = Math.cos(dir) * leng * treeGrowVal;
	const yy = Math.sin(dir) * leng * treeGrowVal;
	const windSideWayForce = windX * yy - windY * xx;

	dir +=
		windStrength *
		windActual *
		(1 - width / maxTrunk) ** bendability *
		windSideWayForce;

	const endX = x + Math.cos(dir) * leng * treeGrowVal;
	const endY = y + Math.sin(dir) * leng * treeGrowVal;

	renderBranch(x, y, endX, endY, width);

	const lengFactor = depth < 2 ? 1 : randFloat(lengMin, lengMax);

	// here we use depth instead of branchCount to make sure it is a balanced tree
	if (depth < maxDepth && leng > lenTwig && width > widthTwig) {
		const rDir = randInt() ? -1 : 1;
		treeGrow -= 0.2;

		makeBranches(
			endX,
			endY,
			dir + randFloat(angMin, angMax),
			leng * lengFactor,
			width * randFloat(widthMin, widthMax),
			depth + 1,
		);

		makeBranches(
			endX,
			endY,
			dir - randFloat(angMin, angMax),
			leng * lengFactor,
			width * randFloat(widthMin, widthMax),
			depth + 1,
		);

		if (randInt()) {
			makeBranches(
				endX,
				endY,
				dir,
				leng * lengFactor,
				width * randFloat(widthMin, widthMax),
				depth + 1,
			);
		}

		treeGrow += 0.2;
	}

	// Draw leaves on thinner branches
	if (depth > maxDepth - 3) {
		makeLeaf(endX, endY, dir, leafSize);
	}
}

function updateWind() {
	if (Math.random() < gustProbability) {
		windCycleGustTime = (Math.random() * 10 + 1) | 0;
	}
	if (windCycleGustTime > 0) {
		windCycleGustTime--;
		windCycleGust += windCycleGustTime / 20;
	} else {
		windCycleGust *= 0.99;
	}
	windCycle += windCycleGust;
	currentWind = (Math.sin(windCycle / 40) * 0.6 + 0.4) ** 2;
	currentWind = currentWind < 0 ? 0 : currentWind;
	windFollow += (currentWind - windActual) * windBendRectSpeed;
	windFollow *= windBranchSpring;
	windActual += windFollow;
}

// Don’t forget to tell two to draw everything to the screen
two.bind("update", update);
two.play();

function update() {
	two.clear();
	updateWind();
	drawTree(treeSeed);
}
// drawTree(treeSeed);

function scatterLeaves() {
	for (let i = 0; i < 200; i++) {
		const x = randInt(0, two.width);
		const y = randInt(0, two.height);
		const dir = randFloat(0, Math.PI * 2);
		makeLeaf(x, y, dir, leafSize);
	}
}

// function moveLeaves() {
//     for (leaf in leaves) {

//     }
// }

// scatterLeaves();
// two.update();

// setTimeout(function() { debugger; }, 5000)

window.addEventListener("click", () => {
	console.log("click!");
	console.log("branchCount: ", branchCount);
	console.log(randInt());
	console.log(randFloat());
	console.log(randFloat());
	console.log(randInt(2, 7));
	console.log(randFloat(2.5, 7.9));
	treeSeed = ((Math.random() * 10000) | 0).toString();
	treeGrow = 0.1;
	console.log("new seed: ", treeSeed);
	console.log("num branches group: ", branches.children.length);
});
