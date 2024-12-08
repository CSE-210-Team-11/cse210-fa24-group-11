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
		expect(cssContent).toContain("background-color: #0f1b2e");
	});

	test("should define project list container styles", () => {
		expect(cssContent).toContain(".project-list {");
		expect(cssContent).toContain("flex-direction: column");
	});

	test("should define project card styles", () => {
		expect(cssContent).toContain(".project-card {");
		expect(cssContent).toContain("background-color: #0f1b2e");
	});

	test("should define streak button styles", () => {
		expect(cssContent).toContain(".streak-btn {");
		expect(cssContent).toContain("border-radius: 5px");
	});

	test("should define popup styles", () => {
		expect(cssContent).toContain(".popup {");
		expect(cssContent).toContain(".popup-container {");
	});
});
