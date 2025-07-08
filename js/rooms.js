// AUTHENTIC Friends of Mineral Town Room System
// Based on actual GBA game assets and proportions

const FOMT_COLORS = {
    // Authentic GBA color palette from FoMT
    floor: {
        base: '#E6D49A',      // Light wood floor
        shadow: '#CDB88A',    // Floor shadow
        highlight: '#F4E4A6'  // Floor highlight
    },
    walls: {
        base: '#F4E4A6',      // Wall base
        shadow: '#E6D49A',    // Wall shadow
        trim: '#8B7355'       // Wood trim
    },
    furniture: {
        wood: '#A0845C',      // Furniture wood
        woodDark: '#8B7355',  // Dark wood
        woodLight: '#B8966B', // Light wood
        metal: '#9CA0A3',     // Metal accents
        fabric: '#6B8CAE'     // Fabric/cushions
    }
};

const rooms = {
    bedroom: {
        title: "Nicholas's Birthday Room 🎂🎉",
        bgColor: FOMT_COLORS.walls.base,
        floorColor: FOMT_COLORS.floor.base,
        objects: [
            // Romantic picnic setup - perfect for Nicholas's special day!
            { 
                x: 180, y: 160, w: 160, h: 100, type: 'picnic', 
                colors: ['#8B4513', '#228B22', '#FF6347', '#FFD700'],
                message: "A romantic picnic setup just waiting for Nicholas and his special someone! Complete with delicious treats and cozy birthday vibes! 🧺💕🎂",
                discovered: false,
                staticImage: 'items/picnic.png'  // Force load this specific image
            },
            // Birthday Gift - the special surprise!
            { 
                x: 220, y: 340, w: 100, h: 80, type: 'gift', 
                colors: ['#FFD700', '#FFFF00', '#FF0000', '#FFFFFF'],
                message: "birthday_surprise",
                special: true,
                discovered: false
            }
        ],
        exits: [
            // No exits - bedroom is the complete game space
        ]
    }
};

// AUTHENTIC FoMT Room Rendering System
function drawRoom() {
    const room = rooms[game.currentRoom];
    
    // Authentic FoMT floor pattern
    drawFoMTFloor(room);
    
    // Authentic FoMT wall pattern
    drawFoMTWalls(room);
    
    // Draw objects with authentic FoMT style
    room.objects.forEach(obj => {
        drawFoMTObject(obj);
    });
    
    // Authentic FoMT door style
    room.exits.forEach(exit => {
        drawFoMTDoor(exit);
    });
}

// Export functions to global scope
window.rooms = rooms;
window.drawRoom = drawRoom;
window.drawFoMTObject = drawFoMTObject;
window.drawFoMTFloor = drawFoMTFloor;
window.drawFoMTWalls = drawFoMTWalls;
window.drawFoMTObjectSprite = drawFoMTObjectSprite;
window.drawFoMTDoor = drawFoMTDoor;
window.FOMT_COLORS = FOMT_COLORS;

console.log('✅ Room system initialized');
// Authentic FoMT floor rendering
function drawFoMTFloor(room) {
    const tileSize = 16;
    
    for (let x = 0; x < canvas.width; x += tileSize) {
        for (let y = 0; y < canvas.height; y += tileSize) {
            // Base floor tile
            ctx.fillStyle = room.floorColor;
            ctx.fillRect(x, y, tileSize, tileSize);
            
            // Authentic FoMT floor pattern with dithering
            ctx.fillStyle = FOMT_COLORS.floor.shadow;
            // Bottom edge shadow
            ctx.fillRect(x, y + tileSize - 2, tileSize, 2);
            // Right edge shadow
            ctx.fillRect(x + tileSize - 2, y, 2, tileSize);
            
            // Wood grain effect (every 4th tile)
            if ((x / tileSize + y / tileSize) % 4 === 0) {
                ctx.fillStyle = FOMT_COLORS.floor.highlight;
                ctx.fillRect(x + 2, y + 4, tileSize - 4, 2);
                ctx.fillRect(x + 2, y + 8, tileSize - 4, 1);
                ctx.fillRect(x + 2, y + 12, tileSize - 4, 2);
            }
        }
    }
}

