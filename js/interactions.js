// Game interactions and message system with error handling

// Enhanced interaction system
function interactWithObject() {
    if (!window.rooms || !window.game) return;
    
    try {
        const room = rooms[game.currentRoom];
        if (!room || !room.objects) return;
        
        let foundInteraction = false;
        
        room.objects.forEach(obj => {
            if (isNearObject && isNearObject(obj)) {
                foundInteraction = true;
                
                if (obj.message === "birthday_surprise") {
                    showBirthdayMessage();
                } else {
                    displayMessage(obj.message);
                    obj.discovered = true;
                    game.discoveries.add(obj.type);
                    game.totalInteractions++;
                    game.lastInteraction = obj.type;
                    createHeartEffect(obj.x + obj.w/2, obj.y);
                    
                    // Cat reaction to player interactions
                    if (typeof catInteractionBehavior === 'function') {
                        catInteractionBehavior(obj.type);
                    }
                }
            }
        });
        
        if (!foundInteraction) {
            displayMessage("Nicholas doesn't see anything interesting here. Try walking closer to objects! 🔍");
        }
    } catch (error) {
        console.error('Interaction error:', error);
        displayMessage("Something went wrong with the interaction! 😅");
    }
}

// Enhanced birthday message with typing effect
function showBirthdayMessage() {
    if (!window.game) return;
    
    try {
        game.birthdayFound = true;
        const room = rooms[game.currentRoom];
        if (room && room.objects) {
            const giftObj = room.objects.find(obj => obj.type === 'gift');
            if (giftObj) giftObj.discovered = true;
        }
        
        const personalMessage = `🎂✨ HAPPY BIRTHDAY NICHOLAS! ✨🎂

Today we celebrate the incredible person you are! Your dedication to fitness inspires everyone around you, your love for your black cat shows your gentle heart, and your amazing style in those perfect black gym clothes makes you look absolutely stunning!

You bring joy, strength, and kindness to everyone lucky enough to know you. May this new year of life bring you endless adventures, achieved goals, and all the happiness your wonderful heart deserves!

Your faithful black cat companion and everyone who loves you wishes you the most magical birthday ever! 🖤✨💪

Keep being the amazing Nicholas we all adore! 🎉`;
        
        displayMessage(personalMessage);
        
        // Enhanced birthday effects
        if (typeof createBirthdaySparkles === 'function') createBirthdaySparkles();
        setTimeout(() => {
            if (typeof createConfettiExplosion === 'function') createConfettiExplosion();
        }, 500);
        setTimeout(() => {
            if (typeof createHeartRain === 'function') createHeartRain();
        }, 1000);
        
    } catch (error) {
        console.error('Birthday message error:', error);
        displayMessage("🎂 HAPPY BIRTHDAY NICHOLAS! 🎂\\n\\nHope your special day is amazing! 🎉");
    }
}

// Enhanced message display with better formatting
function displayMessage(text) {
    try {
        const messageDisplay = document.getElementById('messageDisplay');
        if (!messageDisplay) return;
        
        // Add typing effect for birthday message
        if (text.includes('HAPPY BIRTHDAY')) {
            messageDisplay.textContent = '';
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    messageDisplay.textContent += text.charAt(i);
                    i++;
                    messageDisplay.scrollTop = messageDisplay.scrollHeight;
                    setTimeout(typeWriter, 30);
                }
            };
            typeWriter();
        } else {
            messageDisplay.textContent = text;
            messageDisplay.scrollTop = 0;
        }
    } catch (error) {
        console.error('Display message error:', error);
    }
}

// Enhanced items checking
function checkItems() {
    if (!window.game) return;
    
    try {
        const items = Array.from(game.discoveries);
        const totalItems = getTotalDiscoverableItems();
        
        if (items.length === 0) {
            displayMessage("Nicholas hasn't discovered anything yet! Try walking up to objects and pressing Talk! 🔍");
        } else {
            const itemsText = items.map(item => {
                switch(item) {
                    case 'bed': return 'Cozy Bed 🛏️';
                    case 'closet': return 'Gym Wardrobe 👕';
                    case 'shoes': return 'Black Sneakers 👟';
                    case 'weights': return 'Workout Equipment 🏋️‍♂️';
                    case 'vanity': return 'Self-Care Station ✨';
                    case 'couch': return 'Movie Couch 🛋️';
                    case 'plant': return 'Happy Plant 🌱';
                    case 'tv': return 'Entertainment Center 📺';
                    case 'photo': return 'Sweet Memory 📷';
                    case 'gift': return 'Birthday Surprise 🎁';
                    case 'desk': return 'Work Desk 💼';
                    case 'macbook': return 'MacBook Pro 💻';
                    case 'vitamins': return 'Health Supplements 💊';
                    default: return item;
                }
            }).join(', ');
            
            const completionMessage = items.length >= totalItems ? 
                '🌟 Amazing exploring, Nicholas! You\'ve discovered everything! 🌟' : 
                `Keep exploring! ${totalItems - items.length} more things to discover! 🎯`;
            
            displayMessage(`🎒 Nicholas's Discoveries:\\n${itemsText}\\n\\n${completionMessage}`);
        }
    } catch (error) {
        console.error('Check items error:', error);
        displayMessage("Error checking items! 😅");
    }
}

