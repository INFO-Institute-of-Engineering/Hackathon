// ===== PROBLEM STATEMENTS PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    initializeProblemFilters();
    initializeProblemSelection();
    initializeSearchFunctionality();
    initializeProblemAnimations();
    if (typeof initializeTypingEffect === 'function') {
        initializeTypingEffect();
    }
});

// ===== FILTER FUNCTIONALITY =====
function initializeProblemFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const problemCards = document.querySelectorAll('.problem-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter problem cards
            filterProblems(filterValue, problemCards);
        });
    });
}

function filterProblems(filterValue, problemCards) {
    let matchIndex = 0;

    problemCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const badge = card.querySelector('.problem-category');
        const badgeText = badge ? badge.textContent.trim().toLowerCase() : '';
        
        const isMatch = (filterValue === 'all') ||
            (filterValue === 'web' && (cardCategory === 'web' || badgeText.includes('full stack') || badgeText.includes('web'))) ||
            (filterValue === 'iot' && (cardCategory === 'iot' || badgeText.includes('iot'))) ||
            (filterValue === 'ai' && (cardCategory === 'ai' || badgeText === 'ai')) ||
            (cardCategory === filterValue);
        
        if (isMatch) {
            const delay = Math.min(matchIndex * 25, 250);
            matchIndex++;
            card.classList.remove('hidden', 'fade-out');
            setTimeout(() => {
                card.classList.add('fade-in');
            }, delay);
        } else {
            card.classList.add('fade-out');
            card.classList.remove('fade-in');
            setTimeout(() => {
                card.classList.add('hidden');
            }, 280);
        }
    });
    
    // Update results count
    updateResultsCount(filterValue, problemCards);
}

function updateResultsCount(filterValue, problemCards) {
    const visibleCards = Array.from(problemCards).filter(card => {
        const cardCategory = card.getAttribute('data-category');
        const badge = card.querySelector('.problem-category');
        const badgeText = badge ? badge.textContent.trim().toLowerCase() : '';
        return (filterValue === 'all') ||
            (filterValue === 'web' && (cardCategory === 'web' || badgeText.includes('full stack') || badgeText.includes('web'))) ||
            (filterValue === 'iot' && (cardCategory === 'iot' || badgeText.includes('iot'))) ||
            (filterValue === 'ai' && (cardCategory === 'ai' || badgeText === 'ai')) ||
            (cardCategory === filterValue);
    });
    
    // You can add a results counter here if needed
    console.log(`Showing ${visibleCards.length} problems`);
}

// ===== PROBLEM SELECTION =====
function initializeProblemSelection() {
    const selectButtons = document.querySelectorAll('.select-btn');
    let selectedProblem = null;
    
    selectButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const problemCard = button.closest('.problem-card');
            const problemNumber = problemCard.querySelector('.problem-number').textContent;
            const problemTitle = problemCard.querySelector('.problem-title').textContent;
            
            // Remove selection from other problems
            selectButtons.forEach(btn => {
                btn.classList.remove('selected');
                btn.textContent = 'Select Problem';
            });
            
            // Mark this problem as selected
            button.classList.add('selected');
            button.innerHTML = '✓ Selected';
            selectedProblem = { number: problemNumber, title: problemTitle };
            
            // Add visual feedback
            addSelectionFeedback(problemCard);
            
            // Store selection in localStorage
            localStorage.setItem('selectedProblem', JSON.stringify(selectedProblem));
            
            // Show confirmation message
            showSelectionConfirmation(problemTitle);
        });
    });
    
    // Load previously selected problem
    loadSelectedProblem();
}

function addSelectionFeedback(problemCard) {
    // Remove previous selection highlights
    document.querySelectorAll('.problem-card').forEach(card => {
        card.classList.remove('selected-problem');
    });
    
    // Add highlight to selected problem
    problemCard.classList.add('selected-problem');
    
    // Add glow effect
    const glowEffect = document.createElement('div');
    glowEffect.className = 'selection-glow';
    problemCard.appendChild(glowEffect);
    
    // Remove glow effect after animation
    setTimeout(() => {
        if (glowEffect.parentNode) {
            glowEffect.parentNode.removeChild(glowEffect);
        }
    }, 2000);
}

