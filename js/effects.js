// Visual effects and animations

// Enhanced visual effects
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
        
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.appendChild(heart);
            setTimeout(() => heart.remove(), 3000);
        }
    } catch (error) {
        console.error('Heart effect error:', error);
    }
}

function createBirthdaySparkles() {
    try {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'birthday-sparkle';
                sparkle.innerHTML = ['✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)];
                sparkle.style.position = 'absolute';
                sparkle.style.left = Math.random() * 400 + 'px';
                sparkle.style.top = Math.random() * 400 + 'px';
                sparkle.style.animationDelay = Math.random() * 1 + 's';
                sparkle.style.fontSize = (14 + Math.random() * 8) + 'px';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '1000';
                
                const gameContainer = document.querySelector('.game-container');
                if (gameContainer) {
                    gameContainer.appendChild(sparkle);
                    setTimeout(() => sparkle.remove(), 4000);
                }
            }, i * 100);
        }
    } catch (error) {
        console.error('Birthday sparkles error:', error);
    }
}

function createConfettiExplosion() {
    try {
        const confettiItems = ['🎉', '🎊', '🎈', '🎁', '💝', '🌟', '⭐', '🎂', '💪', '🖤'];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-effect';
                confetti.style.position = 'absolute';
                confetti.style.left = Math.random() * 400 + 'px';
                confetti.style.top = '-20px';
                confetti.style.fontSize = (14 + Math.random() * 6) + 'px';
                confetti.innerHTML = confettiItems[Math.floor(Math.random() * confettiItems.length)];
                confetti.style.animationDuration = (3 + Math.random() * 2) + 's';
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '1000';
                
                const gameContainer = document.querySelector('.game-container');
                if (gameContainer) {
                    gameContainer.appendChild(confetti);
                    setTimeout(() => confetti.remove(), 5000);
                }
            }, i * 60);
        }
    } catch (error) {
        console.error('Confetti explosion error:', error);
    }
}

function createHeartRain() {
    try {
        const hearts = ['💖', '💝', '💗', '💕', '❤️', '🖤'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'confetti-effect';
                heart.style.position = 'absolute';
                heart.style.left = Math.random() * 400 + 'px';
                heart.style.top = '-20px';
                heart.style.fontSize = (16 + Math.random() * 8) + 'px';
                heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.animationDuration = (4 + Math.random() * 2) + 's';
                heart.style.animationDelay = Math.random() * 1 + 's';
                heart.style.pointerEvents = 'none';
                heart.style.zIndex = '1000';
                
                const gameContainer = document.querySelector('.game-container');
                if (gameContainer) {
                    gameContainer.appendChild(heart);
                    setTimeout(() => heart.remove(), 6000);
                }
            }, i * 200);
        }
    } catch (error) {
        console.error('Heart rain error:', error);
    }
}

// Particle system for enhanced effects
class Particle {
    constructor(x, y, type = 'sparkle') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.life = 1.0;
        this.decay = 0.02;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.size = Math.random() * 3 + 1;
        this.color = this.getColor();
    }
    
    getColor() {
        switch(this.type) {
            case 'sparkle': return '#FFD700';
            case 'heart': return '#FF69B4';
            case 'birthday': return '#FF4500';
            default: return '#FFFFFF';
        }
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.vy += 0.1; // gravity
    }
    
    draw() {
        if (this.life <= 0 || !window.ctx) return false;
        
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
        
        return true;
    }
}

// Particle manager
const particles = [];

function addParticles(x, y, count = 10, type = 'sparkle') {
    try {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y, type));
        }
    } catch (error) {
        console.error('Add particles error:', error);
    }
}

function updateParticles() {
    try {
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.update();
            
            if (!particle.draw()) {
                particles.splice(i, 1);
            }
        }
    } catch (error) {
        console.error('Update particles error:', error);
    }
}

// Screen shake effect
let screenShake = { x: 0, y: 0, intensity: 0, duration: 0 };

function startScreenShake(intensity = 5, duration = 500) {
    try {
        screenShake.intensity = intensity;
        screenShake.duration = duration;
    } catch (error) {
        console.error('Screen shake error:', error);
    }
}

function updateScreenShake() {
    try {
        if (screenShake.duration > 0 && window.canvas) {
            screenShake.x = (Math.random() - 0.5) * screenShake.intensity;
            screenShake.y = (Math.random() - 0.5) * screenShake.intensity;
            screenShake.duration -= 16;
            screenShake.intensity *= 0.95;
            
            canvas.style.transform = `translate(${screenShake.x}px, ${screenShake.y}px)`;
        } else if (window.canvas) {
            canvas.style.transform = 'translate(0px, 0px)';
            screenShake.x = 0;
            screenShake.y = 0;
        }
    } catch (error) {
        console.error('Update screen shake error:', error);
    }
}

// Export all functions to global scope
window.createHeartEffect = createHeartEffect;
window.createBirthdaySparkles = createBirthdaySparkles;
window.createConfettiExplosion = createConfettiExplosion;
window.createHeartRain = createHeartRain;
window.addParticles = addParticles;
window.updateParticles = updateParticles;
window.startScreenShake = startScreenShake;
window.updateScreenShake = updateScreenShake;
window.Particle = Particle;

console.log('✅ Effects system initialized');