// Authentic FoMT wall rendering
function drawFoMTWalls(room) {
    // Wall base
    ctx.fillStyle = room.bgColor;
    ctx.fillRect(0, 0, canvas.width, 48);
    
    // Wall trim
    ctx.fillStyle = FOMT_COLORS.walls.trim;
    ctx.fillRect(0, 40, canvas.width, 8);
    
    // Wall pattern
    for (let x = 0; x < canvas.width; x += 32) {
        ctx.fillStyle = FOMT_COLORS.walls.shadow;
        ctx.fillRect(x, 8, 2, 32);
    }
}

// Enhanced object drawing with PNG sprites and FoMT fallback
function drawFoMTObject(obj) {
    // Special birthday gift glow
    if (obj.type === 'gift' && !game.birthdayFound) {
        const glow = Math.sin(Date.now() * 0.008) * 30 + 200;
        ctx.fillStyle = `rgba(255, ${glow}, 0, 0.4)`;
        ctx.fillRect(obj.x - 4, obj.y - 4, obj.w + 8, obj.h + 8);
    }
    
    // Discovery highlight
    if (obj.discovered && obj.type !== 'gift') {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
        ctx.fillRect(obj.x - 1, obj.y - 1, obj.w + 2, obj.h + 2);
    }
    
    // Try to draw with PNG sprite first, fallback to FoMT style
    if (!drawRoomObject(obj)) {
        drawFoMTObjectSprite(obj);
    }
    
    // Interaction indicator with FoMT style
    if (typeof isNearObject !== 'undefined' && isNearObject && isNearObject(obj)) {
        const pulse = Math.sin(Date.now() * 0.012) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(255, 255, 255, ${pulse})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(obj.x - 2, obj.y - 2, obj.w + 4, obj.h + 4);
    }
}

// Authentic FoMT sprite rendering
function drawFoMTObjectSprite(obj) {
    switch(obj.type) {
        case 'bed':
            drawFoMTBed(obj);
            break;
        case 'desk':
            drawFoMTDesk(obj);
            break;
        case 'macbook':
            drawFoMTMacBook(obj);
            break;
        case 'tv':
            drawFoMTTV(obj);
            break;
        case 'vanity':
            drawFoMTVanity(obj);
            break;
        case 'vitamins':
            drawFoMTVitamins(obj);
            break;
        case 'shoes':
            drawFoMTShoes(obj);
            break;
        case 'plant':
            drawFoMTPlant(obj);
            break;
        case 'closet':
            drawFoMTCloset(obj);
            break;
        case 'weights':
            drawFoMTWeights(obj);
            break;
        case 'gift':
            drawFoMTGift(obj);
            break;
        case 'couch':
            drawFoMTCouch(obj);
            break;
        case 'photo':
            drawFoMTPhoto(obj);
            break;
        default:
            // Default FoMT style rectangle
            ctx.fillStyle = obj.colors[0];
            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
            break;
    }
}

// Export functions to global scope
window.rooms = rooms;
window.drawRoom = drawRoom;
window.drawFoMTObject = drawFoMTObject;
window.drawFoMTFloor = drawFoMTFloor;
window.drawFoMTWalls = drawFoMTWalls;
window.drawFoMTObjectSprite = drawFoMTObjectSprite;
window.drawFoMTDoor = drawFoMTDoor;
window.FOMT_COLORS = FOMT_COLORS;

console.log('✅ Room system initialized');
// Authentic FoMT Gift sprite
function drawFoMTGift(obj) {
    // Gift base
    ctx.fillStyle = obj.colors[0];
    ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
    
    // Gift ribbon vertical
    ctx.fillStyle = obj.colors[2];
    ctx.fillRect(obj.x + obj.w/2 - 4, obj.y, 8, obj.h);
    
    // Gift ribbon horizontal
    ctx.fillStyle = obj.colors[2];
    ctx.fillRect(obj.x, obj.y + obj.h/2 - 4, obj.w, 8);
    
    // Bow
    ctx.fillStyle = obj.colors[2];
    ctx.fillRect(obj.x + obj.w/2 - 6, obj.y - 4, 12, 8);
    
    // Gift tag
    ctx.fillStyle = obj.colors[3];
    ctx.fillRect(obj.x + obj.w - 8, obj.y + 4, 6, 4);
}

