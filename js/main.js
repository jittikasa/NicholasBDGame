// Enhanced main initialization with better error handling

// Global variables - ensure they're defined
window.game = null;
window.canvas = null;
window.ctx = null;
window.sprites = {};
window.allSpritesLoaded = false;

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎂 Nicholas\'s Birthday Adventure Loading...');
    
    // FORCE LOAD PICNIC IMAGE FIRST
    console.log('🧺 FORCE LOADING PICNIC PNG...');
    window.picnicImage = new Image();
    window.picnicImage.onload = () => {
        window.picnicImageLoaded = true;
        console.log('✅ PICNIC PNG LOADED! Size:', window.picnicImage.width, 'x', window.picnicImage.height);
    };
    window.picnicImage.onerror = () => {
        console.error('❌ PICNIC PNG FAILED TO LOAD!');
        console.log('🔄 Trying alternative paths...');
        
        // Try without ./
        const img2 = new Image();
        img2.onload = () => {
            window.picnicImage = img2;
            window.picnicImageLoaded = true;
            console.log('✅ PICNIC PNG LOADED (alt path)! Size:', img2.width, 'x', img2.height);
        };
        img2.onerror = () => {
            console.error('❌ All picnic paths failed!');
            window.picnicImageLoaded = false;
        };
        img2.src = 'items/picnic.png';
    };
    window.picnicImage.src = './items/picnic.png';  // Try with ./ prefix
    
    try {
        // Show loading screen immediately
        showLoadingScreen();
        
        // Initialize basic game systems first
        updateLoadingText('Setting up game...');
        await initializeGameSystems();
        
        // Load all sprites
        updateLoadingText('Loading Nicholas and friends...');
        await loadSprites();
        
        // Initialize the complete game
        updateLoadingText('Setting up the adventure...');
        await initializeGame();
        
        // Hide loading screen and start game
        updateLoadingText('Ready for birthday fun!');
        setTimeout(() => {
            hideLoadingScreen();
            startGame();
        }, 500);
        
    } catch (error) {
        console.error('Failed to initialize game:', error);
        updateLoadingText('Oops! Something went wrong. Please refresh to try again.');
        
        // Show error details in console for debugging
        console.error('Error details:', error.stack);
    }
});

