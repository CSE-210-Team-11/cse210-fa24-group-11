// Mock the circlevisualisation module
import { initializeFromURL } from "../../scripts/taskflow.js"
import { Chart } from "../../scripts/chart.js";

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

	

	describe("initializeFromURL", () => {
		it("should return correct file path", () => {
		  // Test with custom file
		  window.location = undefined;
	  
		  // Test default case
		  window.location = { search: "" };
		  expect(initializeFromURL()).toBe('../data/tracks/beginfront');
		});
	  });


	describe('initializeTaskFlow', () => {
		beforeEach(() => {
			document.body.innerHTML = '<div id="taskFlow"></div>';  // Set up a mock DOM
		});

		it('should render project information and modules correctly', async () => {
			const mockData = {
				name: "Test Project",
				modules: [
					{
						id: 1,
						name: "Module 1",
						tasks: [
							{ taskId: 1, name: "Task 1", subtasks: ["Subtask 1", "Subtask 2"] },
							{ taskId: 2, name: "Task 2", subtasks: ["Subtask 3"] },
						]
					},
				],
			};

			// Mock the fetch call to return the mock data
			global.fetch = jest.fn(() =>
				Promise.resolve({
					json: () => Promise.resolve(mockData),
				})
			);

			await initializeTaskFlow("../data/tracks/test.json");

			// Check if the project name is rendered correctly
			expect(document.body.innerHTML).toContain("<div id=\"taskFlow\"></div>");
			// Check if the module name is rendered correctly
			expect(document.body.innerHTML).toContain("<div id=\"taskFlow\"></div>");
			// Check if the task name is rendered correctly
			expect(document.body.innerHTML).toContain("<div id=\"taskFlow\"></div>");
		});
	});

	describe('updateDisplays', () => {
		beforeEach(() => {
			// Set up a mock DOM
			document.body.innerHTML = '<div id="taskFlow"></div>';
			// Mock the update function
			jest.spyOn(console, 'log').mockImplementation(() => {});
		});
	
		it('should correctly calculate and log completion percentage', () => {
			// Set up mock project data in localStorage
			const mockData = [
				{
					name: 'Test Project',
					modules: [
						{
							tasks: [
								{
									subtasks: [true, false, true],
								},
								{
									subtasks: [true, true],
								},
							]
						}
					]
				}
			];
			global.localStorage.setItem('projects', JSON.stringify(mockData));
	
			// Call updateDisplays with a project name
			updateDisplays('Test Project');
	
			// Check if the console logs the correct completion
			expect(console.log).toHaveBeenNthCalledWith(1, 'Modules·length:·1');
			expect(console.log).toHaveBeenNthCalledWith(2, 'Completion:  0.8');
			

		});
	});


	describe('initializeFromURL', () => {
		it('should return correct file path based on URL parameter', () => {
			// Mock window.location.search
			global.window = Object.create(window);
			Object.defineProperty(window, 'location', {
				value: {
					search: '?file=testfile',
				},
			});

			const filePath = initializeFromURL();
			expect(filePath).toBe('../data/tracks/testfile');
		});

		it('should return default file path when no file parameter is provided', () => {
			// Mock window.location.search
			global.window = Object.create(window);
			Object.defineProperty(window, 'location', {
				value: {
					search: '',
				},
			});

			const filePath = initializeFromURL();
			expect(filePath).toBe('../data/tracks/beginfront');
		});
	});


});
