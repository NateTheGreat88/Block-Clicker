// Artifacts System for Blockclicker
// =================================

// Artifacts data structure
const artifacts = {
    "ancient-clicker": {
        id: "ancient-clicker",
        name: "Ancient Clicker",
        description: "A mysterious device from a forgotten civilization that increases click power.",
        icon: "fas fa-mouse-pointer",
        rarity: "legendary",
        discovered: false,
        active: false,
        discoveryRequirement: "Reach 100,000 clicks",
        discoveryCheck: () => totalClicks >= 100000,
        effect: {
            type: "click_power",
            value: 50, // 50% boost to click power
            description: "+50% Click Power"
        }
    },
    "quantum-cube": {
        id: "quantum-cube",
        name: "Quantum Cube",
        description: "A cube that exists in multiple dimensions simultaneously, boosting block efficiency.",
        icon: "fas fa-cube",
        rarity: "epic",
        discovered: false,
        active: false,
        discoveryRequirement: "Own 50 total blocks",
        discoveryCheck: () => calculateTotalBlocks() >= 50,
        effect: {
            type: "block_efficiency",
            value: 25, // 25% boost to all blocks' production
            description: "+25% Block Efficiency"
        }
    },
    "time-crystal": {
        id: "time-crystal",
        name: "Time Crystal",
        description: "A crystal that bends the flow of time, increasing auto-click speed.",
        icon: "fas fa-hourglass-half",
        rarity: "epic",
        discovered: false,
        active: false,
        discoveryRequirement: "Play for 2 hours total",
        discoveryCheck: () => playTime >= 120, // 120 minutes
        effect: {
            type: "auto_click",
            value: 30, // 30% boost to auto-click speed
            description: "+30% Auto-Click Speed"
        }
    },
    "cosmic-lens": {
        id: "cosmic-lens",
        name: "Cosmic Lens",
        description: "A lens that allows you to see hidden dimensions, enhancing artifact discovery chance.",
        icon: "fas fa-search",
        rarity: "rare",
        discovered: false,
        active: false,
        discoveryRequirement: "Discover 3 other artifacts",
        discoveryCheck: () => getDiscoveredArtifactsCount() >= 3,
        effect: {
            type: "discovery",
            value: 50, // 50% increased chance to discover artifacts
            description: "+50% Artifact Discovery"
        }
    },
    "gilded-hammer": {
        id: "gilded-hammer",
        name: "Gilded Hammer",
        description: "A beautifully crafted hammer that reduces the cost of blocks.",
        icon: "fas fa-hammer",
        rarity: "rare",
        discovered: false,
        active: false,
        discoveryRequirement: "Spend 1,000,000 score",
        discoveryCheck: () => totalSpent >= 1000000,
        effect: {
            type: "block_cost",
            value: 15, // 15% reduction in block costs
            description: "-15% Block Costs"
        }
    },
    "philosophers-stone": {
        id: "philosophers-stone",
        name: "Philosopher's Stone",
        description: "The legendary alchemical substance capable of turning lead into gold. Increases all score gains.",
        icon: "fas fa-donate",
        rarity: "legendary",
        discovered: false,
        active: false,
        discoveryRequirement: "Reach prestige level 5",
        discoveryCheck: () => prestigeLevel >= 5,
        effect: {
            type: "score_gain",
            value: 25, // 25% boost to all score gains
            description: "+25% All Score Gains"
        }
    },
    "enchanted-blueprint": {
        id: "enchanted-blueprint",
        name: "Enchanted Blueprint",
        description: "A magical blueprint that grants a random bonus block on prestige.",
        icon: "fas fa-scroll",
        rarity: "uncommon",
        discovered: false,
        active: false,
        discoveryRequirement: "Prestige 3 times",
        discoveryCheck: () => prestigeCount >= 3,
        effect: {
            type: "prestige_bonus",
            value: 1, // 1 random block on prestige
            description: "Random Bonus Block on Prestige"
        }
    },
    "void-shard": {
        id: "void-shard",
        name: "Void Shard",
        description: "A fragment from the void between realities, providing a chance for free blocks.",
        icon: "fas fa-space-shuttle",
        rarity: "rare",
        discovered: false,
        active: false,
        discoveryRequirement: "Purchase 100 blocks total",
        discoveryCheck: () => totalBlocksPurchased >= 100,
        effect: {
            type: "free_block",
            value: 5, // 5% chance for free blocks
            description: "5% Chance for Free Blocks"
        }
    },
    "prosperity-charm": {
        id: "prosperity-charm",
        name: "Prosperity Charm",
        description: "A lucky charm that increases the prestige points earned.",
        icon: "fas fa-coins",
        rarity: "uncommon",
        discovered: false,
        active: false,
        discoveryRequirement: "Earn 50 total prestige points",
        discoveryCheck: () => prestigeTotalEarned >= 50,
        effect: {
            type: "prestige_points",
            value: 20, // 20% more prestige points
            description: "+20% Prestige Points"
        }
    },
    "fractal-prism": {
        id: "fractal-prism",
        name: "Fractal Prism",
        description: "A prism with infinite reflections inside, boosting critical click chance.",
        icon: "fas fa-certificate",
        rarity: "uncommon",
        discovered: false,
        active: false,
        discoveryRequirement: "Click 1,000 times in one session",
        discoveryCheck: () => sessionClicks >= 1000,
        effect: {
            type: "critical",
            value: 10, // 10% boost to critical click chance
            description: "+10% Critical Click Chance"
        }
    },
    "arcane-codex": {
        id: "arcane-codex",
        name: "Arcane Codex",
        description: "An ancient book of spells that increases overall efficiency.",
        icon: "fas fa-book",
        rarity: "rare",
        discovered: false,
        active: false,
        discoveryRequirement: "Discover 6 other artifacts",
        discoveryCheck: () => getDiscoveredArtifactsCount() >= 6,
        effect: {
            type: "efficiency",
            value: 15, // 15% overall efficiency boost
            description: "+15% Overall Efficiency"
        }
    },
    "celestial-keystone": {
        id: "celestial-keystone",
        name: "Celestial Keystone",
        description: "A key that unlocks the boundaries between worlds, granting a chance for double rewards.",
        icon: "fas fa-key",
        rarity: "epic",
        discovered: false,
        active: false,
        discoveryRequirement: "Reach a score of 10,000,000",
        discoveryCheck: () => score >= 10000000,
        effect: {
            type: "double_reward",
            value: 7, // 7% chance for double rewards
            description: "7% Chance for Double Rewards"
        }
    }
};

