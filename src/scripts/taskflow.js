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
                    ${module.tasks.map(task => `
                        <div class="task">
                            <h3>${task.name}</h3>
                            <ul class="subtask-list">
                                ${task.subtasks.map(subtask => 
                                    `<li class="subtask">${subtask}</li>`
                                ).join('')}
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

// Event listener to initialize task flow when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeTaskFlow);
