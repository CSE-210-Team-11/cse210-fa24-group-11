import { getTimeOfDay } from "../../../src/utils/timeOfDay.js";

describe("Time of Day Tests", () => {
    test("getTimeOfDay returns 'day' during day hours", () => {
        const mockDate = new Date("2024-01-01T10:00:00");
        jest.spyOn(global, "Date").mockImplementation(() => mockDate);

        expect(getTimeOfDay()).toBe("day");

        jest.restoreAllMocks();
    });

    test("getTimeOfDay returns 'night' during night hours", () => {
        const mockDate = new Date("2024-01-01T03:00:00");
        jest.spyOn(global, "Date").mockImplementation(() => mockDate);

        expect(getTimeOfDay()).toBe("night");

        jest.restoreAllMocks();
    });
});
