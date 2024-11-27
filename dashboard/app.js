// Sidebar toggle function
const sidebarToggle = () => {
	document.body.classList.toggle('sidebar-open')
}

// Sidebar trigger
const sidebarTrigger = document.getElementById('main-header__sidebar-toggle')

// Add the event listener for the sidebar toggle
sidebarTrigger.addEventListener('click', sidebarToggle)



// Sidebar collapse function
const sidebarCollapse = () => {
	document.body.classList.toggle('sidebar-collapsed')
}

// Sidebar trigger
const sidebarCollapseTrigger = document.getElementById('sidebar__collapse')

// Add the event listener for the sidebar toggle
sidebarCollapseTrigger.addEventListener('click', sidebarCollapse)



// Theme switcher function
const switchTheme = () => {
	// Get root element and data-theme value
	const rootElem = document.documentElement
	let dataTheme = rootElem.getAttribute('data-theme'),
		newTheme

	newTheme = (dataTheme === 'light') ? 'dark' : 'light'

	// Set the new HTML attribute
	rootElem.setAttribute('data-theme', newTheme)

	// Set the new local storage item
	localStorage.setItem("theme", newTheme)
}

// Task Management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initial render when page loads
document.addEventListener('DOMContentLoaded', function() {
    renderTasks(); // Display any saved tasks
});

function showNewTaskForm() {
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.style.display = 'block';
    }
}

function cancelTask() {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    if (taskForm && taskInput) {
        taskForm.style.display = 'none';
        taskInput.value = '';
    }
}

function saveTask() {
    const taskInput = document.getElementById('taskInput');
    if (!taskInput) return;

    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        progress: 0, // Add initial progress
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskInput.value = '';
    document.getElementById('taskForm').style.display = 'none';
    renderTasks();
}

function updateProgress(taskId, increment) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.progress = Math.min(Math.max(task.progress + increment, 0), 100);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
}

function editTask(taskId) {

    const task = tasks.find(task => task.id === taskId);
    if (!task) return;

    const taskInput = document.getElementById('taskInput');
    if (!taskInput) return;


    taskInput.value = task.text;
    document.getElementById('taskForm').style.display = 'block';

    // Remove the task from the list
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}


function renderTasks() {
    const taskList = document.getElementById('tasksList');
    if (!taskList) return;

    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${task.progress}%; background-color: ${task.progress >= 100 ? '#4CAF50' : '#2196F3'}"></div>
                    <div class="progress-controls">
                        <span class="progress-text">${task.progress}%</span>
                        <button onclick="updateProgress(${task.id}, 10)" class="progress-btn plus-btn">+</button>
                        <button onclick="updateProgress(${task.id}, -10)" class="progress-btn minus-btn">-</button>
                    </div>
                </div>
                <div class="task-buttons">
                    <button onclick="editTask(${task.id})" class="edit-btn">Edit</button>
                    <button onclick="deleteTask(${task.id})" class="delete-btn">Delete</button>
                </div>
            </div>
        `;
        taskList.appendChild(taskElement);
    });
}



document.querySelectorAll('#sidebar__nav a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelectorAll('.content').forEach(content => content.classList.remove('active'));

        const targetId = this.getAttribute('href').substring(1) + '-content';

        document.getElementById(targetId).classList.add('active');

        document.querySelectorAll('#sidebar__nav a').forEach(item => item.classList.remove('active'));
        this.classList.add('active');
    });
});

const strikesLink = document.querySelector('#strikes-link svg use');
const checkInButton = document.querySelector('#checkin-button');

checkInButton.addEventListener('click', function (e) {
    e.preventDefault(); 

    if (strikesLink.getAttribute('xlink:href') === '#icon-unStrike') {
        strikesLink.setAttribute('xlink:href', '#icon-strike');
    } else {
        strikesLink.setAttribute('xlink:href', '#icon-unStrike');
    }
});



// Initial render of tasks
document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
});



// Add the event listener for the theme switcher
document.querySelector('#sidebar__theme-switcher').addEventListener('click', switchTheme)

