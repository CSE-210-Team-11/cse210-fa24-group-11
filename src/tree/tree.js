import Two from "../../node_modules/two.js/build/two.module.js";
import { randFloat, randInt, reseed } from "../utils/seededRandom.js";

// Make an instance of Two and place it on the page.
const two = new Two({
	type: Two.Types.canvas,
	fullscreen: true,
	autostart: true,
}).appendTo(document.body);

// const leafTexture = two.makeTexture("./tree/leaf.png");

const angMin = 0.3;
const angMax = 0.8;
const lengMin = 0.6;
const lengMax = 0.7;
const widthMin = 0.6;
const widthMax = 0.8;
const maxDepth = 6;
const trunkMin = two.width / 50;
const trunkMax = trunkMin + 20;
// const maxBranches = 300;
const leafSize = 6; // Much larger leaf size
const leafVariation = 0.3; // Adds some size variation to leaves

const lenTwig = 9;
const widthTwig = 5;

let treeSeed = ((Math.random() * 10000) | 0).toString();
let branchCount = 0;
let leafCount = 0;
let maxTrunk = 0;
let treeGrow = 0.1;
// const done = 0;
// const leaves = two.makeGroup();
// const branches = two.makeGroup();

// const baseLeaf = two.makeSprite(leafTexture, 0, 0);

export function makeLeaf(x, y, dir, size) {
	const actualSize = size * (1 + randFloat(-leafVariation, leafVariation));
	const leaf = two.makeCircle(x, y, actualSize);
	leaf.fill = "green";
	leaf.noStroke();
	leaf.rotation = dir + Math.PI / 2 + randFloat(-1, 1); // Add slight random rotation
	leafCount++;
	return leaf;
}

/**
 * Draws the tree on the canvas
 * @param {string} seed - The seed for the random function
 */
export function drawTree(seed) {
	branchCount = 0;
	treeGrow += 0.02;
	reseed(seed);
	maxTrunk = randInt(trunkMin, trunkMax);

	makeBranches(
		two.width / 2,
		two.height,
		-Math.PI / 2,
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
export function renderBranch(x, y, endX, endY, width) {
	const branch = two.makeLine(x, y, endX, endY);
	branch.linewidth = width;
	branch.fill = "brown";
	branch.stroke = "#4B3621";
	return branch;
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
export function makeBranches(x, y, dir, leng, width, depth) {
	branchCount++;

	const treeGrowVal = (treeGrow > 1 ? 1 : treeGrow < 0.1 ? 0.1 : treeGrow) ** 2;

	const endX = x + Math.cos(dir) * leng * treeGrowVal;
	const endY = y + Math.sin(dir) * leng * treeGrowVal;

	renderBranch(x, y, endX, endY, width);

	const lengFactor = depth < 2 ? 1 : randFloat(lengMin, lengMax);

	if (depth < maxDepth) {
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

	if (depth > maxDepth - 3) {
		makeLeaf(endX, endY, dir, leafSize);
	}
}

// Don’t forget to tell two to draw everything to the screen
two.bind("update", update);
two.play();

export function update() {
	two.clear();
	drawTree(treeSeed);
}

// Optional: Uncomment if you want to use this function
// function moveLeaves() {
//     for (leaf in leaves) {
//     }
// }

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
});

// Export branchCount to access it in tests
export { branchCount, leafCount, two, maxDepth };
