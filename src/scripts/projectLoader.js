async function getTrackFiles() {
    try {
        const response = await fetch('../data/tracks/index.json');
        const data = await response.json();
        return data.files;
    } catch (error) {
        console.log('Error fetching track files:', error);
        return [];
    }
}

export async function loadProjects() {
    const projectContainer = document.querySelector('.project-list:first-child');
    projectContainer.innerHTML = '';
    
    const files = await getTrackFiles();
    
    for (const file of files) {
        try {
            const response = await fetch(`../data/tracks/${file}`);
            const track = await response.json();
            
            const moduleCount = track.modules.length;
            const projectCount = track.modules.reduce((count, module) => 
                count + module.tasks.length, 0);

            const projectCard = `
                <div class="project-card">
                    <span>${track.name}</span>
                    <div class="project-card-buttons-list">
                        <button class="project-card-button">Modules: ${moduleCount}</button>
                        <button class="project-card-button">Projects: ${projectCount}</button>
                        <button class="project-card-button">Start Project <i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
            `;

            projectContainer.insertAdjacentHTML('beforeend', projectCard);
        } catch (error) {
            console.log(`Error loading ${file}:`, error);
        }
    }
}

document.addEventListener('DOMContentLoaded', loadProjects);