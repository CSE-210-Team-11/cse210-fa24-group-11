import { jest } from "@jest/globals";
import * as treeModule from "../../../scripts/components/tree/tree.js";

// Mock seededRandom.js
jest.mock("../../../utils/seededRandom.js", () => ({
	randInt: jest.fn((min, max) => {
		if (typeof max === "undefined") return min || 0;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}),
	randFloat: jest.fn((min, max) => {
		if (typeof max === "undefined") return min || 0;
		return Math.random() * (max - min) + min;
	}),
	reseed: jest.fn(),
}));

// Setup DOM environment
document.body.innerHTML =
	'<div id="draw-shapes"><canvas id="treeCanvas" width="500" height="500"></canvas></div>';

// Initialize Two.js dimensions
beforeAll(() => {
	treeModule.two.width = 800;
	treeModule.two.height = 600;
});

describe("Leaf Generation", () => {
	beforeEach(() => {
		// Reset the module and clear mocks before each test
		jest.resetModules();
		jest.clearAllMocks(); // Clear any previous mocks
		treeModule.leafCount = 0;
		treeModule.two.clear();
	});

	test("should be no leaves at the beginning", () => {
		expect(treeModule.leafCount).toBe(0);
	});

	test("renderLeaf creates leaf with correct properties", () => {
		const leaf = treeModule.renderLeaf(100, 100, Math.PI / 2, 0.1, 0);

		expect(leaf.fill).toBe("green");
		expect(typeof leaf.rotation).toBe("number");
		expect(treeModule.leafCount).toBe(1);
	});

	test("call makeLeaf several times to create more leaves", () => {
		const leaf = treeModule.renderLeaf(100, 100, Math.PI / 2, 0.1);
		treeModule.renderLeaf(100, 100, Math.PI / 2, 0.1);
		treeModule.renderLeaf(100, 100, Math.PI / 2, 0.1);
		treeModule.renderLeaf(100, 100, Math.PI / 2, 0.1);

		expect(leaf.fill).toBe("green");
		expect(typeof leaf.rotation).toBe("number");
		expect(treeModule.leafCount).toBe(5);
	});
});

describe("Branch Rendering", () => {
	beforeEach(() => {
		jest.resetModules();
		jest.clearAllMocks();
		treeModule.branchCount = 0;
		treeModule.two.clear();
	});

	test("renderBranch creates branch with correct properties width=10", () => {
		const branch = treeModule.renderBranch(100, 100, 200, 200, 10);

		expect(branch.linewidth).toBe(10);
		expect(branch.fill).toBe("brown");
		expect(branch.stroke).toBe("#4B3621");
	});

	test("renderBranch creates branch with correct properties width=30", () => {
		const branch = treeModule.renderBranch(100, 100, 200, 200, 30);

		expect(branch.linewidth).toBe(30);
		expect(branch.fill).toBe("brown");
		expect(branch.stroke).toBe("#4B3621");
	});
});

