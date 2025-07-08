// Cat AI and behavior system

// Cat AI - follows Nicholas with enhanced behavior
function updateCat() {
    if (!window.game || !window.canvas) return;
    
    try {
        const dx = game.player.x - game.cat.x;
        const dy = game.player.y - game.cat.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        // Enhanced following behavior
        if (distance > 100) {
            game.cat.moving = true;
            const speed = 2;
            
            // Follow with some delay for more natural movement
            if (Date.now() - (game.cat.followTimer || 0) > 300) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    game.cat.direction = dx > 0 ? 'right' : 'left';
                    game.cat.x += dx > 0 ? speed : -speed;
                } else {
                    game.cat.direction = dy > 0 ? 'down' : 'up';
                    game.cat.y += dy > 0 ? speed : -speed;
                }
                
                game.cat.followTimer = Date.now();
            }
            
            game.cat.animFrame++;
        } else {
            game.cat.moving = false;
            
            // Random cat behavior when idle
            if (Math.random() < 0.008) {
                const directions = ['up', 'down', 'left', 'right'];
                game.cat.direction = directions[Math.floor(Math.random() * directions.length)];
            }
            
            // Occasional random movement when idle
            if (Math.random() < 0.003) {
                const randomDirections = ['up', 'down', 'left', 'right'];
                const randomDir = randomDirections[Math.floor(Math.random() * randomDirections.length)];
                const moveDistance = 10;
                
                switch(randomDir) {
                    case 'up':
                        if (game.cat.y > 50) game.cat.y -= moveDistance;
                        break;
                    case 'down':
                        if (game.cat.y < canvas.height - 100) game.cat.y += moveDistance;
                        break;
                    case 'left':
                        if (game.cat.x > 20) game.cat.x -= moveDistance;
                        break;
                    case 'right':
                        if (game.cat.x < canvas.width - 50) game.cat.x += moveDistance;
                        break;
                }
                
                game.cat.direction = randomDir;
                game.cat.moving = true;
                game.cat.animFrame += 5;
            }
        }
        
        // Always update animation frame for tail wagging and breathing
        game.cat.animFrame++;
        
        // Prevent cat from going out of bounds
        game.cat.x = Math.max(10, Math.min(canvas.width - 40, game.cat.x));
        game.cat.y = Math.max(10, Math.min(canvas.height - 80, game.cat.y));
        
        // Store last position for collision detection
        game.cat.lastPosition = { x: game.cat.x, y: game.cat.y };
    } catch (error) {
        console.error('Update cat error:', error);
    }
}

// Cat reaction to player interactions
function catInteractionBehavior(objectType) {
    if (!window.game) return;
    
    try {
        // Cat gets excited when Nicholas interacts with objects
        const reactions = {
            'bed': () => {
                // Cat wants to jump on the bed
                game.cat.direction = 'up';
                if (typeof addParticles === 'function') {
                    addParticles(game.cat.x, game.cat.y, 3, 'heart');
                }
            },
            'couch': () => {
                // Cat loves the couch
                if (typeof addParticles === 'function') {
                    addParticles(game.cat.x, game.cat.y, 5, 'heart');
                }
            },
            'weights': () => {
                // Cat is confused by exercise equipment
                game.cat.direction = 'left';
                setTimeout(() => game.cat.direction = 'right', 500);
            },
            'plant': () => {
                // Cat is interested in plants
                game.cat.direction = 'up';
                if (typeof addParticles === 'function') {
                    addParticles(game.cat.x, game.cat.y, 2, 'sparkle');
                }
            },
            'gift': () => {
                // Cat celebrates birthday!
                for (let i = 0; i < 8; i++) {
                    setTimeout(() => {
                        if (typeof addParticles === 'function') {
                            addParticles(game.cat.x + Math.random() * 20, game.cat.y + Math.random() * 20, 3, 'birthday');
                        }
                    }, i * 100);
                }
            }
        };
        
        if (reactions[objectType]) {
            reactions[objectType]();
        }
    } catch (error) {
        console.error('Cat interaction behavior error:', error);
    }
}

// Export to global scope
window.updateCat = updateCat;
window.catInteractionBehavior = catInteractionBehavior;

console.log('✅ Cat system initialized');
