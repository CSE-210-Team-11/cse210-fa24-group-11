// Mock the circlevisualisation module
jest.mock("../../scripts/circlevisualisation.js", () => ({
	renderProgressCircles: jest.fn(),
}));

// Mock the tree.js module
jest.mock("../../scripts/components/tree/tree.js", () => ({
	update: jest.fn()
}));

import { renderProgressCircles } from "../../scripts/circlevisualisation.js";
import { update } from "../../scripts/components/tree/tree.js";
import {
	initializeTaskFlow,
	saveSubtaskProgress,
	updateTaskStatus,
	updateDisplays,
	attachCheckboxListeners,
} from "../../scripts/taskflow.js";

describe("TaskFlow", () => {
	// Setup mock DOM elements and localStorage before each test
	beforeEach(() => {
		// Clear mock calls
		renderProgressCircles.mockClear();

		// Clear localStorage
		localStorage.clear();

		document.body.innerHTML = `
            <div id="taskFlow"></div>
        `;

		// Mock fetch response
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () =>
					Promise.resolve({
						name: "Test Track",
						modules: [
							{
								id: 1,
								name: "Test Module",
								tasks: [
									{
										name: "Test Task",
										subtasks: ["Subtask 1", "Subtask 2"],
									},
								],
							},
						],
					}),
			}),
		);
	});

	// Clean up after each test
	afterEach(() => {
		jest.clearAllMocks();
		document.body.innerHTML = "";
		localStorage.clear();
	});

	describe("initializeTaskFlow", () => {
		it("should fetch and render task data with localStorage state", async () => {
			// Set up initial localStorage state
			const initialProgress = [
				{
					name: "Test Track",
					modules: [
						{
							id: 1,
							tasks: [
								{
									subtasks: [true, false],
								},
							],
						},
					],
				},
			];
			localStorage.setItem("projects", JSON.stringify(initialProgress));

			initializeTaskFlow();
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(fetch).toHaveBeenCalledWith("../data/tracks/beginfront.json");
		});

		it("should handle fetch errors gracefully", async () => {
			const consoleErrorSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});
			global.fetch = jest.fn(() => Promise.reject("API Error"));

			await initializeTaskFlow();
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(consoleErrorSpy).toHaveBeenCalled();
			expect(document.getElementById("taskFlow").innerHTML).toContain(
				"Error loading data",
			);

			consoleErrorSpy.mockRestore();
		});
	});

	describe("saveSubtaskProgress", () => {
		it("should save subtask progress to localStorage", () => {
			saveSubtaskProgress("Test Track", 1, 0, 0, 0, true);

			const stored = JSON.parse(localStorage.getItem("projects"));
			expect(stored).toHaveLength(1);
			expect(stored[0].modules[0].tasks[0].subtasks[0]).toBe(true);
		});

		it("should update existing progress in localStorage", () => {
			// Set initial state
			saveSubtaskProgress("Test Track", 1, 0, 0, 0, true);

			// Update state
			saveSubtaskProgress("Test Track", 1, 0, 0, 0, false);

			const stored = JSON.parse(localStorage.getItem("projects"));
			expect(stored[0].modules[0].tasks[0].subtasks[0]).toBe(false);
		});
	});

	describe("updateDisplays", () => {
		it("should handle empty or invalid project data gracefully", () => {
			const consoleSpy = jest.spyOn(console, "log");
			
			// Set up localStorage with invalid project data
			localStorage.setItem("projects", JSON.stringify([
				{
					name: "Test Track",
					modules: [] // Empty modules array
				}
			]));

			// Call updateDisplays (we need to export it first)
			updateDisplays("Test Track");

			expect(consoleSpy).toHaveBeenCalledWith("Modules·length:·0");
			consoleSpy.mockRestore();
		});

		it("should calculate and update completion percentage correctly", () => {
			// Mock the tree update function
			jest.mock("../../scripts/components/tree/tree.js", () => ({
				update: jest.fn()
			}));

			// Set up localStorage with some completed and incomplete subtasks
			localStorage.setItem("projects", JSON.stringify([
				{
					name: "Test Track",
					modules: [{
						id: 1,
						tasks: [{
							subtasks: [true, false, true] // 2/3 completed
						}]
					}]
				}
			]));

			const consoleSpy = jest.spyOn(console, "log");
			updateDisplays("Test Track");

			expect(consoleSpy).toHaveBeenCalledWith("Completion:  0.6666666666666666");
			consoleSpy.mockRestore();
		});
	});

	describe("attachCheckboxListeners", () => {
		it("should attach event listeners to checkboxes and handle changes", () => {
			// Set up DOM with a checkbox
			document.body.innerHTML = `
				<input 
					type="checkbox" 
					class="subtask-checkbox" 
					data-project="Test Track"
					data-module-id="1"
					data-module-index="0"
					data-task-index="0"
					data-subtask-index="0"
				/>
			`;

			// Call the function (we need to export it first)
			attachCheckboxListeners();

			// Simulate checkbox change
			const checkbox = document.querySelector(".subtask-checkbox");
			checkbox.checked = true;
			checkbox.dispatchEvent(new Event("change"));

			// Verify localStorage was updated
			const stored = JSON.parse(localStorage.getItem("projects"));
			expect(stored[0].modules[0].tasks[0].subtasks[0]).toBe(true);
		});
	});
});