describe("Branch Generation", () => {
	beforeEach(() => {
		jest.resetModules();
		jest.clearAllMocks();
		treeModule.branchCount = 0;
		treeModule.leafCount = 0;
		treeModule.two.clear();
	});

	test("makeBranches creates a valid number of branches, depth=1", () => {
		const n = 1;
		treeModule.makeBranches(100, 100, Math.PI / 2, 30, n);

		const maxBranches = 3 ** (treeModule.maxDepth + 1);
		expect(treeModule.branchCount).toBeGreaterThan(0);
		expect(treeModule.branchCount).toBeLessThan(maxBranches);
		expect(treeModule.branchCount).toBeGreaterThan(treeModule.leafCount);
	});

	test("makeBranches creates a valid number of branches, depth=3", () => {
		const n = 3;
		treeModule.makeBranches(100, 100, Math.PI / 2, 30, n);

		const maxBranches = 3 ** (treeModule.maxDepth + 1);
		expect(treeModule.branchCount).toBeGreaterThan(0);
		expect(treeModule.branchCount).toBeLessThan(maxBranches);
		expect(treeModule.branchCount).toBeGreaterThan(treeModule.leafCount);
	});

	test("makeBranches creates a valid number of branches, depth=5", () => {
		const n = 5;
		treeModule.maxDepth = 10;
		treeModule.makeBranches(100, 100, Math.PI / 2, 30, n);

		const maxBranches = 3 ** (treeModule.maxDepth + 1) - 3 ** (n + 1);
		expect(treeModule.branchCount).toBeGreaterThan(0);
		expect(treeModule.branchCount).toBeLessThan(maxBranches);
		expect(treeModule.branchCount).toBeGreaterThan(treeModule.leafCount);
	});

	test("makeBranches creates a valid number of branches, depth=7", () => {
		const n = 7;
		treeModule.maxDepth = 8;
		treeModule.makeBranches(100, 100, Math.PI / 2, 30, n);

		const maxBranches = 3 ** (treeModule.maxDepth + 1) - 3 ** (n + 1);
		expect(treeModule.branchCount).toBeGreaterThan(0);
		expect(treeModule.branchCount).toBeLessThan(maxBranches);
		expect(treeModule.branchCount).toBeGreaterThan(treeModule.leafCount);
	});

	test("branch count increases with depth", () => {
		// Test with shallow depth
		treeModule.branchCount = 0;
		treeModule.makeBranches(100, 100, Math.PI / 2, 30, 10, 1);
		const shallowCount = treeModule.branchCount;

		// Test with deeper depth
		treeModule.branchCount = 0;
		treeModule.makeBranches(100, 100, Math.PI / 2, 30, 10, 3);
		const deeperCount = treeModule.branchCount;

		expect(deeperCount).toBeGreaterThan(shallowCount);
	});

	test("branch count never exceeds maximum possible branches", () => {
		// Maximum possible branches at any depth is 3^depth
		const depth = 4;
		const maxPossibleBranches = 3 ** (depth + 1);

		treeModule.makeBranches(100, 100, Math.PI / 2, 30, 10, depth);

		expect(treeModule.branchCount).toBeLessThanOrEqual(maxPossibleBranches);
		expect(treeModule.branchCount).toBeGreaterThan(0);
	});
});

describe("Draw Tree Tests", () => {
	beforeEach(() => {
		jest.resetModules();
		jest.clearAllMocks();
		treeModule.branchCount = 0;
		treeModule.leafCount = 0;
		treeModule.two.clear();
	});

	test("drawTree creates valid number of branches and leaves, maxDepth=4", () => {
		treeModule.maxDepth = 4;
		const seed = "test-seed-1";
		treeModule.drawTree(seed);

		// Check branch count is within valid range
		const maxPossibleBranches = 3 ** (treeModule.maxDepth + 1);
		expect(treeModule.branchCount).toBeGreaterThan(0);
		expect(treeModule.branchCount).toBeLessThan(maxPossibleBranches);
	});

	test("drawTree creates valid number of branches and leaves, maxDepth=5", () => {
		treeModule.maxDepth = 5;
		const seed = "test-seed-2";
		treeModule.drawTree(seed);

		// Check branch count is within valid range
		const maxPossibleBranches = 3 ** (treeModule.maxDepth + 1);
		expect(treeModule.branchCount).toBeGreaterThan(0);
		expect(treeModule.branchCount).toBeLessThan(maxPossibleBranches);
	});

	test("drawTree creates valid number of branches and leaves, maxDepth=6", () => {
		treeModule.maxDepth = 6;
		const seed = "test-seed-3";
		treeModule.drawTree(seed);

		// Check branch count is within valid range
		const maxPossibleBranches = 3 ** (treeModule.maxDepth + 1);
		expect(treeModule.branchCount).toBeGreaterThan(0);
		expect(treeModule.branchCount).toBeLessThan(maxPossibleBranches);
	});
});

describe("update Tests", () => {
	beforeEach(() => {
		jest.resetModules();
		jest.clearAllMocks();
		treeModule.branchCount = 0;
		treeModule.leafCount = 0;
	});

	test("update creates valid number of branches and leaves", () => {
		treeModule.maxDepth = 5;
		treeModule.update();

		// Check branch count is within valid range
		const maxPossibleBranches = 3 ** (treeModule.maxDepth + 1);
		expect(treeModule.branchCount).toBeGreaterThan(0);
		expect(treeModule.branchCount).toBeLessThan(maxPossibleBranches);
	});
});
