// Mock the circlevisualisation module
jest.mock('../../scripts/circlevisualisation.js', () => ({
    renderProgressCircles: jest.fn()
}));

import { renderProgressCircles } from '../../scripts/circlevisualisation.js'
import { initializeTaskFlow, showProgress, checkSubtaskStatus, updateCircleProgress } from '../../scripts/taskflow.js';

describe('TaskFlow', () => {
    // Setup mock DOM elements before each test
    beforeEach(() => {
        // Clear mock calls
        renderProgressCircles.mockClear();
        
        document.body.innerHTML = `
            <div id="taskFlow"></div>
        `;

        // Mock fetch response
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    name: "Test Track",
                    modules: [{
                        id: 1,
                        name: "Test Module",
                        tasks: [{
                            name: "Test Task",
                            subtasks: ["Subtask 1", "Subtask 2"]
                        }]
                    }]
                })
            })
        );
    });

    // Clean up after each test
    afterEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
        global.event = undefined;
    });

    describe('initializeTaskFlow', () => {
        it('should fetch and render task data', async () => {
            await initializeTaskFlow();
            await new Promise(resolve => setTimeout(resolve, 0));
            
            expect(fetch).toHaveBeenCalledWith('../data/tracks/beginfront.json');
            const h1 = document.querySelector('h1');
            expect(h1).not.toBeNull();
            expect(h1.textContent).toBe('Test Track');
            
            const projectHeading = document.querySelector('.project-heading');
            expect(projectHeading).not.toBeNull();
            expect(projectHeading.textContent.trim()).toContain('Module 1: Test Module');
        });

        it('should handle fetch errors gracefully', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            global.fetch = jest.fn(() => Promise.reject('API Error'));

            await initializeTaskFlow();
            await new Promise(resolve => setTimeout(resolve, 0));
            
            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(document.getElementById('taskFlow').innerHTML)
                .toContain('Error loading data');
            
            consoleErrorSpy.mockRestore();
        });
    });

    describe('showProgress', () => {
        it('should update active module and trigger circle progress update', async () => {
            await initializeTaskFlow();
            await new Promise(resolve => setTimeout(resolve, 0));

            const projectHeading = document.querySelector('.project-heading');
            expect(projectHeading).not.toBeNull();

            global.event = {
                currentTarget: projectHeading
            };

            showProgress('1');

            expect(projectHeading.classList.contains('active')).toBeTruthy();
            expect(renderProgressCircles).toHaveBeenCalled();
        });
    });

    describe('checkSubtaskStatus', () => {
        it('should update task status when all subtasks are checked', async () => {
            await initializeTaskFlow();
            await new Promise(resolve => setTimeout(resolve, 0));

            const checkboxes = document.querySelectorAll('.subtask-checkbox');
            expect(checkboxes.length).toBeGreaterThan(0);

            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
            });

            checkSubtaskStatus(1, 0, 0);

            const taskStatus = document.querySelector('.task-status');
            expect(taskStatus).not.toBeNull();
            expect(taskStatus.style.display).toBe('inline');
        });

        it('should hide task status when not all subtasks are checked', async () => {
            await initializeTaskFlow();
            await new Promise(resolve => setTimeout(resolve, 0));

            const checkboxes = Array.from(document.querySelectorAll('.subtask-checkbox'));
            expect(checkboxes.length).toBeGreaterThan(0);

            if (checkboxes[0]) checkboxes[0].checked = true;
            if (checkboxes[1]) checkboxes[1].checked = false;

            checkSubtaskStatus(1, 0, 0);

            const taskStatus = document.querySelector('.task-status');
            expect(taskStatus).not.toBeNull();
            expect(taskStatus.style.display).toBe('none');
        });
    });

    describe('updateCircleProgress', () => {
        it('should call renderProgressCircles with current module subtasks', async () => {
            await initializeTaskFlow();
            await new Promise(resolve => setTimeout(resolve, 0));

            global.event = {
                currentTarget: document.querySelector('.project-heading')
            };
            
            showProgress('1');
            updateCircleProgress();

            expect(renderProgressCircles).toHaveBeenCalledWith(
                expect.arrayContaining(['Subtask 1', 'Subtask 2'])
            );
        });
    });
});
