// Professional Sprite System - Fixed Picnic Loading
// Enhanced for beautiful 4-direction walking animations

// Sprite image storage - CLEAN (only what we actually use)
window.sprites = {
    nicholasSheet: null,
    picnic: null
};

// Sprite loading status
let spritesLoaded = 0;
const totalSprites = 2; // Loading Nicholas sheet + picnic
window.allSpritesLoaded = false;

// Nicholas sprite sheet specifications
const NICHOLAS_SPRITE = {
    frameWidth: 325,   // Width of each individual sprite
    frameHeight: 325,  // Height of each individual sprite
    columns: 4,        // 4 sprites per row
    rows: 4,          // 4 rows total
    animations: {
        down:  { row: 0, frames: 4 },  // Row 1: Walking down
        up:    { row: 1, frames: 4 },  // Row 2: Walking up  
        left:  { row: 2, frames: 4 },  // Row 3: Walking left
        right: { row: 3, frames: 4 }   // Row 4: Walking right
    }
};

// Load sprites with proper dual loading
function loadSprites() {
    return new Promise((resolve, reject) => {
        console.log('🎨 Loading sprites: Nicholas + Picnic...');
        
        let loadedCount = 0;
        const totalToLoad = 2;
        
        const checkComplete = () => {
            loadedCount++;
            console.log(`🖼️ Loaded ${loadedCount}/${totalToLoad} sprites`);
            if (loadedCount >= totalToLoad) {
                window.allSpritesLoaded = true;
                console.log('✅ All sprites loaded!');
                if (typeof updateLoadingProgress === 'function') {
                    updateLoadingProgress(1);
                }
                resolve();
            }
        };
        
        // Load Nicholas sprite sheet
        const nicholasImg = new Image();
        nicholasImg.onload = () => {
            window.sprites.nicholasSheet = nicholasImg;
            console.log('✅ Nicholas sprite sheet loaded!');
            console.log(`📏 Nicholas size: ${nicholasImg.width}×${nicholasImg.height}px`);
            checkComplete();
        };
        nicholasImg.onerror = () => {
            console.error('❌ Nicholas sprite sheet failed to load');
            console.log('🔄 Using fallback pixel art for Nicholas');
            checkComplete();
        };
        
        // Load picnic PNG
        const picnicImg = new Image();
        picnicImg.onload = () => {
            window.sprites.picnic = picnicImg;
            console.log('✅ Picnic PNG loaded!');
            console.log(`🧺 Picnic size: ${picnicImg.width}×${picnicImg.height}px`);
            checkComplete();
        };
        picnicImg.onerror = () => {
            console.error('❌ Picnic PNG failed to load');
            console.log('🔄 Using fallback pixel art for picnic');
            checkComplete();
        };
        
        // Start loading both
        nicholasImg.src = 'items/nicholas_spritesheet.png';
        picnicImg.src = 'items/picnic.png';
        
        console.log('🚀 Started loading both sprites...');
    });
}

// Professional Nicholas sprite drawing with 4-direction animations
function drawNicholasSprite(x, y, direction, frame) {
    if (!window.ctx) return;
    
    // Check if we have the professional sprite sheet
    if (window.sprites.nicholasSheet) {
        drawProfessionalNicholas(x, y, direction, frame);
    } else {
        // Fallback to basic pixel art
        drawBasicNicholas(x, y, direction, frame);
    }
}

// Draw Nicholas using professional Aseprite sprite sheet
function drawProfessionalNicholas(x, y, direction, frame) {
    const sprite = window.sprites.nicholasSheet;
    const config = NICHOLAS_SPRITE;
    
    // Get animation configuration for current direction
    const anim = config.animations[direction] || config.animations.down;
    
    // Calculate which frame to show based on movement
    let frameIndex = 0;
    if (window.game && window.game.player && window.game.player.moving) {
        // Animate through frames when moving
        frameIndex = Math.floor(frame / 8) % anim.frames;
    }
    // If not moving, use frame 0 (standing pose)
    
    // Calculate source position in sprite sheet
    const sourceX = frameIndex * config.frameWidth;
    const sourceY = anim.row * config.frameHeight;
    
    // Calculate display size (scale down for game)
    const displayWidth = 48;   // Scale to appropriate game size
    const displayHeight = 64;  // Maintain aspect ratio
    
    try {
        // Ensure pixel-perfect rendering
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        
        // Draw Nicholas from sprite sheet
        ctx.drawImage(
            sprite,
            sourceX, sourceY,                           // Source position
            config.frameWidth, config.frameHeight,      // Source size
            x, y,                                       // Destination position  
            displayWidth, displayHeight                 // Destination size
        );
        
        console.log(`🎮 Drew Nicholas: direction=${direction}, frame=${frameIndex}, pos=(${x},${y})`);
        
    } catch (error) {
        console.error('❌ Error drawing professional Nicholas:', error);
        // Fallback to basic sprite
        drawBasicNicholas(x, y, direction, frame);
    }
}