// Track variables for artifact discovery requirements
let sessionClicks = 0;
let playTime = 0;
let playTimeInterval;
let activeArtifacts = [];
const MAX_ACTIVE_ARTIFACTS = 3;

// Rarity colors and bonuses
const rarityData = {
    "common": { color: "#aaa", bonus: 0 },
    "uncommon": { color: "#1aff1a", bonus: 5 },
    "rare": { color: "#3498db", bonus: 10 },
    "epic": { color: "#9b59b6", bonus: 20 },
    "legendary": { color: "#f1c40f", bonus: 30 }
};

// Initialize artifacts system
function initializeArtifactsSystem() {
    console.log("Initializing Artifacts System...");
    
    // Load saved artifacts data
    loadArtifacts();
    
    // Start tracking play time for artifacts
    startPlayTimeTracking();
    
    // Check for any newly discovered artifacts
    checkArtifactDiscoveries();
    
    // Update the artifacts UI
    updateArtifactsUI();
    
    // Add event listeners for the artifacts interface
    setupArtifactsEventListeners();
    
    // Hook up menu item click
    const menuItem = document.querySelector('.menu-item[data-section="artifacts"]');
    if (menuItem) {
        menuItem.addEventListener('click', () => {
            showSection('artifacts');
        });
    }
}

// Start tracking play time
function startPlayTimeTracking() {
    // Clear any existing interval first
    if (playTimeInterval) {
        clearInterval(playTimeInterval);
    }
    
    // Update play time every minute
    playTimeInterval = setInterval(() => {
        playTime++;
        // Check for time-based artifacts every 5 minutes
        if (playTime % 5 === 0) {
            checkArtifactDiscoveries();
        }
    }, 60000); // 60000 ms = 1 minute
}

// Check for newly discovered artifacts
function checkArtifactDiscoveries() {
    let newDiscoveries = false;
    
    // Check each artifact's discovery condition
    Object.values(artifacts).forEach(artifact => {
        if (!artifact.discovered && artifact.discoveryCheck()) {
            // Discover the artifact
            artifact.discovered = true;
            newDiscoveries = true;
            
            // Show discovery notification
            showArtifactDiscovery(artifact);
        }
    });
    
    // If new artifacts were discovered, update UI and save game
    if (newDiscoveries) {
        updateArtifactsUI();
        saveGame();
    }
}

