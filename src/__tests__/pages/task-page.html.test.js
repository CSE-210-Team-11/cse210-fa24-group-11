import fs from "node:fs";
import path from "node:path";

describe("Task Page", () => {
	beforeEach(() => {
		const html = fs.readFileSync(
			path.resolve(__dirname, "../../pages/task-page.html"),
			"utf8",
		);
		document.documentElement.innerHTML = html;
	});

	describe("Page Structure", () => {
		test("should have correct title", () => {
			expect(document.title).toBe("Learning Path Tasks");
		});

		test("should have required stylesheet linked", () => {
			const stylesheet = document.querySelector('link[rel="stylesheet"]');
			expect(stylesheet).toBeTruthy();
		});

		test("should have main container div", () => {
			const container = document.querySelector(".container");
			expect(container).toBeTruthy();
		});

		test("should have flowchart section", () => {
			const flowchart = document.querySelector("#taskFlow");
			expect(flowchart).toBeTruthy();
		});

		test("should have progress view section", () => {
			const progressView = document.querySelector("#progressView");
			expect(progressView).toBeTruthy();
		});
	});

	describe("Visualization Elements", () => {
		test("should have SVG element for progress rings", () => {
			const svg = document.querySelector(".progress-rings");
			expect(svg).toBeTruthy();
		});

		test("should have canvas element for tree visualization", () => {
			const canvas = document.querySelector("#treeCanvas");
			expect(canvas).toBeTruthy();
		});
	});

	describe("Required Scripts", () => {
		test("should load all required scripts", () => {
			const scripts = document.querySelectorAll('script[type="module"]');
			expect(scripts.length).toBe(2);
		});
	});
});
