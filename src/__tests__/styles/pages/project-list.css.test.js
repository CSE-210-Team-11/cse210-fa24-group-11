import fs from "node:fs";
import path from "node:path";

describe("Project List Styles", () => {
	let cssContent;

	beforeAll(() => {
		cssContent = fs.readFileSync(
			path.resolve(__dirname, "../../../styles/pages/project-list.css"),
			"utf8",
		);
	});

	test("should define basic body styles", () => {
		expect(cssContent).toContain("body {");
	});

	test("should define project list container styles", () => {
		expect(cssContent).toContain(".project-list {");
		expect(cssContent).toContain("flex-direction: column");
	});

	test("should define project card styles", () => {
		expect(cssContent).toContain(".project-card {");
	});

	test("should define streak button styles", () => {
		expect(cssContent).toContain(".streak-btn {");
	});

	test("should define popup styles", () => {
		expect(cssContent).toContain(".popup {");
		expect(cssContent).toContain(".popup-container {");
	});
});