// Show artifact discovery notification
function showArtifactDiscovery(artifact) {
    const rarityColor = rarityData[artifact.rarity].color;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'artifact-discovery-notification';
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${artifact.icon}"></i>
        </div>
        <div class="notification-content">
            <h3>New Artifact Discovered!</h3>
            <p class="artifact-name" style="color: ${rarityColor}">${artifact.name}</p>
            <p class="artifact-description">${artifact.description}</p>
            <p class="artifact-effect">${artifact.effect.description}</p>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 1000);
    }, 6000);
    
    // Play discovery sound if not muted
    if (!isSoundMuted) {
        playSound('discovery');
    }
}

// Update artifacts UI
function updateArtifactsUI() {
    const discoveredCount = getDiscoveredArtifactsCount();
    const totalArtifacts = Object.keys(artifacts).length;
    
    // Update discovery count
    const discoveredElement = document.getElementById('artifacts-discovered');
    if (discoveredElement) {
        discoveredElement.textContent = `${discoveredCount}/${totalArtifacts}`;
    }
    
    // Update power bonus
    const powerElement = document.getElementById('artifacts-power');
    if (powerElement) {
        powerElement.textContent = `${calculateTotalArtifactPower()}%`;
    }
    
    // Update rarity bonus
    const rarityElement = document.getElementById('artifacts-rarity-bonus');
    if (rarityElement) {
        rarityElement.textContent = `${calculateRarityBonus()}%`;
    }
    
    // Update artifacts collection grid
    updateArtifactsGrid();
    
    // Update active artifacts slots
    updateActiveArtifactsSlots();
}

// Update artifacts collection grid
function updateArtifactsGrid() {
    const grid = document.querySelector('.artifacts-collection');
    if (!grid) return;
    
    // Clear existing cards
    grid.innerHTML = '';
    
    // Add artifact cards
    Object.values(artifacts).forEach(artifact => {
        const card = createArtifactCard(artifact);
        grid.appendChild(card);
    });
}

// Create artifact card
function createArtifactCard(artifact) {
    const card = document.createElement('div');
    card.className = `artifact-card ${artifact.discovered ? 'discovered' : 'locked'} ${artifact.active ? 'active' : ''}`;
    card.dataset.id = artifact.id;
    
    if (artifact.discovered) {
        // Discovered artifact
        const rarityColor = rarityData[artifact.rarity].color;
        
        card.innerHTML = `
            <div class="artifact-rarity" style="background-color: ${rarityColor}">
                <span>${artifact.rarity.charAt(0).toUpperCase() + artifact.rarity.slice(1)}</span>
            </div>
            <div class="artifact-icon">
                <i class="${artifact.icon}"></i>
            </div>
            <h3 class="artifact-name">${artifact.name}</h3>
            <p class="artifact-description">${artifact.description}</p>
            <div class="artifact-effect">
                <span>${artifact.effect.description}</span>
            </div>
            <button class="artifact-action-btn ${artifact.active ? 'active' : ''}">
                ${artifact.active ? 'Deactivate' : 'Activate'}
            </button>
        `;
        
        // Add event listener to activate/deactivate
        const btn = card.querySelector('.artifact-action-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                toggleArtifactActive(artifact.id);
            });
        }
    } else {
        // Locked artifact
        card.innerHTML = `
            <div class="artifact-icon locked">
                <i class="fas fa-question"></i>
            </div>
            <h3 class="artifact-name">Unknown Artifact</h3>
            <p class="artifact-description">This artifact has not been discovered yet.</p>
            <div class="artifact-requirement">
                <span><i class="fas fa-tasks"></i> ${artifact.discoveryRequirement}</span>
            </div>
        `;
    }
    
    return card;
}

