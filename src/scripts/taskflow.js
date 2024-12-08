// import { growthFrac, update } from './components/tree/tree.js';

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
			console.log("projectsProgress", projectsProgress);
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
					<div class="unit">
				`;

				// Render tasks
				for (const [taskIndex, task] of module.tasks.entries()) {
					fullHTML += `
						<div class="task" id='task-${module.id}-${taskIndex}'>
							<h3>Unit ${task.taskId}</h3>
							<p>${task.name}</p>
						</div>
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
									<p class="checkbox-label">
										<label for="${subtaskId}">
											${subtask}
										</label>
									</p>
								</div>
                        `;
					}
				}
				fullHTML += "</div>";
			}
			taskFlow.innerHTML = fullHTML;

			// Add event listeners to all checkboxes after the HTML is inserted
			attachCheckboxListeners();
		})
		.catch((error) => {
			console.error("Error loading data:", error);
			document.getElementById("taskFlow").innerHTML =
				"Error loading data. Check console for details.";
		});
}

// New function to attach event listeners to checkboxes
function attachCheckboxListeners() {
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

			// Update the task status (checkmark)
			updateTaskStatus(moduleId, taskIndex);
		});
	}
}

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

// Function to check if all subtasks in a task are completed
export function updateTaskStatus(moduleId, taskIndex) {
	const taskElement = document.getElementById(`task-${moduleId}-${taskIndex}`);
	const checkboxes = taskElement.querySelectorAll(".subtask-checkbox");
	const taskStatusSpan = taskElement.querySelector(".task-status");

	const allChecked = Array.from(checkboxes).every(
		(checkbox) => checkbox.checked,
	);

	taskStatusSpan.style.display = allChecked ? "inline" : "none";

	if (allChecked) {
		console.log(`All subtasks for Task ${taskIndex} in Module ${moduleId} are completed.`);
		
		// show the percentage of completed tasks
		const percentage = calculatePercentageOfCompletedTasks();
		console.log("Percentage of completed tasks:", percentage);
		// growthFrac = percentage;
		// update();
	}
}

// Calculate the percentage of completed tasks
function calculatePercentageOfCompletedTasks() {
	const projectsProgress = JSON.parse(localStorage.getItem("projects") || "[]");

	if (projectsProgress.length === 0) {
		return 0;
	}

	// Initialize counters for total and completed tasks
	let totalTasks = 0;
	let completedTasks = 0;

	// Iterate over all project progress
	projectsProgress.forEach((project) => {
		if (project.modules) {
			project.modules.forEach((module) => {
				if (module.tasks) {
					module.tasks.forEach((task) => {
						totalTasks++; // Count this task

						// Check if all subtasks are completed
						if (
							task.subtasks &&
							task.subtasks.length > 0 &&
							task.subtasks.every((subtask) => subtask === true)
						) {
							completedTasks++;
						}
					});
				}
			});
		}
	});

	// Avoid division by zero
	if (totalTasks === 0) {
		return 0;
	}
	const percentage = (completedTasks / totalTasks);
	return percentage.toFixed(4); 
}



// Event listener to initialize task flow based on URL parameter
document.addEventListener("DOMContentLoaded", () => {
	const params = new URLSearchParams(window.location.search);
	const fileParam = params.get("file") || "beginfront";
	const filePath = `../data/tracks/${fileParam}`;

	initializeTaskFlow(filePath);
});
