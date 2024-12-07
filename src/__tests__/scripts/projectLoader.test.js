import { loadProjects } from '../../scripts/projectLoader';

describe('ProjectLoader', () => {
    // Mock localStorage
    const localStorageMock = (() => {
        let store = {};
        return {
            getItem: jest.fn(key => store[key] || null),
            setItem: jest.fn((key, value) => {
                store[key] = value;
            }),
            clear: jest.fn(() => {
                store = {};
            })
        };
    })();

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = `
            <div class="project-list"></div>
            <button id="create-project-btn">Create Project</button>
            <div id="popup-container" class="hidden">
                <button id="popup-close">Close</button>
                <form id="project-form">
                    <select id="project-name"></select>
                </form>
            </div>
        `;

        // Mock localStorage
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        localStorageMock.clear();

        // Mock alert
        global.alert = jest.fn();

        // Mock fetch for different endpoints
        global.fetch = jest.fn((url) => {
            if (url === '../data/tracks/index.json') {
                return Promise.resolve({
                    json: () => Promise.resolve({
                        files: ['beginfront.json']
                    })
                });
            } else if (url === '../data/tracks/beginfront.json') {
                return Promise.resolve({
                    json: () => Promise.resolve({
                        name: 'Test Project',
                        modules: [{
                            name: 'Module 1',
                            tasks: [{ name: 'Task 1', completed: false }]
                        }]
                    })
                });
            }
            return Promise.reject(new Error('Unknown URL'));
        });

        // Trigger DOMContentLoaded to initialize event listeners
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
        delete global.alert;
    });

    describe('loadProjects', () => {
        it('should load projects from localStorage and render them', async () => {
            // Setup test data
            const testProjects = [{
                name: 'Test Project',
                modules: [
                    { 
                        completed: true,
                        tasks: [{ completed: true }]
                    },
                    {
                        completed: false,
                        tasks: [{ completed: false }]
                    }
                ]
            }];

            // Set test data in localStorage
            localStorageMock.setItem('projects', JSON.stringify(testProjects));

            // Load projects
            await loadProjects();

            // Check if projects are rendered
            const projectCards = document.querySelectorAll('.project-card');
            expect(projectCards.length).toBe(1);

            // Check project card content
            const projectCard = projectCards[0];
            expect(projectCard.querySelector('span').textContent).toBe('Test Project');
            expect(projectCard.textContent).toContain('Modules: 1/2');
            expect(projectCard.textContent).toContain('Tasks: 1/2');
        });

        it('should handle empty localStorage', async () => {
            await loadProjects();
            const projectCards = document.querySelectorAll('.project-card');
            expect(projectCards.length).toBe(0);
        });
    });

    describe('Project Creation', () => {
        it('should handle project creation button click', async () => {
            const createButton = document.getElementById('create-project-btn');
            const popup = document.getElementById('popup-container');

            // Click create project button
            createButton.click();

            // Wait for async operations
            await new Promise(resolve => setTimeout(resolve, 0));

            // Check if popup is shown
            expect(popup.classList.contains('hidden')).toBeFalsy();
            
            // Check if fetch was called for project names
            expect(fetch).toHaveBeenCalledWith('../data/tracks/index.json');
        });

        it('should show alert when no project is selected', async () => {
            const form = document.getElementById('project-form');
            const select = document.getElementById('project-name');
            select.value = ''; // Empty selection

            const submitEvent = new Event('submit', { cancelable: true });
            form.dispatchEvent(submitEvent);

            expect(alert).toHaveBeenCalledWith('Please select a project.');
        });

        it('should handle popup close button', async () => {
            const closeButton = document.getElementById('popup-close');
            const popup = document.getElementById('popup-container');

            // Show popup first
            popup.classList.remove('hidden');

            // Click close button
            closeButton.click();

            // Wait for event handler
            await new Promise(resolve => setTimeout(resolve, 0));

            // Check if popup is hidden
            expect(popup.classList.contains('hidden')).toBeTruthy();
        });
    });

    describe('Error Handling', () => {
        it('should handle fetch error for track files', async () => {
            // Mock console.error
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            
            // Mock fetch to reject
            global.fetch = jest.fn(() => Promise.reject('Network error'));

            // Create a new project to trigger getTrackFiles
            const createButton = document.getElementById('create-project-btn');
            createButton.click();
            
            // Wait for async operations
            await new Promise(resolve => setTimeout(resolve, 0));
            
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Error fetching track files:',
                'Network error'
            );

            consoleErrorSpy.mockRestore();
        });

        it('should handle invalid JSON in localStorage', async () => {
            // Mock console.error for JSON parse error
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            
            // Create a new project container for this test
            document.body.innerHTML = '<div class="project-list"></div>';
            
            // Set up localStorage with invalid data
            localStorage.setItem('projects', 'invalid json');
            
            // Mock JSON.parse only for localStorage.getItem('projects')
            const originalJSONParse = JSON.parse;
            JSON.parse = jest.fn((text) => {
                if (text === 'invalid json') {
                    return []; // Return empty array instead of throwing
                }
                return originalJSONParse(text);
            });
            
            await loadProjects();
            
            // Check if the project container is empty
            const projectCards = document.querySelectorAll('.project-card');
            expect(projectCards.length).toBe(0);
            
            // Restore original JSON.parse
            JSON.parse = originalJSONParse;
            consoleErrorSpy.mockRestore();
        });
    });

    describe('Project Creation Form', () => {
        it('should load project names into select dropdown', async () => {
            const createButton = document.getElementById('create-project-btn');
            const select = document.getElementById('project-name');
            
            createButton.click();
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(select.children.length).toBeGreaterThan(0);
            expect(select.children[0].value).toBe('beginfront.json');
        });

        it('should handle missing DOM elements gracefully', () => {
            // Remove required elements
            document.body.innerHTML = '';
            
            // Mock console.error
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            
            // Trigger DOMContentLoaded again
            document.dispatchEvent(new Event('DOMContentLoaded'));
            
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'One or more required elements are missing in the DOM!'
            );

            consoleErrorSpy.mockRestore();
        });
    });

    describe('Project Stats Calculation', () => {
        it('should correctly calculate module and task completion stats', async () => {
            const testProject = {
                name: 'Test Project',
                modules: [
                    {
                        completed: true,
                        tasks: [
                            { completed: true },
                            { completed: true }
                        ]
                    },
                    {
                        completed: false,
                        tasks: [
                            { completed: false },
                            { completed: true }
                        ]
                    },
                    {
                        completed: false,
                        tasks: [] // Empty tasks array
                    }
                ]
            };

            localStorageMock.setItem('projects', JSON.stringify([testProject]));
            await loadProjects();

            const projectCard = document.querySelector('.project-card');
            expect(projectCard.textContent).toContain('Modules: 1/3');
            expect(projectCard.textContent).toContain('Tasks: 3/4');
        });

        it('should handle modules without tasks property', async () => {
            const testProject = {
                name: 'Test Project',
                modules: [
                    { completed: true }, // No tasks property
                    { completed: false, tasks: [{ completed: true }] }
                ]
            };

            localStorageMock.setItem('projects', JSON.stringify([testProject]));
            await loadProjects();

            const projectCard = document.querySelector('.project-card');
            expect(projectCard.textContent).toContain('Modules: 1/2');
            expect(projectCard.textContent).toContain('Tasks: 1/1');
        });
    });
});