// Authentic FoMT Picnic sprite
function drawFoMTPicnic(obj) {
    // Picnic blanket base (larger and more detailed)
    ctx.fillStyle = obj.colors[0]; // Brown
    ctx.fillRect(obj.x, obj.y + obj.h - 30, obj.w, 30);
    
    // Checkered pattern on blanket (more squares for bigger blanket)
    ctx.fillStyle = obj.colors[1]; // Green
    const squareSize = 20;
    for (let i = 0; i < Math.ceil(obj.w / squareSize); i++) {
        for (let j = 0; j < 2; j++) {
            if ((i + j) % 2 === 0) {
                ctx.fillRect(obj.x + i * squareSize, obj.y + obj.h - 30 + j * 15, squareSize, 15);
            }
        }
    }
    
    // Larger picnic basket
    ctx.fillStyle = '#654321';
    ctx.fillRect(obj.x + 20, obj.y + 15, 40, 40);
    
    // Basket handle
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(obj.x + 32, obj.y + 8, 16, 8);
    
    // Food spread (more items for bigger picnic)
    // Multiple sandwiches
    ctx.fillStyle = obj.colors[2]; // Red (tomato)
    ctx.fillRect(obj.x + 80, obj.y + 35, 20, 15);
    ctx.fillRect(obj.x + 110, obj.y + 40, 18, 12);
    
    // Cheese selection
    ctx.fillStyle = obj.colors[3]; // Gold
    ctx.fillRect(obj.x + 75, obj.y + 55, 15, 12);
    ctx.fillStyle = '#FFFF88';
    ctx.fillRect(obj.x + 95, obj.y + 52, 12, 10);
    
    // Fruits (grapes and apples)
    ctx.fillStyle = '#9966CC';
    for (let i = 0; i < 6; i++) {
        ctx.fillRect(obj.x + 65 + i * 5, obj.y + 20 + Math.floor(i/3) * 4, 4, 4);
    }
    
    // Red apples
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(obj.x + 130, obj.y + 25, 8, 8);
    ctx.fillRect(obj.x + 142, obj.y + 28, 8, 8);
    
    // Wine glasses (romantic touch)
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(obj.x + 120, obj.y + 15, 6, 12);
    ctx.fillRect(obj.x + 135, obj.y + 15, 6, 12);
    
    // Wine bottle
    ctx.fillStyle = '#228B22';
    ctx.fillRect(obj.x + 105, obj.y + 10, 6, 20);
    
    // Birthday cake (special touch!)
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(obj.x + 45, obj.y + 60, 25, 15);
    
    // Cake candles
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(obj.x + 50, obj.y + 58, 2, 4);
    ctx.fillRect(obj.x + 58, obj.y + 58, 2, 4);
    ctx.fillRect(obj.x + 66, obj.y + 58, 2, 4);
}

// Authentic FoMT Door sprite
function drawFoMTDoor(exit) {
    // Door frame
    ctx.fillStyle = FOMT_COLORS.walls.trim;
    ctx.fillRect(exit.x - 2, exit.y - 2, exit.w + 4, exit.h + 4);
    
    // Door background
    ctx.fillStyle = FOMT_COLORS.furniture.wood;
    ctx.fillRect(exit.x, exit.y, exit.w, exit.h);
    
    // Door panel
    ctx.fillStyle = FOMT_COLORS.furniture.woodLight;
    ctx.fillRect(exit.x + 2, exit.y + 2, exit.w - 4, exit.h - 4);
    
    // Door handle
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(exit.x + exit.w - 6, exit.y + exit.h/2 - 2, 3, 4);
}

// AUTHENTIC FoMT Room Rendering System
function drawRoom() {
    const room = rooms[game.currentRoom];
    
    // Authentic FoMT floor pattern
    drawFoMTFloor(room);
    
    // Authentic FoMT wall pattern
    drawFoMTWalls(room);
    
    // Draw objects with sprite integration
    room.objects.forEach(obj => {
        drawFoMTObject(obj);
    });
    
    // Authentic FoMT door style
    room.exits.forEach(exit => {
        drawFoMTDoor(exit);
    });
}

