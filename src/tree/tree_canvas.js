const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.height = 600;
canvas.width = 1000;

const leaf_image = new Image();
leaf_image.src = "tree/leaf.svg";

canvas.addEventListener("click", () => {
	treeSeed = (Math.random() * 10000) | 0;
	treeGrow = 0.1;
});

/* Seeded random functions
   randSeed(int)  int is a seed value
   randSI()  random integer 0 or 1
   randSI(max) random integer from  0 <= random < max
   randSI(min, max) random integer from min <= random < max
   randS()  like Math.random
   randS(max) random float 0 <= random < max
   randS(min, max) random float min <= random < max
   */
const seededRandom = (() => {
	let seed = 1;
	return {
		max: 2576436549074795,
		reseed(s) {
			seed = s;
		},
		random() {
			return (seed = (8765432352450986 * seed + 8507698654323524) % this.max);
		},
	};
})();
const randSeed = (seed) => seededRandom.reseed(seed | 0);
const randSI = (min = 2, max = min + (min = 0)) =>
	(seededRandom.random() % (max - min)) + min;
const randS = (min = 1, max = min + (min = 0)) =>
	(seededRandom.random() / seededRandom.max) * (max - min) + min;

const angMin = 0.01;
const angMax = 0.6;
const lengMin = 0.8;
const lengMax = 0.9;
const widthMin = 0.6;
const widthMax = 0.8;
const trunkMin = 8;
const trunkMax = 10;
const maxBranches = 200;
const leafSize = 20; // Much larger leaf size
const leafVariation = 0.3; // Adds some size variation to leaves

const windX = -1;
const windY = 0;
const bendability = 8;
const windStrength = 0.01 * bendability * (200 ** 2 / canvas.height ** 2);
const windBendRectSpeed = 0.01;
const windBranchSpring = 0.98;
const gustProbability = 1 / 100;

let windCycle = 0;
let windCycleGust = 0;
let windCycleGustTime = 0;
let currentWind = 0;
let windFollow = 0;
let windActual = 0;
let treeSeed = (Math.random() * 10000) | 0;
let branchCount = 0;
let maxTrunk = 0;
let treeGrow = 0.01;

function drawLeaf(x, y, dir, size) {
	const actualSize = size * (1 + randS(-leafVariation, leafVariation));
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(dir + Math.PI / 2 + randS(-1, 1)); // Add slight random rotation
	ctx.scale(actualSize / 20, actualSize / 20);
	ctx.drawImage(leaf_image, -15, -20, 30, 40);
	ctx.restore();
}

function drawTree(seed) {
	branchCount = 0;
	treeGrow += 0.02;
	randSeed(seed);
	maxTrunk = randSI(trunkMin, trunkMax);
	drawBranch(
		canvas.width / 2,
		canvas.height,
		-Math.PI / 2,
		canvas.height / 5,
		maxTrunk,
	);
}

function drawBranch(x, y, dir, leng, width) {
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

	ctx.strokeStyle = "#4B3621";
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(x, y);
	const endX = x + Math.cos(dir) * leng * treeGrowVal;
	const endY = y + Math.sin(dir) * leng * treeGrowVal;
	ctx.lineTo(endX, endY);
	ctx.stroke();

	// Draw leaves on thinner branches
	if (width < 3) {
		// Increased threshold for more leaves
		drawLeaf(endX, endY, dir, leafSize);
	}

	if (branchCount < maxBranches && leng > 5 && width > 1) {
		const rDir = randSI() ? -1 : 1;
		treeGrow -= 0.2;

		drawBranch(
			endX,
			endY,
			dir + randS(angMin, angMax) * rDir,
			leng * randS(lengMin, lengMax),
			width * randS(widthMin, widthMax),
		);

		drawBranch(
			endX,
			endY,
			dir + randS(angMin, angMax) * -rDir,
			leng * randS(lengMin, lengMax),
			width * randS(widthMin, widthMax),
		);

		treeGrow += 0.2;
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

function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	updateWind();
	drawTree(treeSeed);
	requestAnimationFrame(update);
}

leaf_image.onload = () => {
	requestAnimationFrame(update);
};
