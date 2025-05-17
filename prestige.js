// Prestige System
const prestigeSystem = {
    points: 0,
    totalPoints: 0,
    multiplier: 1,
    upgrades: {
        clickMultiplier: { level: 0, cost: 1, effect: 0.1, maxLevel: 10 },
        autoClickRate: { level: 0, cost: 1, effect: 0.05, maxLevel: 10 },
        blockDiscount: { level: 0, cost: 1, effect: 0.02, maxLevel: 40 },
        startingBlocks: { level: 0, cost: 1, effect: 1, maxLevel: 10 }
    },

    // Calculate prestige points based on current score
    calculatePoints() {
        return Math.floor(Math.sqrt(window.score / 10000));
    },

    // Check if player can prestige
    canPrestige() {
        return this.calculatePoints() > 0;
    },

    // Perform prestige reset
    prestige() {
        const pointsToGain = this.calculatePoints();
        
        // Add points
        this.points += pointsToGain;
        this.totalPoints += pointsToGain;
        
        // Reset game progress
        window.score = 0;
        window.clickMultiplier = 1;
        window.autoClickValue = 0;
        window.bonusClickChance = 0;
        window.clicks = 0;
        window.clickTimes = [];
        
        // Reset inventory
        for (let blockType in window.blockInventory) {
            window.blockInventory[blockType].count = 0;
        }
        
        // Apply starting bonuses from upgrades
        if (this.upgrades.startingBlocks.level > 0) {
            const freeBlocks = this.upgrades.startingBlocks.level;
            window.blockInventory['red-block'].count += freeBlocks;
            window.blockInventory['blue-block'].count += freeBlocks;
        }
        
        // Apply permanent multipliers
        if (this.upgrades.clickMultiplier.level > 0) {
            window.clickMultiplier += this.upgrades.clickMultiplier.level * this.upgrades.clickMultiplier.effect;
        }
        
        if (this.upgrades.autoClickRate.level > 0) {
            window.autoClickValue += this.upgrades.autoClickRate.level * this.upgrades.autoClickRate.effect;
        }
        
        // Save data
        this.saveData();
        
        // Update UI
        this.updateUI();
        window.refreshInventory();
        window.updateScore();
    },

    // Purchase an upgrade
    purchaseUpgrade(upgradeType) {
        const upgrade = this.upgrades[upgradeType];
        
        if (this.points >= upgrade.cost && upgrade.level < upgrade.maxLevel) {
            this.points -= upgrade.cost;
            upgrade.level++;
            
            // Apply upgrade effect
            switch(upgradeType) {
                case 'clickMultiplier':
                    window.clickMultiplier += upgrade.effect;
                    break;
                case 'autoClickRate':
                    window.autoClickValue += upgrade.effect;
                    break;
                case 'blockDiscount':
                    this.updateShopPrices();
                    break;
            }
            
            // Save and update UI
            this.saveData();
            this.updateUI();
            return true;
        }
        return false;
    },

    // Save prestige data
    saveData() {
        localStorage.setItem('prestigeData', JSON.stringify({
            points: this.points,
            totalPoints: this.totalPoints,
            upgrades: this.upgrades
        }));
    },

    // Load prestige data
    loadData() {
        const savedData = localStorage.getItem('prestigeData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.points = data.points;
            this.totalPoints = data.totalPoints;
            this.upgrades = data.upgrades;
            
            // Apply permanent upgrades
            if (this.upgrades.clickMultiplier.level > 0) {
                window.clickMultiplier += this.upgrades.clickMultiplier.level * this.upgrades.clickMultiplier.effect;
            }
            if (this.upgrades.autoClickRate.level > 0) {
                window.autoClickValue += this.upgrades.autoClickRate.level * this.upgrades.autoClickRate.effect;
            }
            if (this.upgrades.blockDiscount.level > 0) {
                this.updateShopPrices();
            }
        }
    },

    // Update shop prices based on block discount upgrade
    updateShopPrices() {
        const discount = Math.min(0.8, this.upgrades.blockDiscount.level * this.upgrades.blockDiscount.effect);
        
        document.querySelectorAll('.shop-item').forEach(item => {
            const basePrice = parseInt(item.getAttribute('data-base-price') || item.getAttribute('data-price'));
            const discountedPrice = Math.floor(basePrice * (1 - discount));
            item.setAttribute('data-price', discountedPrice);
            item.querySelector('.price-value').textContent = discountedPrice;
        });
    },

    // Update UI elements
    updateUI() {
        // Update points displays
        document.getElementById('prestige-points').textContent = this.points;
        document.getElementById('total-prestige-points').textContent = this.totalPoints;
        document.getElementById('next-prestige-points').textContent = this.calculatePoints();
        
        // Update upgrade buttons and displays
        for (const [type, upgrade] of Object.entries(this.upgrades)) {
            const button = document.getElementById(`upgrade-${type}`);
            if (button) {
                button.disabled = this.points < upgrade.cost || upgrade.level >= upgrade.maxLevel;
                
                const levelDisplay = document.getElementById(`${type}-level`);
                if (levelDisplay) {
                    levelDisplay.textContent = `Level ${upgrade.level}/${upgrade.maxLevel}`;
                }
                
                const effectDisplay = document.getElementById(`${type}-effect`);
                if (effectDisplay) {
                    const effect = (upgrade.effect * upgrade.level * 100).toFixed(0);
                    effectDisplay.textContent = `+${effect}%`;
                }
            }
        }
        
        // Update prestige button
        const prestigeButton = document.getElementById('prestige-now');
        if (prestigeButton) {
            prestigeButton.disabled = !this.canPrestige();
        }
    },

    // Initialize the prestige system
    initialize() {
        // Load saved data
        this.loadData();
        
        // Add event listeners
        document.getElementById('prestige-now')?.addEventListener('click', () => {
            document.getElementById('prestige-modal').style.display = 'block';
        });
        
        document.getElementById('prestige-confirm')?.addEventListener('change', function() {
            document.getElementById('confirm-prestige').disabled = !this.checked;
        });
        
        document.getElementById('confirm-prestige')?.addEventListener('click', () => {
            this.prestige();
            document.getElementById('prestige-modal').style.display = 'none';
        });
        
        document.getElementById('cancel-prestige')?.addEventListener('click', () => {
            document.getElementById('prestige-modal').style.display = 'none';
        });
        
        document.querySelector('.close-modal')?.addEventListener('click', () => {
            document.getElementById('prestige-modal').style.display = 'none';
        });
        
        // Add upgrade button listeners
        for (const type of Object.keys(this.upgrades)) {
            document.getElementById(`upgrade-${type}`)?.addEventListener('click', () => {
                this.purchaseUpgrade(type);
            });
        }
        
        // Update UI
        this.updateUI();
    }
};

// Export the prestige system
window.prestigeSystem = prestigeSystem;

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    prestigeSystem.initialize();
}); 