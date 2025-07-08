// Game configuration and constants
const CONFIG = {
    CANVAS_WIDTH: 480,
    CANVAS_HEIGHT: 540,
    PLAYER_SPEED: 6,
    INTERACTION_DISTANCE: 80,
    ANIMATION_SPEED: 8,
    MOVEMENT_DELAY: 100,
    DEBUG_MODE: false
};

// Game state object
let game = null;
let canvas = null;
let ctx = null;

// Initialize canvas and context
function initializeCanvas() {
    try {
        canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }
        
        ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get canvas context');
        }
        
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        
        // Export to global scope
        window.canvas = canvas;
        window.ctx = ctx;
        
        return true;
    } catch (error) {
        console.error('Canvas initialization failed:', error);
        alert('Sorry! Your browser doesn\'t support this game. Please try a modern browser.');
        return false;
    }
}

// Utility functions
function adjustBrightness(hexColor, amount) {
    try {
        const hex = hexColor.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.round(255 * amount)));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.round(255 * amount)));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.round(255 * amount)));
        return `rgb(${r}, ${g}, ${b})`;
    } catch (error) {
        console.error('Brightness adjustment error:', error);
        return hexColor;
    }
}

function isRectColliding(rect1, rect2) {
    try {
        return rect1.x < rect2.x + rect2.w &&
               rect1.x + rect1.w > rect2.x &&
               rect1.y < rect2.y + rect2.h &&
               rect1.y + rect1.h > rect2.y;
    } catch (error) {
        console.error('Collision detection error:', error);
        return false;
    }
}

// Export to global scope
window.CONFIG = CONFIG;
window.initializeCanvas = initializeCanvas;
window.adjustBrightness = adjustBrightness;
window.isRectColliding = isRectColliding;

console.log('✅ Config system initialized');
