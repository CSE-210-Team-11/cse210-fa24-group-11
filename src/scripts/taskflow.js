function initializeTaskFlow(jsonFilePath = '../data/tracks/beginfront.json') {
    fetch(jsonFilePath)
        .then(response => response.json())
        .then(data => {
            const taskFlow = document.getElementById('taskFlow');
            taskFlow.innerHTML = ''; // Clear previous content

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
                                <span class="task-status" style="display: none; color: green;">✅</span>
                            </h3>
                            <ul class="subtask-list">
                                ${task.subtasks.map((subtask, subtaskIndex) => `
                                    <li class="subtask">
                                        <input type="checkbox" 
                                            class="subtask-checkbox" 
                                            id="subtask-${module.id}-${taskIndex}-${subtaskIndex}" 
                                            ${getSubtaskState(module.id, taskIndex, subtaskIndex) ? 'checked' : ''} 
                                        > 
                                        <label for="subtask-${module.id}-${taskIndex}-${subtaskIndex}">${subtask}</label>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}`;
                taskFlow.appendChild(moduleDiv);

                // Add event listeners to update checkbox states in localStorage
                module.tasks.forEach((task, taskIndex) => {
                    task.subtasks.forEach((_, subtaskIndex) => {
                        const checkbox = document.getElementById(`subtask-${module.id}-${taskIndex}-${subtaskIndex}`);
                        checkbox.addEventListener('change', () => {
                            saveSubtaskState(module.id, taskIndex, subtaskIndex, checkbox.checked);
                        });
                    });
                });
            });
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('taskFlow').innerHTML = 'Error loading data. Check console for details.';
        });
}

// Get the state of a subtask from localStorage
function getSubtaskState(moduleId, taskIndex, subtaskIndex) {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const project = projects.find(p => p.modules && p.modules.some(m => m.id === moduleId));
    if (project) {
        const module = project.modules.find(m => m.id === moduleId);
        if (module) {
            const task = module.tasks[taskIndex];
            if (task) {
                return task.subtasksState && task.subtasksState[subtaskIndex] || false;
            }
        }
    }
    return false; 
}

// Save the state of a subtask to localStorage
function saveSubtaskState(moduleId, taskIndex, subtaskIndex, checked) {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    let project = projects.find(p => p.modules && p.modules.some(m => m.id === moduleId));

    if (!project) {
        project = { name: 'Default Project', modules: [] };
        projects.push(project);
    }

    let module = project.modules.find(m => m.id === moduleId);
    if (!module) {
        module = { id: moduleId, name: `Module ${moduleId}`, tasks: [] };
        project.modules.push(module);
    }

    let task = module.tasks[taskIndex];
    if (!task) {
        task = { name: `Task ${taskIndex + 1}`, subtasks: [], subtasksState: [] };
        module.tasks[taskIndex] = task;
    }

    if (!task.subtasksState) {
        task.subtasksState = new Array(task.subtasks.length).fill(false);
    }

    task.subtasksState[subtaskIndex] = checked;

    localStorage.setItem('projects', JSON.stringify(projects));
}


// Event listener to initialize task flow based on URL parameter
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const fileParam = params.get('file') || 'beginfront'; 
    const filePath = `../data/tracks/${fileParam}`; 

    initializeTaskFlow(filePath); 
});
