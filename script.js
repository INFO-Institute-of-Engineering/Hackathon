// ===== GLOBAL VARIABLES =====
let mouseX = 0;
let mouseY = 0;
let particles = [];
let isScrolling = false;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeParticleSystem();
    initializeMouseFollower();
    initializeScrollAnimations();
    initializeTypingEffect();
    initializeNavigation();
    initializeSmoothScroll();
    initializeParallaxEffects();
    initializeHoverEffects();
    
    // Preload animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===== PARTICLE SYSTEM =====
function initializeParticleSystem() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
            this.fadeDelay = Math.random() * 600;
            this.fadeStart = Date.now() + this.fadeDelay;
            this.fadingOut = false;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * 1000;
            this.o = '0.' + Math.floor(Math.random() * 50 + 50);
            this.size = Math.random() * 2 + 1;
            this.color = this.getRandomColor();
            this.speed = Math.random() * 0.5 + 0.1;
            this.angle = Math.random() * Math.PI * 2;
            this.life = 0;
            this.maxLife = Math.random() * 300 + 200;
        }
        
        getRandomColor() {
            const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff0080'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.life++;
            
            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.x -= (dx / distance) * force * 2;
                this.y -= (dy / distance) * force * 2;
            }
            
            // Boundary check
            if (this.x < 0 || this.x > canvas.width || 
                this.y < 0 || this.y > canvas.height || 
                this.life > this.maxLife) {
                this.reset();
                this.life = 0;
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.o * (1 - this.life / this.maxLife);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Create particles
    const particleCount = window.innerWidth < 768 ? 50 : 100;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        drawConnections();
        
        requestAnimationFrame(animate);
    }
    
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.save();
                    ctx.globalAlpha = (150 - distance) / 150 * 0.2;
                    ctx.strokeStyle = '#00ffff';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    }
    
    animate();
}

// ===== MOUSE FOLLOWER =====
function initializeMouseFollower() {
    const follower = document.querySelector('.mouse-follower');
    let currentX = 0;
    let currentY = 0;
    let aimX = 0;
    let aimY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        aimX = e.clientX;
        aimY = e.clientY;
    });
    
    function animateFollower() {
        currentX += (aimX - currentX) * 0.1;
        currentY += (aimY - currentY) * 0.1;
        
        follower.style.left = currentX + 'px';
        follower.style.top = currentY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
    
    // Enhanced hover effects
    const interactiveElements = document.querySelectorAll('a, button, .about-card, .prize-card, .timeline-card, .location-card, .map-wrapper');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            follower.style.transform = 'scale(2)';
            follower.style.background = 'radial-gradient(circle, rgba(0, 255, 255, 0.8) 0%, transparent 70%)';
        });
        
        element.addEventListener('mouseleave', () => {
            follower.style.transform = 'scale(1)';
            follower.style.background = 'radial-gradient(circle, var(--primary-neon) 0%, transparent 70%)';
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Special animations for specific elements
                if (entry.target.classList.contains('timeline-item')) {
                    setTimeout(() => {
                        animateTimelineItem(entry.target);
                    }, 200);
                }
                
                if (entry.target.classList.contains('prize-card')) {
                    setTimeout(() => {
                        animatePrizeCard(entry.target);
                    }, 300);
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.reveal-animation').forEach(el => {
        observer.observe(el);
    });
    
    // Parallax scroll effect
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        // Hero parallax
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
        
        // Update scroll indicator
        updateScrollIndicator();
        
        // Navbar background opacity
        const navbar = document.querySelector('.navbar');
        const opacity = Math.min(scrollY / 100, 0.95);
        navbar.style.background = `rgba(0, 0, 0, ${opacity})`;
    });
}

function animateTimelineItem(item) {
    const marker = item.querySelector('.timeline-marker');
    const card = item.querySelector('.timeline-card');
    
    marker.style.animation = 'pulse-marker 1s ease-in-out';
    
    setTimeout(() => {
        card.style.transform = 'scale(1.02)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
    }, 300);
}

function animatePrizeCard(card) {
    const icon = card.querySelector('.prize-icon');
    const amount = card.querySelector('.prize-amount');
    
    icon.style.animation = 'rotate-glow 0.8s ease-in-out';
    
    setTimeout(() => {
        amount.style.animation = 'glow-pulse 0.5s ease-in-out';
    }, 200);
}

function updateScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const scrollProgress = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
    
    if (scrollProgress > 0.1) {
        scrollIndicator.style.opacity = '0';
    } else {
        scrollIndicator.style.opacity = '1';
    }
}

// ===== TYPING EFFECT =====
function initializeTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const text = typingText.getAttribute('data-text');
    let index = 0;
    
    typingText.innerHTML = '';
    
    function typeWriter() {
        if (index < text.length) {
            typingText.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, 150);
        } else {
            // Start glow animation after typing is complete
            setTimeout(() => {
                typingText.style.animation = 'glow-pulse 2s ease-in-out infinite alternate';
            }, 500);
        }
    }
    
    // Start typing after a short delay
    setTimeout(typeWriter, 1000);
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close mobile menu when clicking on a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    // Active navigation highlight
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinksItems.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// ===== SMOOTH SCROLL =====
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== PARALLAX EFFECTS =====
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.about-card, .prize-card');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const rate = scrollTop * -0.5;
            const yPos = -(rate / (index + 5));
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ===== HOVER EFFECTS =====
function initializeHoverEffects() {
    // Button magnetic effect
    const buttons = document.querySelectorAll('.cta-button, .location-button');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
        
        // Click ripple effect
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Card tilt effect
    const cards = document.querySelectorAll('.about-card, .prize-card, .timeline-card, .location-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// ===== TIMELINE ANIMATIONS =====
function initializeTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const marker = entry.target.querySelector('.timeline-marker');
                const card = entry.target.querySelector('.timeline-card');
                
                // Animate marker
                marker.style.animation = 'pulse-marker 1s ease-in-out infinite';
                
                // Animate card entrance
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateX(0) scale(1)';
                }, 200);
            }
        });
    }, { threshold: 0.5 });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

// ===== UTILITIES =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
const optimizedScroll = throttle(() => {
    // Scroll-based animations go here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScroll);

// ===== DYNAMIC STYLES =====
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
   .nav-links.active {
        display: flex !important;
        position: fixed;
        top: 70px;
        left: 0;
        width: 100%;
        height: calc(100vh - 70px);
        background: rgba(0, 0, 0, 0.98);
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 40px;
        backdrop-filter: blur(15px);
        z-index: 1999;
    }
    
    .nav-links.active .nav-link {
        font-size: 1.5rem;
        opacity: 0;
        animation: slideInFromTop 0.5s ease forwards;
    }
    
    .nav-links.active .nav-link:nth-child(1) { animation-delay: 0.1s; }
    .nav-links.active .nav-link:nth-child(2) { animation-delay: 0.2s; }
    .nav-links.active .nav-link:nth-child(3) { animation-delay: 0.3s; }
    .nav-links.active .nav-link:nth-child(4) { animation-delay: 0.4s; }
    .nav-links.active .nav-link:nth-child(5) { animation-delay: 0.5s; }
    
    @keyframes slideInFromTop {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav-link.active {
        color: var(--primary-neon) !important;
        text-shadow: 0 0 10px var(--primary-neon);
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
    }
`;

document.head.appendChild(style);

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.warn('Non-critical error:', e.error);
    // Continue execution without breaking the experience
});

// ===== LOADING OPTIMIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Lazy load non-critical animations
    setTimeout(() => {
        initializeTimelineAnimations();
    }, 1000);
    
    // Initialize critical features immediately
    requestAnimationFrame(() => {
        // Critical animations that need immediate initialization
        document.body.style.opacity = '1';
    });
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduce-motion');
    
    // Disable resource-intensive animations
    particles = [];
    
    const style = document.createElement('style');
    style.textContent = `
        .reduce-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        .reduce-motion .mouse-follower {
            display: none;
        }
        
        .reduce-motion #particleCanvas {
            display: none;
        }
    `;
    document.head.appendChild(style);
}

// ===== EXPORT FOR POTENTIAL TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeParticleSystem,
        initializeMouseFollower,
        initializeScrollAnimations,
        initializeTypingEffect
    };
}
// Add this to script.js
function handleRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal-animation');
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 50) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

// Listen for scroll and touchmove events
window.addEventListener('scroll', handleRevealAnimations);
window.addEventListener('touchmove', handleRevealAnimations);

// Initial trigger
document.addEventListener('DOMContentLoaded', handleRevealAnimations);