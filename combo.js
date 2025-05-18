// Combo System for Blockclicker
// =======================

let comboLevel = 0;
let comboTimer = null;
let maxComboLevel = 10;
let comboMultiplier = 1.0;
let lastClickTime = 0;
const COMBO_TIMEOUT = 2000; // 2 seconds to maintain combo
const COMBO_WINDOW = 1000; // 1 second window for optimal timing

// DOM Elements
let comboContainer;
let comboFill;
let comboMultiplierText;

// Initialize the combo system
function initComboSystem() {
    comboContainer = document.querySelector('.combo-container');
    comboFill = document.querySelector('.combo-fill');
    comboMultiplierText = document.querySelector('.combo-multiplier');
    
    // Add the combo artifact
    artifacts["rhythm-crystal"] = {
        id: "rhythm-crystal",
        name: "Rhythm Crystal",
        description: "A mystical crystal that resonates with your clicking rhythm, enhancing combo effects.",
        icon: "fas fa-drum",
        rarity: "legendary",
        discovered: false,
        active: false,
        discoveryRequirement: "Reach combo level 8",
        discoveryCheck: () => comboLevel >= 8,
        effect: {
            type: "combo_power",
            value: 50, // 50% stronger combo effects
            description: "+50% Combo Power"
        }
    };
}

// Handle clicks for the combo system
function handleComboClick() {
    const currentTime = Date.now();
    
    if (lastClickTime === 0) {
        lastClickTime = currentTime;
        incrementCombo();
        return;
    }

    const timeDiff = currentTime - lastClickTime;
    
    // Check if click is within the combo window
    if (timeDiff <= COMBO_WINDOW) {
        incrementCombo();
    } else {
        // Reset combo if clicked too slow or too fast
        resetCombo();
        incrementCombo();
    }
    
    lastClickTime = currentTime;
    updateComboVisuals();
}

// Increment the combo level
function incrementCombo() {
    if (comboLevel < maxComboLevel) {
        comboLevel++;
        updateComboMultiplier();
    }
    
    // Reset the combo timer
    if (comboTimer) clearTimeout(comboTimer);
    comboTimer = setTimeout(resetCombo, COMBO_TIMEOUT);
    
    // Flash effect
    comboContainer.classList.add('combo-flash');
    setTimeout(() => comboContainer.classList.remove('combo-flash'), 300);
}

// Update the combo multiplier based on current level
function updateComboMultiplier() {
    // Base multiplier calculation
    comboMultiplier = 1 + (comboLevel * 0.1); // Each level adds 10% bonus
    
    // Check for Rhythm Crystal artifact bonus
    if (artifacts["rhythm-crystal"].active) {
        comboMultiplier += (comboLevel * 0.05); // Additional 5% per level with artifact
    }
    
    // Update the display
    comboMultiplierText.textContent = `x${comboMultiplier.toFixed(1)}`;
}

// Reset the combo
function resetCombo() {
    comboLevel = 0;
    comboMultiplier = 1.0;
    lastClickTime = 0;
    updateComboVisuals();
    if (comboTimer) {
        clearTimeout(comboTimer);
        comboTimer = null;
    }
}

// Update the visual elements of the combo system
function updateComboVisuals() {
    const fillPercentage = (comboLevel / maxComboLevel) * 100;
    comboFill.style.width = `${fillPercentage}%`;
    comboMultiplierText.textContent = `x${comboMultiplier.toFixed(1)}`;
}

// Get the current combo multiplier for score calculations
function getComboMultiplier() {
    return comboMultiplier;
}

// Save combo state
function saveComboState() {
    const comboState = {
        level: comboLevel,
        multiplier: comboMultiplier,
        maxLevel: maxComboLevel
    };
    localStorage.setItem('comboState', JSON.stringify(comboState));
}

// Load combo state
function loadComboState() {
    const savedState = localStorage.getItem('comboState');
    if (savedState) {
        const state = JSON.parse(savedState);
        comboLevel = state.level;
        comboMultiplier = state.multiplier;
        maxComboLevel = state.maxLevel;
        updateComboVisuals();
    }
}

// Export functions for use in main game
window.ComboSystem = {
    init: initComboSystem,
    handleClick: handleComboClick,
    getMultiplier: getComboMultiplier,
    save: saveComboState,
    load: loadComboState
}; 