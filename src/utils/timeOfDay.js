const dayStart = 6;
const nightStart = 20;

/**
 * Calculates whether it is day or night based on the current timestamp
 * @returns {string} - "day" or "night"
 */
export function getTimeOfDay() {
	const date = new Date();
	const hour = date.getHours();
	if (hour > dayStart && hour < nightStart) {
		return "day";
	}
	
	return "night";
}