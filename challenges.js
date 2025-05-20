// Advanced Challenge System
const ChallengeSystem = {
    challengeKey: 'currentChallenge',
    progressKey: 'challengeProgress',
    lastAssignKey: 'lastChallengeAssign',
    advancedThreshold: 1, // Minimum prestige level for advanced challenges
    challengeTypes: [
        // Basic
        { id: 'score', desc: 'Earn {n} score in a day', min: 100000, max: 10000000, reward: 10000 },
        { id: 'blocks', desc: 'Place {n} blocks', min: 50, max: 500, reward: 5000 },
        { id: 'chain', desc: 'Trigger {n} chain reactions', min: 5, max: 30, reward: 7000 },
        // Advanced
        { id: 'prestige', desc: 'Prestige {n} times', min: 1, max: 2, reward: 25000, advanced: true },
        { id: 'rainbow', desc: 'Place {n} rainbow blocks', min: 1, max: 5, reward: 15000, advanced: true },
        { id: 'powerup', desc: 'Activate {n} power-ups', min: 3, max: 10, reward: 12000, advanced: true },
        { id: 'minigame', desc: 'Score {n} in the minigame', min: 1000, max: 10000, reward: 9000, advanced: true }
    ],

    current: null,
    progress: 0,
    lastAssign: 0,

    init() {
        this.load();
        this.createUI();
        this.updateUI();
        this.listenForProgress();
    },

    load() {
        this.current = JSON.parse(localStorage.getItem(this.challengeKey) || 'null');
        this.progress = parseInt(localStorage.getItem(this.progressKey)) || 0;
        this.lastAssign = parseInt(localStorage.getItem(this.lastAssignKey)) || 0;
        // Assign new challenge if needed
        if (!this.current || this.isExpired()) {
            this.assignNewChallenge();
        }
    },

    save() {
        localStorage.setItem(this.challengeKey, JSON.stringify(this.current));
        localStorage.setItem(this.progressKey, this.progress);
        localStorage.setItem(this.lastAssignKey, this.lastAssign);
    },

    isExpired() {
        // Daily challenge: expires every 24h
        return (Date.now() - this.lastAssign) > 86400000;
    },

    assignNewChallenge() {
        // Determine if user is advanced
        const prestige = (window.PrestigeSystem && PrestigeSystem.prestigeLevel) || 0;
        const advanced = prestige >= this.advancedThreshold;
        // Filter challenge pool
        const pool = this.challengeTypes.filter(c => !c.advanced || advanced);
        const challenge = pool[Math.floor(Math.random() * pool.length)];
        // Randomize target
        const n = Math.floor(Math.random() * (challenge.max - challenge.min + 1)) + challenge.min;
        this.current = { ...challenge, n };
        this.progress = 0;
        this.lastAssign = Date.now();
        this.save();
    },

    createUI() {
        let container = document.getElementById('challenge-panel');
        if (!container) {
            container = document.createElement('div');
            container.id = 'challenge-panel';
            container.style.margin = '20px auto';
            container.style.maxWidth = '400px';
            container.style.background = 'rgba(0,0,0,0.2)';
            container.style.borderRadius = '10px';
            container.style.padding = '20px';
            container.style.textAlign = 'center';
            container.style.border = '1px solid rgba(255,255,255,0.1)';
            container.innerHTML = `
                <h3 style="color:#ff6347;">Daily Challenge</h3>
                <div id="challenge-desc"></div>
                <div id="challenge-progress-bar" style="background:#222;height:10px;border-radius:5px;margin:10px 0;overflow:hidden;"><div id="challenge-progress-fill" style="background:#ff6347;height:100%;width:0%;transition:width 0.5s;"></div></div>
                <div id="challenge-progress-text"></div>
                <button id="challenge-claim-btn" class="profile-btn profile-btn-primary" style="margin-top:10px;display:none;">
                    <i class="fas fa-trophy"></i> Claim Reward
                </button>
                <div id="challenge-timer" style="margin-top:8px;color:#aaa;"></div>
            `;
            // Insert at top of profile section
            const profileSection = document.getElementById('profile-section');
            if (profileSection) {
                profileSection.insertBefore(container, profileSection.firstChild.nextSibling);
            } else {
                document.body.appendChild(container);
            }
        }
        document.getElementById('challenge-claim-btn').onclick = () => this.claimReward();
    },

    updateUI() {
        if (!this.current) return;
        const desc = document.getElementById('challenge-desc');
        const progressText = document.getElementById('challenge-progress-text');
        const fill = document.getElementById('challenge-progress-fill');
        const claimBtn = document.getElementById('challenge-claim-btn');
        const timer = document.getElementById('challenge-timer');
        desc.innerHTML = this.current.desc.replace('{n}', `<b>${this.current.n}</b>`);
        const percent = Math.min(100, Math.floor((this.progress / this.current.n) * 100));
        fill.style.width = percent + '%';
        progressText.innerHTML = `Progress: <b>${this.progress}</b> / <b>${this.current.n}</b>`;
        if (this.progress >= this.current.n) {
            claimBtn.style.display = '';
        } else {
            claimBtn.style.display = 'none';
        }
        // Timer for next challenge
        const ms = Math.max(0, 86400000 - (Date.now() - this.lastAssign));
        if (ms > 0) {
            const h = Math.floor(ms / 3600000);
            const m = Math.floor((ms % 3600000) / 60000);
            const s = Math.floor((ms % 60000) / 1000);
            timer.textContent = `Next challenge in: ${h}h ${m}m ${s}s`;
            clearTimeout(this._timer);
            this._timer = setTimeout(() => this.updateUI(), 1000);
        } else {
            timer.textContent = '';
        }
    },

    claimReward() {
        if (!this.current || this.progress < this.current.n) return;
        // Grant reward
        if (this.current.reward) {
            const scoreElem = document.getElementById('score');
            let score = parseInt(scoreElem.textContent) || 0;
            score += this.current.reward;
            scoreElem.textContent = score;
            if (typeof window.score !== 'undefined') window.score = score;
        }
        // Show effect
        this.showRewardEffect(this.current.reward);
        // Assign new challenge
        this.assignNewChallenge();
        this.updateUI();
    },

    showRewardEffect(amount) {
        const effect = document.createElement('div');
        effect.className = 'bonus-indicator';
        effect.style.color = '#ff6347';
        effect.style.fontSize = '1.5rem';
        effect.innerHTML = `<i class="fas fa-trophy"></i><br>Challenge Complete!<br>+${amount} Score`;
        effect.style.left = `${Math.random() * 30 + 35}%`;
        effect.style.top = `${Math.random() * 20 + 40}%`;
        effect.style.zIndex = '1000';
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 2500);
    },

    listenForProgress() {
        // Hook into game events for progress
        // Example: listen for block placement, score, prestige, etc.
        // You can expand these hooks as needed for your game
        const self = this;
        // Score
        const origIncrementScore = window.incrementScore;
        window.incrementScore = function(amount) {
            origIncrementScore.apply(this, arguments);
            if (self.current && self.current.id === 'score') {
                self.progress += amount;
                self.save();
                self.updateUI();
            }
        };
        // Block placement
        const origPlaceBlock = window.placeBlock;
        window.placeBlock = function(cell, blockType, isRegenerating) {
            origPlaceBlock.apply(this, arguments);
            if (self.current && self.current.id === 'blocks') {
                self.progress++;
                self.save();
                self.updateUI();
            }
            if (self.current && self.current.id === 'rainbow' && blockType === 'rainbow-block') {
                self.progress++;
                self.save();
                self.updateUI();
            }
        };
        // Chain reactions (example: call this in your chain reaction system)
        window.onChainReaction = function() {
            if (self.current && self.current.id === 'chain') {
                self.progress++;
                self.save();
                self.updateUI();
            }
        };
        // Power-up activation (example: call this in your power-up system)
        window.onPowerUp = function() {
            if (self.current && self.current.id === 'powerup') {
                self.progress++;
                self.save();
                self.updateUI();
            }
        };
        // Prestige
        const origPerformPrestige = window.PrestigeSystem && window.PrestigeSystem.performPrestige;
        if (origPerformPrestige) {
            window.PrestigeSystem.performPrestige = function() {
                origPerformPrestige.apply(this, arguments);
                if (self.current && self.current.id === 'prestige') {
                    self.progress++;
                    self.save();
                    self.updateUI();
                }
            };
        }
        // Minigame score (example: call this in your minigame system)
        window.onMinigameScore = function(score) {
            if (self.current && self.current.id === 'minigame') {
                self.progress = Math.max(self.progress, score);
                self.save();
                self.updateUI();
            }
        };
    }
};

document.addEventListener('DOMContentLoaded', () => ChallengeSystem.init()); 