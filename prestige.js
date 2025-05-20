// Prestige System
const PrestigeSystem = {
    // Prestige stats
    prestigePoints: 0,
    totalPrestigePoints: 0,
    prestigeLevel: 0,
    lastPrestigeScore: 0,

    // Prestige upgrades
    upgrades: {
        'click-power': {
            name: 'Enhanced Clicking',
            description: 'Permanently increase click power by 25% per level',
            baseCost: 2,
            costMultiplier: 1.5,
            maxLevel: 10,
            level: 0,
            effect: (level) => 1 + (level * 0.25),
            icon: 'fa-hand-pointer'
        },
        'auto-efficiency': {
            name: 'Auto-Click Mastery',
            description: 'Permanently increase auto-click efficiency by 30% per level',
            baseCost: 3,
            costMultiplier: 1.6,
            maxLevel: 8,
            level: 0,
            effect: (level) => 1 + (level * 0.3),
            icon: 'fa-robot'
        },
        'block-value': {
            name: 'Block Enhancement',
            description: 'Permanently increase block rewards by 40% per level',
            baseCost: 4,
            costMultiplier: 1.7,
            maxLevel: 6,
            level: 0,
            effect: (level) => 1 + (level * 0.4),
            icon: 'fa-cubes'
        },
        'chain-power': {
            name: 'Chain Amplification',
            description: 'Permanently increase chain reaction power by 50% per level',
            baseCost: 5,
            costMultiplier: 1.8,
            maxLevel: 5,
            level: 0,
            effect: (level) => 1 + (level * 0.5),
            icon: 'fa-link'
        },
        'starting-bonus': {
            name: 'Head Start',
            description: 'Start with bonus resources after prestige',
            baseCost: 3,
            costMultiplier: 2,
            maxLevel: 3,
            level: 0,
            effect: (level) => level * 1000,
            icon: 'fa-rocket'
        }
    },

    // Initialize the prestige system
    init() {
        this.loadPrestigeData();
        this.createPrestigeUI();
        this.updatePrestigeDisplay();
        this.applyPrestigeEffects();
    },

    // Load saved prestige data
    loadPrestigeData() {
        const savedData = localStorage.getItem('prestigeData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.prestigePoints = data.prestigePoints || 0;
            this.totalPrestigePoints = data.totalPrestigePoints || 0;
            this.prestigeLevel = data.prestigeLevel || 0;
            this.lastPrestigeScore = data.lastPrestigeScore || 0;

            // Load upgrade levels
            if (data.upgrades) {
                for (const [key, upgrade] of Object.entries(data.upgrades)) {
                    if (this.upgrades[key]) {
                        this.upgrades[key].level = upgrade.level || 0;
                    }
                }
            }
        }
    },

    // Save prestige data
    savePrestigeData() {
        const data = {
            prestigePoints: this.prestigePoints,
            totalPrestigePoints: this.totalPrestigePoints,
            prestigeLevel: this.prestigeLevel,
            lastPrestigeScore: this.lastPrestigeScore,
            upgrades: {}
        };

        // Save upgrade levels
        for (const [key, upgrade] of Object.entries(this.upgrades)) {
            data.upgrades[key] = {
                level: upgrade.level
            };
        }

        localStorage.setItem('prestigeData', JSON.stringify(data));
    },

    // Create the prestige UI
    createPrestigeUI() {
        // Create prestige button in the sidebar
        const prestigeButton = document.createElement('div');
        prestigeButton.className = 'menu-item';
        prestigeButton.setAttribute('data-section', 'prestige');
        prestigeButton.innerHTML = `
            <i class="fas fa-sync-alt"></i>
            <span>Prestige</span>
            <div class="prestige-points-badge">0</div>
        `;
        document.querySelector('.sidebar-menu').appendChild(prestigeButton);

        // Create prestige section
        const prestigeSection = document.createElement('div');
        prestigeSection.id = 'prestige-section';
        prestigeSection.className = 'game-section hidden';
        prestigeSection.innerHTML = `
            <h2 class="section-title">Prestige System</h2>
            <div class="prestige-container">
                <div class="prestige-info">
                    <div class="prestige-stats">
                        <div class="prestige-stat">
                            <span class="stat-label">Prestige Points:</span>
                            <span class="stat-value" id="prestige-points">0</span>
                        </div>
                        <div class="prestige-stat">
                            <span class="stat-label">Prestige Level:</span>
                            <span class="stat-value" id="prestige-level">0</span>
                        </div>
                        <div class="prestige-stat">
                            <span class="stat-label">Total Points Earned:</span>
                            <span class="stat-value" id="total-prestige-points">0</span>
                        </div>
                    </div>
                    <div class="prestige-action">
                        <button id="prestige-button" class="prestige-btn" disabled>
                            <i class="fas fa-sync-alt"></i>
                            Prestige Now
                            <span class="points-preview">+0 Points</span>
                        </button>
                        <p class="prestige-requirement">Reach 1,000,000 score to prestige</p>
                    </div>
                </div>
                <div class="prestige-upgrades" id="prestige-upgrades">
                    <!-- Upgrades will be added here -->
                </div>
            </div>
        `;
        document.querySelector('.main-content').appendChild(prestigeSection);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .prestige-points-badge {
                position: absolute;
                right: 10px;
                background: var(--accent-color, #4682ff);
                color: white;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 0.8rem;
                min-width: 20px;
                text-align: center;
            }

            .prestige-container {
                max-width: 900px;
                margin: 0 auto;
                padding: 20px;
            }

            .prestige-info {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .prestige-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
            }

            .prestige-stat {
                text-align: center;
            }

            .stat-label {
                color: #aaa;
                font-size: 0.9rem;
                margin-bottom: 5px;
                display: block;
            }

            .stat-value {
                font-size: 1.5rem;
                font-weight: bold;
                color: var(--accent-color, #4682ff);
            }

            .prestige-action {
                text-align: center;
            }

            .prestige-btn {
                background: var(--accent-color, #4682ff);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 25px;
                font-size: 1.2rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
                margin: 0 auto;
            }

            .prestige-btn:disabled {
                background: #666;
                cursor: not-allowed;
                opacity: 0.7;
            }

            .prestige-btn:not(:disabled):hover {
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(70, 130, 255, 0.5);
            }

            .points-preview {
                font-size: 0.9rem;
                opacity: 0.8;
            }

            .prestige-requirement {
                color: #aaa;
                font-size: 0.9rem;
                margin-top: 10px;
            }

            .prestige-upgrades {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
            }

            .prestige-upgrade {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 10px;
                padding: 15px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
            }

            .prestige-upgrade:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }

            .upgrade-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }

            .upgrade-icon {
                width: 40px;
                height: 40px;
                background: rgba(70, 130, 255, 0.2);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                color: var(--accent-color, #4682ff);
            }

            .upgrade-title {
                flex: 1;
            }

            .upgrade-name {
                font-weight: bold;
                margin: 0;
            }

            .upgrade-level {
                font-size: 0.8rem;
                color: #aaa;
            }

            .upgrade-description {
                font-size: 0.9rem;
                color: #bbb;
                margin-bottom: 15px;
                min-height: 40px;
            }

            .upgrade-progress {
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                margin-bottom: 10px;
                overflow: hidden;
            }

            .upgrade-progress-bar {
                height: 100%;
                background: var(--accent-color, #4682ff);
                width: 0%;
                transition: width 0.3s ease;
            }

            .upgrade-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .upgrade-cost {
                color: #ffd700;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .upgrade-button {
                background: rgba(70, 130, 255, 0.2);
                color: var(--accent-color, #4682ff);
                border: 1px solid var(--accent-color, #4682ff);
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .upgrade-button:hover:not(:disabled) {
                background: var(--accent-color, #4682ff);
                color: white;
            }

            .upgrade-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .prestige-confirmation {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }

            .confirmation-content {
                background: #222;
                border-radius: 10px;
                padding: 20px;
                max-width: 400px;
                width: 90%;
                text-align: center;
            }

            .confirmation-title {
                font-size: 1.5rem;
                margin-bottom: 20px;
                color: var(--accent-color, #4682ff);
            }

            .confirmation-message {
                margin-bottom: 20px;
                color: #bbb;
            }

            .confirmation-buttons {
                display: flex;
                justify-content: center;
                gap: 10px;
            }

            .confirm-btn, .cancel-btn {
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .confirm-btn {
                background: var(--accent-color, #4682ff);
                color: white;
                border: none;
            }

            .cancel-btn {
                background: transparent;
                color: #aaa;
                border: 1px solid #aaa;
            }

            .confirm-btn:hover {
                transform: scale(1.05);
            }

            .cancel-btn:hover {
                color: white;
                border-color: white;
            }
        `;
        document.head.appendChild(style);

        // Add event listeners
        prestigeButton.addEventListener('click', () => this.showPrestigeSection());
        document.getElementById('prestige-button').addEventListener('click', () => this.showPrestigeConfirmation());

        // Create upgrade elements
        this.createUpgradeElements();
    },

    // Create upgrade elements
    createUpgradeElements() {
        const container = document.getElementById('prestige-upgrades');
        container.innerHTML = '';

        for (const [key, upgrade] of Object.entries(this.upgrades)) {
            const element = document.createElement('div');
            element.className = 'prestige-upgrade';
            element.innerHTML = `
                <div class="upgrade-header">
                    <div class="upgrade-icon">
                        <i class="fas ${upgrade.icon}"></i>
                    </div>
                    <div class="upgrade-title">
                        <h3 class="upgrade-name">${upgrade.name}</h3>
                        <div class="upgrade-level">Level ${upgrade.level}/${upgrade.maxLevel}</div>
                    </div>
                </div>
                <div class="upgrade-description">${upgrade.description}</div>
                <div class="upgrade-progress">
                    <div class="upgrade-progress-bar" style="width: ${(upgrade.level / upgrade.maxLevel) * 100}%"></div>
                </div>
                <div class="upgrade-footer">
                    <div class="upgrade-cost">
                        <i class="fas fa-sync-alt"></i>
                        ${this.calculateUpgradeCost(key)}
                    </div>
                    <button class="upgrade-button" onclick="PrestigeSystem.purchaseUpgrade('${key}')"
                            ${upgrade.level >= upgrade.maxLevel ? 'disabled' : ''}>
                        Upgrade
                    </button>
                </div>
            `;
            container.appendChild(element);
        }
    },

    // Show prestige section
    showPrestigeSection() {
        // Hide all sections
        document.querySelectorAll('.game-section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show prestige section
        document.getElementById('prestige-section').classList.remove('hidden');

        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === 'prestige') {
                item.classList.add('active');
            }
        });
    },

    // Calculate prestige points based on current score
    calculatePrestigePoints(score) {
        // Ensure score is a valid number
        const numericScore = parseInt(score) || 0;
        // Base formula: sqrt(score / 1000000)
        const points = Math.floor(Math.sqrt(Math.max(0, numericScore) / 1000000));
        console.log('Calculating prestige points:', { numericScore, points }); // Debug log
        return points;
    },

    // Calculate upgrade cost
    calculateUpgradeCost(upgradeKey) {
        const upgrade = this.upgrades[upgradeKey];
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
    },

    // Purchase an upgrade
    purchaseUpgrade(upgradeKey) {
        const upgrade = this.upgrades[upgradeKey];
        const cost = this.calculateUpgradeCost(upgradeKey);

        if (this.prestigePoints >= cost && upgrade.level < upgrade.maxLevel) {
            this.prestigePoints -= cost;
            upgrade.level++;
            this.savePrestigeData();
            this.updatePrestigeDisplay();
            this.applyPrestigeEffects();
            this.createUpgradeElements();

            // Show upgrade effect message
            this.showUpgradeEffect(upgrade);
        }
    },

    // Show upgrade effect message
    showUpgradeEffect(upgrade) {
        const message = document.createElement('div');
        message.className = 'upgrade-effect-message';
        message.innerHTML = `
            <i class="fas ${upgrade.icon}"></i>
            ${upgrade.name} upgraded to level ${upgrade.level}!
        `;
        message.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: var(--accent-color, #4682ff);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            animation: fade-up 2s forwards;
            z-index: 1000;
        `;

        document.body.appendChild(message);
        setTimeout(() => message.remove(), 2000);
    },

    // Show prestige confirmation dialog
    showPrestigeConfirmation() {
        // Get current score from the score element
        const currentScore = parseInt(document.getElementById('score').textContent) || 0;
        const points = this.calculatePrestigePoints(currentScore);
        const dialog = document.createElement('div');
        dialog.className = 'prestige-confirmation';
        dialog.innerHTML = `
            <div class="confirmation-content">
                <h2 class="confirmation-title">Confirm Prestige</h2>
                <p class="confirmation-message">
                    Are you sure you want to prestige?<br>
                    You will receive <strong>${points} Prestige Points</strong><br>
                    but will lose all current progress!
                </p>
                <div class="confirmation-buttons">
                    <button class="cancel-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Cancel
                    </button>
                    <button class="confirm-btn" onclick="PrestigeSystem.performPrestige()">
                        Confirm
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
    },

    // Perform prestige
    performPrestige() {
        // Get current score from the score element
        const currentScore = parseInt(document.getElementById('score').textContent) || 0;
        
        // Calculate prestige points
        const points = this.calculatePrestigePoints(currentScore);
        this.prestigePoints += points;
        this.totalPrestigePoints += points;
        this.prestigeLevel++;
        this.lastPrestigeScore = currentScore;

        // Save prestige data
        this.savePrestigeData();

        // Reset game progress
        this.resetGameProgress();

        // Apply starting bonus if available
        const startingBonus = this.upgrades['starting-bonus'].effect(this.upgrades['starting-bonus'].level);
        if (startingBonus > 0) {
            document.getElementById('score').textContent = startingBonus;
        }

        // Update displays
        this.updatePrestigeDisplay();
        this.applyPrestigeEffects();

        // Remove confirmation dialog
        document.querySelector('.prestige-confirmation').remove();

        // Show prestige effect
        this.showPrestigeEffect(points);
    },

    // Show prestige effect
    showPrestigeEffect(points) {
        const effect = document.createElement('div');
        effect.className = 'prestige-effect';
        effect.innerHTML = `
            <div class="effect-content">
                <i class="fas fa-sync-alt fa-spin"></i>
                <h2>Prestige Complete!</h2>
                <p>+${points} Prestige Points</p>
            </div>
        `;
        effect.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fade-in-out 3s forwards;
        `;

        const style = document.createElement('style');
        style.textContent = `
            .effect-content {
                text-align: center;
                color: white;
            }
            .effect-content i {
                font-size: 4rem;
                color: var(--accent-color, #4682ff);
                margin-bottom: 20px;
            }
            .effect-content h2 {
                font-size: 2rem;
                margin: 10px 0;
            }
            .effect-content p {
                font-size: 1.5rem;
                color: var(--accent-color, #4682ff);
            }
            @keyframes fade-in-out {
                0% { opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(effect);

        setTimeout(() => {
            effect.remove();
            style.remove();
        }, 3000);
    },

    // Reset game progress
    resetGameProgress() {
        // Reset score
        document.getElementById('score').textContent = '0';
        if (typeof window.score !== 'undefined') {
            window.score = 0;
        }

        // Reset other game variables
        if (typeof window.clickMultiplier !== 'undefined') {
            window.clickMultiplier = 1;
        }
        if (typeof window.autoClickValue !== 'undefined') {
            window.autoClickValue = 0;
        }
        if (typeof window.bonusClickChance !== 'undefined') {
            window.bonusClickChance = 0;
        }

        // Clear inventory
        if (typeof window.blockInventory !== 'undefined') {
            for (const blockType in window.blockInventory) {
                window.blockInventory[blockType].count = 0;
            }
            // Refresh inventory display
            if (typeof window.refreshInventory === 'function') {
                window.refreshInventory();
            }
        }

        // Clear build area
        if (typeof window.clearBuild === 'function') {
            window.clearBuild();
        }
    },

    // Update prestige display
    updatePrestigeDisplay() {
        // Get current score from the score element
        const currentScore = parseInt(document.getElementById('score').textContent) || 0;
        console.log('Current score:', currentScore); // Debug log

        // Update points display
        document.getElementById('prestige-points').textContent = this.prestigePoints;
        document.getElementById('prestige-level').textContent = this.prestigeLevel;
        document.getElementById('total-prestige-points').textContent = this.totalPrestigePoints;
        document.querySelector('.prestige-points-badge').textContent = this.prestigePoints;

        // Update prestige button
        const prestigeButton = document.getElementById('prestige-button');
        const pointsPreview = this.calculatePrestigePoints(currentScore);
        prestigeButton.querySelector('.points-preview').textContent = `+${pointsPreview} Points`;
        
        if (currentScore >= 1000000) {
            prestigeButton.disabled = false;
            document.querySelector('.prestige-requirement').style.display = 'none';
        } else {
            prestigeButton.disabled = true;
            document.querySelector('.prestige-requirement').style.display = 'block';
            const remaining = Math.max(0, 1000000 - currentScore);
            document.querySelector('.prestige-requirement').textContent = 
                `Reach ${remaining.toLocaleString()} more score to prestige`;
        }

        // Update upgrade buttons
        for (const [key, upgrade] of Object.entries(this.upgrades)) {
            const cost = this.calculateUpgradeCost(key);
            const button = document.querySelector(`button[onclick="PrestigeSystem.purchaseUpgrade('${key}')"]`);
            if (button) {
                button.disabled = this.prestigePoints < cost || upgrade.level >= upgrade.maxLevel;
            }
        }
    },

    // Apply prestige effects
    applyPrestigeEffects() {
        // Apply click power upgrade
        const clickPowerMultiplier = this.upgrades['click-power'].effect(this.upgrades['click-power'].level);
        window.baseClickMultiplier = clickPowerMultiplier;

        // Apply auto-click efficiency upgrade
        const autoEfficiencyMultiplier = this.upgrades['auto-efficiency'].effect(this.upgrades['auto-efficiency'].level);
        window.baseAutoClickMultiplier = autoEfficiencyMultiplier;

        // Apply block value upgrade
        const blockValueMultiplier = this.upgrades['block-value'].effect(this.upgrades['block-value'].level);
        window.blockRewardMultiplier = blockValueMultiplier;

        // Apply chain power upgrade
        const chainPowerMultiplier = this.upgrades['chain-power'].effect(this.upgrades['chain-power'].level);
        window.chainReactionMultiplier = chainPowerMultiplier;
    }
};

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    PrestigeSystem.init();
});