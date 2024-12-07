import { toggleSubtasks, addTask } from "../../scripts/task_page.js";

describe("task_page", () => {
    beforeEach(() => {
        // Setup basic DOM structure needed for tests
        document.body.innerHTML = `
            <ul id="tasks"></ul>
        `;
    });

    describe("toggleSubtasks", () => {
        beforeEach(() => {
            // Add a task with subtask for toggle testing
            document.getElementById('tasks').innerHTML = `
                <li>
                    <span class="task">📋 Task 1</span>
                    <ul id="subtask-1" class="subtasks hidden">
                        <li>✅ Subtask 1.1</li>
                    </ul>
                </li>
            `;
        });

        it("should toggle subtask visibility", () => {
            const subtaskList = document.getElementById("subtask-1");
            toggleSubtasks("subtask-1");
            expect(subtaskList.classList.contains("hidden")).toBe(false);
            
            toggleSubtasks("subtask-1");
            expect(subtaskList.classList.contains("hidden")).toBe(true);
        });
    });

    describe("addTask", () => {
        it("should add new task to the list", () => {
            const initialTaskCount = document.querySelectorAll('.task').length;
            addTask();
            const newTaskCount = document.querySelectorAll('.task').length;
            expect(newTaskCount).toBe(initialTaskCount + 1);
        });

        it("should create task with correct structure", () => {
            addTask();
            const lastTask = document.querySelector('#tasks li:last-child');
            expect(lastTask).not.toBeNull();
            expect(lastTask.querySelector('.task')).not.toBeNull();
            expect(lastTask.querySelector('.subtasks')).not.toBeNull();
        });
    });
});