// Get total discoverable items
function getTotalDiscoverableItems() {
    try {
        if (!window.rooms) return 0;
        
        let total = 0;
        Object.values(rooms).forEach(room => {
            if (room.objects) {
                total += room.objects.filter(obj => obj.type !== 'gift').length;
            }
        });
        return total;
    } catch (error) {
        console.error('Get total items error:', error);
        return 10; // Default fallback
    }
}

// Cat interaction behavior
function catInteractionBehavior(objectType) {
    if (!window.game) return;
    
    try {
        // Cat reacts to Nicholas's interactions
        const reactions = {
            'bed': 'sleep',
            'plant': 'curious',
            'gift': 'excited',
            'couch': 'follow',
            'tv': 'watch',
            'weights': 'avoid'
        };
        
        const reaction = reactions[objectType] || 'neutral';
        
        switch(reaction) {
            case 'excited':
                // Cat gets excited and moves closer
                game.cat.moving = true;
                game.cat.animFrame += 10;
                break;
            case 'curious':
                // Cat tilts head or looks
                game.cat.direction = game.player.direction;
                break;
            case 'follow':
                // Cat immediately follows Nicholas
                game.cat.followTimer = 0;
                break;
        }
    } catch (error) {
        console.error('Cat interaction error:', error);
    }
}

// Enhanced room information
function showRoomInfo() {
    if (!window.rooms || !window.game) return;
    
    try {
        const room = rooms[game.currentRoom];
        if (!room) return;
        
        const interactableObjects = room.objects ? room.objects.length : 0;
        const discoveredObjects = room.objects ? room.objects.filter(obj => obj.discovered).length : 0;
        
        let roomDescription = '';
        
        switch(game.currentRoom) {
            case 'bedroom':
                roomDescription = "Nicholas's personal sanctuary! This is where he starts each day with confidence and ends it with peaceful rest. His black gym clothes are perfectly organized, and his workout equipment shows his dedication!";
                break;
            case 'livingroom':
                roomDescription = "The heart of Nicholas's home! This cozy space is perfect for relaxing with his beloved black cat, watching movies, and enjoying quiet moments. Every corner tells a story of comfort and companionship!";
                break;
            default:
                roomDescription = "A special place in Nicholas's world!";
        }
        
        displayMessage(`📍 ${room.title}\\n\\n${roomDescription}\\n\\n🔍 Objects here: ${interactableObjects}\\n✨ Discovered: ${discoveredObjects}/${interactableObjects}\\n\\nWalk near objects and press Talk to interact! 💫`);
    } catch (error) {
        console.error('Room info error:', error);
        displayMessage("📍 Nicholas is exploring this lovely space! Walk around and interact with objects! ✨");
    }
}

// Simple heart effect fallback
function createHeartEffect(x, y) {
    try {
        const hearts = ['💖', '💝', '💗', '💕', '❤️'];
        const heart = document.createElement('div');
        heart.className = 'hearts-effect';
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.position = 'absolute';
        heart.style.left = (x - 10 + Math.random() * 20) + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = (12 + Math.random() * 6) + 'px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        heart.style.animation = 'heartFloat 3s ease-out forwards';
        
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.appendChild(heart);
            setTimeout(() => heart.remove(), 3000);
        }
    } catch (error) {
        console.error('Heart effect error:', error);
    }
}

// Game statistics
function getGameStats() {
    if (!window.game) return {};
    
    try {
        const playTime = Math.floor((Date.now() - game.gameStartTime) / 1000);
        const minutes = Math.floor(playTime / 60);
        const seconds = playTime % 60;
        
        return {
            playTime: `${minutes}:${seconds.toString().padStart(2, '0')}`,
            interactions: game.totalInteractions,
            discoveries: game.discoveries.size,
            roomVisits: Object.values(game.roomVisits).reduce((a, b) => a + b, 0),
            birthdayFound: game.birthdayFound
        };
    } catch (error) {
        console.error('Game stats error:', error);
        return {};
    }
}

// Export functions to global scope
window.interactWithObject = interactWithObject;
window.showBirthdayMessage = showBirthdayMessage;
window.displayMessage = displayMessage;
window.checkItems = checkItems;
window.getTotalDiscoverableItems = getTotalDiscoverableItems;
window.catInteractionBehavior = catInteractionBehavior;
window.showRoomInfo = showRoomInfo;
window.createHeartEffect = createHeartEffect;
window.getGameStats = getGameStats;

console.log('✅ Interactions system initialized');
