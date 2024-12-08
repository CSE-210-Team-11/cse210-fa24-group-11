import fs from "node:fs";
import path from "node:path";

describe("Home Page", () => {
	beforeAll(() => {
		const html = fs.readFileSync(
			path.resolve(__dirname, "../../pages/home.html"),
			"utf8",
		);
		document.documentElement.innerHTML = html;
	});

	test("renders the greeting message", () => {
		const greeting = document.querySelector(".greeting");
		expect(greeting).toBeTruthy();
	});

	test("renders the quote container elements", () => {
		const quoteContainer = document.getElementById("quote-container");
		expect(quoteContainer).toBeTruthy();

		const quoteText = document.getElementById("quote-text");
		expect(quoteText).toBeTruthy();

		const quoteAuthor = document.getElementById("quote-author");
		expect(quoteAuthor).toBeTruthy();
	});

	test("renders the buttons with correct text", () => {
		const buttons = document.querySelectorAll("button");
		expect(buttons.length).toBe(1);
		expect(buttons[0].textContent).toContain("Projects");
	});

	test("renders the tree art image", () => {
		const treeArt = document.querySelector(".tree-art");
		expect(treeArt).toBeTruthy();
	});
});
