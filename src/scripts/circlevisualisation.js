// circleVisualization.js

/**
 * Render progress circles for each subtask
 * 
 *
*/

const taskColors = [
	"#ff69b4",
	"#4caf50",
	"#00bcd4",
	"#ffd700",
	"#9c27b0",
	"#ff5722",
	"#3f51b5",
	"#009688",
	"#ff9800",
	"#e91e63",
];

/**
 * Render progress circles for each subtask
 * @param {Array} subtasks - Array of subtasks
 */

export function renderProgressCircles(subtasks) {
	const svg = document.querySelector(".progress-rings");
	svg.innerHTML = "";

	const baseRadius = 90;
	const spacing = 5;

	for (const [index, subtask] of subtasks.entries()) {
		// Create background circle
		const bgCircle = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"circle",
		);
		bgCircle.setAttribute("cx", "100");
		bgCircle.setAttribute("cy", "100");
		const radius = baseRadius - index * spacing;
		bgCircle.setAttribute("r", String(radius));
		bgCircle.setAttribute("class", "progress-ring-bg");
		bgCircle.style.stroke = taskColors[index % taskColors.length];
		bgCircle.style.opacity = "0.2";
		svg.appendChild(bgCircle);

		// Create progress circle
		const circle = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"circle",
		);
		circle.setAttribute("cx", "100");
		circle.setAttribute("cy", "100");
		circle.setAttribute("r", String(radius));
		circle.setAttribute("class", "progress-ring");
		circle.style.stroke = taskColors[index % taskColors.length];

		const circumference = 2 * Math.PI * radius;
		circle.style.strokeDasharray = circumference;
		circle.style.strokeDashoffset = circumference * 0.75;

		svg.appendChild(circle);
	}
}

/**
 * Update progress circles based on subtask completion
 * @param {Array} subtasks - Array of subtasks
 */ 

document.addEventListener("updateProgressCircles", (e) => {
	renderProgressCircles(e.detail.subtasks);
});
