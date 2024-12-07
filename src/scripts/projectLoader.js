async function getTrackFiles() {
    try {
        const response = await fetch('../data/tracks/index.json');
        const data = await response.json();
        return data.files;
    } catch (error) {
        console.error('Error fetching track files:', error);
        return [];
    }
}

export async function loadProjects() {
    const projectContainer = document.querySelector('.project-list:first-child');
    projectContainer.innerHTML = '';

    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];

    // Render stored projects from local storage
    storedProjects.forEach((project) => {
        const totalModules = project.modules.length;
        const completedModules = project.modules.filter((module) => module.completed).length;

        const totalTasks = project.modules.reduce(
            (count, module) => count + (module.tasks ? module.tasks.length : 0),
            0
        );
        const completedTasks = project.modules.reduce(
            (count, module) =>
                count + (module.tasks ? module.tasks.filter((task) => task.completed).length : 0),
            0
        );

        // curFile = project.file;
        // console.log(project);

        const projectCard = `
            <div class="project-card">
                <span>${project.name}</span>
                <div class="project-card-buttons-list">
                    <button class="project-card-button">Modules: ${completedModules}/${totalModules}</button>
                    <button class="project-card-button">Tasks: ${completedTasks}/${totalTasks}</button>
                    <button class="project-card-button" 
                            onclick="window.location.href='task-page.html?file=${encodeURIComponent(project.file)}'">
                        Start Project <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

        projectContainer.insertAdjacentHTML('beforeend', projectCard);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const createProjectButton = document.getElementById('create-project-btn');
    const popupContainer = document.getElementById('popup-container');
    const popupCloseButton = document.getElementById('popup-close');
    const projectForm = document.getElementById('project-form');
    const projectNameSelect = document.getElementById('project-name');

    // Ensure required elements exist
    if (!createProjectButton || !popupContainer || !popupCloseButton || !projectForm || !projectNameSelect) {
        console.error('One or more required elements are missing in the DOM!');
        return;
    }

    // Load project names into the dropdown menu
    async function loadProjectNames() {
        try {
            const files = await getTrackFiles();
            projectNameSelect.innerHTML = ''; // Clear existing options

            files.forEach((file) => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file; // Display the file name in the dropdown
                projectNameSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading project names:', error);
        }
    }

    // Open the project creation pop-up
    createProjectButton.addEventListener('click', async () => {
        console.log('Create Project button clicked!');
        await loadProjectNames(); // Load project names dynamically
        popupContainer.classList.remove('hidden'); // Show the pop-up
    });

    // Close the project creation pop-up
    popupCloseButton.addEventListener('click', () => {
        console.log('Cancel button clicked!');
        popupContainer.classList.add('hidden'); // Hide the pop-up
    });

    // Handle project creation
    projectForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const selectedFile = projectNameSelect.value;

        if (selectedFile) {
            try {
                const response = await fetch(`../data/tracks/${selectedFile}`);
                const projectData = await response.json();
                // insert selectedFile into projectData
                projectData.file = selectedFile;

                // Initialize "completed" field for each module in the project
                projectData.modules.forEach((module) => {
                    module.completed = false;
                });

                // Save the project in local storage
                const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
                storedProjects.push({
                    name: projectData.name,
                    modules: projectData.modules,
                    file: projectData.file,
                });
                localStorage.setItem('projects', JSON.stringify(storedProjects));

                alert(`Project "${projectData.name}" created successfully!`);

                // Hide the pop-up after successful creation
                popupContainer.classList.add('hidden');

                // Reload project list
                loadProjects();
            } catch (error) {
                console.error('Error creating project:', error);
            }
        } else {
            alert('Please select a project.');
        }
    });

    // Initial load of projects
    loadProjects();
});