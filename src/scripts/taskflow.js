let moduleData = null;
let currentModuleSubtasks = [];

// Function to initialize and fetch task data
function initializeTaskFlow() {
    fetch('../data/tracks/beginfront.json')
        .then(response => response.json())
        .then(data => {
            moduleData = data;
            const taskFlow = document.getElementById('taskFlow');
            
            const trackTitle = document.createElement('h1');
            trackTitle.textContent = data.name;
            taskFlow.appendChild(trackTitle);

            // Render modules and tasks
            data.modules.forEach(module => {
                const moduleDiv = document.createElement('div');
                moduleDiv.innerHTML = `
                    <button class="project-heading" onclick="showProgress('${module.id}')">
                        Module ${module.id}: ${module.name}
                    </button>
                    ${module.tasks.map((task, taskIndex) => `
                        <div class="task" id="task-${module.id}-${taskIndex}">
                            <h3>
                                ${task.name}
                                <span class="task-status" style="display: none; color: green;">✅</span> <!-- Checkmark next to the title -->
                            </h3>
                            <ul class="subtask-list">
                                ${task.subtasks.map((subtask, subtaskIndex) => `
                                    <li class="subtask">
                                        <input type="checkbox" 
                                            class="subtask-checkbox" 
                                            id="subtask-${module.id}-${taskIndex}-${subtaskIndex}" 
                                            onclick="checkSubtaskStatus(${module.id}, ${taskIndex}, ${subtaskIndex})">
                                        <label for="subtask-${module.id}-${taskIndex}-${subtaskIndex}">${subtask}</label>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                `;
                taskFlow.appendChild(moduleDiv);
            });
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('taskFlow').innerHTML = 'Error loading data. Check console for details.';
        });
}

// Function to show progress of a selected module
function showProgress(moduleId) {
    document.querySelectorAll('.project-heading').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.currentTarget.classList.add('active');
    
    const module = moduleData.modules.find(m => m.id === parseInt(moduleId));
    currentModuleSubtasks = module.tasks.reduce((acc, task) => {
        return acc.concat(task.subtasks);
    }, []);

    // Notify circlevisualisation.js to update progress circles
    updateCircleProgress();
}

// Function to update the progress circles (communicates with circlevisualisation.js)
function updateCircleProgress() {
    renderProgressCircles(currentModuleSubtasks); // Passing data to circlevisualisation.js
}

// Function to check the status of subtasks and update task status
function checkSubtaskStatus(moduleId, taskIndex, subtaskIndex) {
    const module = moduleData.modules.find(m => m.id === moduleId);
    const task = module.tasks[taskIndex];
    const subtaskCheckboxes = document.querySelectorAll(`#task-${moduleId}-${taskIndex} .subtask-checkbox`);

    // Check if all subtasks are checked
    const allChecked = Array.from(subtaskCheckboxes).every(checkbox => checkbox.checked);

    const taskElement = document.querySelector(`#task-${moduleId}-${taskIndex}`);
    const taskStatus = taskElement.querySelector('.task-status');

    if (allChecked) {
        // If all subtasks are checked, show a checkmark next to the task title
        taskStatus.style.display = 'inline'; // Show checkmark
    } else {
        // Hide the checkmark if not all subtasks are checked
        taskStatus.style.display = 'none';
    }
}

// Event listener to initialize task flow when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeTaskFlow);
