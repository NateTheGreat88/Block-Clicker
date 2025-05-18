// Chain Reaction System for Blockclicker
// =======================

const ChainReactionSystem = {
    // Reaction types between different blocks
    reactions: {
        'red-block': {
            'blue-block': {
                effect: 'steam',
                bonus: 1.5,
                description: 'Fire meets Water!'
            },
            'crystal-block': {
                effect: 'amplify',
                bonus: 2.0,
                description: 'Energy Amplified!'
            }
        },
        'blue-block': {
            'gold-block': {
                effect: 'sparkle',
                bonus: 1.8,
                description: 'Golden Rain!'
            },
            'crystal-block': {
                effect: 'freeze',
                bonus: 1.7,
                description: 'Crystal Freeze!'
            }
        },
        'gold-block': {
            'purple-block': {
                effect: 'riches',
                bonus: 2.2,
                description: 'Royal Fortune!'
            },
            'crystal-block': {
                effect: 'treasure',
                bonus: 2.5,
                description: 'Crystal Fortune!'
            }
        },
        'purple-block': {
            'green-block': {
                effect: 'nature',
                bonus: 1.6,
                description: 'Natural Magic!'
            },
            'crystal-block': {
                effect: 'enchant',
                bonus: 2.0,
                description: 'Crystal Magic!'
            }
        },
        'green-block': {
            'black-block': {
                effect: 'growth',
                bonus: 1.9,
                description: 'Dark Growth!'
            },
            'crystal-block': {
                effect: 'life',
                bonus: 2.1,
                description: 'Crystal Life!'
            }
        }
    },

    // Initialize the system
    init() {
        // Add styles for chain reactions
        const styles = document.createElement('style');
        styles.textContent = `
            @keyframes steam {
                0% { transform: scale(1); opacity: 0.8; filter: blur(0px); }
                50% { transform: scale(1.5); opacity: 0.5; filter: blur(2px); }
                100% { transform: scale(2); opacity: 0; filter: blur(4px); }
            }

            @keyframes sparkle {
                0% { transform: scale(0.8) rotate(0deg); opacity: 1; }
                50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
                100% { transform: scale(0.8) rotate(360deg); opacity: 0; }
            }

            @keyframes freeze {
                0% { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
                50% { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); }
                100% { clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
            }

            @keyframes riches {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(-50px) rotate(360deg); opacity: 0; }
            }

            @keyframes nature {
                0% { transform: scale(1) rotate(0deg); filter: hue-rotate(0deg); }
                50% { transform: scale(1.3) rotate(180deg); filter: hue-rotate(180deg); }
                100% { transform: scale(1) rotate(360deg); filter: hue-rotate(360deg); }
            }

            @keyframes growth {
                0% { transform: scale(0.8); opacity: 0.3; }
                50% { transform: scale(1.2); opacity: 0.7; }
                100% { transform: scale(1.5); opacity: 0; }
            }

            .chain-reaction {
                position: absolute;
                pointer-events: none;
                z-index: 100;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .chain-reaction-effect {
                position: absolute;
                width: 100%;
                height: 100%;
                animation-duration: 1s;
                animation-fill-mode: forwards;
            }

            .chain-reaction-text {
                position: absolute;
                color: white;
                font-size: 0.8rem;
                font-weight: bold;
                text-shadow: 0 0 5px rgba(0,0,0,0.5);
                animation: float-up 1s forwards;
                white-space: nowrap;
            }

            @keyframes float-up {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-30px); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    },

    // Check for possible reactions when placing a block
    checkReactions(cell, blockType) {
        const row = parseInt(cell.getAttribute('data-row'));
        const col = parseInt(cell.getAttribute('data-col'));
        
        // Check adjacent cells
        const adjacentCells = [
            {row: row-1, col: col}, // top
            {row: row+1, col: col}, // bottom
            {row: row, col: col-1}, // left
            {row: row, col: col+1}  // right
        ];

        let totalBonus = 0;
        
        adjacentCells.forEach(pos => {
            const adjacentCell = document.querySelector(`.grid-cell[data-row="${pos.row}"][data-col="${pos.col}"]`);
            if (adjacentCell && adjacentCell.classList.contains('has-block')) {
                const adjacentType = adjacentCell.getAttribute('data-block-type');
                const reaction = this.getReaction(blockType, adjacentType);
                
                if (reaction) {
                    this.triggerReaction(cell, adjacentCell, reaction);
                    totalBonus += reaction.bonus;
                }
            }
        });

        return totalBonus;
    },

    // Get the reaction between two block types
    getReaction(type1, type2) {
        if (this.reactions[type1] && this.reactions[type1][type2]) {
            return this.reactions[type1][type2];
        }
        if (this.reactions[type2] && this.reactions[type2][type1]) {
            return this.reactions[type2][type1];
        }
        return null;
    },

    // Trigger the visual reaction between blocks
    triggerReaction(cell1, cell2, reaction) {
        // Create reaction container
        const reactionContainer = document.createElement('div');
        reactionContainer.className = 'chain-reaction';
        
        // Create effect element
        const effect = document.createElement('div');
        effect.className = 'chain-reaction-effect';
        effect.style.animation = `${reaction.effect} 1s forwards`;
        
        // Set effect color based on reaction
        switch (reaction.effect) {
            case 'steam':
                effect.style.background = 'linear-gradient(white, #88ccff)';
                break;
            case 'sparkle':
                effect.style.background = 'radial-gradient(circle, #ffd700, transparent)';
                break;
            case 'freeze':
                effect.style.background = 'linear-gradient(135deg, #88ccff, white)';
                break;
            case 'riches':
                effect.style.background = 'radial-gradient(circle, #ffd700, #800080)';
                break;
            case 'nature':
                effect.style.background = 'linear-gradient(#32cd32, #006400)';
                break;
            case 'growth':
                effect.style.background = 'radial-gradient(circle, #32cd32, #000000)';
                break;
        }

        // Create text element
        const text = document.createElement('div');
        text.className = 'chain-reaction-text';
        text.textContent = `${reaction.description} (${reaction.bonus}x)`;
        
        // Add elements to container
        reactionContainer.appendChild(effect);
        reactionContainer.appendChild(text);
        
        // Add to both cells
        cell1.appendChild(reactionContainer.cloneNode(true));
        cell2.appendChild(reactionContainer.cloneNode(true));
        
        // Remove after animation
        setTimeout(() => {
            const reactions = document.querySelectorAll('.chain-reaction');
            reactions.forEach(r => r.remove());
        }, 1000);

        // Play reaction sound
        playSound('bonus');
    }
};

// Export the system
window.ChainReactionSystem = ChainReactionSystem; 