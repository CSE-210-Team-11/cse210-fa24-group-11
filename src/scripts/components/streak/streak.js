const streakBtn = document.getElementById("streak-btn");
const lastCheckinEl = document.getElementById("last-checkin");

const STREAK_KEY = "streak";
const LAST_CHECKIN_KEY = "lastCheckin";

let streak = Number.parseInt(localStorage.getItem(STREAK_KEY)) || 0;
let lastCheckin = localStorage.getItem(LAST_CHECKIN_KEY);

function updateUI() {
	streakBtn.textContent = `Streak: ${streak}`;
	lastCheckinEl.textContent = lastCheckin
		? `Last check-in: ${new Date(lastCheckin).toLocaleDateString()}`
		: "Last check-in: Never";

	if (streak > 0) {
		streakBtn.classList.add("clicked");
		streakBtn.classList.remove("default");
	} else {
		streakBtn.classList.add("default");
		streakBtn.classList.remove("clicked");
	}
}

streakBtn.addEventListener("click", () => {
	const today = new Date().setHours(0, 0, 0, 0);

	if (!lastCheckin) {
		streak = 1;
	} else {
		const lastDate = new Date(lastCheckin).setHours(0, 0, 0, 0);
		const diff = (today - lastDate) / (1000 * 60 * 60 * 24);

		if (diff === 1) {
			streak++;
		} else if (diff > 1) {
			streak = 1;
		}
	}

	lastCheckin = new Date().toISOString();
	localStorage.setItem(STREAK_KEY, streak);
	localStorage.setItem(LAST_CHECKIN_KEY, lastCheckin);

	updateUI();
});

updateUI();
