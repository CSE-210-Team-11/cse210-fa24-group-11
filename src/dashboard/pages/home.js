class HomePage {
    constructor() {
        this.container = document.getElementById('dashboard');
    }

    render() {
        this.container.innerHTML = `
            <div class="container">
                <header class="header">
                    <h1 class="welcome">Welcome Angry Atishay!</h1>
                    <div class="actions" id="action-buttons"></div>
                </header>

                <main>
                    <div class="quote-box">
                        <p class="quote-text" id="quote-text"></p>
                        <p class="quote-author" id="quote-author"></p>
                    </div>

                    <!-- New section below quote-box -->
                    <div class="stats-box">
                        <div class="stat-item">
                            <h3>Tasks Completed</h3>
                            <p id="tasks-completed">25</p>
                        </div>
                        <div class="stat-item">
                            <h3>Tasks In Progress</h3>
                            <p id="tasks-in-progress">5</p>
                        </div>
                        <div class="stat-item">
                            <h3>Days Streak</h3>
                            <p id="days-streak">10</p>
                        </div>
                    </div>
                </main>
            </div>

            <div class="forest-container">
                <svg class="forest-svg" viewBox="0 0 1200 300">
                    <!-- Background Hill -->
                    <path d="M0 220 Q600 180 1200 220 L1200 300 L0 300 Z" fill="#e8f5e9"/>
                    
                    <!-- Trees (Left to Right) -->
                    <g transform="translate(150, 200) scale(0.8)">
                        <path d="M-15 80 L0 0 L15 80" fill="#2d3436"/>
                        <circle cx="0" cy="20" r="35" fill="#27ae60"/>
                        <circle cx="-20" cy="40" r="25" fill="#2ecc71"/>
                        <circle cx="20" cy="40" r="25" fill="#2ecc71"/>
                    </g>

                    <g transform="translate(350, 180) scale(1.2)">
                        <path d="M-15 80 L0 0 L15 80" fill="#2d3436"/>
                        <circle cx="0" cy="20" r="35" fill="#219653"/>
                        <circle cx="-20" cy="40" r="25" fill="#27ae60"/>
                        <circle cx="20" cy="40" r="25" fill="#27ae60"/>
                    </g>

                    <g transform="translate(600, 160) scale(1.4)">
                        <path d="M-15 80 L0 0 L15 80" fill="#2d3436"/>
                        <circle cx="0" cy="20" r="35" fill="#219653"/>
                        <circle cx="-20" cy="40" r="25" fill="#27ae60"/>
                        <circle cx="20" cy="40" r="25" fill="#27ae60"/>
                        <circle cx="0" cy="30" r="30" fill="#2ecc71"/>
                    </g>

                    <g transform="translate(850, 180) scale(1.1)">
                        <path d="M-15 80 L0 0 L15 80" fill="#2d3436"/>
                        <circle cx="0" cy="20" r="35" fill="#219653"/>
                        <circle cx="-20" cy="40" r="25" fill="#27ae60"/>
                        <circle cx="20" cy="40" r="25" fill="#27ae60"/>
                    </g>

                    <g transform="translate(1050, 200) scale(0.9)">
                        <path d="M-15 80 L0 0 L15 80" fill="#2d3436"/>
                        <circle cx="0" cy="20" r="35" fill="#27ae60"/>
                        <circle cx="-20" cy="40" r="25" fill="#2ecc71"/>
                        <circle cx="20" cy="40" r="25" fill="#2ecc71"/>
                    </g>
                </svg>
            </div>
        `;

        // Add buttons
        const actionButtons = document.getElementById('action-buttons');
        const addProjectBtn = new Button('Add Project', 'plus', () => console.log('Add Project clicked'));
        const goToProjectsBtn = new Button('Go to Projects', 'arrow', () => console.log('Go to Projects clicked'));

        actionButtons.appendChild(addProjectBtn.render());
        actionButtons.appendChild(goToProjectsBtn.render());

        // Initialize quotes
        QuoteManager.init();
    }
}

// Initialize the homepage when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const homePage = new HomePage();
    homePage.render();
});