import { update } from './components/tree/tree.js';


/**
 * Initializes the task flow based on the provided JSON file path
 * @param {string} jsonFilePath - The path to the JSON file to load
 * @returns {void}
 */
export function initializeTaskFlow(
	jsonFilePath = "../data/tracks/beginfront.json",
) {
	fetch(jsonFilePath)
		.then((response) => response.json())
		.then((data) => {

			const taskFlow = document.getElementById("taskFlow");
			taskFlow.innerHTML = ""; // Clear previous content
			// trackTitle
			let fullHTML = "";

			// Retrieve progress for this specific project from localStorage
			const projectsProgress = JSON.parse(
				localStorage.getItem("projects") || "[]",
			);
			const projectProgress = projectsProgress.find(
				(p) => p.name === data.name,
			);
			fullHTML += `
				<div class="project">
					<h1>${data.name}</h1>
				</div>
			`;
			// Render modules and tasks
			for (const [moduleIndex, module] of data.modules.entries()) {
				// Create module button
				fullHTML += `
					<div class="project-heading"}>
						<h2>Section ${module.id}: ${module.name}</h2>
					</div>
					<div class="unit flexbox-display">
				`;

				// Render tasks
				for (const [taskIndex, task] of module.tasks.entries()) {
					fullHTML += `
						<div class="task-container">
							<div class="task" id='task-${module.id}-${taskIndex}'>
								<div class="task-header" onclick="this.parentElement.parentElement.classList.toggle('expanded')">
									<h3>Unit ${taskIndex+1}: ${task.name}</h3>
									<span class="accordion-icon">▼</span>
								</div>
							</div>
							<div class="subtasks-container">
					`;
					
					// Task title & Subtask list
					for (const [subtaskIndex, subtask] of task.subtasks.entries()) {
						const isChecked =
							projectProgress?.modules?.[moduleIndex]?.tasks?.[taskIndex]
								?.subtasks?.[subtaskIndex] === true;
						const subtaskId = `subtask-${module.id}-${taskIndex}-${subtaskIndex}`;

						fullHTML += `
							<div class="subtask-inner-div">
								<input 
									type="checkbox" 
									class="subtask-checkbox" 
									id="${subtaskId}"
									data-project="${data.name}"
									data-module-id="${module.id}"
									data-module-index="${moduleIndex}"
									data-task-index="${taskIndex}"
									data-subtask-index="${subtaskIndex}"
									${isChecked ? "checked" : ""}
								/>
								<label for="${subtaskId}" class="checkbox-label">
									${subtask}
								</label>
							</div>
						`;
					}
					fullHTML += `
							</div>
						</div>
					`;
				}
				fullHTML += "</div>";
			}
			taskFlow.innerHTML = fullHTML;

			// Add event listeners to all checkboxes after the HTML is inserted
			attachCheckboxListeners();
			updateDisplays(data.name);
		})
		.catch((error) => {
			console.error("Error loading data:", error);
			document.getElementById("taskFlow").innerHTML =
				"Error loading data. Check console for details.";
		});
}

/**
 * Attaches event listeners to all subtask checkboxes
 * @returns {void}
 * @function attachCheckboxListeners
 * @inner
 * @listens change
 * @fires saveSubtaskProgress
 * @fires updateTaskStatus
 * @fires updateDisplays
 */
export function attachCheckboxListeners() {
	const checkboxes = document.querySelectorAll(".subtask-checkbox");
	for (const checkbox of checkboxes) {
		checkbox.addEventListener("change", (event) => {
			const { project, moduleId, moduleIndex, taskIndex, subtaskIndex } =
				event.target.dataset;

			// Save progress to localStorage
			saveSubtaskProgress(
				project,
				moduleId,
				Number.parseInt(moduleIndex),
				Number.parseInt(taskIndex),
				Number.parseInt(subtaskIndex),
				event.target.checked,
			);
			updateTaskStatus();
			updateDisplays(project);
		});
	}
}

/**
 * Saves the progress of a subtask to localStorage
 * @param {string} projectName - The name of the project
 * @param {number} moduleId - The ID of the module
 * @param {number} moduleIndex - The index of the module
 * @param {number} taskIndex - The index of the task
 * @param {number} subtaskIndex - The index of the subtask
 * @param {boolean} isChecked - The completion status of the subtask
 * @returns {void}
 * @function saveSubtaskProgress
*/
export function saveSubtaskProgress(
	projectName,
	moduleId,
	moduleIndex,
	taskIndex,
	subtaskIndex,
	isChecked,
) {
	// Retrieve existing projects progress
	const projectsProgress = JSON.parse(localStorage.getItem("projects") || "[]");

	// Find or create project progress
	let projectProgress = projectsProgress.find((p) => p.name === projectName);
	if (!projectProgress) {
		projectProgress = {
			name: projectName,
			modules: [],
		};
		projectsProgress.push(projectProgress);
	}

	// Ensure modules array exists
	if (!projectProgress.modules[moduleIndex]) {
		projectProgress.modules[moduleIndex] = {
			id: moduleId,
			tasks: [],
		};
	}

	// Ensure tasks array exists
	if (!projectProgress.modules[moduleIndex].tasks[taskIndex]) {
		projectProgress.modules[moduleIndex].tasks[taskIndex] = {
			subtasks: [],
		};
	}

	// Save subtask progress
	projectProgress.modules[moduleIndex].tasks[taskIndex].subtasks[subtaskIndex] =
		isChecked;

	// Save back to localStorage
	localStorage.setItem("projects", JSON.stringify(projectsProgress));
}

