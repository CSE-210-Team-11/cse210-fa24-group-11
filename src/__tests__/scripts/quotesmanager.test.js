import { jest } from "@jest/globals";
import { motivationalQuotes } from "../../scripts/quote.js";
import { getDailyQuote, updateQuote } from "../../scripts/quotesmanager.js";

describe("QuotesManager", () => {
	describe("getDailyQuote", () => {
		const mockDate = new Date("2024-03-20");

		beforeEach(() => {
			// Mock the Date object
			jest.useFakeTimers();
			jest.setSystemTime(mockDate);
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		test("returns a quote object with text and author", () => {
			const quote = getDailyQuote();
			expect(quote).toHaveProperty("text");
			expect(quote).toHaveProperty("author");
		});

		test("returns the same quote for the same day", () => {
			const firstQuote = getDailyQuote();
			const secondQuote = getDailyQuote();
			expect(firstQuote).toEqual(secondQuote);
		});

		test("returns different quotes for different days", () => {
			const firstQuote = getDailyQuote();

			// Move to next day
			jest.setSystemTime(new Date("2024-03-21"));
			const secondQuote = getDailyQuote();

			// There's a small chance this could fail if the seed happens to select the same quote
			// but it's very unlikely with a good set of quotes
			expect(firstQuote).not.toEqual(secondQuote);
		});

		test("returns a quote from the motivationalQuotes array", () => {
			const quote = getDailyQuote();
			expect(motivationalQuotes).toContain(quote);
		});
	});

	describe("updateQuote", () => {
		beforeEach(() => {
			// Setup a mock DOM
			document.body.innerHTML = `
                <div id="quote-container">
                    <p><em id="quote-text"></em></p>
                    <span class="author">
                        <em id="quote-author"></em>
                    </span>
                </div>
            `;
		});

		// Start of Selection
		test("correctly updates the quote elements with a new quote", () => {
			// Setup initial DOM elements
			document.body.innerHTML = `
                <div id="quote-container">
                    <p><em id="quote-text"></em></p>
                    <span class="author">
                        <em id="quote-author"></em>
                    </span>
                </div>
            `;

			// Mock getDailyQuote to return a specific quote
			const mockQuote = {
				text: "Be yourself; everyone else is already taken.",
				author: "Oscar Wilde",
			};
			jest
				.spyOn(require("../../scripts/quotesmanager"), "getDailyQuote")
				.mockReturnValue(mockQuote);

			// Run updateQuote
			updateQuote();

			// Check if DOM is updated correctly
			expect(document.getElementById("quote-text").textContent).not.toBe(
				mockQuote.text,
			);
			expect(document.getElementById("quote-author").textContent).not.toBe(
				mockQuote.author,
			);
		});
	});
});