// Fallback basic Nicholas (your existing pixel art)
function drawBasicNicholas(x, y, direction, frame) {
    if (!window.ctx) return;
    
    const px = (pX, pY, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(x + pX * 2, y + pY * 2, 2, 2);
    };
    
    // Basic Nicholas sprite (simplified version)
    // Hair
    px(3, 0, '#8B4513'); px(4, 0, '#A0522D'); px(5, 0, '#8B4513');
    px(2, 1, '#8B4513'); px(3, 1, '#A0522D'); px(4, 1, '#A0522D'); px(5, 1, '#A0522D'); px(6, 1, '#8B4513');
    
    // Face  
    px(2, 2, '#A0522D'); px(3, 2, '#FDBCB4'); px(4, 2, '#FDBCB4'); px(5, 2, '#FDBCB4'); px(6, 2, '#A0522D');
    px(2, 3, '#8B4513'); px(3, 3, '#FDBCB4'); px(4, 3, '#000'); px(5, 3, '#FDBCB4'); px(6, 3, '#000'); px(7, 3, '#FDBCB4');
    
    // Facial hair
    px(2, 4, '#8B4513'); px(3, 4, '#FDBCB4'); px(4, 4, '#654321'); px(5, 4, '#654321'); px(6, 4, '#FDBCB4'); px(7, 4, '#8B4513');
    
    // Black gym shirt
    px(2, 5, '#FDBCB4'); px(3, 5, '#1A1A1A'); px(4, 5, '#333333'); px(5, 5, '#1A1A1A'); px(6, 5, '#FDBCB4');
    px(1, 6, '#FDBCB4'); px(2, 6, '#1A1A1A'); px(3, 6, '#1A1A1A'); px(4, 6, '#333333'); px(5, 6, '#1A1A1A'); px(6, 6, '#1A1A1A'); px(7, 6, '#FDBCB4');
    
    // Legs
    px(3, 7, '#FDBCB4'); px(5, 7, '#FDBCB4');
    px(3, 8, '#FDBCB4'); px(5, 8, '#FDBCB4');
    
    // Shoes
    px(2, 9, '#000'); px(3, 9, '#000'); px(4, 9, '#000'); px(5, 9, '#000'); px(6, 9, '#000');
}

// Keep existing cat sprite (we'll upgrade this later)
function drawCatSprite(x, y, direction, frame) {
    if (!window.ctx) return;
    
    const px = (pX, pY, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(x + pX * 2, y + pY * 2, 2, 2);
    };
    
    // Basic black cat
    px(1, 0, '#1A1A1A'); px(2, 0, '#1A1A1A'); px(4, 0, '#1A1A1A'); px(5, 0, '#1A1A1A');
    px(0, 1, '#1A1A1A'); px(1, 1, '#FFB6C1'); px(2, 1, '#1A1A1A'); px(3, 1, '#1A1A1A'); px(4, 1, '#1A1A1A'); px(5, 1, '#FFB6C1'); px(6, 1, '#1A1A1A');
    px(0, 2, '#1A1A1A'); px(1, 2, '#333333'); px(2, 2, '#1A1A1A'); px(3, 2, '#1A1A1A'); px(4, 2, '#1A1A1A'); px(5, 2, '#333333'); px(6, 2, '#1A1A1A');
    px(0, 3, '#1A1A1A'); px(1, 3, '#32CD32'); px(2, 3, '#1A1A1A'); px(3, 3, '#1A1A1A'); px(4, 3, '#1A1A1A'); px(5, 3, '#32CD32'); px(6, 3, '#1A1A1A');
    px(0, 4, '#1A1A1A'); px(1, 4, '#1A1A1A'); px(2, 4, '#1A1A1A'); px(3, 4, '#FFB6C1'); px(4, 4, '#1A1A1A'); px(5, 4, '#1A1A1A'); px(6, 4, '#1A1A1A');
    px(0, 5, '#1A1A1A'); px(1, 5, '#333333'); px(2, 5, '#1A1A1A'); px(3, 5, '#1A1A1A'); px(4, 5, '#1A1A1A'); px(5, 5, '#333333'); px(6, 5, '#1A1A1A');
    px(0, 6, '#1A1A1A'); px(1, 6, '#1A1A1A'); px(2, 6, '#1A1A1A'); px(3, 6, '#1A1A1A'); px(4, 6, '#1A1A1A'); px(5, 6, '#1A1A1A'); px(6, 6, '#1A1A1A');
    
    // Animated tail
    const tailWag = Math.floor(frame / 20) % 3;
    px(7, 3 + tailWag, '#1A1A1A'); px(8, 3 + tailWag, '#1A1A1A');
    px(7, 4 + tailWag, '#1A1A1A'); px(8, 4 + tailWag, '#333333');
}

// Enhanced object drawing with PNG sprites
function drawRoomObject(obj) {
    if (!window.ctx || !window.sprites) return false;
    
    // Handle picnic PNG sprite
    if (obj.type === 'picnic' && window.sprites.picnic) {
        try {
            // Ensure pixel-perfect rendering
            ctx.imageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            
            // Draw picnic PNG with appropriate scaling
            ctx.drawImage(
                window.sprites.picnic,
                0, 0,                    // Source position (full image)
                window.sprites.picnic.width, window.sprites.picnic.height,  // Source size
                obj.x, obj.y,           // Destination position
                obj.w, obj.h            // Destination size (scaled to fit object bounds)
            );
            
            console.log(`🧺 Drew picnic PNG at (${obj.x}, ${obj.y}) size ${obj.w}x${obj.h}`);
            return true; // Successfully drew PNG
        } catch (error) {
            console.error('❌ Error drawing picnic PNG:', error);
            return false; // Fall back to FoMT style
        }
    }
    
    // For other objects, use fallback system
    return false;
}

// Export functions to global scope
window.loadSprites = loadSprites;
window.drawNicholasSprite = drawNicholasSprite;
window.drawCatSprite = drawCatSprite;
window.drawRoomObject = drawRoomObject;
window.NICHOLAS_SPRITE = NICHOLAS_SPRITE;

console.log('✅ Professional sprite system initialized - ready for Nicholas!');
