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
const trunkMinWidth = two.width / 20;
const trunkMaxWidth = trunkMinWidth + 10;
const trunkLength = two.height / (maxDepth - 1.4);
// const maxBranches = 300;
const leafRadius = 6; // Much larger leaf size
const leafVariation = 0.3; // Adds some size variation to leaves

const dayStart = 6;
const nightStart = 20;

const treeSeed = ((Math.random() * 10000) | 0).toString();
let branchCount = 0;
let leafCount = 0;
let growthFrac = 0;

const dayTexture = two.makeTexture("../scripts/components/tree/media/day.jpg");
const nightTexture = two.makeTexture("../scripts/components/tree/media/night.jpg");
const grassTexture = two.makeTexture("../scripts/components/tree/media/grass.png");
const grassNightTexture = two.makeTexture("../scripts/components/tree/media/grass_night.png");
const dayBranchColor = "#4b3621";
const nightBranchColor = "#5b4b32";

/**
 * Calculates whether it is day or night based on the current timestamp
 * @returns {string} - "day" or "night"
 */
export function getTimeOfDay() {
	const date = new Date();
	const hour = date.getHours();
	if (hour > dayStart && hour < nightStart) {
		return "day";
	}
	
	return "night";
}

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
	const maxTrunk = randInt(trunkMinWidth, trunkMaxWidth);
	const timeOfDay = getTimeOfDay();
	const background = two.makeSprite(
		(timeOfDay === "day") ? dayTexture : nightTexture,
		two.width / 2,
		two.height / 2,
	);
	background.scale = (timeOfDay === "day") ? 1 : 0.5;
	makeBranches(
		two.width / 2,
		two.height,
		-Math.PI / 2,
		trunkLength,
		maxTrunk,
		0,
	);
	const grass = two.makeSprite(timeOfDay === "day" ? grassTexture: grassNightTexture, two.width / 2, two.height - two.height / 4);
	grass.scale = 0.4;
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
	const timeOfDay = getTimeOfDay();
	branch.linewidth = width;
	branch.stroke = (timeOfDay === "day") ? dayBranchColor : nightBranchColor;
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

	// The adjusted tree growth curve. Linear, with values tuned for tree appearance.
	const treeGrowVal = 0.5 * growthFrac + 0.5;

	const endX = x + Math.cos(dir) * leng * treeGrowVal;
	const endY = y + Math.sin(dir) * leng * treeGrowVal;

	const lengFactor = depth < 1 ? 1 : randFloat(lengMin, lengMax);
	const widthFactor = randFloat(widthMin, widthMax) * treeGrowVal;

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

/**
 * Updates the tree display
 * @param {number} completion - A number between 0 and 1 representing the completion percentage
 */
export function update(completion) {
	growthFrac = completion;
	two.clear();
	drawTree(treeSeed);
	two.update();
}

// Export branchCount to access it in tests
export { branchCount, leafCount, two, maxDepth, canvas, growthFrac, dayBranchColor, nightBranchColor };
