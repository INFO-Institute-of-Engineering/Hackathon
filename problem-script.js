// ===== PROBLEM STATEMENTS PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    initializeProblemFilters();
    initializeProblemSelection();
    initializeSearchFunctionality();
    initializeProblemAnimations();
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
    problemCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Add filtering class for animation
        card.classList.add('filtering');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
            // Show card
            setTimeout(() => {
                card.classList.remove('hidden', 'fade-out');
                card.classList.add('fade-in');
            }, 100);
        } else {
            // Hide card
            card.classList.add('fade-out');
            setTimeout(() => {
                card.classList.add('hidden');
                card.classList.remove('fade-in');
            }, 400);
        }
        
        // Remove filtering class after animation
        setTimeout(() => {
            card.classList.remove('filtering');
        }, 500);
    });
    
    // Update results count
    updateResultsCount(filterValue, problemCards);
}

function updateResultsCount(filterValue, problemCards) {
    const visibleCards = Array.from(problemCards).filter(card => {
        const cardCategory = card.getAttribute('data-category');
        return filterValue === 'all' || cardCategory === filterValue;
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
    const searchTerm = e.target.value.toLowerCase();
    const problemCards = document.querySelectorAll('.problem-card');
    
    problemCards.forEach(card => {
        const title = card.querySelector('.problem-title').textContent.toLowerCase();
        const description = card.querySelector('.problem-description').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const matchesSearch = title.includes(searchTerm) || 
                            description.includes(searchTerm) || 
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
                }, index * 100);
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
    
    problemCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add magnetic effect
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset transform
            card.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click ripple effect
        card.addEventListener('click', (e) => {
            if (e.target.closest('.select-btn')) return; // Don't add ripple if clicking select button
            
            const ripple = document.createElement('span');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
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