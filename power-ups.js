// Power-Up System
const PowerUpSystem = {
    // Active power-ups
    activePowerUps: [],
    
    // Power-up definitions
    powerUps: {
        'rapid-click': {
            name: 'Rapid Click',
            description: 'Doubles click value for 30 seconds',
            duration: 30000,
            icon: 'fa-bolt',
            color: '#ff3e3e',
            effect: (activate) => {
                if (activate) {
                    window.clickMultiplier *= 2;
                } else {
                    window.clickMultiplier /= 2;
                }
            }
        },
        'auto-boost': {
            name: 'Auto Boost',
            description: 'Triples auto-click speed for 20 seconds',
            duration: 20000,
            icon: 'fa-tachometer-alt',
            color: '#00eeff',
            effect: (activate) => {
                if (activate) {
                    window.autoClickValue *= 3;
                } else {
                    window.autoClickValue /= 3;
                }
            }
        },
        'gold-rush': {
            name: 'Gold Rush',
            description: 'All blocks give 5x rewards for 15 seconds',
            duration: 15000,
            icon: 'fa-coins',
            color: '#ffd700',
            effect: (activate) => {
                window.goldRushActive = activate;
            }
        },
        'chain-master': {
            name: 'Chain Master',
            description: 'Chain reactions have double range for 25 seconds',
            duration: 25000,
            icon: 'fa-link',
            color: '#8a2be2',
            effect: (activate) => {
                window.chainReactionRange = activate ? 2 : 1;
            }
        },
        'block-frenzy': {
            name: 'Block Frenzy',
            description: 'Place blocks instantly for 10 seconds',
            duration: 10000,
            icon: 'fa-cubes',
            color: '#32cd32',
            effect: (activate) => {
                window.instantPlacement = activate;
            }
        }
    },

    // Initialize the power-up system
    init() {
        this.createPowerUpDisplay();
        this.startPowerUpDrops();
    },

    // Create the power-up display container
    createPowerUpDisplay() {
        const container = document.createElement('div');
        container.id = 'power-up-container';
        container.className = 'power-up-container';
        document.body.appendChild(container);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .power-up-container {
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                display: flex;
                flex-direction: column;
                gap: 10px;
                z-index: 1000;
            }

            .power-up {
                width: 50px;
                height: 50px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            }

            .power-up:hover {
                transform: scale(1.1);
            }

            .power-up-timer {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 0 0 10px 10px;
            }

            .power-up-tooltip {
                position: absolute;
                right: 60px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 5px;
                font-size: 14px;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.2s;
                pointer-events: none;
            }

            .power-up:hover .power-up-tooltip {
                opacity: 1;
            }

            .power-up-collect {
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: float-up 1.5s ease-out forwards;
                pointer-events: none;
                z-index: 1000;
            }

            @keyframes float-up {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-100px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    },

    // Start random power-up drops
    startPowerUpDrops() {
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every 10 seconds
                this.spawnPowerUp();
            }
        }, 10000);
    },

    // Spawn a random power-up on the game grid
    spawnPowerUp() {
        const powerUpTypes = Object.keys(this.powerUps);
        const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        const powerUp = this.powerUps[randomType];

        // Create power-up element
        const element = document.createElement('div');
        element.className = 'power-up-collect';
        element.innerHTML = `<i class="fas ${powerUp.icon}" style="color: ${powerUp.color}; font-size: 24px;"></i>`;

        // Random position on the grid
        const grid = document.querySelector('.grid-container');
        if (grid) {
            const rect = grid.getBoundingClientRect();
            element.style.left = `${rect.left + Math.random() * rect.width}px`;
            element.style.top = `${rect.top + Math.random() * rect.height}px`;

            document.body.appendChild(element);

            // Click handler
            element.addEventListener('click', () => {
                this.collectPowerUp(randomType);
                element.remove();
            });

            // Remove after 5 seconds if not collected
            setTimeout(() => element.remove(), 5000);
        }
    },

    // Collect and activate a power-up
    collectPowerUp(type) {
        const powerUp = this.powerUps[type];
        
        // Create power-up display
        const element = document.createElement('div');
        element.className = 'power-up';
        element.style.backgroundColor = powerUp.color;
        element.innerHTML = `
            <i class="fas ${powerUp.icon}"></i>
            <div class="power-up-tooltip">${powerUp.name}: ${powerUp.description}</div>
            <div class="power-up-timer"></div>
        `;

        // Add to container
        document.getElementById('power-up-container').appendChild(element);

        // Activate effect
        powerUp.effect(true);
        this.activePowerUps.push({
            type,
            element,
            endTime: Date.now() + powerUp.duration
        });

        // Start timer animation
        const timer = element.querySelector('.power-up-timer');
        timer.style.transition = `width ${powerUp.duration}ms linear`;
        requestAnimationFrame(() => timer.style.width = '0');

        // Remove after duration
        setTimeout(() => {
            powerUp.effect(false);
            element.remove();
            this.activePowerUps = this.activePowerUps.filter(p => p.element !== element);
        }, powerUp.duration);

        // Show collection message
        this.showCollectionMessage(powerUp);
    },

    // Show power-up collection message
    showCollectionMessage(powerUp) {
        const message = document.createElement('div');
        message.className = 'power-up-message';
        message.innerHTML = `
            <i class="fas ${powerUp.icon}"></i>
            ${powerUp.name} activated!
        `;
        message.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background: ${powerUp.color};
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            animation: fade-up 2s forwards;
            z-index: 1000;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fade-up {
                0% { opacity: 0; transform: translate(-50%, 20px); }
                10% { opacity: 1; transform: translate(-50%, 0); }
                80% { opacity: 1; transform: translate(-50%, 0); }
                100% { opacity: 0; transform: translate(-50%, -20px); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
            style.remove();
        }, 2000);
    }
};

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    PowerUpSystem.init();
}); 