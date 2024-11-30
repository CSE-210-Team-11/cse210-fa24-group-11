let moduleData = null;
let currentModuleSubtasks = [];

const taskColors = [
    '#ff69b4', '#4caf50', '#00bcd4', '#ffd700', '#9c27b0',
    '#ff5722', '#3f51b5', '#009688', '#ff9800', '#e91e63'
];

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

    const progressView = document.getElementById('progressView');
    progressView.style.display = 'block';
    
    renderProgressCircles();
}

function renderProgressCircles() {
    const svg = document.querySelector('.progress-rings');
    svg.innerHTML = '';

    const baseRadius = 90;
    const spacing = 5;
    
    currentModuleSubtasks.forEach((subtask, index) => {
        // Create background circle
        const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        bgCircle.setAttribute('cx', '100');
        bgCircle.setAttribute('cy', '100');
        const radius = baseRadius - (index * spacing);
        bgCircle.setAttribute('r', String(radius));
        bgCircle.setAttribute('class', 'progress-ring-bg');
        bgCircle.style.stroke = taskColors[index % taskColors.length];
        bgCircle.style.opacity = '0.2';
        svg.appendChild(bgCircle);

        // Create progress circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute('cx', '100');
        circle.setAttribute('cy', '100');
        circle.setAttribute('r', String(radius));
        circle.setAttribute('class', 'progress-ring');
        circle.style.stroke = taskColors[index % taskColors.length];
        
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference * 0.75;
        
        svg.appendChild(circle);
    });
}

function updateCircleProgress(checkbox) {
    renderProgressCircles();
}
document.addEventListener('DOMContentLoaded', initializeTaskFlow);
