import fs from "node:fs";
import path from "node:path";

describe("Task Page Styles", () => {
	let cssContent;

	beforeAll(() => {
		cssContent = fs.readFileSync(
			path.resolve(__dirname, "../../../styles/pages/task-page.css"),
			"utf8",
		);
	});

	test("should define container layout", () => {
		expect(cssContent).toContain(".container {");
		expect(cssContent).toContain("display: flex");
	});

	test("should define flowchart styles", () => {
		expect(cssContent).toContain(".flowchart {");
		expect(cssContent).toContain("width:");
	});

	test("should define progress view styles", () => {
		expect(cssContent).toContain(".progress-view {");
		expect(cssContent).toContain(".progress-rings {");
	});

	test("should define heading styles", () => {
		expect(cssContent).toContain(".project-heading {");
		expect(cssContent).toContain("h1 {");
	});

	test("should define task and subtask styles", () => {
		expect(cssContent).toContain(".task h3 {");
		expect(cssContent).toContain(".subtask {");
	});
});