// Update active artifacts slots
function updateActiveArtifactsSlots() {
    const slotsContainer = document.querySelector('.active-artifacts-slots');
    if (!slotsContainer) return;
    
    // Clear existing slots
    slotsContainer.innerHTML = '';
    
    // Create slots
    for (let i = 0; i < MAX_ACTIVE_ARTIFACTS; i++) {
        const slot = document.createElement('div');
        slot.className = 'artifact-slot';
        
        if (i < activeArtifacts.length) {
            // Slot with active artifact
            const artifactId = activeArtifacts[i];
            const artifact = artifacts[artifactId];
            const rarityColor = rarityData[artifact.rarity].color;
            
            slot.innerHTML = `
                <div class="artifact-icon" style="border-color: ${rarityColor}">
                    <i class="${artifact.icon}"></i>
                </div>
                <div class="artifact-slot-info">
                    <h4>${artifact.name}</h4>
                    <p>${artifact.effect.description}</p>
                </div>
                <button class="remove-artifact-btn" data-id="${artifactId}">
                    <i class="fas fa-times"></i>
                </button>
            `;
        } else {
            // Empty slot
            slot.innerHTML = `
                <div class="artifact-icon empty">
                    <i class="fas fa-plus"></i>
                </div>
                <div class="artifact-slot-info">
                    <h4>Empty Slot</h4>
                    <p>Activate an artifact to fill this slot</p>
                </div>
            `;
        }
        
        slotsContainer.appendChild(slot);
    }
    
    // Add event listeners to remove buttons
    const removeButtons = slotsContainer.querySelectorAll('.remove-artifact-btn');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const artifactId = e.currentTarget.dataset.id;
            toggleArtifactActive(artifactId);
            e.stopPropagation();
        });
    });
}

// Toggle artifact active state
function toggleArtifactActive(artifactId) {
    const artifact = artifacts[artifactId];
    if (!artifact || !artifact.discovered) return;
    
    if (artifact.active) {
        // Deactivate artifact
        artifact.active = false;
        activeArtifacts = activeArtifacts.filter(id => id !== artifactId);
    } else {
        // Check if max active artifacts reached
        if (activeArtifacts.length >= MAX_ACTIVE_ARTIFACTS) {
            showNotification("You can only have 3 active artifacts!", "error");
            return;
        }
        
        // Activate artifact
        artifact.active = true;
        activeArtifacts.push(artifactId);
    }
    
    // Update UI and save
    updateArtifactsUI();
    applyArtifactEffects();
    saveGame();
    
    // Play sound
    if (!isSoundMuted) {
        playSound(artifact.active ? 'activate' : 'deactivate');
    }
}

// Apply artifact effects
function applyArtifactEffects() {
    // This function will calculate and apply all effects from active artifacts
    // The actual implementation depends on your game's mechanics
    
    // For now, we'll update the prestige bonuses and other game values
    updatePrestigeUI();
    
    // Recalculate block costs if gilded hammer is active
    if (isArtifactEffectActive('block_cost')) {
        updateShopPrices();
    }
}

// Check if a specific artifact effect is active
function isArtifactEffectActive(effectType) {
    return activeArtifacts.some(id => artifacts[id].effect.type === effectType);
}

// Get effect value for a specific effect type
function getArtifactEffectValue(effectType) {
    let totalValue = 0;
    activeArtifacts.forEach(id => {
        const artifact = artifacts[id];
        if (artifact.effect.type === effectType) {
            totalValue += artifact.effect.value;
        }
    });
    return totalValue;
}

// Get total discovered artifacts count
function getDiscoveredArtifactsCount() {
    return Object.values(artifacts).filter(a => a.discovered).length;
}

// Calculate total artifact power (sum of all active effects)
function calculateTotalArtifactPower() {
    let total = 0;
    activeArtifacts.forEach(id => {
        const artifact = artifacts[id];
        total += artifact.effect.value;
    });
    return total;
}

// Calculate rarity bonus
function calculateRarityBonus() {
    let bonus = 0;
    activeArtifacts.forEach(id => {
        const artifact = artifacts[id];
        bonus += rarityData[artifact.rarity].bonus;
    });
    return bonus;
}

// Setup artifacts event listeners
function setupArtifactsEventListeners() {
    // Add click tracking for artifact discovery
    document.getElementById('clicker').addEventListener('click', () => {
        sessionClicks++;
        // Check for discoveries every 50 clicks
        if (sessionClicks % 50 === 0) {
            checkArtifactDiscoveries();
        }
    });
}

