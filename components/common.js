function initComponents() {
    // Elements
    const loader = document.getElementById('loading-screen');
    const hero = document.querySelector('.hero');
    const tLetter = document.querySelector('.letter.t');
    const cLetter = document.querySelector('.letter.c');
    const iLetter = document.querySelector('.letter.i');
    const tunnel = document.querySelector('.tunnel-effect');
    const welcomeText = document.querySelector('.welcome-text');
    const statsTitle = document.querySelector('.stats-title');
    const statItems = document.querySelectorAll('.stat-item');
    const statNumbers = document.querySelectorAll('.stat-number');
    const galleryTitle = document.querySelector('.gallery-title');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const gallerySection = document.querySelector('.gallery-section');
    const indicator = document.querySelector('.scroll-indicator');
    const scrollContainer = document.querySelector('.scroll-container');
    const orangeReveal = document.querySelector('.orange-reveal');
    const orangeRevealMask = document.querySelector('.orange-reveal-mask');
    const galleryParticles = document.getElementById('galleryParticles');
    
    // Image URLs for gallery
    const imageUrls = [
        'https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ];
    
    // Variables for smooth scrolling
    let scrollY = 0;
    let targetScrollY = 0;
    let animationFrameId = null;
    let heroHeight = window.innerHeight;
    let statsShown = false;
    let galleryShown = false;
    let statsCounted = false;
    
    // Remove loader after 1 second
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.visibility = 'hidden';
            loader.style.display = 'none';
            init();
        }, 1000);
    }, 1000);
    
    // Initialize function
    function init() {
        heroHeight = window.innerHeight;
        scrollContainer.style.height = (heroHeight * 7) + 'px'; // Updated for 7 sections
        
        initGalleryCells();
        smoothScroll();
        createParticles();
    }
    
    // Initialize gallery cells with Show Border effect
    function initGalleryCells() {
        galleryItems.forEach((item, index) => {
            const gridContainer = item.querySelector('.gallery-grid-container');
            const columns = parseInt(item.getAttribute('data-columns')) || 5;
            const rows = parseInt(item.getAttribute('data-rows')) || 5;
            const imageUrl = imageUrls[index];
            
            gridContainer.innerHTML = '';
            
            let cellIndex = 0;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < columns; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'gallery-cell';
                    cell.style.setProperty('--col-index', col);
                    cell.style.setProperty('--row-index', row);
                    cell.style.setProperty('--col-total', columns);
                    cell.style.setProperty('--row-total', rows);
                    cell.style.setProperty('--cell-index', cellIndex);
                    cell.style.backgroundImage = `url(${imageUrl})`;
                    cell.style.backgroundPosition = `${(col/columns)*100}% ${(row/rows)*100}%`;
                    cell.style.backgroundSize = `${columns * 100}% ${rows * 100}%`;
                    gridContainer.appendChild(cell);
                    cellIndex++;
                }
            }
        });
    }
    
    // Animate counting numbers
    function animateCounters() {
        if (statsCounted) return;
        statsCounted = true;
        
        statNumbers.forEach(numberElement => {
            const target = parseInt(numberElement.getAttribute('data-count'));
            const duration = 2000;
            const startTime = Date.now();
            const startValue = 0;
            
            function updateCount() {
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
                
                numberElement.textContent = currentValue;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                }
            }
            
            updateCount();
        });
    }
    
    // Smooth scroll function with momentum
    function smoothScroll() {
        targetScrollY = window.pageYOffset || document.documentElement.scrollTop;
        scrollY += (targetScrollY - scrollY) * 0.08;
        
        // Calculate progress for each section
        const heroProgress = Math.min(scrollY / heroHeight, 1);
        const statsProgress = Math.min(Math.max((scrollY - heroHeight * 1.5) / (heroHeight * 0.5), 0), 1);
        const galleryProgress = Math.min(Math.max((scrollY - heroHeight * 2.5) / (heroHeight * 0.5), 0), 1);
        const galleryFadeOut = Math.min(Math.max((scrollY - heroHeight * 3.2) / (heroHeight * 0.3), 0), 1);
        
        // Enhanced cinematic easing for hero
        const eased = 1 - Math.pow(1 - heroProgress, 3);
        
        // Different zoom scales for each letter
        const baseZoom = 1 + (eased * 5);
        const focusZoom = 1 + (eased * 25);
        const tunnelScale = 1 + (eased * 60);
        
        // Apply transforms to letters
        tLetter.style.transform = `
            scale(${baseZoom * 0.9})
            translateX(${eased * -5}%)
        `;
        
        cLetter.style.transform = `scale(${focusZoom})`;
        
        iLetter.style.transform = `
            scale(${baseZoom * 0.9})
            translateX(${eased * 5}%)
        `;
        
        // Grow tunnel effect
        tunnel.style.transform = `translate(-50%, -50%) scale(${tunnelScale})`;
        tunnel.style.opacity = Math.min(eased * 1.5, 1);
        
        // Adjust orange reveal opacity
        const orangeOpacity = Math.min(eased * 4, 1);
        orangeReveal.style.opacity = orangeOpacity;
        
        // Hide orange reveal mask
        const maskOpacity = Math.max(0, 1 - (scrollY / heroHeight) * 2);
        orangeRevealMask.style.opacity = maskOpacity;
        
        // Hero fade out
        hero.style.opacity = 1 - (eased * 0.8);
        
        // Hide scroll indicator
        indicator.classList.toggle('hidden', heroProgress > 0.1);
        
        // Show welcome text
        if (heroProgress > 0.5) {
            welcomeText.classList.add('visible');
        } else {
            welcomeText.classList.remove('visible');
        }
        
        // Show stats section
        if (statsProgress > 0.2 && !statsShown) {
            statsShown = true;
            statsTitle.classList.add('visible');
            statItems.forEach(item => {
                item.classList.add('visible');
            });
            animateCounters();
        } else if (statsProgress <= 0.2 && statsShown) {
            statsShown = false;
            statsTitle.classList.remove('visible');
            statItems.forEach(item => {
                item.classList.remove('visible');
            });
            statsCounted = false;
        }
        
        // Show gallery items
        if (galleryProgress > 0.2 && !galleryShown) {
            galleryShown = true;
            galleryTitle.classList.add('visible');
            galleryItems.forEach(item => {
                item.classList.add('visible');
            });
            triggerParticleEffect();
        } else if (galleryProgress <= 0.2 && galleryShown) {
            galleryShown = false;
            galleryTitle.classList.remove('visible');
            galleryItems.forEach(item => {
                item.classList.remove('visible');
            });
        }
        
        // Apply gallery fade out
        gallerySection.style.opacity = 1 - galleryFadeOut;
        
        animationFrameId = requestAnimationFrame(smoothScroll);
    }
    
    // Create particles for gallery effect
    function createParticles() {
        if (!galleryParticles) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.opacity = Math.random() * 0.5;
            particle.style.transform = `scale(${Math.random() * 2})`;
            galleryParticles.appendChild(particle);
        }
    }
    
    // Trigger particle animation
    function triggerParticleEffect() {
        if (!galleryParticles) return;
        
        const particles = galleryParticles.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            particle.animate([
                { 
                    opacity: 0,
                    transform: 'scale(0) translateY(0)'
                },
                { 
                    opacity: 0.8,
                    transform: `scale(${1 + Math.random()}) translateY(${Math.random() * -100}px)`
                },
                { 
                    opacity: 0,
                    transform: 'scale(0) translateY(-200px)'
                }
            ], {
                duration: 1000 + Math.random() * 1000,
                delay: index * 50,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
        });
    }
    
    // Handle resize
    function handleResize() {
        heroHeight = window.innerHeight;
        scrollContainer.style.height = (heroHeight * 7) + 'px';
        initGalleryCells();
        targetScrollY = window.pageYOffset || document.documentElement.scrollTop;
    }
    
    // Add subtle parallax effect on mouse move
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        if (scrollY < heroHeight * 0.3) {
            const moveX = (mouseX - 0.5) * 10;
            const moveY = (mouseY - 0.5) * 5;
            
            // Reset transforms first
            tLetter.style.transform = '';
            cLetter.style.transform = '';
            iLetter.style.transform = '';
            
            // Reapply with parallax
            tLetter.style.transform = `
                scale(var(--t-scale, 1)) 
                translateX(var(--t-translate, 0)) 
                translate(${moveX * 0.3}px, ${moveY * 0.3}px)
            `;
            
            cLetter.style.transform = `
                scale(var(--c-scale, 1)) 
                translate(${moveX * 0.5}px, ${moveY * 0.5}px)
            `;
            
            iLetter.style.transform = `
                scale(var(--i-scale, 1)) 
                translateX(var(--i-translate, 0)) 
                translate(${moveX * 0.3}px, ${moveY * 0.3}px)
            `;
        }
    });
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    
    // Prevent context menu on right click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Clean up animation frame on page unload
    window.addEventListener('beforeunload', function() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
}

// Make initComponents available globally
window.initComponents = initComponents;