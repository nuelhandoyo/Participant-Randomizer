/**
 * Disney-style futuristic animations for particle randomizer
 */

class AnimationManager {
    constructor() {
        this.isAnimating = false;
        this.particleInterval = null;
        this.init();
    }

    init() {
        this.createParticleSystem();
        this.setupHologramEffects();
    }

    // Particle System
    createParticleSystem() {
        const particleFields = document.querySelectorAll('.particle-field');
        
        particleFields.forEach(field => {
            this.enhanceParticleField(field);
        });
    }

    enhanceParticleField(field) {
        // Create additional particle elements
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'dynamic-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: var(--primary-cyan);
                border-radius: 50%;
                box-shadow: 0 0 10px var(--primary-cyan);
                opacity: 0;
            `;
            
            field.appendChild(particle);
            this.animateParticle(particle);
        }
    }

    animateParticle(particle) {
        const animate = () => {
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const endX = Math.random() * 100;
            const endY = Math.random() * 100;
            const duration = Math.random() * 3000 + 2000;
            
            particle.style.left = startX + '%';
            particle.style.top = startY + '%';
            particle.style.opacity = '0';
            
            particle.animate([
                {
                    left: startX + '%',
                    top: startY + '%',
                    opacity: '0',
                    transform: 'scale(0)'
                },
                {
                    left: (startX + endX) / 2 + '%',
                    top: (startY + endY) / 2 + '%',
                    opacity: '1',
                    transform: 'scale(1)'
                },
                {
                    left: endX + '%',
                    top: endY + '%',
                    opacity: '0',
                    transform: 'scale(0)'
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).addEventListener('finish', animate);
        };
        
        setTimeout(animate, Math.random() * 2000);
    }

    // Hologram Effects
    setupHologramEffects() {
        const hologramDisplays = document.querySelectorAll('.hologram-display');
        
        hologramDisplays.forEach(display => {
            this.addHologramScanlines(display);
            this.addHologramFlicker(display);
        });
    }

    addHologramScanlines(display) {
        const scanlines = document.createElement('div');
        scanlines.className = 'hologram-scanlines';
        scanlines.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 212, 255, 0.05) 2px,
                rgba(0, 212, 255, 0.05) 4px
            );
            animation: scanlines-move 3s linear infinite;
            pointer-events: none;
            border-radius: 50%;
        `;
        
        display.appendChild(scanlines);
        
        // Add CSS animation
        if (!document.getElementById('hologram-animations')) {
            const style = document.createElement('style');
            style.id = 'hologram-animations';
            style.textContent = `
                @keyframes scanlines-move {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                
                @keyframes hologram-flicker {
                    0%, 98% { opacity: 1; }
                    99% { opacity: 0.8; }
                    100% { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addHologramFlicker(display) {
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                display.style.animation = 'hologram-flicker 0.1s ease-in-out';
                setTimeout(() => {
                    display.style.animation = '';
                }, 100);
            }
        }, 200);
    }

    // Selection Animations
    startSelectionAnimation() {
        this.isAnimating = true;
        
        // Speed up wheel rotation
        const wheelRings = document.querySelectorAll('.wheel-ring');
        wheelRings.forEach(ring => {
            ring.classList.add('spinning');
        });

        // Animate selected name displays
        const selectedNames = document.querySelectorAll('.selected-name');
        selectedNames.forEach(name => {
            name.classList.add('pulsing');
        });

        // Increase particle activity
        this.increaseParticleActivity();
    }

    stopSelectionAnimation() {
        this.isAnimating = false;
        
        // Restore normal wheel rotation
        const wheelRings = document.querySelectorAll('.wheel-ring');
        wheelRings.forEach(ring => {
            ring.classList.remove('spinning');
        });

        // Stop pulsing animation
        const selectedNames = document.querySelectorAll('.selected-name');
        selectedNames.forEach(name => {
            name.classList.remove('pulsing');
        });

        // Restore normal particle activity
        this.restoreParticleActivity();
    }

    increaseParticleActivity() {
        const particles = document.querySelectorAll('.dynamic-particle');
        particles.forEach(particle => {
            particle.style.animationDuration = '0.5s';
        });
    }

    restoreParticleActivity() {
        const particles = document.querySelectorAll('.dynamic-particle');
        particles.forEach(particle => {
            particle.style.animationDuration = '';
        });
    }

    // Name Display Animation
    animateNameChange(element, newName, callback) {
        // Fade out current name
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0.5';
        
        setTimeout(() => {
            element.textContent = newName;
            // Fade in new name
            element.style.transform = 'scale(1.1)';
            element.style.opacity = '1';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                if (callback) callback();
            }, 150);
        }, 150);
    }

    // Selection Complete Animation
    animateSelectionComplete(element, participantName) {
        // Create explosion effect
        this.createSelectionExplosion(element);
        
        // Animate the name with special effect
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'selection-complete 1s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Add success glow
        element.style.textShadow = '0 0 20px var(--success), 0 0 40px var(--success)';
        element.style.color = 'var(--success)';
        
        setTimeout(() => {
            element.style.textShadow = 'var(--glow-cyan)';
            element.style.color = 'var(--primary-cyan)';
            element.style.animation = '';
        }, 1000);
        
        // Add CSS for selection complete animation
        if (!document.getElementById('selection-animations')) {
            const style = document.createElement('style');
            style.id = 'selection-animations';
            style.textContent = `
                @keyframes selection-complete {
                    0% { transform: scale(1); }
                    20% { transform: scale(1.3); }
                    40% { transform: scale(0.9); }
                    60% { transform: scale(1.1); }
                    80% { transform: scale(0.95); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createSelectionExplosion(centerElement) {
        const container = centerElement.closest('.hologram-display');
        if (!container) return;

        // Create explosion particles
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: var(--success);
                border-radius: 50%;
                box-shadow: 0 0 15px var(--success);
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 1000;
            `;
            
            container.appendChild(particle);
            
            // Animate particle explosion
            const angle = (i * 30) * Math.PI / 180;
            const distance = 100 + Math.random() * 50;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            particle.animate([
                {
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: '1'
                },
                {
                    transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(1)`,
                    opacity: '1'
                },
                {
                    transform: `translate(calc(-50% + ${endX * 1.5}px), calc(-50% + ${endY * 1.5}px)) scale(0)`,
                    opacity: '0'
                }
            ], {
                duration: 800 + Math.random() * 400,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).addEventListener('finish', () => {
                particle.remove();
            });
        }
    }

    // Participant List Animations
    animateParticipantAdd(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    animateParticipantRemove(element, callback) {
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.transform = 'translateX(-100%) scale(0.8)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            if (callback) callback();
        }, 300);
    }
}

// Create global animation manager
window.animationManager = new AnimationManager();