// Calculator Class
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetDisplay = false;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentOperand = '';
            this.shouldResetDisplay = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetDisplay = true;
    }

    // Additional mathematical functions
    square() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = current * current;
        this.shouldResetDisplay = true;
    }

    squareRoot() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current) || current < 0) {
            this.showError('Invalid input for square root');
            return;
        }
        this.currentOperand = Math.sqrt(current);
        this.shouldResetDisplay = true;
    }

    inverse() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current) || current === 0) {
            this.showError('Cannot divide by zero');
            return;
        }
        this.currentOperand = 1 / current;
        this.shouldResetDisplay = true;
    }

    negate() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = -current;
    }

    percentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = current / 100;
        this.shouldResetDisplay = true;
    }

    showError(message) {
        this.currentOperand = 'Error';
        this.previousOperand = message;
        this.shouldResetDisplay = true;
        
        // Clear error after 2 seconds
        setTimeout(() => {
            this.clear();
            this.updateDisplay();
        }, 2000);
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand) || '0';
        
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// DOM Elements
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-action]');
const equalsButton = document.querySelector('[data-action="equals"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const previousOperandElement = document.querySelector('#previousOperand');
const currentOperandElement = document.querySelector('#currentOperand');
const themeToggle = document.querySelector('#themeToggle');

// Initialize Calculator
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Event Listeners for Numbers
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        addButtonAnimation(button);
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

// Event Listeners for Operations
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        addButtonAnimation(button);
        const action = button.dataset.action;
        
        switch (action) {
            case 'clear':
                calculator.clear();
                calculator.updateDisplay();
                break;
            case 'delete':
                calculator.delete();
                calculator.updateDisplay();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
            case 'percentage':
                calculator.chooseOperation(getOperationSymbol(action));
                calculator.updateDisplay();
                break;
            case 'equals':
                calculator.compute();
                calculator.updateDisplay();
                break;
            case 'square':
                calculator.square();
                calculator.updateDisplay();
                break;
            case 'square-root':
                calculator.squareRoot();
                calculator.updateDisplay();
                break;
            case 'inverse':
                calculator.inverse();
                calculator.updateDisplay();
                break;
            case 'negate':
                calculator.negate();
                calculator.updateDisplay();
                break;
        }
    });
});

// Helper function to get operation symbols
function getOperationSymbol(action) {
    const symbols = {
        'add': '+',
        'subtract': '−',
        'multiply': '×',
        'divide': '÷',
        'percentage': '%'
    };
    return symbols[action];
}

// Button Animation
function addButtonAnimation(button) {
    button.classList.add('pressed');
    setTimeout(() => {
        button.classList.remove('pressed');
    }, 200);
}

// Theme Toggle Functionality
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update theme toggle icon
    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Save theme preference
    localStorage.setItem('calculator-theme', newTheme);
    
    // Add animation to theme toggle
    addButtonAnimation(themeToggle);
});

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('calculator-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const icon = themeToggle.querySelector('i');
    icon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}

// Keyboard Support
document.addEventListener('keydown', (e) => {
    // Prevent default behavior for calculator keys
    if ('0123456789+-*/.=%'.includes(e.key) || 
        ['Enter', 'Escape', 'Backspace', 'Delete'].includes(e.key)) {
        e.preventDefault();
    }
    
    // Number keys
    if ('0123456789'.includes(e.key)) {
        const button = document.querySelector(`[data-number="${e.key}"]`);
        if (button) {
            addButtonAnimation(button);
            calculator.appendNumber(e.key);
            calculator.updateDisplay();
        }
    }
    
    // Operation keys
    switch (e.key) {
        case '+':
            const addButton = document.querySelector('[data-action="add"]');
            if (addButton) {
                addButtonAnimation(addButton);
                calculator.chooseOperation('+');
                calculator.updateDisplay();
            }
            break;
        case '-':
            const subtractButton = document.querySelector('[data-action="subtract"]');
            if (subtractButton) {
                addButtonAnimation(subtractButton);
                calculator.chooseOperation('−');
                calculator.updateDisplay();
            }
            break;
        case '*':
            const multiplyButton = document.querySelector('[data-action="multiply"]');
            if (multiplyButton) {
                addButtonAnimation(multiplyButton);
                calculator.chooseOperation('×');
                calculator.updateDisplay();
            }
            break;
        case '/':
            const divideButton = document.querySelector('[data-action="divide"]');
            if (divideButton) {
                addButtonAnimation(divideButton);
                calculator.chooseOperation('÷');
                calculator.updateDisplay();
            }
            break;
        case '.':
            const decimalButton = document.querySelector('[data-number="."]');
            if (decimalButton) {
                addButtonAnimation(decimalButton);
                calculator.appendNumber('.');
                calculator.updateDisplay();
            }
            break;
        case 'Enter':
        case '=':
            const equalsBtn = document.querySelector('[data-action="equals"]');
            if (equalsBtn) {
                addButtonAnimation(equalsBtn);
                calculator.compute();
                calculator.updateDisplay();
            }
            break;
        case 'Escape':
            const clearBtn = document.querySelector('[data-action="clear"]');
            if (clearBtn) {
                addButtonAnimation(clearBtn);
                calculator.clear();
                calculator.updateDisplay();
            }
            break;
        case 'Backspace':
        case 'Delete':
            const deleteBtn = document.querySelector('[data-action="delete"]');
            if (deleteBtn) {
                addButtonAnimation(deleteBtn);
                calculator.delete();
                calculator.updateDisplay();
            }
            break;
        case '%':
            const percentageBtn = document.querySelector('[data-action="percentage"]');
            if (percentageBtn) {
                addButtonAnimation(percentageBtn);
                calculator.percentage();
                calculator.updateDisplay();
            }
            break;
    }
});