// Load artifacts data from save
function loadArtifacts() {
    const savedArtifacts = localStorage.getItem('blockclicker_artifacts');
    if (savedArtifacts) {
        const artifactsData = JSON.parse(savedArtifacts);
        
        // Update artifacts data
        if (artifactsData.discovered) {
            Object.keys(artifactsData.discovered).forEach(id => {
                if (artifacts[id]) {
                    artifacts[id].discovered = artifactsData.discovered[id];
                }
            });
        }
        
        // Update active artifacts
        if (artifactsData.active) {
            activeArtifacts = artifactsData.active.filter(id => artifacts[id] && artifacts[id].discovered);
            // Update active state on artifacts
            activeArtifacts.forEach(id => {
                if (artifacts[id]) {
                    artifacts[id].active = true;
                }
            });
        }
        
        // Update playtime
        if (artifactsData.playTime) {
            playTime = artifactsData.playTime;
        }
    }
}

// Save artifacts data
function saveArtifacts() {
    const discoveredData = {};
    Object.keys(artifacts).forEach(id => {
        discoveredData[id] = artifacts[id].discovered;
    });
    
    const artifactsData = {
        discovered: discoveredData,
        active: activeArtifacts,
        playTime: playTime
    };
    
    localStorage.setItem('blockclicker_artifacts', JSON.stringify(artifactsData));
}

// Override the original save function to include artifacts
const originalSaveGame = saveGame;
saveGame = function() {
    // Call original save function
    originalSaveGame();
    
    // Save artifacts
    saveArtifacts();
};

// Override the original load function to include artifacts
const originalLoadGame = loadGame;
loadGame = function() {
    // Call original load function
    originalLoadGame();
    
    // Load artifacts
    loadArtifacts();
    
    // Apply artifact effects
    applyArtifactEffects();
};

// Helper function to calculate total blocks owned
function calculateTotalBlocks() {
    let total = 0;
    Object.values(blockInventory).forEach(count => {
        total += count;
    });
    return total;
}

// Helper function to handle click with artifact effects
const originalHandleClick = handleClick;
handleClick = function(event) {
    // Apply artifact effects to click value
    if (isArtifactEffectActive('click_power')) {
        const bonus = getArtifactEffectValue('click_power') / 100;
        clickValue = Math.ceil(baseClickValue * (1 + prestigeMultiplier + bonus));
    }
    
    // Apply critical click chance from artifacts
    if (isArtifactEffectActive('critical')) {
        const bonusChance = getArtifactEffectValue('critical') / 100;
        // Implement critical click logic here
        const isCritical = Math.random() < bonusChance;
        if (isCritical) {
            clickValue *= 2;
            // Show critical hit effect
            showCriticalHit(event);
        }
    }
    
    // Call the original click handler
    originalHandleClick(event);
    
    // Double reward chance from Celestial Keystone
    if (isArtifactEffectActive('double_reward')) {
        const doubleChance = getArtifactEffectValue('double_reward') / 100;
        if (Math.random() < doubleChance) {
            score += clickValue;
            updateScore();
            showDoubleReward(event);
        }
    }
};

// Show critical hit effect
function showCriticalHit(event) {
    const critText = document.createElement('div');
    critText.className = 'critical-hit';
    critText.textContent = 'CRITICAL!';
    critText.style.left = `${event.clientX}px`;
    critText.style.top = `${event.clientY}px`;
    document.body.appendChild(critText);
    
    setTimeout(() => {
        critText.remove();
    }, 1500);
    
    // Play critical sound
    if (!isSoundMuted) {
        playSound('critical');
    }
}

// Show double reward effect
function showDoubleReward(event) {
    const doubleText = document.createElement('div');
    doubleText.className = 'double-reward';
    doubleText.textContent = 'DOUBLE REWARD!';
    doubleText.style.left = `${event.clientX}px`;
    doubleText.style.top = `${event.clientY}px`;
    document.body.appendChild(doubleText);
    
    setTimeout(() => {
        doubleText.remove();
    }, 1500);
    
    // Play double reward sound
    if (!isSoundMuted) {
        playSound('double');
    }
}

// Modify shop price calculation to account for block price discount artifacts
const originalCalculateBlockPrice = calculateBlockPrice;
calculateBlockPrice = function(basePrice, level) {
    // Get the original price
    let price = originalCalculateBlockPrice(basePrice, level);
    
    // Apply block price discount if active
    if (isArtifactEffectActive('block_cost')) {
        const discountPercent = getArtifactEffectValue('block_cost');
        price = Math.floor(price * (1 - discountPercent / 100));
    }
    
    return price;
}; 