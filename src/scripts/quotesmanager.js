import { motivationalQuotes } from "./quote.js";

/**
 * Returns a random quote from the motivationalQuotes array
 * @returns {Object} A quote object with text and author properties
 */
export function getDailyQuote() {
	const today = new Date().toDateString();
	const seed = today
		.split("")
		.reduce((acc, char) => acc + char.charCodeAt(0), 0);
	const index = seed % motivationalQuotes.length;
	return motivationalQuotes[index];
}

/**
 * Updates the DOM with the daily quote
 */
export function updateQuote() {
	const { text, author } = getDailyQuote();
	document.getElementById("quote-text").textContent = text;
	document.getElementById("quote-author").textContent = `~${author}`;
}
