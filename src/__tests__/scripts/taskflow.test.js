// Mock the circlevisualisation module
jest.mock("../../scripts/circlevisualisation.js", () => ({
	renderProgressCircles: jest.fn(),
}));

import { renderProgressCircles } from "../../scripts/circlevisualisation.js";
import {
	initializeTaskFlow,
	saveSubtaskProgress,
	updateTaskStatus,
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

			await initializeTaskFlow();
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(fetch).toHaveBeenCalledWith("../data/tracks/beginfront.json");

			// Check if checkbox states match localStorage
			const checkboxes = document.querySelectorAll(".subtask-checkbox");
			expect(checkboxes[0].checked).toBe(true);
			expect(checkboxes[1].checked).toBe(false);
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

	describe("updateTaskStatus", () => {
		it("should show completion status when all subtasks are checked", async () => {
			await initializeTaskFlow();
			await new Promise((resolve) => setTimeout(resolve, 0));

			const checkboxes = document.querySelectorAll(".subtask-checkbox");
			for (const checkbox of checkboxes) {
				checkbox.checked = true;
			}

			updateTaskStatus(1, 0);

			const taskStatus = document.querySelector(".task-status");
			expect(taskStatus.style.display).toBe("inline");
		});

		it("should hide completion status when not all subtasks are checked", async () => {
			await initializeTaskFlow();
			await new Promise((resolve) => setTimeout(resolve, 0));

			const checkboxes = Array.from(
				document.querySelectorAll(".subtask-checkbox"),
			);
			checkboxes[0].checked = true;
			checkboxes[1].checked = false;

			updateTaskStatus(1, 0);

			const taskStatus = document.querySelector(".task-status");
			expect(taskStatus.style.display).toBe("none");
		});
	});
});
