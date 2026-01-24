window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    const hero = document.querySelector('.hero');
    const cLetter = document.querySelector('.letter.c');
    const welcomeText = document.querySelector('.welcome-text');
    const indicator = document.querySelector('.scroll-indicator');

    /* HIDE LOADER */
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }, 1200);

    const heroHeight = window.innerHeight;

    const animate = () => {
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / heroHeight, 1);

        /* CINEMATIC EASING */
        const eased = Math.pow(progress, 2.6);

        /* ZOOM INTO THE C */
        const scale = 1 + eased * 7;
        const z = eased * 900;

        cLetter.style.transform = `
            scale(${scale})
            translateZ(${z}px)
        `;

        /* FADE HERO AFTER ENTRY */
        hero.style.opacity = 1 - eased * 1.2;

        /* SCROLL INDICATOR */
        indicator.classList.toggle('hidden', progress > 0.1);

        /* REVEAL CONTENT */
        if (progress > 0.6) {
            welcomeText.classList.add('visible');
        }

        requestAnimationFrame(animate);
    };

    animate();
});