// Initialize basic game systems first
async function initializeGameSystems() {
    return new Promise((resolve, reject) => {
        try {
            // Initialize canvas and context
            const canvas = document.getElementById('gameCanvas');
            if (!canvas) {
                throw new Error('Canvas element not found');
            }
            
            window.canvas = canvas;
            window.ctx = canvas.getContext('2d');
            
            if (!ctx) {
                throw new Error('Could not get canvas context');
            }
            
            // Set up pixel perfect rendering
            ctx.imageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            
            // Initialize basic game state
            window.game = {
                currentRoom: 'bedroom',
                player: { 
                    x: 120, y: 280, 
                    direction: 'down', 
                    animFrame: 0, 
                    moving: false,
                    moveTimer: 0,
                    lastMove: 0
                },
                cat: { 
                    x: 80, y: 240, 
                    direction: 'right', 
                    animFrame: 0, 
                    moving: false,
                    followTimer: 0,
                    lastPosition: { x: 80, y: 240 }
                },
                discoveries: new Set(),
                birthdayFound: false,
                gameStartTime: Date.now(),
                totalInteractions: 0,
                roomVisits: { bedroom: 1, livingroom: 0 },
                lastInteraction: null
            };
            
            console.log('✅ Basic game systems initialized');
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

// Loading screen management
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 300);
    }
}

function updateLoadingText(text) {
    const loadingText = document.getElementById('loadingText');
    if (loadingText) {
        loadingText.textContent = text;
    }
    console.log('Loading:', text);
}

function updateLoadingProgress(progress) {
    const loadingFill = document.getElementById('loadingFill');
    if (loadingFill) {
        loadingFill.style.width = (progress * 100) + '%';
    }
}

// Enhanced game initialization (called after sprites load)
async function initializeGame() {
    return new Promise((resolve, reject) => {
        try {
            // Set up event listeners
            setupControls();
            setupUI();
            
            console.log('✅ Game initialized successfully');
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

// Start the actual game loop
function startGame() {
    console.log('🎮 Starting Nicholas\'s Birthday Adventure!');
    
    // Start game loop
    gameLoop();
    
    // Show initial room
    const roomHeader = document.getElementById('roomHeader');
    if (roomHeader && window.rooms && window.game) {
        roomHeader.textContent = rooms[game.currentRoom].title;
    }
    
    // Show welcome message
    setTimeout(() => {
        if (typeof displayMessage === 'function') {
            displayMessage("🎮 Welcome to Nicholas's Birthday Adventure! 🎉\\n\\nExplore using WASD/arrows or touch controls. Walk near objects and press Talk to interact. Find the special birthday surprise! Your black cat follows you around! 🐱💖");
        }
    }, 1000);
}

// Set up UI event listeners
function setupUI() {
    // Action buttons
    const talkBtn = document.getElementById('talkBtn');
    const checkBtn = document.getElementById('checkBtn');
    const lookBtn = document.getElementById('lookBtn');
    
    if (talkBtn) talkBtn.addEventListener('click', () => {
        if (typeof interactWithObject === 'function') interactWithObject();
    });
    if (checkBtn) checkBtn.addEventListener('click', () => {
        if (typeof checkItems === 'function') checkItems();
    });
    if (lookBtn) lookBtn.addEventListener('click', () => {
        if (typeof showRoomInfo === 'function') showRoomInfo();
    });
    
    // Direction pad controls
    document.querySelectorAll('.dpad').forEach(button => {
        const direction = button.dataset.direction;
        
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (direction && typeof movePlayer === 'function') movePlayer(direction);
        });
        
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (direction && typeof movePlayer === 'function') movePlayer(direction);
        });
    });
    
    console.log('✅ UI controls set up');
}

// Enhanced keyboard and touch controls setup
function setupControls() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (typeof movePlayer !== 'function') return;
        
        switch(e.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                e.preventDefault();
                movePlayer('up');
                break;
            case 'arrowdown':
            case 's':
                e.preventDefault();
                movePlayer('down');
                break;
            case 'arrowleft':
            case 'a':
                e.preventDefault();
                movePlayer('left');
                break;
            case 'arrowright':
            case 'd':
                e.preventDefault();
                movePlayer('right');
                break;
            case ' ':
            case 'enter':
                e.preventDefault();
                if (typeof interactWithObject === 'function') interactWithObject();
                break;
        }
    });
    
    // Touch controls for canvas
    let touchStartX, touchStartY;
    
    if (canvas) {
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            touchStartX = touch.clientX - rect.left;
            touchStartY = touch.clientY - rect.top;
        });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const rect = canvas.getBoundingClientRect();
            const touchEndX = touch.clientX - rect.left;
            const touchEndY = touch.clientY - rect.top;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            if (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (typeof movePlayer === 'function') movePlayer(deltaX > 0 ? 'right' : 'left');
                } else {
                    if (typeof movePlayer === 'function') movePlayer(deltaY > 0 ? 'down' : 'up');
                }
            } else {
                // Tap to interact
                if (typeof interactWithObject === 'function') interactWithObject();
            }
        });
        
        // Click to interact
        canvas.addEventListener('click', (e) => {
            if (typeof interactWithObject === 'function') interactWithObject();
        });
    }
    
    console.log('✅ Controls set up');
}

// Handle any errors gracefully
window.addEventListener('error', (e) => {
    console.error('Game Error:', e.error);
    
    // Show user-friendly error message
    const messageDisplay = document.getElementById('messageDisplay');
    if (messageDisplay) {
        messageDisplay.textContent = 'Oops! Something went wrong. Please refresh the page to try again! 😅';
    }
    
    // Update loading text if still loading
    updateLoadingText('Oops! Something went wrong. Please refresh to try again.');
});

// Prevent context menu on right-click for better mobile experience
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Prevent zoom on double-tap for mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Debug functions (available in console)
window.debugGame = () => {
    console.log('🔍 Game Debug Info:');
    console.log('Sprites loaded:', window.allSpritesLoaded);
    console.log('Game state:', window.game ? 'initialized' : 'not initialized');
    console.log('Canvas:', window.canvas ? 'ready' : 'missing');
    console.log('Context:', window.ctx ? 'ready' : 'missing');
    if (window.game) {
        console.log('Current room:', window.game.currentRoom);
        console.log('Player position:', window.game.player.x, window.game.player.y);
        console.log('Cat position:', window.game.cat.x, window.game.cat.y);
        console.log('Discoveries:', Array.from(window.game.discoveries));
        console.log('Birthday found:', window.game.birthdayFound);
    }
};

window.listSprites = () => {
    console.log('🎨 Loaded Sprites:');
    if (window.sprites) {
        Object.keys(window.sprites).forEach(key => {
            console.log(`${key}:`, window.sprites[key] ? '✅ Loaded' : '❌ Failed');
        });
    } else {
        console.log('Sprites object not initialized');
    }
};

console.log(`
🎂✨ Nicholas's Birthday Adventure ✨🎂

Welcome to this special birthday game!
Made with ❤️ for Nicholas's special day!

Debug commands:
- debugGame() - Show game status
- listSprites() - Show sprite status
`);
