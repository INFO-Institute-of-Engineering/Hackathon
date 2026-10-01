// ===== GLOBAL VARIABLES =====
let mouseX = 0;
let mouseY = 0;
let particles = [];
let isScrolling = false;

// ===== INITIALIZATION =====
function initAllSystems() {
    // 8-Second Infomeister Cyber-Phoenix Intro (Run FIRST on index.html)
    try {
        initializeInfomeisterDoorShatterIntro();
    } catch (e) {
        console.error('Intro error:', e);
    }

    // Immediately trigger typing effect on problem statements or non-intro views
    if (window.location.pathname.includes('problem-statements.html') || !document.getElementById('introOverlay')) {
        initializeTypingEffect();
    }

    initializeParticleSystem();
    initializeMouseFollower();
    initializeScrollAnimations();
    initializeNavigation();
    initializeSmoothScroll();
    initializeParallaxEffects();
    initializeHoverEffects();
    initializePrizeCardTilt();

    // Preload animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllSystems);
} else {
    initAllSystems();
}

// ===== QUANTUM CYBER DUST & FLUID TURBULENCE SWARM SYSTEM =====
function initializeParticleSystem() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isLowPower = (
        window.innerWidth < 768 ||
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 1) ||
        (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
    );

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse Tracking with Velocity & Fluid Impulse
    let mouse = {
        x: -1000,
        y: -1000,
        prevX: -1000,
        prevY: -1000,
        vx: 0,
        vy: 0,
        speed: 0,
        radius: 200,
        active: false
    };

    let particles = [];
    let nebulae = [];

    function resizeCanvas() {
        dpr = isLowPower ? 1 : Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);

        initNebulae();
        initParticles();
    }

    function initNebulae() {
        nebulae = [
            {
                baseX: width * 0.18,
                baseY: height * 0.25,
                radius: Math.max(width, height) * 0.45,
                colorRgb: '0, 240, 255', // Electric Cyan
                maxAlpha: 0.12,
                driftSpeedX: 0.0003,
                driftSpeedY: 0.0005,
                phase: 0
            },
            {
                baseX: width * 0.85,
                baseY: height * 0.40,
                radius: Math.max(width, height) * 0.42,
                colorRgb: '255, 0, 128', // Neon Magenta
                maxAlpha: 0.11,
                driftSpeedX: 0.0004,
                driftSpeedY: 0.0003,
                phase: Math.PI
            },
            {
                baseX: width * 0.50,
                baseY: height * 0.75,
                radius: Math.max(width, height) * 0.38,
                colorRgb: '139, 92, 246', // Deep Violet
                maxAlpha: 0.09,
                driftSpeedX: 0.0003,
                driftSpeedY: 0.0004,
                phase: Math.PI * 0.5
            }
        ];
    }

    function initParticles() {
        particles = [];
        const count = isLowPower ? 35 : (width < 1200 ? 90 : 150);

        for (let i = 0; i < count; i++) {
            const depth = Math.random(); // 0 (far) to 1 (near foreground)
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.2 + (1 - depth) * 0.4;

            const roll = Math.random();
            let color, rgb, shadowColor;
            if (roll < 0.48) {
                color = '#00f5ff'; // Electric Cyan
                rgb = '0, 245, 255';
                shadowColor = '#00f5ff';
            } else if (roll < 0.82) {
                color = '#ff007f'; // Neon Magenta
                rgb = '255, 0, 127';
                shadowColor = '#ff007f';
            } else if (roll < 0.93) {
                color = '#a855f7'; // Deep Neon Violet
                rgb = '168, 85, 247';
                shadowColor = '#a855f7';
            } else {
                color = '#ffffff'; // Quantum Starlight White
                rgb = '255, 255, 255';
                shadowColor = '#00f5ff';
            }

            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                baseVx: Math.cos(angle) * speed,
                baseVy: Math.sin(angle) * speed,
                depth: depth,
                radius: (0.9 + depth * 1.8),
                baseAlpha: 0.35 + depth * 0.55,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.0015 + Math.random() * 0.002,
                color: color,
                rgb: rgb,
                shadowColor: shadowColor,
                trail: []
            });
        }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse with fluid velocity computation
    let mouseTimeout;
    document.addEventListener('mousemove', (e) => {
        if (!mouse.active) {
            mouse.prevX = e.clientX;
            mouse.prevY = e.clientY;
            mouse.active = true;
        } else {
            mouse.prevX = mouse.x;
            mouse.prevY = mouse.y;
        }

        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Instantaneous mouse velocity
        mouse.vx = (mouse.x - mouse.prevX) * 0.6;
        mouse.vy = (mouse.y - mouse.prevY) * 0.6;
        mouse.speed = Math.hypot(mouse.vx, mouse.vy);

        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
            mouse.active = false;
            mouse.vx = 0;
            mouse.vy = 0;
            mouse.speed = 0;
        }, 1500);
    });

    document.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    let startTime = performance.now();

    function render(now) {
        const time = now - startTime;

        // 1. Clear with Deep Obsidian Void
        ctx.fillStyle = '#05070e';
        ctx.fillRect(0, 0, width, height);

        // 2. Render Atmospheric Glowing Nebulae
        for (let n = 0; n < nebulae.length; n++) {
            const neb = nebulae[n];
            const curX = neb.baseX + Math.sin(time * neb.driftSpeedX + neb.phase) * (width * 0.06);
            const curY = neb.baseY + Math.cos(time * neb.driftSpeedY + neb.phase) * (height * 0.06);

            const grad = ctx.createRadialGradient(curX, curY, 0, curX, curY, neb.radius);
            grad.addColorStop(0, `rgba(${neb.colorRgb}, ${neb.maxAlpha})`);
            grad.addColorStop(0.5, `rgba(${neb.colorRgb}, ${neb.maxAlpha * 0.4})`);
            grad.addColorStop(1, 'transparent');

            ctx.save();
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(curX, curY, neb.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 3. Connective Constellation Filaments (skipped on low-power/mobile for 60fps)
        if (!isLowPower) {
            const connectDist = width < 768 ? 60 : 78;
            ctx.save();
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                if (p1.depth < 0.25) continue;

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    if (p2.depth < 0.25) continue;

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < connectDist * connectDist) {
                        const dist = Math.sqrt(distSq);
                        const filamentAlpha = (1 - dist / connectDist) * 0.18 * ((p1.depth + p2.depth) * 0.5);

                        ctx.strokeStyle = `rgba(${p1.rgb}, ${filamentAlpha})`;
                        ctx.lineWidth = 0.65;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            ctx.restore();
        }

        // 4. Update & Render Quantum Particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Fluid Turbulence & Cursor Vortex Dynamics
            if (mouse.active) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.hypot(dx, dy);

                if (dist < mouse.radius && dist > 1) {
                    const normDist = dist / mouse.radius;
                    const force = (1 - normDist) * 0.85;

                    // A. Radial repulsion
                    const angleRad = Math.atan2(dy, dx);
                    p.vx += Math.cos(angleRad) * force * 1.2;
                    p.vy += Math.sin(angleRad) * force * 1.2;

                    // B. Vortex curl swirl
                    const vortexAngle = angleRad + Math.PI * 0.5;
                    p.vx += Math.cos(vortexAngle) * force * 1.6;
                    p.vy += Math.sin(vortexAngle) * force * 1.6;

                    // C. Momentum fling from moving mouse
                    if (mouse.speed > 1.5) {
                        const flingForce = Math.min(mouse.speed * 0.08, 3.0) * (1 - normDist);
                        p.vx += mouse.vx * flingForce * 0.15;
                        p.vy += mouse.vy * flingForce * 0.15;
                    }
                }
            }

            // Damping & natural drift recovery
            p.vx *= 0.94;
            p.vy *= 0.94;
            p.vx += (p.baseVx - p.vx) * 0.035;
            p.vy += (p.baseVy - p.vy) * 0.035;

            // Position update
            p.x += p.vx;
            p.y += p.vy;

            // Screen wrap-around with gentle margin
            const pad = 20;
            if (p.x < -pad) p.x = width + pad;
            if (p.x > width + pad) p.x = -pad;
            if (p.y < -pad) p.y = height + pad;
            if (p.y > height + pad) p.y = -pad;

            // Store high-speed streak trail when moving fast
            const currentSpeed = Math.hypot(p.vx, p.vy);
            if (currentSpeed > 1.6) {
                p.trail.unshift({ x: p.x, y: p.y });
                if (p.trail.length > 5) p.trail.pop();
            } else if (p.trail.length > 0) {
                p.trail.pop();
            }

            // Draw glowing speed streak tail
            if (p.trail.length > 1) {
                ctx.save();
                ctx.strokeStyle = `rgba(${p.rgb}, 0.25)`;
                ctx.lineWidth = p.radius * 0.8;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                for (let t = 0; t < p.trail.length; t++) {
                    ctx.lineTo(p.trail[t].x, p.trail[t].y);
                }
                ctx.stroke();
                ctx.restore();
            }

            // Breathing pulse luminescence
            const pulse = Math.sin(time * p.pulseSpeed + p.pulsePhase);
            const currentAlpha = Math.max(0.15, Math.min(1.0, p.baseAlpha + pulse * 0.2));

            // Render Particle
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.globalAlpha = currentAlpha;

            // Glow bloom only on high-performance desktop
            if (!isLowPower && p.depth > 0.4) {
                ctx.shadowBlur = 6 + p.depth * 4;
                ctx.shadowColor = p.shadowColor;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

// ===== MOUSE FOLLOWER =====
function initializeMouseFollower() {
    const follower = document.querySelector('.mouse-follower');
    if (!follower || !follower.style) return;
    // Disable completely on touch devices & small screens for 0 CPU overhead
    if (window.innerWidth < 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) {
        follower.style.display = 'none';
        return;
    }
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
        if (!follower || !follower.style) return;
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

    // Scroll events handling - optimized with passive listener and cached navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            const opacity = Math.min(window.pageYOffset / 100, 0.95);
            navbar.style.background = `rgba(0, 0, 0, ${opacity})`;
        }
    }, { passive: true });
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

// ===== CHARACTER-BY-CHARACTER (ONE-BY-ONE LETTER) TYPING EFFECT =====
function initializeTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-text');
    if (!typingElements || typingElements.length === 0) return;

    typingElements.forEach((typingElement) => {
        // Prevent duplicate execution if already started or finished
        if (typingElement.dataset.typingActive === 'true' || typingElement.dataset.typingDone === 'true') {
            return;
        }

        const fullText = typingElement.getAttribute('data-text') || typingElement.textContent.trim();
        if (!fullText) return;

        typingElement.dataset.typingActive = 'true';
        typingElement.textContent = '';
        typingElement.classList.add('typing-active');
        typingElement.classList.remove('typing-complete');

        let charIndex = 0;
        const speed = 70; // 70ms per character for smooth one-by-one animation

        function typeNextChar() {
            if (charIndex < fullText.length) {
                typingElement.textContent = fullText.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeNextChar, speed);
            } else {
                typingElement.dataset.typingActive = 'false';
                typingElement.dataset.typingDone = 'true';
                typingElement.classList.remove('typing-active');
                typingElement.classList.add('typing-complete');
                typingElement.style.animation = 'glow-pulse 2s ease-in-out infinite alternate';
            }
        }

        // Delay 150ms before typing begins
        setTimeout(typeNextChar, 150);
    });
}
window.initializeTypingEffect = initializeTypingEffect;