function showSelectionConfirmation(problemTitle) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'selection-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✓</span>
            <span class="notification-text">Problem Selected: ${problemTitle}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function loadSelectedProblem() {
    const savedProblem = localStorage.getItem('selectedProblem');
    if (savedProblem) {
        const problem = JSON.parse(savedProblem);
        const problemCard = Array.from(document.querySelectorAll('.problem-card')).find(card => {
            const number = card.querySelector('.problem-number').textContent;
            return number === problem.number;
        });
        
        if (problemCard) {
            const selectButton = problemCard.querySelector('.select-btn');
            selectButton.classList.add('selected');
            selectButton.innerHTML = '✓ Selected';
            problemCard.classList.add('selected-problem');
        }
    }
}

// ===== SEARCH FUNCTIONALITY =====
function initializeSearchFunctionality() {
    // Add search box if needed
    const searchBox = createSearchBox();
    const filterSection = document.querySelector('.filter-section .container');
    
    if (filterSection) {
        filterSection.appendChild(searchBox);
    }
}

function createSearchBox() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-box">
            <input type="text" id="problemSearch" placeholder="Search problems..." class="search-input">
            <button class="search-btn">🔍</button>
        </div>
    `;
    
    const searchInput = searchContainer.querySelector('#problemSearch');
    searchInput.addEventListener('input', handleSearch);
    
    return searchContainer;
}

function handleSearch(e) {
    const rawSearch = e.target.value.toLowerCase().trim();
    const searchTerm = rawSearch.replace(/comming/g, 'coming');
    const problemCards = document.querySelectorAll('.problem-card');
    
    problemCards.forEach(card => {
        const titleEl = card.querySelector('.problem-title');
        const descEl = card.querySelector('.problem-description');
        const numEl = card.querySelector('.problem-number');
        const catEl = card.querySelector('.problem-category');
        
        const title = titleEl ? titleEl.textContent.toLowerCase() : '';
        const description = descEl ? descEl.textContent.toLowerCase() : '';
        const number = numEl ? numEl.textContent.toLowerCase() : '';
        const category = catEl ? catEl.textContent.toLowerCase() : '';
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const matchesSearch = title.includes(searchTerm) || 
                            title.includes(rawSearch) ||
                            description.includes(searchTerm) || 
                            description.includes(rawSearch) ||
                            number.includes(rawSearch) ||
                            category.includes(rawSearch) ||
                            tags.some(tag => tag.includes(searchTerm));
        
        if (matchesSearch) {
            card.classList.remove('hidden');
            card.style.display = 'block';
        } else {
            card.classList.add('hidden');
            card.style.display = 'none';
        }
    });
}


// ===== PROBLEM ANIMATIONS =====
function initializeProblemAnimations() {
    // Stagger animation for problem cards
    const problemCards = document.querySelectorAll('.problem-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, Math.min(index * 60, 400));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    problemCards.forEach(card => {
        observer.observe(card);
    });
    
    // Add hover sound effect (optional)
    addHoverEffects();
}

function addHoverEffects() {
    const problemCards = document.querySelectorAll('.problem-card');
    if (!problemCards.length) return;

    const isTouch = window.innerWidth < 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    problemCards.forEach(card => {
        // Tag category theme for styling
        const badge = card.querySelector('.problem-category');
        const text = badge ? badge.textContent.trim().toLowerCase() : '';
        if (text === 'ai' || card.getAttribute('data-category') === 'ai') {
            card.setAttribute('data-theme', 'ai');
        } else if (text.includes('iot') || card.getAttribute('data-category') === 'iot') {
            card.setAttribute('data-theme', 'iot');
        } else if (text.includes('stack') || text.includes('web') || card.getAttribute('data-category') === 'web') {
            card.setAttribute('data-theme', 'web');
        }

        // On touch screens, let CSS transitions handle hover/active smoothly without pointer tracking overhead
        if (!isTouch) {
            let isHovered = false;

            card.addEventListener('mouseenter', () => {
                isHovered = true;
                card.style.transition = 'transform 0.12s ease-out, box-shadow 0.3s ease, border-color 0.3s ease';
            });

            card.addEventListener('mousemove', (e) => {
                if (!isHovered) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const percentX = (x / rect.width) * 2 - 1;
                const percentY = (y / rect.height) * 2 - 1;

                // Comfortable 3D tilt max 8 degrees
                const maxTilt = 8;
                const tiltX = -percentY * maxTilt;
                const tiltY = percentX * maxTilt;

                card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`;
                card.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
                card.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);
            });

            card.addEventListener('mouseleave', () => {
                isHovered = false;
                card.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease';
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
            });
        }

        // Smooth click ripple effect
        card.addEventListener('click', (e) => {
            if (e.target.closest('.select-btn')) return;
            
            const ripple = document.createElement('span');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 1.5;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(var(--card-theme-rgb, 0, 240, 255), 0.25) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: cardRipple 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                pointer-events: none;
                z-index: 6;
            `;
            
            card.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function getSelectedProblem() {
    const savedProblem = localStorage.getItem('selectedProblem');
    return savedProblem ? JSON.parse(savedProblem) : null;
}

function clearSelection() {
    localStorage.removeItem('selectedProblem');
    document.querySelectorAll('.select-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.textContent = 'Select Problem';
    });
    document.querySelectorAll('.problem-card').forEach(card => {
        card.classList.remove('selected-problem');
    });
}

// ===== DYNAMIC STYLES =====
const problemStyles = document.createElement('style');
problemStyles.textContent = `
    .search-container {
        margin-top: 30px;
        display: flex;
        justify-content: center;
    }
    
    .search-box {
        position: relative;
        max-width: 400px;
        width: 100%;
    }
    
    .search-input {
        width: 100%;
        padding: 12px 50px 12px 20px;
        background: rgba(26, 26, 26, 0.9);
        border: 2px solid rgba(0, 255, 255, 0.3);
        border-radius: 25px;
        color: var(--text-primary);
        font-size: 1rem;
        outline: none;
        transition: all var(--transition-fast);
    }
    
    .search-input:focus {
        border-color: var(--primary-neon);
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    }
    
    .search-input::placeholder {
        color: var(--text-muted);
    }
    
    .search-btn {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
        background: var(--gradient-primary);
        border: none;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all var(--transition-fast);
    }
    
    .search-btn:hover {
        transform: translateY(-50%) scale(1.1);
        box-shadow: 0 0 15px var(--primary-neon);
    }
    
    .selected-problem {
        border-color: var(--tertiary-neon) !important;
        box-shadow: 0 0 30px rgba(255, 255, 0, 0.3) !important;
        background: rgba(255, 255, 0, 0.05) !important;
    }
    
    .selection-glow {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle, rgba(255, 255, 0, 0.2) 0%, transparent 70%);
        border-radius: var(--border-radius);
        animation: selection-pulse 2s ease-out;
        pointer-events: none;
        z-index: -1;
    }
    
    .selection-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0, 255, 0, 0.9);
        color: var(--primary-bg);
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: 600;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 255, 0, 0.3);
    }
    
    .selection-notification.show {
        transform: translateX(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out;
    }
    
    @keyframes selection-pulse {
        0% { 
            opacity: 0;
            transform: scale(0.8);
        }
        50% { 
            opacity: 1;
            transform: scale(1.05);
        }
        100% { 
            opacity: 0;
            transform: scale(1);
        }
    }
    
    @media (max-width: 768px) {
        .search-container {
            margin-top: 20px;
            padding: 0 20px;
        }
        
        .selection-notification {
            right: 10px;
            left: 10px;
            transform: translateY(-100px);
        }
        
        .selection-notification.show {
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(problemStyles);

// ===== EXPORT FOR POTENTIAL TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeProblemFilters,
        initializeProblemSelection,
        getSelectedProblem,
        clearSelection
    };
}
// Track navigation back to Home so clicking Home or logo skips intro
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
        const href = link.getAttribute('href') || '';
        if (href === 'index.html' || href.startsWith('index.html#')) {
            try {
                sessionStorage.setItem('trisquadathon_skip_intro_nav', 'true');
            } catch (err) {}
        }
    }
}, true);
