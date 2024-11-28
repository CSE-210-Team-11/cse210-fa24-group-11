// Sidebar toggle function
const sidebarToggle = () => {
	document.body.classList.toggle("sidebar-open");
};

// Sidebar trigger
const sidebarTrigger = document.getElementById("main-header__sidebar-toggle");

// Add the event listener for the sidebar toggle
sidebarTrigger.addEventListener("click", sidebarToggle);

// Sidebar collapse function
const sidebarCollapse = () => {
	document.body.classList.toggle("sidebar-collapsed");
};

// Sidebar trigger
const sidebarCollapseTrigger = document.getElementById("sidebar__collapse");

// Add the event listener for the sidebar toggle
sidebarCollapseTrigger.addEventListener("click", sidebarCollapse);

// Theme switcher function
const switchTheme = () => {
	// Get root element and data-theme value
	const rootElem = document.documentElement;
	const dataTheme = rootElem.getAttribute("data-theme"); // Use const instead of let
	const newTheme = dataTheme === "light" ? "dark" : "light";

	// Set the new HTML attribute
	rootElem.setAttribute("data-theme", newTheme);

	// Set the new local storage item
	localStorage.setItem("theme", newTheme);
};

// Task Management
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Initial render when page loads
document.addEventListener("DOMContentLoaded", () => {
	renderTasks(); // Display any saved tasks
});

function showNewTaskForm() {
	const taskForm = document.getElementById("taskForm");
	if (taskForm) {
		taskForm.style.display = "block";
	}
}

function cancelTask() {
	const taskForm = document.getElementById("taskForm");
	const taskInput = document.getElementById("taskInput");
	if (taskForm && taskInput) {
		taskForm.style.display = "none";
		taskInput.value = "";
	}
}

function saveTask() {
	const taskInput = document.getElementById("taskInput");
	if (!taskInput) return;

	const taskText = taskInput.value.trim();
	if (!taskText) return;

	const newTask = {
		id: Date.now(),
		text: taskText,
		progress: 0, // Add initial progress
		createdAt: new Date().toISOString(),
	};
	tasks.push(newTask);

	localStorage.setItem("tasks", JSON.stringify(tasks));
	taskInput.value = "";
	document.getElementById("taskForm").style.display = "none";
	renderTasks();
}

function updateProgress(taskId, increment) {
	const task = tasks.find((task) => task.id === taskId);
	if (task) {
		task.progress = Math.min(Math.max(task.progress + increment, 0), 100);
		localStorage.setItem("tasks", JSON.stringify(tasks));
		renderTasks();
	}
}

function editTask(taskId) {
	const task = tasks.find((task) => task.id === taskId);
	if (!task) return;

	const taskInput = document.getElementById("taskInput");
	if (!taskInput) return;

	taskInput.value = task.text;
	document.getElementById("taskForm").style.display = "block";

	// Remove the task from the list
	tasks = tasks.filter((task) => task.id !== taskId);
	localStorage.setItem("tasks", JSON.stringify(tasks));
	renderTasks();
}

function deleteTask(taskId) {
	tasks = tasks.filter((task) => task.id !== taskId);
	localStorage.setItem("tasks", JSON.stringify(tasks));
	renderTasks();
}

const links = document.querySelectorAll("#sidebar__nav a");

for (const link of links) {
	link.addEventListener("click", function (e) {
		e.preventDefault();

		const contents = document.querySelectorAll(".content");
		for (const content of contents) {
			content.classList.remove("active");
		}

		const targetId = `${this.getAttribute("href").substring(1)}-content`;
		document.getElementById(targetId).classList.add("active");

		for (const item of links) {
			item.classList.remove("active");
		}

		this.classList.add("active");
	});
}

const strikesLink = document.querySelector("#strikes-link svg use");
const checkInButton = document.querySelector("#checkin-button");

checkInButton.addEventListener("click", (e) => {
	e.preventDefault();

	if (strikesLink.getAttribute("xlink:href") === "#icon-unStrike") {
		strikesLink.setAttribute("xlink:href", "#icon-strike");
	} else {
		strikesLink.setAttribute("xlink:href", "#icon-unStrike");
	}
});

// Add the event listener for the theme switcher
document
	.querySelector("#sidebar__theme-switcher")
	.addEventListener("click", switchTheme);