// ===== NAVIGATION =====
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    if (!hamburger || !navLinks) return;

    // Mobile menu toggle
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('mobile-nav-open', navLinks.classList.contains('active'));

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
            document.body.classList.remove('mobile-nav-open');

            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('mobile-nav-open');

            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Active navigation highlight - throttled with requestAnimationFrame for 60fps
    let navTicking = false;
    window.addEventListener('scroll', () => {
        if (!navTicking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                const sections = document.querySelectorAll('section[id]');

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
                navTicking = false;
            });
            navTicking = true;
        }
    }, { passive: true });
}

// ===== SMOOTH SCROLL =====
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
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
// Track internal navigation to Home so clicking 'Home' or logo skips intro
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
        const href = link.getAttribute('href') || '';
        if (href === 'index.html' || href.startsWith('index.html#') || href.startsWith('#')) {
            try {
                sessionStorage.setItem('trisquadathon_skip_intro_nav', 'true');
            } catch (err) { }
        }
    }
}, true);

function initializeParallaxEffects() {
    // Parallax disabled on cards to ensure 60fps smoothness and prevent layout collision
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

    // Generic Card tilt effect (for about, timeline, location)
    const cards = document.querySelectorAll('.about-card, .timeline-card, .location-card');

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

// ===== 3D HOLOGRAPHIC PRIZE CARD TILT & SPECULAR GLARE =====
function initializePrizeCardTilt() {
    const cards = document.querySelectorAll('.prize-card');
    if (!cards.length) return;
    // Touch screens do not have cursor hover - skip 3D tilt calculations to preserve 60fps
    if (window.innerWidth < 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) {
        return;
    }

    cards.forEach(card => {
        const isWinner = card.classList.contains('winner');
        const baseScale = isWinner ? 1.08 : 1.0;
        let isHovered = false;

        card.addEventListener('mouseenter', () => {
            isHovered = true;
            card.style.transition = 'transform 0.12s ease-out, border-color 0.3s ease, box-shadow 0.3s ease';
            card.style.setProperty('--sheen-opacity', '1');
        });

        card.addEventListener('mousemove', (e) => {
            if (!isHovered) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Normalized coordinates (-1 to 1) from center of card
            const percentX = (x / rect.width) * 2 - 1;
            const percentY = (y / rect.height) * 2 - 1;

            // 3D tilt rotation (max 15 degrees)
            const maxTilt = 15;
            const tiltX = -percentY * maxTilt;
            const tiltY = percentX * maxTilt;

            // Calculate angle for dynamic holographic rainbow sheen
            const rad = Math.atan2(percentY, percentX);
            const deg = (rad * 180 / Math.PI) + 90;

            const hoverScale = isWinner ? 1.14 : 1.07;
            const zDistance = isWinner ? 28 : 20;

            card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${hoverScale}, ${hoverScale}, ${hoverScale}) translateZ(${zDistance}px)`;
            card.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
            card.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);
            card.style.setProperty('--tilt-angle', `${deg.toFixed(1)}deg`);
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            card.style.transition = 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.4s ease, box-shadow 0.4s ease';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(${baseScale}, ${baseScale}, ${baseScale}) translateZ(0px)`;
            card.style.setProperty('--sheen-opacity', '0');
        });
    });

    // Special Recognition Category Cards
    const specialCards = document.querySelectorAll('.special-prize-card');
    specialCards.forEach(card => {
        let isHovered = false;

        card.addEventListener('mouseenter', () => {
            isHovered = true;
            card.style.transition = 'transform 0.15s ease-out, box-shadow 0.35s ease';
        });

        card.addEventListener('mousemove', (e) => {
            if (!isHovered) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const percentX = (x / rect.width) * 2 - 1;
            const percentY = (y / rect.height) * 2 - 1;

            const maxTilt = 8;
            const tiltX = -percentY * maxTilt;
            const tiltY = percentX * maxTilt;

            card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-8px) scale3d(1.025, 1.025, 1.025)`;
            card.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
            card.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            card.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s ease';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
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
    return function () {
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
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
let revealScheduled = false;
function handleRevealAnimations() {
    // Only query unrevealed elements to avoid querying dozens of DOM nodes per scroll
    const reveals = document.querySelectorAll('.reveal-animation:not(.active)');
    if (!reveals.length) return;
    const windowHeight = window.innerHeight;
    for (let i = 0; i < reveals.length; i++) {
        const el = reveals[i];
        if (el.getBoundingClientRect().top < windowHeight - 40) {
            el.classList.add('active');
        }
    }
}

function onThrottledScroll() {
    if (!revealScheduled) {
        revealScheduled = true;
        requestAnimationFrame(() => {
            handleRevealAnimations();
            revealScheduled = false;
        });
    }
}

// Passive listeners allow native compositor scrolling at 60/120 FPS
window.addEventListener('scroll', onThrottledScroll, { passive: true });
window.addEventListener('touchmove', onThrottledScroll, { passive: true });

// Initial trigger
document.addEventListener('DOMContentLoaded', handleRevealAnimations);

// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// 8-SECOND "THE AWAKENING OF THE CYBER-PHOENIX" INFOMEISTER BRAND INTRO
// Concept: PCB Circuit Surge -> Official Infomeister Medallion -> Trisquadathon 2.0
// Total Duration: 8.0 Seconds (Extended +3s for Cinematic Breathing Room)
// ==========================================================================
function initializeInfomeisterDoorShatterIntro() {
    const overlay = document.getElementById('introOverlay');
    const canvas = document.getElementById('introCanvas');

    // Never show on problem statements page
    if (window.location.pathname.includes('problem-statements.html')) {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.documentElement.classList.remove('intro-locked');
        document.body.classList.remove('intro-locked');
        initializeTypingEffect();
        return;
    }

    if (!overlay || !canvas) {
        initializeTypingEffect();
        return;
    }

    // 1. Detect if the user refreshed / reloaded the webpage (Reload always shows intro)
    let isPageReload = false;
    try {
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries && navEntries.length > 0) {
            isPageReload = (navEntries[0].type === 'reload');
        } else if (window.performance && window.performance.navigation) {
            isPageReload = (window.performance.navigation.type === 1);
        }
    } catch (e) {
        console.warn('Navigation check error:', e);
    }

    // 2. Detect if user navigated back to Home via internal link or from problem statements
    const referrer = document.referrer || '';
    const isFromInternalBackNav = referrer.includes('problem-statements.html') ||
        sessionStorage.getItem('trisquadathon_skip_intro_nav') === 'true';

    // If it's a page reload: USER WANTS THE INTRO TO PLAY!
    if (isPageReload) {
        try {
            sessionStorage.removeItem('trisquadathon_skip_intro_nav');
        } catch (e) { }
    } else if (isFromInternalBackNav) {
        // Navigating back to home from problem statements or clicking home:
        // Skip intro immediately so user doesn't wait when clicking Home
        try {
            sessionStorage.removeItem('trisquadathon_skip_intro_nav');
        } catch (e) { }
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.documentElement.classList.remove('intro-locked');
        document.body.classList.remove('intro-locked');
        initializeTypingEffect();
        return;
    }

    // Helper to replay intro anytime for testing via browser console: replayIntro()
    window.replayIntro = function () {
        try { sessionStorage.removeItem('trisquadathon_skip_intro_nav'); } catch (e) { }
        window.location.reload();
    };

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        overlay.remove();
        initializeTypingEffect();
        return;
    }

    // 100% True Fullscreen Scroll Lock
    document.documentElement.classList.add('intro-locked');
    document.body.classList.add('intro-locked');

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = null;
    let isTerminated = false;

    // Strict 8.0s Lifecycle (8000ms = 5s base + 3s extra)
    const INTRO_DURATION = 8000;
    const FADE_START_TIME = 7350;
    let startTime = null;

    // High-Contrast Cyber Palette Constants
    const C_CYAN = '#00f0ff';
    const C_BLUE = '#0077ff';
    const C_GOLD = '#ffaa00';
    const C_WHITE = '#ffffff';

    // Preload custom brand fonts
    if (document.fonts) {
        document.fonts.load('900 64px "KungFuMaster"').catch(() => { });
        document.fonts.load('900 64px "Orbitron"').catch(() => { });
        document.fonts.load('600 24px "Exo 2"').catch(() => { });
    }

    // ----------------------------------------------------------------------
    // LOAD OFFICIAL INFOMEISTER LOGO IMAGE
    // ----------------------------------------------------------------------
    const logoImg = new Image();
    let isLogoLoaded = false;
    logoImg.onload = () => { isLogoLoaded = true; };
    logoImg.src = 'images/infomeister-logo.png?v=7.0';

    // ----------------------------------------------------------------------
    // AMBIENT COSMIC PARTICLES (Cinematic Floating Stardust Depth)
    // ----------------------------------------------------------------------
    const ambientMotes = [];
    const NUM_MOTES = 60;
    for (let i = 0; i < NUM_MOTES; i++) {
        ambientMotes.push({
            x: Math.random(),
            y: Math.random(),
            size: 0.8 + Math.random() * 1.8,
            speedY: -0.012 - Math.random() * 0.024,
            speedX: (Math.random() - 0.5) * 0.008,
            alpha: 0.15 + Math.random() * 0.55,
            phase: Math.random() * Math.PI * 2
        });
    }

    // ----------------------------------------------------------------------
    // OFFSCREEN TITLE RENDERING (Liquid Platinum + Dark Bevels)
    // ----------------------------------------------------------------------
    let offTitle = null;
    let titleW = 0;
    let titleH = 0;
    let titleFontSize = 48;

    function prepareTitleBuffer() {
        titleFontSize = Math.max(22, Math.min(width * 0.052, 64));
        const testFont = `900 ${titleFontSize}px 'KungFuMaster', 'Orbitron', 'Montserrat', sans-serif`;

        const measureCanvas = document.createElement('canvas');
        const mCtx = measureCanvas.getContext('2d');
        mCtx.font = testFont;
        const textMetrics = mCtx.measureText('TRISQUADATHON');

        titleW = Math.ceil(textMetrics.width + 40);
        titleH = Math.ceil(titleFontSize * 1.7);

        offTitle = document.createElement('canvas');
        offTitle.width = Math.max(1, Math.ceil(titleW * dpr));
        offTitle.height = Math.max(1, Math.ceil(titleH * dpr));

        const tCtx = offTitle.getContext('2d');
        if (!tCtx) return;
        tCtx.scale(dpr, dpr);

        const tcx = titleW / 2;
        const tcy = titleH / 2 + titleFontSize * 0.34;

        tCtx.font = testFont;
        tCtx.textAlign = 'center';
        tCtx.textBaseline = 'alphabetic';

        // Dark Obsidian Drop Shadow
        tCtx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        tCtx.shadowBlur = 24;
        tCtx.shadowOffsetY = 6;

        tCtx.strokeStyle = '#050a12';
        tCtx.lineWidth = Math.max(5, titleFontSize * 0.09);
        tCtx.strokeText('TRISQUADATHON', tcx, tcy);

        tCtx.shadowColor = 'transparent';

        // Multi-Stop Liquid Platinum Gradient
        const grad = tCtx.createLinearGradient(0, tcy - titleFontSize, 0, tcy + 4);
        grad.addColorStop(0, '#ffffff');      // Blinding specular highlight
        grad.addColorStop(0.22, '#f0f5fa');   // Liquid platinum
        grad.addColorStop(0.48, '#a2b6cb');   // Brushed alloy
        grad.addColorStop(0.52, '#3b4d60');   // Horizon shadow
        grad.addColorStop(0.78, '#d6e4f3');   // Ground reflection
        grad.addColorStop(1, '#798e9f');      // Deep bevel
        tCtx.fillStyle = grad;
        tCtx.fillText('TRISQUADATHON', tcx, tcy);

        // Specular Top Rim Line
        tCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        tCtx.lineWidth = 1.3;
        tCtx.strokeText('TRISQUADATHON', tcx, tcy);
    }

    // ----------------------------------------------------------------------
    // RESIZE HANDLER
    // ----------------------------------------------------------------------
    function resize() {
        if (!canvas) return;
        width = window.innerWidth || document.documentElement.clientWidth || 1920;
        height = window.innerHeight || document.documentElement.clientHeight || 1080;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        prepareTitleBuffer();
    }

    // ----------------------------------------------------------------------
    // MATHEMATICAL EASING FUNCTIONS
    // ----------------------------------------------------------------------
    function easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }

    function easeInOutCubic(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    // ----------------------------------------------------------------------
    // MAIN ANIMATION LOOP (Cinematic Optical Flare & Eclipse Reveal)
    // ----------------------------------------------------------------------
    let lastTime = performance.now();

    function render(now) {
        if (isTerminated) return;
        if (!startTime) startTime = now;

        const elapsed = now - startTime;
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        const T = elapsed / 1000; // Timeline in seconds (0.00s -> 8.00s)

        const cx = width / 2;
        const cy = height / 2;
        const minDim = Math.min(width, height);
        const isMobile = width < 768 || width < height;

        // Target size of the Infomeister Medallion (calibrated for mobile & desktop)
        const medallionFullSize = isMobile
            ? Math.max(190, Math.min(width * 0.62, height * 0.29, 255))
            : Math.max(250, Math.min(minDim * 0.42, 360));
        const medallionRadius = medallionFullSize * 0.495;

        ctx.save();

        // ------------------------------------------------------------------
        // LAYER 1: LUXURY DARK SAPPHIRE & OBSIDIAN BLUE VOID (PREMIUM DARK BLUE)
        // ------------------------------------------------------------------
        const bgGrad = ctx.createRadialGradient(cx, cy, 25, cx, cy, Math.max(width, height) * 0.95);
        bgGrad.addColorStop(0, '#071836');    // Refined dark sapphire core
        bgGrad.addColorStop(0.24, '#041026'); // Deep dark Prussian navy
        bgGrad.addColorStop(0.58, '#020918'); // Midnight obsidian abyss
        bgGrad.addColorStop(1, '#01030a');    // Deepest OLED aerospace blue-black
        ctx.fillStyle = bgGrad;
        ctx.fillRect(-20, -20, width + 40, height + 40);

        // Subtle Moody Midnight Nebula Bloom (Dark, Deep, Atmospheric)
        const auraBreath = 0.92 + 0.08 * Math.sin(T * 1.6);
        const auraR = minDim * 0.68 * auraBreath;
        const auraGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, auraR);
        auraGrad.addColorStop(0, 'rgba(16, 56, 120, 0.24)');
        auraGrad.addColorStop(0.40, 'rgba(8, 28, 68, 0.12)');
        auraGrad.addColorStop(0.75, 'rgba(2, 9, 24, 0.04)');
        auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, auraR, 0, Math.PI * 2);
        ctx.fill();

        // Ultra-Faint Stealth Blueprint Matrix Lattice
        ctx.save();
        ctx.strokeStyle = 'rgba(28, 85, 160, 0.032)';
        ctx.lineWidth = 1;
        const gridSpacing = isMobile ? 48 : 64;
        const startX = (width % gridSpacing) / 2;
        const startY = (height % gridSpacing) / 2;
        ctx.beginPath();
        for (let x = startX; x < width; x += gridSpacing) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        for (let y = startY; y < height; y += gridSpacing) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();
        ctx.restore();

        // Cinematic Deep Space Stardust (Subtle Ice-Blue & Sapphire)
        ctx.save();
        ambientMotes.forEach((p, idx) => {
            p.y += p.speedY * dt;
            p.x += p.speedX * dt;
            if (p.y < 0) p.y = 1;
            if (p.x < 0) p.x = 1;
            if (p.x > 1) p.x = 0;

            const px = p.x * width;
            const py = p.y * height;
            const curAlpha = p.alpha * (0.50 + 0.25 * Math.sin(T * 2.2 + p.phase));

            const moteColor = (idx % 3 === 0)
                ? `rgba(220, 240, 255, ${curAlpha * 0.75})`
                : ((idx % 2 === 0)
                    ? `rgba(0, 190, 255, ${curAlpha * 0.7})`
                    : `rgba(40, 110, 210, ${curAlpha * 0.65})`);

            ctx.fillStyle = moteColor;
            ctx.beginPath();
            ctx.arc(px, py, p.size * 0.95, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();

        // Sleek Metallic Telemetry Coordinate Rings (Dark Steel Sapphire)
        ctx.strokeStyle = 'rgba(0, 160, 255, 0.07)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, medallionRadius * 1.35, 0, Math.PI * 2);
        ctx.arc(cx, cy, medallionRadius * 1.95, 0, Math.PI * 2);
        ctx.stroke();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(T * 0.05);
        ctx.strokeStyle = 'rgba(0, 120, 230, 0.09)';
        ctx.setLineDash([4, 16]);
        ctx.beginPath();
        ctx.arc(0, 0, medallionRadius * 1.62, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // ------------------------------------------------------------------
        // LAYER 2: HOLOGRAPHIC HUD APERTURE RETICLE (0.0s -> 2.2s)
        // ------------------------------------------------------------------
        if (T < 2.2) {
            const hudAlpha = T < 0.45 ? T / 0.45 : (T > 1.8 ? Math.max(0, (2.2 - T) / 0.4) : 1);
            ctx.save();
            ctx.globalAlpha = hudAlpha;

            // 4 Minimalist Corner Framing Brackets
            const bracketSize = isMobile ? 14 : 20;
            const pad = medallionRadius + (isMobile ? 12 : 18);
            ctx.strokeStyle = C_CYAN;
            ctx.lineWidth = 1.8;

            // Top-Left Bracket
            ctx.beginPath();
            ctx.moveTo(cx - pad, cy - pad + bracketSize);
            ctx.lineTo(cx - pad, cy - pad);
            ctx.lineTo(cx - pad + bracketSize, cy - pad);
            ctx.stroke();

            // Top-Right Bracket
            ctx.beginPath();
            ctx.moveTo(cx + pad - bracketSize, cy - pad);
            ctx.lineTo(cx + pad, cy - pad);
            ctx.lineTo(cx + pad, cy - pad + bracketSize);
            ctx.stroke();

            // Bottom-Left Bracket
            ctx.beginPath();
            ctx.moveTo(cx - pad, cy + pad - bracketSize);
            ctx.lineTo(cx - pad, cy + pad);
            ctx.lineTo(cx - pad + bracketSize, cy + pad);
            ctx.stroke();

            // Bottom-Right Bracket
            ctx.beginPath();
            ctx.moveTo(cx + pad - bracketSize, cy + pad);
            ctx.lineTo(cx + pad, cy + pad);
            ctx.lineTo(cx + pad, cy + pad - bracketSize);
            ctx.stroke();

            // Fine Central Coordinate Focus Ring
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(T * 0.4);
            ctx.strokeStyle = 'rgba(0, 220, 255, 0.28)';
            ctx.lineWidth = 1;
            ctx.setLineDash([6, 12]);
            ctx.beginPath();
            ctx.arc(0, 0, medallionRadius * 1.08, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // Precision HUD Status Readout at Screen Bottom
            ctx.font = `600 ${isMobile ? '8.5px' : '10.5px'} 'Orbitron', monospace`;
            ctx.letterSpacing = isMobile ? '2px' : '3px';
            ctx.fillStyle = C_CYAN;
            ctx.textAlign = 'center';
            if (T < 1.30) {
                const dots = '.'.repeat(1 + Math.floor((T * 4) % 4));
                ctx.fillText('INITIALIZING SYSTEM // CALIBRATING OPTICAL APERTURE ' + dots, cx, height - 28);
            } else {
                ctx.fillText('ENGAGING QUANTUM CORE // INFOMEISTER CSE ARCHITECTURE', cx, height - 28);
            }

            ctx.restore();
        }

        // ------------------------------------------------------------------
        // LAYER 3: ANAMORPHIC HORIZON BEAM & OPTICAL FLARE (0.60s -> 2.60s)
        // ------------------------------------------------------------------
        if (T >= 0.60 && T < 2.60) {
            const flareProg = Math.min(1, (T - 0.60) / 0.85);
            const easeFlare = easeOutQuart(flareProg);
            const flareFade = T > 2.0 ? Math.max(0, (2.60 - T) / 0.60) : 1;

            const flareW = (width * 1.25) * easeFlare;

            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = flareFade;

            // 1. Wide Anamorphic Horizontal Streak
            const flareGrad = ctx.createLinearGradient(cx - flareW / 2, 0, cx + flareW / 2, 0);
            flareGrad.addColorStop(0, 'rgba(0, 110, 255, 0)');
            flareGrad.addColorStop(0.35, 'rgba(0, 220, 255, 0.45)');
            flareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
            flareGrad.addColorStop(0.65, 'rgba(0, 220, 255, 0.45)');
            flareGrad.addColorStop(1, 'rgba(0, 110, 255, 0)');

            ctx.strokeStyle = flareGrad;
            ctx.lineWidth = Math.max(2, 3.5 * easeFlare);
            ctx.shadowColor = C_CYAN;
            ctx.shadowBlur = 24;
            ctx.beginPath();
            ctx.moveTo(cx - flareW / 2, cy);
            ctx.lineTo(cx + flareW / 2, cy);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // 2. Central Lens Core Glint Orb
            const coreR = Math.max(6, 28 * (1 - Math.abs(flareProg - 0.6) * 1.6));
            if (coreR > 0) {
                const orbGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreR);
                orbGrad.addColorStop(0, '#ffffff');
                orbGrad.addColorStop(0.4, 'rgba(0, 240, 255, 0.7)');
                orbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = orbGrad;
                ctx.beginPath();
                ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }

        // ------------------------------------------------------------------
        // LAYER 4: PRISMATIC ECLIPSE CORONA & SOFT SHOCKWAVE (1.20s -> 2.80s)
        // ------------------------------------------------------------------
        if (T >= 1.20 && T < 2.80) {
            const coronaProg = Math.min(1, (T - 1.20) / 0.65);
            const coronaFade = T > 2.2 ? Math.max(0, (2.80 - T) / 0.60) : 1;

            ctx.save();
            ctx.globalAlpha = coronaProg * coronaFade;

            // Backlight Eclipse Radial Corona
            const glowR = medallionRadius * 1.45;
            const glowGrad = ctx.createRadialGradient(cx, cy, medallionRadius * 0.4, cx, cy, glowR);
            glowGrad.addColorStop(0, 'rgba(0, 220, 255, 0.45)');
            glowGrad.addColorStop(0.5, 'rgba(0, 100, 240, 0.18)');
            glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
            ctx.fill();

            // Soft Atmospheric Horizon Pulse (at T = 1.80s)
            if (T >= 1.80) {
                const waveProg = (T - 1.80) / 0.95;
                const waveR = medallionRadius + waveProg * (minDim * 0.55);
                const waveAlpha = (1 - waveProg) * 0.45;

                ctx.strokeStyle = `rgba(0, 220, 255, ${waveAlpha})`;
                ctx.lineWidth = 2.0 * (1 - waveProg);
                ctx.shadowColor = C_CYAN;
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.restore();
        }

        // ------------------------------------------------------------------
        // LAYER 5: THE ROYAL INFOMEISTER MEDALLION MATERIALIZATION
        // ------------------------------------------------------------------
        if (T >= 1.70) {
            let mScale = 1.0;
            let mCenterY = cy;
            let mAlpha = 1.0;
            let rotAngle = 0;

            if (T < 4.20) {
                // Smooth Cinematic Depth Zoom & Settling (0.72 -> 1.03 -> 1.00)
                const enterProg = Math.min(1, (T - 1.70) / 0.85);
                const easeEnter = easeOutQuart(enterProg);
                mScale = 0.72 + 0.31 * easeEnter - (enterProg > 0.7 ? 0.03 * ((enterProg - 0.7) / 0.3) : 0);
                mAlpha = Math.min(1, (T - 1.70) / 0.40);
                rotAngle = (1 - easeEnter) * -0.04; // Gentle 2.3° micro-tilt easing into dead-center alignment
                mCenterY = cy;
            } else {
                // Ascending gracefully to header position
                const ascendProg = Math.min(1, (T - 4.20) / 0.92);
                const easeAscend = easeInOutCubic(ascendProg);
                const targetScale = isMobile ? 0.40 : 0.46;
                mScale = 1.0 - (1.0 - targetScale) * easeAscend;
                const targetHeaderY = isMobile
                    ? Math.max(72, cy - titleH * 0.88 - 78)
                    : Math.max(90, cy - titleH * 0.85 - 88);
                mCenterY = cy + (targetHeaderY - cy) * easeAscend;
                mAlpha = 1.0;
                rotAngle = 0;
            }

            const currentSize = medallionFullSize * mScale;
            const currentRadius = currentSize * 0.495;

            ctx.save();
            ctx.globalAlpha = mAlpha;
            ctx.translate(cx, mCenterY);
            if (rotAngle !== 0) ctx.rotate(rotAngle);

            // 1. Deep Cybernetic Ambient Backlight Glow
            const glowR = currentRadius * 1.55;
            const glowGrad = ctx.createRadialGradient(0, 0, currentRadius * 0.35, 0, 0, glowR);
            glowGrad.addColorStop(0, 'rgba(0, 210, 255, 0.55)');
            glowGrad.addColorStop(0.45, 'rgba(0, 100, 230, 0.20)');
            glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(0, 0, glowR, 0, Math.PI * 2);
            ctx.fill();

            // 2. Exact High-Res Infomeister Medallion (100% Round Shape via Anti-Aliased Circular Mask)
            if (isLogoLoaded) {
                ctx.save();
                // Outer Deep Titanium & Neon Drop Shadow
                ctx.shadowColor = 'rgba(0, 220, 255, 0.40)';
                ctx.shadowBlur = 24 * mScale;
                ctx.shadowOffsetY = 6 * mScale;

                // STRICT CIRCULAR CLIPPING - GUARANTEES ABSOLUTELY PERFECT ROUND SHAPE
                ctx.beginPath();
                ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
                ctx.clip();

                // Draw exact official Infomeister logo artwork centered
                ctx.drawImage(logoImg, -currentSize / 2, -currentSize / 2, currentSize, currentSize);
                ctx.restore();

                // 3. Multi-Stop 3D Beveled Chrome / Titanium Outer Bezel Rim
                ctx.save();
                ctx.beginPath();
                ctx.arc(0, 0, currentRadius - 0.5, 0, Math.PI * 2);
                const rimGrad = ctx.createLinearGradient(
                    -currentRadius,
                    -currentRadius,
                    currentRadius,
                    currentRadius
                );
                rimGrad.addColorStop(0, '#ffffff');             // 12 o'clock blinding glint
                rimGrad.addColorStop(0.20, '#dbe9f7');          // Polished platinum
                rimGrad.addColorStop(0.48, '#0b1624');          // Deep shadow bevel groove
                rimGrad.addColorStop(0.74, '#55bbff');          // Neon cyan reflected light
                rimGrad.addColorStop(1, '#1b324d');             // Titanium alloy
                ctx.strokeStyle = rimGrad;
                ctx.lineWidth = Math.max(2.2, 4.0 * mScale);
                ctx.stroke();
                ctx.restore();

                // 4. Subtle Energy Pulse Wave (T = 2.0s -> 3.20s)
                if (T >= 2.0 && T < 3.20) {
                    const surgePhase = Math.sin((T - 2.0) * Math.PI * 3.0);
                    if (surgePhase > 0) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(0, 0, currentRadius * 0.96, 0, Math.PI * 2);
                        ctx.clip();
                        ctx.globalCompositeOperation = 'screen';
                        ctx.fillStyle = `rgba(0, 240, 255, ${surgePhase * 0.16})`;
                        ctx.fill();
                        ctx.restore();
                    }
                }

                // 5. Diagonal Liquid Specular Glint Sweep (2.30s -> 3.90s)
                if (T >= 2.30 && T < 3.90) {
                    const glintProg = (T - 2.30) / 1.55;
                    const glintOffset = -currentRadius * 2.2 + glintProg * (currentRadius * 4.4);

                    ctx.save();
                    // Circular clip to match medallion boundary
                    ctx.beginPath();
                    ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
                    ctx.clip();

                    ctx.globalCompositeOperation = 'screen';
                    ctx.rotate(Math.PI / 4); // 45-degree angle sweep

                    const glintGrad = ctx.createLinearGradient(glintOffset - 50, 0, glintOffset + 50, 0);
                    glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
                    glintGrad.addColorStop(0.45, 'rgba(255, 255, 255, 0.85)');
                    glintGrad.addColorStop(0.55, 'rgba(0, 240, 255, 0.70)');
                    glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    ctx.fillStyle = glintGrad;
                    ctx.fillRect(glintOffset - 50, -currentRadius * 1.5, 100, currentRadius * 3.0);
                    ctx.restore();
                }

                // 6. Breathing Ambient Neon Halo Ring
                if (T >= 2.10) {
                    const haloPulse = 0.5 + 0.5 * Math.sin(T * 3.5);
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(0, 0, currentRadius + 3, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.22 + 0.22 * haloPulse})`;
                    ctx.lineWidth = 1.4;
                    ctx.shadowColor = C_CYAN;
                    ctx.shadowBlur = 10 * haloPulse;
                    ctx.stroke();
                    ctx.restore();
                }
            } else {
                ctx.strokeStyle = C_CYAN;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.restore();
        }

        // ------------------------------------------------------------------
        // LAYER 6: THE FLAGSHIP REVEAL — "INFOMEISTER PRESENTS" -> TRISQUADATHON 2.0
        // ------------------------------------------------------------------
        if (T >= 4.10) {
            const revealT = T - 4.10;
            const revealProg = Math.min(1, revealT / 0.95);
            const easeReveal = easeOutQuart(revealProg);
            const titleScale = 0.92 + 0.08 * easeReveal;

            // Group Width Calculation
            const badgeW = Math.max(56, titleFontSize * 1.15);
            const badgeH = Math.max(30, titleFontSize * 0.58);
            const gap = Math.max(18, titleFontSize * 0.28);
            const totalGroupW = titleW + gap + badgeW;

            const groupLeftX = cx - totalGroupW / 2;
            const titlePosX = groupLeftX;
            const titlePosY = cy - titleH / 2 + 35;
            const badgeX = groupLeftX + titleW + gap;
            const badgeY = cy - badgeH / 2 + 35;

            ctx.save();
            ctx.globalAlpha = Math.min(1, revealT / 0.45);

            // Anamorphic Horizontal Laser Flare behind Title
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            const flareW = width * 1.15;
            const flareGrad = ctx.createLinearGradient(cx - flareW / 2, 0, cx + flareW / 2, 0);
            flareGrad.addColorStop(0, 'rgba(0, 119, 255, 0)');
            flareGrad.addColorStop(0.3, 'rgba(0, 240, 255, 0.45)');
            flareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
            flareGrad.addColorStop(0.7, 'rgba(0, 240, 255, 0.45)');
            flareGrad.addColorStop(1, 'rgba(0, 119, 255, 0)');

            ctx.strokeStyle = flareGrad;
            ctx.lineWidth = 3;
            ctx.shadowColor = C_CYAN;
            ctx.shadowBlur = 24;
            ctx.beginPath();
            ctx.moveTo(cx - flareW / 2, titlePosY + titleH * 0.5);
            ctx.lineTo(cx + flareW / 2, titlePosY + titleH * 0.5);
            ctx.stroke();
            ctx.restore();

            // Authoritative Brand Header: "INFOMEISTER PRESENTS"
            ctx.save();
            ctx.font = `800 ${Math.max(12, Math.min(width * 0.016, 16))}px 'Orbitron', 'Exo 2', sans-serif`;
            ctx.letterSpacing = isMobile ? '4px' : '8px';
            ctx.textAlign = 'center';
            ctx.fillStyle = C_CYAN;
            ctx.shadowColor = C_CYAN;
            ctx.shadowBlur = 12;
            ctx.fillText('INFOMEISTER PRESENTS', cx, titlePosY - 36);
            ctx.restore();

            // Scale & Render Main Title: TRISQUADATHON
            ctx.save();
            ctx.translate(cx, titlePosY + titleH / 2);
            ctx.scale(titleScale, titleScale);
            ctx.translate(-cx, -(titlePosY + titleH / 2));

            // Liquid Platinum TRISQUADATHON
            ctx.drawImage(offTitle, 0, 0, titleW * dpr, titleH * dpr, titlePosX, titlePosY, titleW, titleH);

            // Sculpted 2.0 Emblem in Sapphire & Platinum
            ctx.save();
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 8);
            else ctx.rect(badgeX, badgeY, badgeW, badgeH);

            const bFill = ctx.createLinearGradient(badgeX, badgeY, badgeX, badgeY + badgeH);
            bFill.addColorStop(0, '#102238');
            bFill.addColorStop(1, '#050c16');
            ctx.fillStyle = bFill;
            ctx.fill();

            // Electric Cyan Glowing Rim
            ctx.shadowColor = C_CYAN;
            ctx.shadowBlur = 14;
            ctx.strokeStyle = C_CYAN;
            ctx.lineWidth = 2.0;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // "2.0" Typography in Pure Laser White
            ctx.font = `900 ${Math.max(16, badgeH * 0.56)}px 'Orbitron', 'Exo 2', sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('2.0', badgeX + badgeW / 2, badgeY + badgeH / 2 + 1);
            ctx.restore();

            // Specular Light Glint Sweep across Title (4.6s -> 7.0s)
            if (T >= 4.60 && T <= 7.0) {
                const glintProg = (T - 4.60) / 2.3;
                const glintX = groupLeftX - 60 + glintProg * (totalGroupW + 120);

                ctx.save();
                ctx.beginPath();
                ctx.rect(titlePosX, titlePosY - 10, totalGroupW + 20, titleH + 20);
                ctx.clip();

                const glintGrad = ctx.createLinearGradient(glintX - 50, 0, glintX + 50, 0);
                glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
                glintGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
                glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = glintGrad;
                ctx.fillRect(glintX - 50, titlePosY - 10, 100, titleH + 20);
                ctx.restore();
            }

            ctx.restore();

            // Bottom Subtitle and Department Honorifics
            ctx.save();
            ctx.textAlign = 'center';
            if (isMobile) {
                // 2 Stacked Lines for Clean Mobile Fit
                ctx.font = `600 ${Math.max(8.5, Math.min(width * 0.026, 11))}px 'Orbitron', 'Exo 2', sans-serif`;
                ctx.letterSpacing = '1.8px';
                ctx.fillStyle = 'rgba(220, 240, 255, 0.95)';
                ctx.fillText('DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING', cx, titlePosY + titleH + 24);
                ctx.fillText('INFO INSTITUTE OF ENGINEERING', cx, titlePosY + titleH + 39);

                // Divider Ray
                ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(cx - 100, titlePosY + titleH + 48);
                ctx.lineTo(cx + 100, titlePosY + titleH + 48);
                ctx.stroke();

                // Hackathon Challenge Descriptor
                ctx.font = `700 ${Math.max(8.5, Math.min(width * 0.024, 10.5))}px 'Orbitron', sans-serif`;
                ctx.letterSpacing = '2px';
                ctx.fillStyle = C_GOLD;
                ctx.shadowColor = C_GOLD;
                ctx.shadowBlur = 8;
                ctx.fillText('8 HOURS NATIONAL LEVEL HACKATHON', cx, titlePosY + titleH + 62);
            } else {
                // Desktop Widescreen Layout
                ctx.font = `600 ${Math.max(10, Math.min(width * 0.013, 12.5))}px 'Orbitron', 'Exo 2', sans-serif`;
                ctx.letterSpacing = '3.5px';
                ctx.fillStyle = 'rgba(220, 240, 255, 0.95)';
                ctx.fillText('DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING • INFO INSTITUTE OF ENGINEERING', cx, titlePosY + titleH + 26);

                // Divider Ray
                ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(cx - 180, titlePosY + titleH + 34);
                ctx.lineTo(cx + 180, titlePosY + titleH + 34);
                ctx.stroke();

                // Hackathon Challenge Descriptor
                ctx.font = `700 ${Math.max(9.5, Math.min(width * 0.0125, 12))}px 'Orbitron', sans-serif`;
                ctx.letterSpacing = '3.5px';
                ctx.fillStyle = C_GOLD;
                ctx.shadowColor = C_GOLD;
                ctx.shadowBlur = 8;
                ctx.fillText('8 HOURS NATIONAL LEVEL HACKATHON', cx, titlePosY + titleH + 48);
            }
            ctx.restore();

            ctx.restore();
        }

        ctx.restore();

        // ------------------------------------------------------------------
        // TERMINATION & SEAMLESS DISSOLVE (7.35s -> 8.0s)
        // ------------------------------------------------------------------
        if (elapsed >= FADE_START_TIME && !overlay.classList.contains('intro-fade-out')) {
            overlay.classList.add('intro-fade-out');
        }

        if (elapsed >= INTRO_DURATION) {
            terminateIntro();
            return;
        }

        animId = requestAnimationFrame(render);
    }

    function terminateIntro() {
        if (isTerminated) return;
        isTerminated = true;

        if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
        }

        window.removeEventListener('resize', resize);

        // Remove overlay cleanly from DOM
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }

        // Unlock page scrolling
        document.documentElement.classList.remove('intro-locked');
        document.body.classList.remove('intro-locked');

        // Trigger hero typing effect
        initializeTypingEffect();
    }

    // Safety fallback timer at 8.1s
    setTimeout(() => {
        if (!isTerminated) {
            terminateIntro();
        }
    }, INTRO_DURATION + 100);

    window.addEventListener('resize', resize);
    resize();
    animId = requestAnimationFrame(render);
}
