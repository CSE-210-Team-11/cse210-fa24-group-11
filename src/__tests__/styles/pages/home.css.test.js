import fs from "node:fs";
import path from "node:path";

describe("home.css", () => {
	let styleSheet;

	beforeAll(() => {
		const cssPath = path.resolve(__dirname, "../../../styles/pages/home.css");
		const css = fs.readFileSync(cssPath, "utf8");

		styleSheet = document.createElement("style");
		styleSheet.appendChild(document.createTextNode(css));
		document.head.appendChild(styleSheet);
	});

	afterAll(() => {
		document.head.removeChild(styleSheet);
	});

	test("greeting-div should use a block alignment", () => {
		document.body.innerHTML = '<div class="greeting-div"></div>';
		const greetingDiv = document.querySelector(".greeting-div");
		const styles = window.getComputedStyle(greetingDiv);
		expect(styles.display).toBe("block");
	});
});
