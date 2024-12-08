export function displayStreak() {
    // Retrieve the value of "streak" from localStorage
    const streak = localStorage.getItem('streak');

    // Find the element where the streak will be displayed
    const streakDisplay = document.getElementById('display-streak');

    // Check if the streak exists in localStorage
    if (streak) {
        streakDisplay.textContent = streak; // Render the streak value
    } else {
        streakDisplay.textContent = 0; // Fallback value if "streak" is not set
    }
}
