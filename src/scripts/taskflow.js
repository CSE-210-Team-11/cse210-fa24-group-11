export function initializeTaskFlow(
	jsonFilePath = "../data/tracks/beginfront.json",
) {
	fetch(jsonFilePath)
		.then((response) => response.json())
		.then((data) => {
			const taskFlow = document.getElementById("taskFlow");
			taskFlow.innerHTML = ""; // Clear previous content

			const trackTitle = document.createElement("h1");
			trackTitle.textContent = data.name;
			taskFlow.appendChild(trackTitle);

			// Retrieve progress for this specific project from localStorage
			const projectsProgress = JSON.parse(
				localStorage.getItem("projects") || "[]",
			);
			const projectProgress = projectsProgress.find(
				(p) => p.name === data.name,
			);

			// Render modules and tasks
			for (const [moduleIndex, module] of data.modules.entries()) {
				const moduleDiv = document.createElement("div");

				// Create module button
				const moduleButton = document.createElement("button");
				moduleButton.className = "project-heading";
				moduleButton.setAttribute("onclick", `showProgress('${module.id}')`);
				moduleButton.textContent = `Module ${module.id}: ${module.name}`;
				moduleDiv.appendChild(moduleButton);

				// Render tasks
				for (const [taskIndex, task] of module.tasks.entries()) {
					const taskDiv = document.createElement("div");
					taskDiv.className = "task";
					taskDiv.id = `task-${module.id}-${taskIndex}`;

					// Task title
					const taskTitle = document.createElement("h3");
					taskTitle.innerHTML = `${task.name} <span class="task-status" style="display: none; color: green;">✅</span>`;
					taskDiv.appendChild(taskTitle);

					// Subtask list
					const subtaskList = document.createElement("ul");
					subtaskList.className = "subtask-list";

					for (const [subtaskIndex, subtask] of task.subtasks.entries()) {
						const subtaskItem = document.createElement("li");
						subtaskItem.className = "subtask";

						const checkbox = document.createElement("input");
						checkbox.type = "checkbox";
						checkbox.className = "subtask-checkbox";
						const checkboxId = `subtask-${module.id}-${taskIndex}-${subtaskIndex}`;
						checkbox.id = checkboxId;

						// Explicitly check if this subtask was previously completed in localStorage
						if (projectProgress) {
							const moduleProgress = projectProgress.modules[moduleIndex];
							if (moduleProgress?.tasks[taskIndex]) {
								const subtaskProgress =
									moduleProgress.tasks[taskIndex].subtasks[subtaskIndex];
								// Only set to checked if explicitly true in localStorage
								checkbox.checked = subtaskProgress === true;
							}
						}

						// Add event listener to save progress
						checkbox.addEventListener("change", () => {
							saveSubtaskProgress(
								data.name,
								module.id,
								moduleIndex,
								taskIndex,
								subtaskIndex,
								checkbox.checked,
							);
						});

						const label = document.createElement("label");
						label.htmlFor = checkboxId;
						label.textContent = subtask;

						subtaskItem.appendChild(checkbox);
						subtaskItem.appendChild(label);
						subtaskList.appendChild(subtaskItem);
					}

					taskDiv.appendChild(subtaskList);
					moduleDiv.appendChild(taskDiv);
				}

				taskFlow.appendChild(moduleDiv);
			}
		})
		.catch((error) => {
			console.error("Error loading data:", error);
			document.getElementById("taskFlow").innerHTML =
				"Error loading data. Check console for details.";
		});
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

// Optional: Function to check if all subtasks in a task are completed
export function updateTaskStatus(moduleId, taskIndex) {
	const taskElement = document.getElementById(`task-${moduleId}-${taskIndex}`);
	const checkboxes = taskElement.querySelectorAll(".subtask-checkbox");
	const taskStatusSpan = taskElement.querySelector(".task-status");

	const allChecked = Array.from(checkboxes).every(
		(checkbox) => checkbox.checked,
	);
	taskStatusSpan.style.display = allChecked ? "inline" : "none";
}

// Event listener to initialize task flow based on URL parameter
document.addEventListener("DOMContentLoaded", () => {
	const params = new URLSearchParams(window.location.search);
	const fileParam = params.get("file") || "beginfront";
	const filePath = `../data/tracks/${fileParam}`;

	initializeTaskFlow(filePath);
});