// Enhanced object drawing with PNG sprites and FoMT fallback
function drawFoMTObject(obj) {
    // Special birthday gift glow
    if (obj.type === 'gift' && !game.birthdayFound) {
        const glow = Math.sin(Date.now() * 0.008) * 30 + 200;
        ctx.fillStyle = `rgba(255, ${glow}, 0, 0.4)`;
        ctx.fillRect(obj.x - 4, obj.y - 4, obj.w + 8, obj.h + 8);
    }
    
    // Discovery highlight
    if (obj.discovered && obj.type !== 'gift') {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
        ctx.fillRect(obj.x - 1, obj.y - 1, obj.w + 2, obj.h + 2);
    }
    
    // DIRECT PICNIC PNG DRAWING - NO BULLSHIT
    if (obj.type === 'picnic') {
        console.log('🧺 Drawing picnic - imageLoaded:', window.picnicImageLoaded);
        
        if (window.picnicImageLoaded === true && window.picnicImage) {
            try {
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(window.picnicImage, obj.x, obj.y, obj.w, obj.h);
                console.log('✅ PICNIC PNG DRAWN AT:', obj.x, obj.y, obj.w, obj.h);
                
                // Add a border so we can see it's there
                ctx.strokeStyle = '#00FF00';
                ctx.lineWidth = 2;
                ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
                return;
            } catch (error) {
                console.error('❌ Error drawing picnic PNG:', error);
            }
        } else {
            console.log('🔄 Picnic PNG not loaded, using fallback');
        }
    }
    
    // Debug logging for picnic
    if (obj.type === 'picnic') {
        console.log('🧺 Drawing picnic object:', {
            hasSprites: !!window.sprites,
            hasPicnicSprite: !!window.sprites?.picnic,
            hasStaticImage: !!window.picnicImage,
            imageLoaded: window.picnicImageLoaded,
            position: {x: obj.x, y: obj.y, w: obj.w, h: obj.h}
        });
    }
    
    // Try to draw with PNG sprite first, fallback to FoMT style
    if (typeof drawRoomObject === 'function' && drawRoomObject(obj)) {
        // PNG sprite was drawn successfully
        console.log(`✅ Drew ${obj.type} using PNG sprite`);
        return;
    } else {
        // Fallback to FoMT style drawing
        console.log(`🔄 Drawing ${obj.type} using FoMT fallback`);
        drawFoMTObjectSprite(obj);
    }
    
    // Interaction indicator with FoMT style
    if (typeof isNearObject !== 'undefined' && isNearObject && isNearObject(obj)) {
        const pulse = Math.sin(Date.now() * 0.012) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(255, 255, 255, ${pulse})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(obj.x - 2, obj.y - 2, obj.w + 4, obj.h + 4);
    }
}

// Authentic FoMT floor rendering
function drawFoMTFloor(room) {
    const tileSize = 16;
    
    for (let x = 0; x < canvas.width; x += tileSize) {
        for (let y = 0; y < canvas.height; y += tileSize) {
            // Base floor tile
            ctx.fillStyle = room.floorColor;
            ctx.fillRect(x, y, tileSize, tileSize);
            
            // Authentic FoMT floor pattern with dithering
            ctx.fillStyle = FOMT_COLORS.floor.shadow;
            // Bottom edge shadow
            ctx.fillRect(x, y + tileSize - 2, tileSize, 2);
            // Right edge shadow
            ctx.fillRect(x + tileSize - 2, y, 2, tileSize);
            
            // Wood grain effect (every 4th tile)
            if ((x / tileSize + y / tileSize) % 4 === 0) {
                ctx.fillStyle = FOMT_COLORS.floor.highlight;
                ctx.fillRect(x + 2, y + 4, tileSize - 4, 2);
                ctx.fillRect(x + 2, y + 8, tileSize - 4, 1);
                ctx.fillRect(x + 2, y + 12, tileSize - 4, 2);
            }
        }
    }
}

// Authentic FoMT wall rendering
function drawFoMTWalls(room) {
    // Wall base
    ctx.fillStyle = room.bgColor;
    ctx.fillRect(0, 0, canvas.width, 48);
    
    // Wall trim
    ctx.fillStyle = FOMT_COLORS.walls.trim;
    ctx.fillRect(0, 40, canvas.width, 8);
    
    // Wall pattern
    for (let x = 0; x < canvas.width; x += 32) {
        ctx.fillStyle = FOMT_COLORS.walls.shadow;
        ctx.fillRect(x, 8, 2, 32);
    }
}

// Authentic FoMT sprite rendering (fallback system)
function drawFoMTObjectSprite(obj) {
    switch(obj.type) {
        case 'gift':
            drawFoMTGift(obj);
            break;
        case 'picnic':
            drawFoMTPicnic(obj);
            break;
        default:
            // Default FoMT style rectangle
            if (obj.colors && obj.colors[0]) {
                ctx.fillStyle = obj.colors[0];
                ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
            }
            break;
    }
}
