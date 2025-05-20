// Daily Reward System
const DailyReward = {
    rewardAmounts: [500, 750, 1000, 1500, 2000, 3000, 5000], // Score for each day
    maxStreak: 7,
    rewardKey: 'dailyReward',
    blockTypes: [
        'red-block', 'blue-block', 'gold-block', 'purple-block', 'green-block', 'black-block',
        'rainbow-block', 'crystal-block', 'obsidian-block', 'reactor-block', 'quantum-block'
    ],
    powerUps: [
        { name: 'Rapid Click', icon: 'fa-bolt', color: '#ff3e3e' },
        { name: 'Auto Boost', icon: 'fa-robot', color: '#4682ff' },
        { name: 'Gold Rush', icon: 'fa-coins', color: '#ffd700' },
        { name: 'Chain Master', icon: 'fa-link', color: '#8a2be2' },
        { name: 'Block Frenzy', icon: 'fa-magic', color: '#32cd32' }
    ],

    init() {
        this.loadData();
        this.createUI();
        this.updateUI();
    },

    loadData() {
        const data = JSON.parse(localStorage.getItem(this.rewardKey) || '{}');
        this.lastClaim = data.lastClaim || 0;
        this.streak = data.streak || 0;
    },

    saveData() {
        localStorage.setItem(this.rewardKey, JSON.stringify({
            lastClaim: this.lastClaim,
            streak: this.streak
        }));
    },

    canClaim() {
        const now = Date.now();
        // 24 hours = 86400000 ms
        return now - this.lastClaim >= 86400000;
    },

    timeUntilNext() {
        const now = Date.now();
        const ms = Math.max(0, 86400000 - (now - this.lastClaim));
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    },

    claimReward() {
        if (!this.canClaim()) return;
        this.streak = (this.streak % this.maxStreak) + 1;
        this.lastClaim = Date.now();
        this.saveData();
        if (this.streak === this.maxStreak) {
            this.grantGoldenChest();
        } else {
            this.grantRandomReward(this.streak);
        }
        this.updateUI();
    },

    grantRandomReward(streakDay) {
        // Randomly choose reward type: 0=score, 1=block, 2=power-up
        const rewardType = Math.floor(Math.random() * 3);
        if (rewardType === 0) {
            // Score
            const reward = this.rewardAmounts[streakDay - 1] || 500;
            this.addScore(reward);
            this.showRewardEffect(`+${reward} Score!`, 'fa-coins', '#ffd700');
        } else if (rewardType === 1) {
            // Block
            const block = this.blockTypes[Math.floor(Math.random() * this.blockTypes.length)];
            if (window.blockInventory && window.blockInventory[block]) {
                window.blockInventory[block].count++;
                if (typeof window.refreshInventory === 'function') window.refreshInventory();
            }
            this.showRewardEffect(`+1 ${this.formatBlockName(block)}`, 'fa-cube', '#4682ff');
        } else {
            // Power-up
            const power = this.powerUps[Math.floor(Math.random() * this.powerUps.length)];
            this.showRewardEffect(`Power-Up: ${power.name}!`, power.icon, power.color);
            // Optionally, trigger the power-up effect here if you want
        }
    },

    grantGoldenChest() {
        // 7th day: big bonus - all 3 types
        const score = 10000;
        this.addScore(score);
        // 3 random blocks
        let blockMsg = '';
        for (let i = 0; i < 3; i++) {
            const block = this.blockTypes[Math.floor(Math.random() * this.blockTypes.length)];
            if (window.blockInventory && window.blockInventory[block]) {
                window.blockInventory[block].count++;
                blockMsg += `${this.formatBlockName(block)}, `;
            }
        }
        if (typeof window.refreshInventory === 'function') window.refreshInventory();
        // 2 random power-ups
        let powerMsg = '';
        for (let i = 0; i < 2; i++) {
            const power = this.powerUps[Math.floor(Math.random() * this.powerUps.length)];
            powerMsg += `${power.name}, `;
        }
        this.showChestEffect(score, blockMsg.slice(0, -2), powerMsg.slice(0, -2));
    },

    addScore(amount) {
        const scoreElem = document.getElementById('score');
        let score = parseInt(scoreElem.textContent) || 0;
        score += amount;
        scoreElem.textContent = score;
        if (typeof window.score !== 'undefined') window.score = score;
    },

    showRewardEffect(text, icon, color) {
        const effect = document.createElement('div');
        effect.className = 'bonus-indicator';
        effect.style.color = color;
        effect.style.fontSize = '1.5rem';
        effect.innerHTML = `<i class="fas ${icon}"></i><br>${text}`;
        effect.style.left = `${Math.random() * 30 + 35}%`;
        effect.style.top = `${Math.random() * 20 + 40}%`;
        effect.style.zIndex = '1000';
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 2200);
    },

    showChestEffect(score, blocks, powers) {
        const effect = document.createElement('div');
        effect.className = 'bonus-indicator';
        effect.style.color = '#ffd700';
        effect.style.fontSize = '2rem';
        effect.style.background = 'rgba(0,0,0,0.7)';
        effect.style.border = '3px solid gold';
        effect.style.borderRadius = '20px';
        effect.style.padding = '20px';
        effect.innerHTML = `<i class="fas fa-treasure-chest fa-bounce"></i><br><b>Golden Chest!</b><br>+${score} Score<br>Blocks: ${blocks}<br>Power-Ups: ${powers}`;
        effect.style.left = '40%';
        effect.style.top = '35%';
        effect.style.zIndex = '2000';
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 3500);
    },

    formatBlockName(block) {
        return block.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },

    createUI() {
        // Add to profile section (or main-content if you prefer)
        let container = document.getElementById('daily-reward-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'daily-reward-container';
            container.style.margin = '20px auto';
            container.style.maxWidth = '400px';
            container.style.background = 'rgba(0,0,0,0.2)';
            container.style.borderRadius = '10px';
            container.style.padding = '20px';
            container.style.textAlign = 'center';
            container.style.border = '1px solid rgba(255,255,255,0.1)';
            container.innerHTML = `
                <h3 style="color:#ffd700;">Daily Reward</h3>
                <div id="daily-reward-status"></div>
                <button id="daily-reward-claim" class="profile-btn profile-btn-primary" style="margin-top:10px;">
                    <i class="fas fa-gift"></i> Claim Reward
                </button>
                <div id="daily-reward-timer" style="margin-top:8px;color:#aaa;"></div>
            `;
            // Insert at top of profile section
            const profileSection = document.getElementById('profile-section');
            if (profileSection) {
                profileSection.insertBefore(container, profileSection.firstChild);
            } else {
                document.body.appendChild(container);
            }
        }
        document.getElementById('daily-reward-claim').onclick = () => this.claimReward();
    },

    updateUI() {
        const status = document.getElementById('daily-reward-status');
        const claimBtn = document.getElementById('daily-reward-claim');
        const timer = document.getElementById('daily-reward-timer');
        if (this.canClaim()) {
            if (this.streak === this.maxStreak) {
                status.innerHTML = `Streak: <b>${this.streak}</b> day(s)<br><b>Golden Chest available!</b>`;
            } else {
                status.innerHTML = `Streak: <b>${this.streak}</b> day(s)<br>Next Reward: <b>Random Bonus</b>`;
            }
            claimBtn.disabled = false;
            timer.textContent = '';
        } else {
            status.innerHTML = `Streak: <b>${this.streak}</b> day(s)`;
            claimBtn.disabled = true;
            timer.textContent = `Next reward in: ${this.timeUntilNext()}`;
            // Update timer every second
            clearTimeout(this._timer);
            this._timer = setTimeout(() => this.updateUI(), 1000);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => DailyReward.init()); 