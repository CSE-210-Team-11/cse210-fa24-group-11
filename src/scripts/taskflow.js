// Function to initialize and fetch task data
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
                                            onclick="checkSubtaskStatus(${module.id}, ${taskIndex}, ${subtaskIndex})">
                                        <label for="subtask-${module.id}-${taskIndex}-${subtaskIndex}">${subtask}</label>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}`;
                taskFlow.appendChild(moduleDiv);
            });
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('taskFlow').innerHTML = 'Error loading data. Check console for details.';
        });
}

// Event listener to initialize task flow based on URL parameter
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const fileParam = params.get('file') || 'beginfront'; // Default to 'beginfront' if 'file' is not provided
    const filePath = `../data/tracks/${fileParam}.json`; // Build file path

    initializeTaskFlow(filePath); // Initialize with the built file path
});