/**
 * Updates the progress displays based on the project name
 * @param {string} projectName - The name of the project
 * @returns {void}
 * @function updateDisplays
*/
export function updateDisplays(projectName) {
	// Retrieve existing projects progress
	const projectsProgress = JSON.parse(localStorage.getItem("projects") || "[]");

	// Find or create project progress
	const project = projectsProgress.find((p) => p.name === projectName);
	let totalSubtasks = 0;
	let completedSubtasks = 0;
	if (project.modules) {
		console.log(`Modules·length:·${project.modules.length}`)
		for (const module of project.modules) {
			if (module.tasks) {
				for (const task of module.tasks) {
					if (task.subtasks && task.subtasks.length > 0) {
						for (const subtask of task.subtasks) {
							if (subtask === true) {
								completedSubtasks++;
							}
							totalSubtasks++;
						}
					}
				}
			}
		}
	}

	if (totalSubtasks !== 0) {
		const completion = completedSubtasks / totalSubtasks;
		console.log(`Completion:  ${completion}`);
		update(completion);
	}
}

let lastPercentageTasks = -1;
let lastPercentageModules = -1;
let lastPercentageSubtasks = -1;


/**
 * Updates the task status charts based on the progress
 * @returns {void}
 * @function updateTaskStatus
*/
export function updateTaskStatus() {

	const percentageTasks = calculatePercentageOfCompletedTasks() * 100;
	const percentageModules = calculatePercentageOfCompletedModules() * 100;
	const percentageSubtasks = calculatePercentageOfCompletedSubtask() * 100;
	// console.log(`Percentage: ` + percentageTasks + " " + percentageModules + " " + percentageSubtasks);
	if (percentageTasks !== lastPercentageTasks) {
		updateTaskChart(percentageTasks);
		lastPercentageTasks = percentageTasks;
		console.log("Task chart updated");
	}
	if (percentageModules !== lastPercentageModules) {
		updateModuleChart(percentageModules);
		lastPercentageModules = percentageModules;
		console.log("Module chart updated");
	}
	if (percentageSubtasks !== lastPercentageSubtasks) {
		updateSubtaskChart(percentageSubtasks);
		lastPercentageSubtasks = percentageSubtasks;
		console.log("Subtask chart updated");
	}
}

/**
 * Calculates the percentage of completed tasks
 * @returns {number} The percentage of completed tasks
 * @function calculatePercentageOfCompletedTasks
 */
function calculatePercentageOfCompletedTasks() {
	const projectsProgress = JSON.parse(localStorage.getItem("projects") || "[]");

	if (projectsProgress.length === 0) {
		return 0;
	}

	// Initialize counters for total and completed tasks
	let totalTasks = 0;
	let completedTasks = 0;

	// Iterate over all project progress
	for (const project of projectsProgress) {
		if (project.modules) {
			for (const module of project.modules) {
				if (module.tasks) {
					for (const task of module.tasks) {
						totalTasks++; // Count this task
	
						// Check if all subtasks are completed
						if (
							task.subtasks &&
							task.subtasks.length > 0 &&
							task.subtasks.every((subtask) => subtask === true)
						) {
							completedTasks++;
						}
					}
				}
			}
		}
	}
	

	// Avoid division by zero
	if (totalTasks === 0) {
		return 0;
	}
	const percentage = (completedTasks / totalTasks);
	return percentage.toFixed(4);
}

/**
 * Calculates the percentage of completed modules
 * @returns {number} The percentage of completed modules
 * @function calculatePercentageOfCompletedModules
*/
function calculatePercentageOfCompletedModules() {
	const projectsProgress = JSON.parse(localStorage.getItem("projects") || "[]");

	if (projectsProgress.length === 0) {
		return 0;
	}

	// Initialize counters for total and completed tasks
	let totalModules = 0;
	let completedModules = 0;

	// Iterate over all project progress
	for (const project of projectsProgress) {
		if (project.modules) {
			for (const module of project.modules) {
				totalModules++; // Count this module
				let flag = true;
				if (module.tasks) {
					for (const task of module.tasks) {
						if (
							task.subtasks &&
							task.subtasks.length > 0 &&
							task.subtasks.every((subtask) => subtask === true)
						) {
							// No change needed here, as the condition is checked
						} else {
							flag = false;
						}
					}
				}
				if (flag) {
					completedModules++;
				}
			}
		}
	}
	
	// Avoid division by zero
	if (totalModules === 0) {
		return 0;
	}

	return completedModules / totalModules;
}

