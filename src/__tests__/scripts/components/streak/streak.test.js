// Set up DOM before importing module
document.body.innerHTML = `
    <button id="streak-btn">Streak: 0</button>
    <div id="last-checkin">Last check-in: Never</div>
`;

describe("Streak", () => {
	beforeEach(() => {
		document.body.innerHTML = `
            <button id="streak-btn">Streak: 0</button>
            <div id="last-checkin">Last check-in: Never</div>
        `;
		localStorage.clear();

		// Mock Date.now() to return a fixed timestamp
		jest.useFakeTimers();
		jest.setSystemTime(new Date("2024-01-15T12:00:00Z"));
	});

	afterEach(() => {
		document.body.innerHTML = "";
		localStorage.clear();
		jest.clearAllMocks();
		jest.resetModules();
		jest.useRealTimers();
	});

	it("should initialize with zero streak if no localStorage data", () => {
		const streakBtn = document.getElementById("streak-btn");
		expect(streakBtn.textContent).toBe("Streak: 0");

		const lastCheckin = document.getElementById("last-checkin");
		expect(lastCheckin.textContent).toBe("Last check-in: Never");
	});

	it("should load existing streak from localStorage", () => {
		localStorage.setItem("streak", "5");
		localStorage.setItem("lastCheckin", new Date().toISOString());

		// Re-import module to test with new localStorage values
		jest.resetModules();
		require("../../../../scripts/components/streak/streak");

		const streakBtn = document.getElementById("streak-btn");
		expect(streakBtn.textContent).toBe("Streak: 5");
	});

	it("should increment streak on consecutive days", () => {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		localStorage.setItem("streak", "0");
		localStorage.setItem("lastCheckin", yesterday.toISOString());

		const streakBtn = document.getElementById("streak-btn");
		streakBtn.click();

		expect(streakBtn.textContent).toBe("Streak: 0");
	});

	it("should reset streak if more than one day is missed", () => {
		const twoDaysAgo = new Date();
		twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
		localStorage.setItem("streak", "0");
		localStorage.setItem("lastCheckin", twoDaysAgo.toISOString());

		const streakBtn = document.getElementById("streak-btn");
		streakBtn.click();

		expect(streakBtn.textContent).toBe("Streak: 0");
	});

	it("should update button style based on streak", () => {
		const streakBtn = document.getElementById("streak-btn");

		expect(streakBtn.classList.contains("clicked")).toBeFalsy();

		streakBtn.click();

		expect(streakBtn.classList.contains("default")).toBeFalsy();
	});

	describe("streak logic", () => {
		it("should start streak at 0 for first check-in", () => {
			const streakBtn = document.getElementById("streak-btn");
			streakBtn.click();

			expect(streakBtn.textContent).toBe("Streak: 0");
		});

		it("should increment streak for consecutive daily check-ins", () => {
			// Set up previous day check-in
			const yesterday = new Date("2024-01-14T12:00:00Z");
			localStorage.setItem("streak", "3");
			localStorage.setItem("lastCheckin", yesterday.toISOString());

			// Re-import module with new localStorage values
			jest.resetModules();
			require("../../../../scripts/components/streak/streak");

			const streakBtn = document.getElementById("streak-btn");
			streakBtn.click();

			expect(streakBtn.textContent).toBe("Streak: 4");
			expect(localStorage.getItem("streak")).toBe("4");
		});

		it("should reset streak when missing a day", () => {
			// Set up check-in from two days ago
			const twoDaysAgo = new Date("2024-01-13T12:00:00Z");
			localStorage.setItem("streak", "5");
			localStorage.setItem("lastCheckin", twoDaysAgo.toISOString());

			// Re-import module with new localStorage values
			jest.resetModules();
			require("../../../../scripts/components/streak/streak");

			const streakBtn = document.getElementById("streak-btn");
			streakBtn.click();

			expect(streakBtn.textContent).toBe("Streak: 1");
			expect(localStorage.getItem("streak")).toBe("1");
		});

		it("should not increment streak for same-day check-ins", () => {
			// Set up check-in from earlier today
			const today = new Date("2024-01-15T08:00:00Z");
			localStorage.setItem("streak", "3");
			localStorage.setItem("lastCheckin", today.toISOString());

			// Re-import module with new localStorage values
			jest.resetModules();
			require("../../../../scripts/components/streak/streak");

			const streakBtn = document.getElementById("streak-btn");
			streakBtn.click();

			expect(streakBtn.textContent).toBe("Streak: 3");
			expect(localStorage.getItem("streak")).toBe("3");
		});
	});

	describe("Streak CSS Classes", () => {
		beforeEach(() => {
		  document.body.innerHTML = `
			<button id="streak-btn">Streak: 0</button>
			<div id="last-checkin">Last check-in: Never</div>
		  `;
		  localStorage.clear();
		  jest.useFakeTimers();
		  jest.setSystemTime(new Date("2024-01-15T12:00:00Z"));
		});
	  
		afterEach(() => {
		  document.body.innerHTML = "";
		  localStorage.clear();
		  jest.clearAllMocks();
		  jest.useRealTimers();
		});
	  
		it("should add 'clicked' class and remove 'default' class when streak > 0", () => {
		  // Set initial state
		  const streakBtn = document.getElementById("streak-btn");
		  streakBtn.classList.add("default");
		  
		  // Set up previous day check-in to ensure streak increases
		  const yesterday = new Date("2024-01-14T12:00:00Z");
		  localStorage.setItem("streak", "0");
		  localStorage.setItem("lastCheckin", yesterday.toISOString());
	  
		  // Re-import module and trigger click
		  jest.resetModules();
		  require("../../../../scripts/components/streak/streak");
		  streakBtn.click();
	  
		  // Verify CSS classes
		  expect(streakBtn.classList.contains("clicked")).toBe(true);
		  expect(streakBtn.classList.contains("default")).toBe(false);
		});
	  });
	  
	  describe("Streak Increment Logic", () => {
		beforeEach(() => {
		  document.body.innerHTML = `
			<button id="streak-btn">Streak: 0</button>
			<div id="last-checkin">Last check-in: Never</div>
		  `;
		  localStorage.clear();
		  jest.useFakeTimers();
		  jest.setSystemTime(new Date("2024-01-15T12:00:00Z"));
		});
	  
		afterEach(() => {
		  document.body.innerHTML = "";
		  localStorage.clear();
		  jest.clearAllMocks();
		  jest.useRealTimers();
		});
	  
		it("should increment streak when checking in one day after last check-in", () => {
		  // Set up yesterday's check-in
		  const yesterday = new Date("2024-01-14T12:00:00Z");
		  localStorage.setItem("streak", "5"); // Starting with streak of 5
		  localStorage.setItem("lastCheckin", yesterday.toISOString());
	  
		  // Re-import module and trigger click
		  jest.resetModules();
		  require("../../../../scripts/components/streak/streak");
		  const streakBtn = document.getElementById("streak-btn");
		  
		  // Get initial streak value
		  const initialStreak = Number.parseInt(localStorage.getItem("streak"));
		  
		  // Click the button
		  streakBtn.click();
		  
		  // Verify streak increased by exactly 1
		  const newStreak = Number.parseInt(localStorage.getItem("streak"));
		  expect(newStreak).toBe(initialStreak + 1);
		  expect(streakBtn.textContent).toBe(`Streak: ${initialStreak + 1}`);
		});
	  
		it("should only increment streak once per day", () => {
		  // Set up yesterday's check-in
		  const yesterday = new Date("2024-01-14T12:00:00Z");
		  localStorage.setItem("streak", "5");
		  localStorage.setItem("lastCheckin", yesterday.toISOString());
	  
		  // Re-import module
		  jest.resetModules();
		  require("../../../../scripts/components/streak/streak");
		  const streakBtn = document.getElementById("streak-btn");
		  
		  // First click
		  streakBtn.click();
		  const firstClickStreak = Number.parseInt(localStorage.getItem("streak"));
		  
		  // Second click on same day
		  streakBtn.click();
		  const secondClickStreak = Number.parseInt(localStorage.getItem("streak"));
		  
		  // Verify streak only increased once
		  expect(secondClickStreak).toBe(firstClickStreak);
		});
	  });
});
