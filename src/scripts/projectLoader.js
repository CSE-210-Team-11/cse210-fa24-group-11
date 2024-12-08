export async function getTrackFiles() {
	try {
		const response = await fetch("../data/tracks/index.json");
		const data = await response.json();
		return data.files;
	} catch (error) {
		console.error("Error fetching track files:", error);
		return [];
	}
}

export async function loadProjects() {
	const projectContainer = document.querySelector(".project-list:first-child");
	projectContainer.innerHTML = "";

	const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];

	// Render stored projects from local storage
	for (const project of storedProjects) {
		// Calculate module completion
		const totalModules = project.modules.length;
		const completedModules = calculateCompletedModules(project);

		// Calculate task and subtask completion
		const { totalTasks, completedTasks, totalSubtasks, completedSubtasks } =
			calculateTaskCompletion(project);
			// console.log("totalTasks", project)

		const projectCard = `
            <div class="project-card">
                <span>${project.name}</span>
                <div class="project-card-buttons-list">
                    <button class="project-card-button">Sections: ${completedModules}/${totalModules}</button>
                    <button class="project-card-button">Units: ${completedTasks}/${totalTasks}</button>
                    <button class="project-card-button">Lessons: ${completedSubtasks}/${totalSubtasks}</button>
                    <button class="project-card-button" 
                            onclick="window.location.href='task-page.html?file=${encodeURIComponent(project.file)}'">
                        Start Project <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

		projectContainer.insertAdjacentHTML("beforeend", projectCard);
	}
}

// Helper function to calculate completed modules
export function calculateCompletedModules(project) {
	if (!project.modules) return 0;

	return project.modules.filter((module) => {
		// Check if all tasks in the module are completed
		if (!module.tasks) return false;

		return module.tasks.every((task) => {
			// Check if all subtasks are completed
			if (!task.subtasks) return false;
			return task.subtasks.every((subtask) => subtask === true);
		});
	}).length;
}

// Helper function to calculate task completion
function calculateTaskCompletion(project) {
	let totalTasks = 0;
	let completedTasks = 0;
	let totalSubtasks = 0;
	let completedSubtasks = 0;

	if (!project.modules)
		return {
			totalTasks: 0,
			completedTasks: 0,
			totalSubtasks: 0,
			completedSubtasks: 0,
		};

	for (const module of project.modules) {
		if (!module.tasks) return;

		for (const task of module.tasks) {
			if (!task.subtasks) return;

			totalTasks++;
			let taskCompleted = true;

			for (const subtask of task.subtasks) {
				totalSubtasks++;
				if (subtask === true) {
					completedSubtasks++;
				} else {
					taskCompleted = false;
				}
			}

			if (taskCompleted) {
				completedTasks++;
			}
		}
	}

	return {
		totalTasks,
		completedTasks,
		totalSubtasks,
		completedSubtasks,
	};
}

export function storeProject(project) {
	const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
	storedProjects.push(project);
	localStorage.setItem("projects", JSON.stringify(storedProjects));
}

document.addEventListener("DOMContentLoaded", () => {
	const createProjectButton = document.getElementById("create-project-btn");
	const popupContainer = document.getElementById("popup-container");
	const popupCloseButton = document.getElementById("popup-close");
	const projectForm = document.getElementById("project-form");
	const projectNameSelect = document.getElementById("project-name");

	// Ensure required elements exist
	if (
		!createProjectButton ||
		!popupContainer ||
		!popupCloseButton ||
		!projectForm ||
		!projectNameSelect
	) {
		console.error("One or more required elements are missing in the DOM!");
		return;
	}

	// Load project names into the dropdown menu
	async function loadProjectNames() {
		try {
			const files = await getTrackFiles();
			console.log(files);
			projectNameSelect.innerHTML = ""; // Clear existing options

			for (const file of files) {
				const option = document.createElement("option");
				option.value = file.filename; // Use the filename as the value
				option.textContent = file.displayName; // Use the display name for showing in dropdown
				projectNameSelect.appendChild(option);
			}
		} catch (error) {
			console.error("Error loading project names:", error);
		}
	}

	// Open the project creation pop-up
	createProjectButton.addEventListener("click", async () => {
		await loadProjectNames(); // Load project names dynamically
		popupContainer.classList.remove("hidden"); // Show the pop-up
	});

	// Close the project creation pop-up
	popupCloseButton.addEventListener("click", () => {
		popupContainer.classList.add("hidden"); // Hide the pop-up
	});

	// Handle project creation
	projectForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		const selectedFile = projectNameSelect.value;

		if (selectedFile) {
			try {
				const response = await fetch(`../data/tracks/${selectedFile}`);
				const projectData = await response.json();
				// insert selectedFile into projectData
				projectData.file = selectedFile;

				// Initialize "completed" field for each module in the project
				for (const module of projectData.modules) {
					module.completed = false;
				}

				// Save the project in local storage
				storeProject(projectData);

				alert(`Project "${projectData.name}" created successfully!`);

				// Hide the pop-up after successful creation
				popupContainer.classList.add("hidden");

				// Reload project list
				loadProjects();
			} catch (error) {
				console.error("Error creating project:", error);
			}
		} else {
			alert("Please select a project.");
		}
	});

	// Initial load of projects
	loadProjects();
});
export function getProjectCount() {
	const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
	return storedProjects.length;
}