/**
 * Calculates the percentage of completed subtasks
 * @returns {number} The percentage of completed subtasks
 * @function calculatePercentageOfCompletedSubtask
*/
function calculatePercentageOfCompletedSubtask() {
	const projectsProgress = JSON.parse(localStorage.getItem("projects") || "[]");

	if (projectsProgress.length === 0) {
		return 0;
	}

	// Initialize counters for total and completed tasks



	
	let totalSubtasks = 0;
	let completedSubtasks = 0;

	// Iterate over all project progress
	for (const project of projectsProgress) {
		if (project.modules) {
			for (const module of project.modules) {
				if (module.tasks) {
					for (const task of module.tasks) {
						if (task.subtasks) {
							for (const subtask of task.subtasks) {
								totalSubtasks++; // Count this subtask
								if (subtask === true) {
									completedSubtasks++;
								}
							}
						}
					}
				}
			}
		}
	}
	

	// Avoid division by zero
	if (totalSubtasks === 0) {
		return 0;
	}

	return completedSubtasks / totalSubtasks;
}

/**
 * Creates a donut chart using Chart.js
 * @param {string} canvasId - The ID of the canvas element to render the chart
 * @param {number} completedPercentage - The percentage of completed tasks
 * @param {object} colors - The colors for the chart
 * @returns {object} The Chart.js instance
 * @function createDonutChart
*/
function createDonutChart(canvasId, completedPercentage, colors) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed'],
            datasets: [{
                data: [completedPercentage, 100 - completedPercentage],
                backgroundColor: [
                    colors.completed, 
                    colors.remaining  
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: {
                tooltip: {
                    callbacks: {
						label: (context) => `${context.label}: ${context.formattedValue}%`
                    }
                }
            }
        }
    });
}

/**
 * Updates the task chart with the new percentage
 * @param {number} taskPercentage - The new percentage of completed tasks
 * @returns {void}
 * @function updateTaskChart
*/
function updateTaskChart(taskPercentage) {
	const id = 'taskProgressChart';
	const existingChart = Chart.getChart(id);
	if (existingChart) {
		existingChart.destroy();
	}
	createDonutChart('taskProgressChart', taskPercentage, {
		completed: 'rgba(75, 192, 192, 0.8)',
		remaining: 'rgba(220, 220, 220, 0.5)'
	});

}

/**
 * Updates the module chart with the new percentage
 * @param {number} modulePercentage - The new percentage of completed modules
 * @returns {void}
 * @function updateModuleChart
*/
function updateModuleChart(modulePercentage) {
	const id = 'moduleProgressChart';
	const existingChart = Chart.getChart(id);
	if (existingChart) {
		existingChart.destroy();
	}
	createDonutChart('moduleProgressChart', modulePercentage, {
		completed: 'rgba(54, 162, 235, 0.8)',
		remaining: 'rgba(220, 220, 220, 0.5)'
	});
}

/**
 * Updates the subtask chart with the new percentage
 * @param {number} subtaskPercentage - The new percentage of completed subtasks
 * @returns {void}
 * @function updateSubtaskChart
*/
function updateSubtaskChart(subtaskPercentage) {
	const id = 'subtaskProgressChart';
	const existingChart = Chart.getChart(id);
	if (existingChart) {
		existingChart.destroy();
	}
	createDonutChart('subtaskProgressChart', subtaskPercentage, {
		completed: 'rgba(255, 99, 132, 0.8)',
		remaining: 'rgba(220, 220, 220, 0.5)'
	});
}


/**
 * Initializes the task flow based on the provided JSON file path
 * @param {string} jsonFilePath - The path to the JSON file to load
 * @returns {void}
 * @function initializeTaskFlow
 * @inner
 */
export function initializeFromURL() {
    const params = new URLSearchParams(window.location.search);
    const fileParam = params.get("file") || "beginfront";
    const filePath = `../data/tracks/${fileParam}`;
    return filePath;
}

/**
 * Initializes the task flow based on the provided JSON file path
 * @param {string} filePath - The path to the JSON file to load
 * @returns {void}
 * @function initializeTaskFlow
 * @inner
 */
document.addEventListener("DOMContentLoaded", () => {
    const filePath = initializeFromURL();
    initializeTaskFlow(filePath);
	updateTaskStatus();
});
