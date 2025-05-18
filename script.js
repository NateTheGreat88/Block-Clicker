// Mouse trail effect configuration
const mouseTrailConfig = {
    particleCount: 15,
    particleSize: 4,
    trailLength: 10,
    trailDelay: 10,
    colors: [
        '#4682ff',
        '#ff3e3e',
        '#32cd32',
        '#ffd700',
        '#8a2be2'
    ]
};

// Mouse position tracking
let mouseX = 0;
let mouseY = 0;
let lastX = 0;
let lastY = 0;
let trailSegments = [];
let lastTrailTime = 0;

// Mouse movement handler
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    createMouseParticles(e.clientX, e.clientY);
    
    const now = Date.now();
    if (now - lastTrailTime > mouseTrailConfig.trailDelay) {
        createTrailSegment(e.clientX, e.clientY);
        lastTrailTime = now;
    }
});

// Create particles following the mouse
function createMouseParticles(x, y) {
    const dx = x - lastX;
    const dy = y - lastY;
    const speed = Math.sqrt(dx * dx + dy * dy);
    
    if (speed > 5) {
        const count = Math.min(mouseTrailConfig.particleCount, Math.floor(speed / 2));
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'mouse-particle';
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 20;
            const particleX = x + Math.cos(angle) * distance;
            const particleY = y + Math.sin(angle) * distance;
            
            const size = mouseTrailConfig.particleSize * (0.5 + Math.random());
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            const color = mouseTrailConfig.colors[Math.floor(Math.random() * mouseTrailConfig.colors.length)];
            particle.style.background = `radial-gradient(circle, ${color} 0%, ${color}00 70%)`;
            
            particle.style.left = particleX + 'px';
            particle.style.top = particleY + 'px';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
    
    lastX = x;
    lastY = y;
}

// Create trail segments
function createTrailSegment(x, y) {
    const segment = document.createElement('div');
    segment.className = 'trail-segment';
    
    segment.style.left = x + 'px';
    segment.style.top = y + 'px';
    
    trailSegments.push({
        element: segment,
        timestamp: Date.now()
    });
    
    document.body.appendChild(segment);
    
    while (trailSegments.length > mouseTrailConfig.trailLength) {
        const oldestSegment = trailSegments.shift();
        oldestSegment.element.remove();
    }
    
    setTimeout(() => {
        segment.remove();
        trailSegments = trailSegments.filter(s => s.element !== segment);
    }, 500);
}

// Clean up old particles periodically
setInterval(() => {
    const oldParticles = document.querySelectorAll('.mouse-particle');
    oldParticles.forEach(particle => {
        if (particle.style.opacity === '0') {
            particle.remove();
        }
    });
}, 2000); 