// display-streak.test.js

describe("Display Streak", () => {
    beforeEach(() => {
        // Set up DOM before testing
        document.body.innerHTML = `
            <div id="display-streak"></div>
        `;
        
        // Mock localStorage
        jest.spyOn(Storage.prototype, 'getItem');
    });

    afterEach(() => {
        // Clean up after each test
        document.body.innerHTML = "";
        jest.clearAllMocks();
        jest.resetModules();
    });

    it("should display 0 when streak is not in localStorage", () => {
        // Mock localStorage return value
        localStorage.getItem.mockReturnValue(null);

        const { displayStreak } = require('../../../scripts/components/streak/displayStreak');
        displayStreak();

        const streakDisplay = document.getElementById('display-streak');
        expect(streakDisplay.textContent).toBe("0");
    });

    it("should display correct streak value from localStorage", () => {
        // Mock localStorage return value
        localStorage.getItem.mockReturnValue("5");

        const { displayStreak } = require('../../../scripts/components/streak/displayStreak');
        displayStreak();

        const streakDisplay = document.getElementById('display-streak');
        expect(streakDisplay.textContent).toBe("5");
    });

    it("should handle zero value in localStorage", () => {
        localStorage.getItem.mockReturnValue("0");

        const { displayStreak } = require('../../../scripts/components/streak/displayStreak');
        displayStreak();

        const streakDisplay = document.getElementById('display-streak');
        expect(streakDisplay.textContent).toBe("0");
    });

    it("should handle null value in localStorage", () => {
        localStorage.getItem.mockReturnValue(null);

        const { displayStreak } = require('../../../scripts/components/streak/displayStreak');
        displayStreak();

        const streakDisplay = document.getElementById('display-streak');
        expect(streakDisplay.textContent).toBe("0");
    });
});
