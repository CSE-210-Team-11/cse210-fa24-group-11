import fs from "node:fs";
import path from "node:path";

describe("Streak Component Styles", () => {
	let cssContent;

	beforeAll(() => {
		cssContent = fs.readFileSync(
			path.resolve(
				__dirname,
				"../../../../styles/components/streak/streak.css",
			),
			"utf8",
		);
	});

	test("should define basic body styles", () => {
		expect(cssContent).toContain("body {");
		expect(cssContent).toContain("display: flex");
	});

	test("should define streak wrapper styles", () => {
		expect(cssContent).toContain(".streak-wrapper {");
		expect(cssContent).toContain("text-align: center");
	});

	test("should define streak button styles", () => {
		expect(cssContent).toContain(".streak-btn {");
		expect(cssContent).toContain(".streak-btn.default {");
		expect(cssContent).toContain(".streak-btn.clicked {");
	});

	test("should define last check-in styles", () => {
		expect(cssContent).toContain(".last-checkin {");
	});
});
