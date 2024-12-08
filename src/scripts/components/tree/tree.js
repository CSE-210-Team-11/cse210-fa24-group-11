import Two from "../../../../node_modules/two.js/build/two.module.js";
import { randFloat, randInt, reseed } from "../../../utils/seededRandom.js";

const canvas = document.getElementById("treeCanvas");

// Make an instance of Two and place it on the page.
const two = new Two({
	type: Two.Types.canvas,
	domElement: canvas,
	autostart: true,
});

const angMin = 0.3;
const angMax = 0.8;
const lengMin = 0.7;
const lengMax = 0.8;
const widthMin = 0.7;
const widthMax = 0.8;
const maxDepth = 6;
const trunkMin = two.width / 20;
const trunkMax = trunkMin + 10;
// const maxBranches = 300;
const leafRadius = 6; // Much larger leaf size
const leafVariation = 0.3; // Adds some size variation to leaves

const lenTwig = 9;
const widthTwig = 5;

const treeSeed = ((Math.random() * 10000) | 0).toString();
let branchCount = 0;
let leafCount = 0;
let growthFrac = 0;

/**
 * Renders a circular leaf on the tree
 * @param {number} x - The x position of the leaf
 * @param {number} y - The y position of the leaf
 * @param {number} dir - The initial direction of the rotation
 * @param {number} size - The size of the leaf
 * @param {number} rotation - The radian value of rotation to add
 */
export function renderLeaf(x, y, dir, size, rotation) {
	const leaf = two.makeCircle(x, y, size);
	leaf.fill = "green";
	leaf.noStroke();
	leaf.rotation = dir + Math.PI / 2 + rotation; // Add slight random rotation
	leafCount++;
	return leaf;
}

/**
 * Draws the tree on the canvas
 * @param {string} seed - The seed for the random function
 */
export function drawTree(seed) {
	branchCount = 0;
	reseed(seed);
	const maxTrunk = randInt(trunkMin, trunkMax);
	const square = two.makeRectangle(
		two.width / 2,
		two.height / 2,
		two.width,
		two.height,
	);
	makeBranches(
		two.width / 2,
		two.height,
		-Math.PI / 2,
		two.height / (maxDepth - 1),
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

	// Limit bounds of treeGrowVal to 0.1 and 1, square the result
	const treeGrowVal =
		Math.log10(growthFrac) + 1 > 0 ? Math.log10(growthFrac) + 1 : 0;

	const endX = x + Math.cos(dir) * leng * treeGrowVal;
	const endY = y + Math.sin(dir) * leng * treeGrowVal;

	const lengFactor = depth < 1 ? 1 : randFloat(lengMin, lengMax);
	const widthFactor = randFloat(widthMin, widthMax) * growthFrac ** 2;

	if (width > 1.0) renderBranch(x, y, endX, endY, width * widthFactor);

	if (depth < maxDepth) {
		makeBranches(
			endX,
			endY,
			dir + randFloat(angMin, angMax),
			leng * lengFactor,
			width * widthFactor,
			depth + 1,
		);

		makeBranches(
			endX,
			endY,
			dir - randFloat(angMin, angMax),
			leng * lengFactor,
			width * widthFactor,
			depth + 1,
		);

		if (randInt()) {
			makeBranches(
				endX,
				endY,
				dir,
				leng * lengFactor,
				width * widthFactor,
				depth + 1,
			);
		}
	}

	// Rand calls must be outside render call, since they must happen in every iteration whether or not we render
	const size = leafRadius * (1 + randFloat(-leafVariation, leafVariation));
	const rotation = randFloat(-1, 1);
	if (depth > maxDepth - 3 && growthFrac >= 1) {
		renderLeaf(endX, endY, dir, size, rotation);
	}
}

// Don’t forget to tell two to draw everything to the screen
// two.bind("update", update);
// two.play();

export function update(completion) {
	growthFrac = completion;
	two.clear();
	drawTree(treeSeed);
	two.update();
}

// Optional: Uncomment if you want to use this function
// function moveLeaves() {
//     for (leaf in leaves) {
//     }
// }

// canvas.addEventListener("click", () => {
// 	console.log("click!");
// 	console.log("branchCount: ", branchCount);
// 	treeSeed = ((Math.random() * 10000) | 0).toString();
// 	// if (growthFrac < 1) {
// 	// 	growthFrac += 0.01;
// 	// }
// 	growthFrac = 1;
// 	console.log(growthFrac)
// 	console.log("seed: ", treeSeed);
// });

// Export branchCount to access it in tests
export { branchCount, leafCount, two, maxDepth, canvas, growthFrac };
