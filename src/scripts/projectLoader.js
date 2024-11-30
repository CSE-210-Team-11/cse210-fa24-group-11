// projectLoader.js

let moduleData = null;
let currentModuleSubtasks = [];

function initializeTaskFlow() {
    fetch('../data/tracks/beginfront.json')
        .then(response => response.json())
        .then(data => {
            moduleData = data;
            const taskFlow = document.getElementById('taskFlow');
            
            const trackTitle = document.createElement('h1');
            trackTitle.textContent = data.name;
            taskFlow.appendChild(trackTitle);

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

function showProgress(moduleId) {
    document.querySelectorAll('.project-heading').forEach(btn => {
        btn.classList.remove('active');
    });

    event.currentTarget.classList.add('active');
    
    const module = moduleData.modules.find(m => m.id === parseInt(moduleId));
    currentModuleSubtasks = module.tasks.reduce((acc, task) => {
        return acc.concat(task.subtasks);
    }, []);
    
    // Trigger custom event to update progress circles
    const event = new CustomEvent('updateProgressCircles', {
        detail: {
            subtasks: currentModuleSubtasks
        }
    });
    document.dispatchEvent(event);

    const progressView = document.getElementById('progressView');
    progressView.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', initializeTaskFlow);
