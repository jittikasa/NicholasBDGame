// Main game logic and loop with error handling

// Game configuration constants
const CONFIG = {
    CANVAS_WIDTH: 480,
    CANVAS_HEIGHT: 540,
    PLAYER_SPEED: 6,
    INTERACTION_DISTANCE: 80,
    ANIMATION_SPEED: 8,
    MOVEMENT_DELAY: 100,
    DEBUG_MODE: false
};

// Main game loop with enhanced error handling
function gameLoop() {
    try {
        // Check if game is properly initialized
        if (!window.game || !window.ctx || !window.canvas) {
            console.warn('Game not properly initialized, skipping frame');
            requestAnimationFrame(gameLoop);
            return;
        }
        
        // Update game systems
        updatePlayer();
        updateCat();
        
        // Clear and redraw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw game world
        drawRoom();
        drawCharacters();
        
        // Continue the loop
        requestAnimationFrame(gameLoop);
        
    } catch (error) {
        console.error('Game loop error:', error);
        // Try to continue the game loop even if there's an error
        setTimeout(() => requestAnimationFrame(gameLoop), 100);
    }
}

// Character drawing function
function drawCharacters() {
    if (!window.game || !window.ctx) return;
    
    try {
        // Draw cat first (behind player)
        if (typeof drawCatSprite === 'function') {
            drawCatSprite(game.cat.x, game.cat.y, game.cat.direction, game.cat.animFrame);
        }
        
        // Draw Nicholas
        if (typeof drawNicholasSprite === 'function') {
            drawNicholasSprite(game.player.x, game.player.y, game.player.direction, game.player.animFrame);
        }
    } catch (error) {
        console.error('Character drawing error:', error);
    }
}

// Player update function
function updatePlayer() {
    if (!window.game) return;
    
    try {
        // Update movement timer
        if (game.player.moveTimer > 0) {
            game.player.moveTimer -= 16;
            if (game.player.moveTimer <= 0) {
                game.player.moving = false;
            }
        }
        
        // Update animation frame
        if (game.player.moving) {
            game.player.animFrame++;
        }
    } catch (error) {
        console.error('Player update error:', error);
    }
}

// Cat update function
function updateCat() {
    if (!window.game) return;
    
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
        }
    } catch (error) {
        console.error('Cat update error:', error);
    }
}

// Enhanced movement with improved collision detection
function movePlayer(direction) {
    if (!window.game || !window.canvas) return;
    
    try {
        if (game.player.moving || Date.now() - (game.player.lastMove || 0) < CONFIG.MOVEMENT_DELAY) return;
        
        const speed = CONFIG.PLAYER_SPEED;
        let newX = game.player.x;
        let newY = game.player.y;
        
        game.player.direction = direction;
        
        switch(direction) {
            case 'up': newY -= speed; break;
            case 'down': newY += speed; break;
            case 'left': newX -= speed; break;
            case 'right': newX += speed; break;
        }
        
        // Enhanced boundary checking
        const margin = 18;
        if (newX >= margin && newX <= canvas.width - margin*2 && 
            newY >= margin && newY <= canvas.height - 80) {
            
            if (checkCollisions(newX, newY)) {
                game.player.x = newX;
                game.player.y = newY;
                game.player.moving = true;
                game.player.moveTimer = 150;
                game.player.lastMove = Date.now();
                
                checkRoomTransition(newX, newY);
            }
        }
    } catch (error) {
        console.error('Move player error:', error);
    }
}

// Enhanced collision detection
function checkCollisions(x, y) {
    if (!window.rooms || !window.game) return true;
    
    try {
        const room = rooms[game.currentRoom];
        if (!room || !room.objects) return true;
        
        const playerRect = { x: x, y: y, w: 36, h: 60 };
        
        for (let obj of room.objects) {
            const objRect = { x: obj.x, y: obj.y, w: obj.w, h: obj.h };
            
            if (isRectColliding(playerRect, objRect)) {
                return false;
            }
        }
        return true;
    } catch (error) {
        console.error('Collision detection error:', error);
        return true; // Allow movement if collision detection fails
    }
}

// Utility function for rectangle collision detection
function isRectColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.w &&
           rect1.x + rect1.w > rect2.x &&
           rect1.y < rect2.y + rect2.h &&
           rect1.y + rect1.h > rect2.y;
}

// Check if player is near an object
function isNearObject(obj) {
    if (!window.game) return false;
    
    try {
        const playerCenterX = game.player.x + 18;
        const playerCenterY = game.player.y + 30;
        const objCenterX = obj.x + obj.w/2;
        const objCenterY = obj.y + obj.h/2;
        
        const distance = Math.sqrt(
            Math.pow(playerCenterX - objCenterX, 2) + 
            Math.pow(playerCenterY - objCenterY, 2)
        );
        
        return distance < CONFIG.INTERACTION_DISTANCE;
    } catch (error) {
        console.error('isNearObject error:', error);
        return false;
    }
}

// Enhanced room transition
function checkRoomTransition(x, y) {
    if (!window.rooms || !window.game) return;
    
    try {
        const room = rooms[game.currentRoom];
        if (!room || !room.exits) return;
        
        room.exits.forEach(exit => {
            if (x < exit.x + exit.w && x + 36 > exit.x && 
                y < exit.y + exit.h && y + 60 > exit.y) {
                
                const oldRoom = game.currentRoom;
                game.currentRoom = exit.to;
                game.roomVisits[exit.to] = (game.roomVisits[exit.to] || 0) + 1;
                
                // Position player appropriately based on room transition
                if (exit.to === 'livingroom') {
                    game.player.x = 60;
                    game.player.y = 280;
                } else {
                    game.player.x = 380;
                    game.player.y = 280;
                }
                
                // Update room header with transition effect
                const header = document.getElementById('roomHeader');
                if (header && rooms[game.currentRoom]) {
                    header.style.opacity = '0';
                    setTimeout(() => {
                        header.textContent = rooms[game.currentRoom].title;
                        header.style.opacity = '1';
                    }, 250);
                }
                
                // Cat follows to new room
                setTimeout(() => {
                    game.cat.x = game.player.x - 40;
                    game.cat.y = game.player.y + 20;
                }, 500);
            }
        });
    } catch (error) {
        console.error('Room transition error:', error);
    }
}

// Export functions to global scope
window.gameLoop = gameLoop;
window.drawCharacters = drawCharacters;
window.updatePlayer = updatePlayer;
window.updateCat = updateCat;
window.movePlayer = movePlayer;
window.checkCollisions = checkCollisions;
window.isRectColliding = isRectColliding;
window.isNearObject = isNearObject;
window.checkRoomTransition = checkRoomTransition;
window.CONFIG = CONFIG;

console.log('✅ Game logic initialized');
