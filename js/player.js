// Player movement and interaction system

// Enhanced movement with improved collision detection
function movePlayer(direction) {
    if (!window.game || !window.canvas || !window.CONFIG) return;
    
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
            
            if (isRectColliding && isRectColliding(playerRect, objRect)) {
                return false;
            }
        }
        return true;
    } catch (error) {
        console.error('Collision detection error:', error);
        return true;
    }
}

// Check if player is near an object
function isNearObject(obj) {
    if (!window.game || !window.CONFIG) return false;
    
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
                    if (game.cat) {
                        game.cat.x = game.player.x - 40;
                        game.cat.y = game.player.y + 20;
                    }
                }, 500);
            }
        });
    } catch (error) {
        console.error('Room transition error:', error);
    }
}

// Player animation update
function updatePlayer() {
    if (!window.game) return;
    
    try {
        // Update movement timers
        if (game.player.moveTimer > 0) {
            game.player.moveTimer -= 16;
            if (game.player.moveTimer <= 0) {
                game.player.moving = false;
            }
        }
        
        // Update animations
        if (game.player.moving) {
            game.player.animFrame++;
        }
    } catch (error) {
        console.error('Update player error:', error);
    }
}

// Export to global scope
window.movePlayer = movePlayer;
window.checkCollisions = checkCollisions;
window.isNearObject = isNearObject;
window.checkRoomTransition = checkRoomTransition;
window.updatePlayer = updatePlayer;

console.log('✅ Player system initialized');
