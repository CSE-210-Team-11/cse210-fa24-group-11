// 展开/折叠 Subtasks
function toggleSubtasks(id) {
    const subtaskList = document.getElementById(id);
    if (subtaskList.classList.contains("hidden")) {
      subtaskList.classList.remove("hidden");
    } else {
      subtaskList.classList.add("hidden");
    }
  }
  
  // 添加新 Task
  function addTask() {
    const taskList = document.getElementById("tasks");
    const newTaskIndex = taskList.children.length + 1;
  
    const newTask = document.createElement("li");
  
    // 创建主 Task 元素
    const taskSpan = document.createElement("span");
    taskSpan.textContent = `📋 Task ${newTaskIndex}`;
    taskSpan.className = "task";
    taskSpan.onclick = () => toggleSubtasks(`subtask-${newTaskIndex}`);
  
    // 创建 Subtasks 容器
    const subTaskList = document.createElement("ul");
    subTaskList.id = `subtask-${newTaskIndex}`;
    subTaskList.className = "subtasks hidden";
  
    // 添加默认 Subtask
    const subTaskItem = document.createElement("li");
    subTaskItem.textContent = `✅ Subtask ${newTaskIndex}.1`;
    subTaskList.appendChild(subTaskItem);
  
    // 添加到主 Task
    newTask.appendChild(taskSpan);
    newTask.appendChild(subTaskList);
  
    // 添加到 Task 列表
    taskList.appendChild(newTask);
  }
  