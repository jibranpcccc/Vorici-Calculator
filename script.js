// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (document.querySelector(targetId)) {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialize interactive SVG and calculator functionality
    initInteractiveSVG();
    initCalculator();
});

// Add active class to current navigation item
const currentLocation = location.href;
const menuItems = document.querySelectorAll('nav a');
const menuLength = menuItems.length;

for (let i = 0; i < menuLength; i++) {
    if (menuItems[i].href === currentLocation) {
        menuItems[i].classList.add('active');
    }
}

// Simple console log to verify script is loaded
console.log('Vorici Calculator - Script loaded successfully');

// Mobile menu toggle (will be enhanced in the next update)
function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('mobile-visible');
}

// Add event listener for mobile menu toggle
const mobileMenuButton = document.createElement('button');
mobileMenuButton.className = 'mobile-menu-button';
mobileMenuButton.innerHTML = '☰';
mobileMenuButton.onclick = toggleMobileMenu;

document.querySelector('header .container').prepend(mobileMenuButton);

// Add responsive styles for mobile menu
const style = document.createElement('style');
style.textContent = `
    .mobile-menu-button {
        display: none;
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    }
    
    @media (max-width: 768px) {
        .mobile-menu-button {
            display: block;
        }
        
        nav {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--secondary-color);
            padding: 1rem;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
            z-index: 1000;
        }
        
        nav.mobile-visible {
            display: flex;
        }
    }
`;

document.head.appendChild(style);

// Interactive SVG functionality
function initInteractiveSVG() {
    if (!document.getElementById('crafting-bench')) return;
    
    const sockets = document.querySelectorAll('.socket');
    const colorBtns = {
        red: document.getElementById('red-btn'),
        green: document.getElementById('green-btn'),
        blue: document.getElementById('blue-btn'),
        white: document.getElementById('white-btn')
    };
    
    let selectedColor = 'red';
    
    // Set up color button functionality
    if (colorBtns.red) {
        colorBtns.red.addEventListener('click', () => selectedColor = 'red');
    }
    if (colorBtns.green) {
        colorBtns.green.addEventListener('click', () => selectedColor = 'green');
    }
    if (colorBtns.blue) {
        colorBtns.blue.addEventListener('click', () => selectedColor = 'blue');
    }
    if (colorBtns.white) {
        colorBtns.white.addEventListener('click', () => selectedColor = 'white');
    }
    
    // Make sockets interactive
    sockets.forEach(socket => {
        socket.addEventListener('click', function() {
            const colors = {
                red: '#ff5a5a',
                green: '#5aff5a',
                blue: '#5a5aff',
                white: '#ffffff'
            };
            
            this.setAttribute('fill', colors[selectedColor]);
            this.setAttribute('data-color', selectedColor);
            
            // Simple animation on click
            this.setAttribute('r', '18');
            setTimeout(() => {
                this.setAttribute('r', '15');
            }, 150);
        });
    });
}

