import fs from "node:fs";
import path from "node:path";
import { jest } from "@jest/globals";

describe("Project List Page", () => {
	beforeAll(() => {
		const html = fs.readFileSync(
			path.resolve(__dirname, "../../pages/project-list.html"),
			"utf8",
		);
		document.documentElement.innerHTML = html;
	});

	test("renders project list container", () => {
		const projectList = document.querySelector(".project-list");
		expect(projectList).toBeTruthy();
	});

	test("has create project button", () => {
		const createButton = document.querySelector("#create-project-btn");
		expect(createButton).toBeTruthy();
		expect(createButton.textContent).toContain("Create Project");
	});

	test("has popup container", () => {
		const popup = document.querySelector("#popup-container");
		expect(popup).toBeTruthy();
		expect(popup.classList.contains("hidden")).toBeTruthy();
	});

	test("has project form elements", () => {
		const form = document.querySelector("#project-form");
		const select = document.querySelector("#project-name");
		const submitBtn = form.querySelector('button[type="submit"]');
		const cancelBtn = document.querySelector("#popup-close");

		expect(form).toBeTruthy();
		expect(select).toBeTruthy();
		expect(submitBtn).toBeTruthy();
		expect(cancelBtn).toBeTruthy();
	});

	test("has streak elements", () => {
		const streakBtn = document.querySelector("#streak-btn");
		const lastCheckin = document.querySelector("#last-checkin");

		expect(streakBtn).toBeTruthy();
		expect(streakBtn.textContent).toContain("Streak");
		expect(lastCheckin).toBeTruthy();
		expect(lastCheckin.textContent).toContain("check-in");
	});
});