// Touch and Haptic Feedback (for mobile devices)
function addHapticFeedback() {
    if ('vibrate' in navigator) {
        navigator.vibrate(50); // 50ms vibration
    }
}

// Add haptic feedback to all buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', addHapticFeedback);
});

// Initialize the calculator
loadTheme();
calculator.updateDisplay();

// Dynamic bubble generation for more variety
function createDynamicBubbles() {
    const bubblesContainer = document.querySelector('.bubbles-container');
    const colorGradients = [
        'radial-gradient(circle at 30% 30%, #ff6b6b, #ff4757, #ff3742)',
        'radial-gradient(circle at 30% 30%, #4ecdc4, #00d2d3, #01a3a4)',
        'radial-gradient(circle at 30% 30%, #45b7d1, #3742fa, #2f3542)',
        'radial-gradient(circle at 30% 30%, #f9ca24, #f0932b, #eb4d4b)',
        'radial-gradient(circle at 30% 30%, #6c5ce7, #a29bfe, #74b9ff)',
        'radial-gradient(circle at 30% 30%, #fd79a8, #e84393, #d63031)',
        'radial-gradient(circle at 30% 30%, #00b894, #00cec9, #55a3ff)',
        'radial-gradient(circle at 30% 30%, #e17055, #fd79a8, #fdcb6e)',
        'radial-gradient(circle at 30% 30%, #a29bfe, #6c5ce7, #fd79a8)',
        'radial-gradient(circle at 30% 30%, #00cec9, #00b894, #55a3ff)',
        'radial-gradient(circle at 30% 30%, #fdcb6e, #f9ca24, #f0932b)',
        'radial-gradient(circle at 30% 30%, #74b9ff, #0984e3, #6c5ce7)',
        'radial-gradient(circle at 30% 30%, #e84393, #fd79a8, #fdcb6e)'
    ];
    
    // Create additional bubbles dynamically
    for (let i = 0; i < 8; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble dynamic-bubble';
        
        const size = Math.random() * 25 + 20; // 20-45px
        const gradient = colorGradients[Math.floor(Math.random() * colorGradients.length)];
        const top = Math.random() * 80 + 10; // 10-90% (avoid calculator area)
        const left = Math.random() * 80 + 10; // 10-90% (avoid calculator area)
        const delay = Math.random() * 15; // 0-15s delay
        const duration = Math.random() * 15 + 15; // 15-30s duration
        
        bubble.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${gradient};
            top: ${top}%;
            left: ${left}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;
        
        bubblesContainer.appendChild(bubble);
    }
}

// Create dynamic bubbles after a short delay
setTimeout(createDynamicBubbles, 2000);

// Add some visual flair on load
window.addEventListener('load', () => {
    // Animate particles
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        particle.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Add entrance animation to calculator
    const calculator = document.querySelector('.calculator');
    calculator.style.animation = 'slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
});

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Handle any resize-specific logic here if needed
    }, 250);
});

// Add smooth scrolling behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Console welcome message
console.log(`
🧮 Modern Calculator v1.0
✨ Features:
- Beautiful dark/light theme
- Smooth animations and transitions
- Keyboard support
- Advanced mathematical functions
- Mobile-friendly design
- Haptic feedback support

🎨 Created with HTML, CSS, and JavaScript
`);

// Error handling for edge cases
window.addEventListener('error', (e) => {
    console.error('Calculator Error:', e.error);
    // Gracefully handle any unexpected errors
    calculator.showError('Something went wrong');
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment the following lines if you want to add PWA capabilities
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}