// Advanced calculator functionality
function initCalculator() {
    if (!document.getElementById('calculator-section')) return;
    
    const totalSocketsSelect = document.getElementById('total-sockets');
    const desiredRedInput = document.getElementById('desired-red');
    const desiredGreenInput = document.getElementById('desired-green');
    const desiredBlueInput = document.getElementById('desired-blue');
    const desiredWhiteInput = document.getElementById('desired-white');
    const strengthInput = document.getElementById('strength');
    const dexterityInput = document.getElementById('dexterity');
    const intelligenceInput = document.getElementById('intelligence');
    const calculateBtn = document.getElementById('calculate-btn');
    const previewSockets = document.getElementById('preview-sockets');
    const results = document.getElementById('results');
    
    // Update socket preview whenever inputs change
    [desiredRedInput, desiredGreenInput, desiredBlueInput, desiredWhiteInput].forEach(input => {
        if (input) {
            input.addEventListener('input', updateSocketPreview);
        }
    });
    
    if (totalSocketsSelect) {
        totalSocketsSelect.addEventListener('change', function() {
            updateSocketMaxValues();
            updateSocketPreview();
        });
    }
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateResults);
    }
    
    // Initialize
    updateSocketMaxValues();
    updateSocketPreview();
    
    // Update socket preview function
    function updateSocketPreview() {
        if (!previewSockets) return;
        
        previewSockets.innerHTML = '';
        
        const totalSockets = parseInt(totalSocketsSelect.value, 10) || 6;
        const redSockets = parseInt(desiredRedInput.value, 10) || 0;
        const greenSockets = parseInt(desiredGreenInput.value, 10) || 0;
        const blueSockets = parseInt(desiredBlueInput.value, 10) || 0;
        const whiteSockets = parseInt(desiredWhiteInput.value, 10) || 0;
        
        const colors = [];
        
        // Add sockets in order
        for (let i = 0; i < redSockets; i++) colors.push('red');
        for (let i = 0; i < greenSockets; i++) colors.push('green');
        for (let i = 0; i < blueSockets; i++) colors.push('blue');
        for (let i = 0; i < whiteSockets; i++) colors.push('white');
        
        // Add empty sockets if needed
        const remaining = totalSockets - colors.length;
        for (let i = 0; i < remaining; i++) colors.push('empty');
        
        // Render sockets
        const socketColors = {
            red: '#ff5a5a',
            green: '#5aff5a',
            blue: '#5a5aff',
            white: '#ffffff',
            empty: '#333'
        };
        
        colors.slice(0, totalSockets).forEach(color => {
            const socket = document.createElement('div');
            socket.className = 'preview-socket';
            socket.style.backgroundColor = socketColors[color];
            previewSockets.appendChild(socket);
        });
    }
    
    function updateSocketMaxValues() {
        if (!totalSocketsSelect || !desiredRedInput || !desiredGreenInput || !desiredBlueInput || !desiredWhiteInput) return;
        
        const totalSockets = parseInt(totalSocketsSelect.value, 10) || 6;
        
        desiredRedInput.setAttribute('max', totalSockets);
        desiredGreenInput.setAttribute('max', totalSockets);
        desiredBlueInput.setAttribute('max', totalSockets);
        desiredWhiteInput.setAttribute('max', totalSockets);
        
        // Adjust values if they exceed the new total
        if (parseInt(desiredRedInput.value, 10) > totalSockets) desiredRedInput.value = totalSockets;
        if (parseInt(desiredGreenInput.value, 10) > totalSockets) desiredGreenInput.value = totalSockets;
        if (parseInt(desiredBlueInput.value, 10) > totalSockets) desiredBlueInput.value = totalSockets;
        if (parseInt(desiredWhiteInput.value, 10) > totalSockets) desiredWhiteInput.value = totalSockets;
    }
    
    function calculateResults() {
        if (!results || !strengthInput || !dexterityInput || !intelligenceInput) return;
        
        // Get all input values
        const totalSockets = parseInt(totalSocketsSelect.value, 10) || 6;
        const redSockets = parseInt(desiredRedInput.value, 10) || 0;
        const greenSockets = parseInt(desiredGreenInput.value, 10) || 0;
        const blueSockets = parseInt(desiredBlueInput.value, 10) || 0;
        const whiteSockets = parseInt(desiredWhiteInput.value, 10) || 0;
        
        const str = parseInt(strengthInput.value, 10) || 0;
        const dex = parseInt(dexterityInput.value, 10) || 0;
        const int = parseInt(intelligenceInput.value, 10) || 0;
        
        // Validate socket count
        const totalDesiredSockets = redSockets + greenSockets + blueSockets + whiteSockets;
        if (totalDesiredSockets > totalSockets) {
            alert(`Total colored sockets (${totalDesiredSockets}) cannot exceed total sockets (${totalSockets}).`);
            return;
        }
        if (totalDesiredSockets === 0) {
            alert('Please select at least one colored socket.');
            return;
        }
        
        // Calculate socket probabilities based on attributes
        const totalAttr = str + dex + int + 60; // 20 base per attribute
        const redProb = (str + 20) / totalAttr;
        const greenProb = (dex + 20) / totalAttr;
        const blueProb = (int + 20) / totalAttr;
        
        // Determine if sockets are off-color
        let primaryAttr = 'balanced';
        if (str > dex && str > int) primaryAttr = 'str';
        if (dex > str && dex > int) primaryAttr = 'dex';
        if (int > str && int > dex) primaryAttr = 'int';
        
        let offColorCount = 0;
        if (primaryAttr === 'str') offColorCount = greenSockets + blueSockets;
        if (primaryAttr === 'dex') offColorCount = redSockets + blueSockets;
        if (primaryAttr === 'int') offColorCount = redSockets + greenSockets;
        
        // Calculate crafting difficulty
        let difficulty = 1;
        if (offColorCount >= 4) difficulty = 5;
        else if (offColorCount >= 3) difficulty = 3;
        else if (offColorCount >= 2) difficulty = 2;
        
        // Calculate average chromatic orbs needed
        let chromatics = 0;
        if (primaryAttr === 'balanced') {
            chromatics = totalSockets * 4;
        } else {
            // More complex calculation for weighted attributes
            const offColorProb = offColorCount / totalSockets;
            chromatics = Math.ceil(25 * Math.pow(offColorProb * difficulty, 2) * totalSockets);
        }
        
        // Determine best method
        let method = 'Chromatic Orbs';
        let successRate = 'Variable';
        let resultDetails = '';
        
        if (offColorCount >= 4 && totalSockets === 6) {
            method = 'Vorici Crafting Bench';
            successRate = 'Guaranteed';
            chromatics = chromatics * 1.5; // Convert to equivalent bench cost
            resultDetails += '<p><strong>Recommended Approach:</strong> Use the crafting bench to force specific socket colors. This is expensive but guaranteed.</p>';
        } else if (offColorCount >= 1 && totalDesiredSockets <= 3 && totalSockets > 3) {
            method = 'Socket & Crafting Bench Hybrid';
            successRate = 'High';
            resultDetails += '<p><strong>Recommended Approach:</strong> Use jeweller orbs to get 1-3 sockets, use the crafting bench for colors, then use jeweller orbs again to increase sockets while maintaining colors.</p>';
        } else {
            resultDetails += '<p><strong>Recommended Approach:</strong> Direct use of chromatic orbs until you get desired colors.</p>';
        }
        
        resultDetails += `<p><strong>Socket Color Probabilities:</strong></p>
        <ul>
            <li>Red Socket: ${(redProb * 100).toFixed(1)}%</li>
            <li>Green Socket: ${(greenProb * 100).toFixed(1)}%</li>
            <li>Blue Socket: ${(blueProb * 100).toFixed(1)}%</li>
        </ul>`;
        
        // Display results
        document.getElementById('method').textContent = method;
        document.getElementById('cost').textContent = offColorCount >= 3 ? 'High' : (offColorCount >= 1 ? 'Medium' : 'Low');
        document.getElementById('success-rate').textContent = successRate;
        document.getElementById('chromatics').textContent = Math.ceil(chromatics).toString();
        document.getElementById('result-details').innerHTML = resultDetails;
        
        results.style.display = 'block';
        
        // Scroll to results
        results.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
