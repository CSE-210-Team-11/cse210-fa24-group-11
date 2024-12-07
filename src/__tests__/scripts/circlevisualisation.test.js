import { renderProgressCircles } from "../../scripts/circlevisualisation.js";

describe("circleVisualisation", () => {
	let svgElement;

	beforeEach(() => {
		svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svgElement.classList.add("progress-rings");
		document.body.appendChild(svgElement);
	});

	afterEach(() => {
		document.body.removeChild(svgElement);
	});

	describe("renderProgressCircles", () => {
		it("should create SVG elements", () => {
			const subtasks = [{ id: 1 }];
			renderProgressCircles(subtasks);
			expect(svgElement.children.length).toBeGreaterThan(0);
		});

		it("should create correct number of circles", () => {
			const subtasks = [{ id: 1 }, { id: 2 }];
			renderProgressCircles(subtasks);
			expect(svgElement.querySelectorAll("circle").length).toBe(4); // 2 circles per subtask
		});

		it("should clear previous circles before rendering", () => {
			renderProgressCircles([{ id: 1 }]);
			renderProgressCircles([{ id: 1 }]);
			expect(svgElement.querySelectorAll("circle").length).toBe(2);
		});
	});
});
