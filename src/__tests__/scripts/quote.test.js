import { motivationalQuotes } from "../../scripts/quote.js";

describe("motivationalQuotes", () => {
	it("should be an array", () => {
		expect(Array.isArray(motivationalQuotes)).toBe(true);
	});

	it("should contain objects with text and author properties", () => {
		for (const quote of motivationalQuotes) {
			expect(quote).toHaveProperty("text");
			expect(quote).toHaveProperty("author");
			expect(typeof quote.text).toBe("string");
			expect(typeof quote.author).toBe("string");
		}
	});

	it("should have at least one quote", () => {
		expect(motivationalQuotes.length).toBeGreaterThan(0);
	});
});
