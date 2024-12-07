export function toggleSubtasks(id) {
	const subtaskList = document.getElementById(id);
	if (subtaskList.classList.contains("hidden")) {
		subtaskList.classList.remove("hidden");
	} else {
		subtaskList.classList.add("hidden");
	}
}

export function addTask() {
	const taskList = document.getElementById("tasks");
	const newTaskIndex = taskList.children.length + 1;

	const newTask = document.createElement("li");

	const taskSpan = document.createElement("span");
	taskSpan.textContent = `📋 Task ${newTaskIndex}`;
	taskSpan.className = "task";
	taskSpan.onclick = () => toggleSubtasks(`subtask-${newTaskIndex}`);

	const subTaskList = document.createElement("ul");
	subTaskList.id = `subtask-${newTaskIndex}`;
	subTaskList.className = "subtasks hidden";

	const subTaskItem = document.createElement("li");
	subTaskItem.textContent = `✅ Subtask ${newTaskIndex}.1`;
	subTaskList.appendChild(subTaskItem);

	newTask.appendChild(taskSpan);
	newTask.appendChild(subTaskList);

	taskList.appendChild(newTask);
}
