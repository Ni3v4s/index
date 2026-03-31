// Portfolio interactive sounds
(function () {
    'use strict';

    // Preload all sound assets
    const clickSounds = [
        new Audio('clickSound.play 1.wav'),
        new Audio('clickSound.play 2.wav'),
        new Audio('clickSound.play 3.wav'),
        new Audio('clickSound.play 4.wav'),
    ];
    const hoverSound = new Audio('hoverSound.play01.wav');

    // Lower volume so sounds are subtle
    clickSounds.forEach(s => { s.volume = 0.45; });
    hoverSound.volume = 0.25;

    // Play a random click sound on every click of interactive elements
    document.addEventListener('click', function (e) {
        const target = e.target.closest('a, button, input[type="submit"], input[type="button"]');
        if (!target) return;
        const sound = clickSounds[Math.floor(Math.random() * clickSounds.length)];
        sound.currentTime = 0;
        sound.play().catch(() => {}); // ignore autoplay policy errors
    });

    // Play hover sound on links and buttons
    let hoverThrottle = 0;
    document.addEventListener('mouseover', function (e) {
        const target = e.target.closest('a, button');
        if (!target) return;
        const now = Date.now();
        if (now - hoverThrottle < 120) return; // throttle rapid hover triggers
        hoverThrottle = now;
        hoverSound.currentTime = 0;
        hoverSound.play().catch(() => {});
    });
})();

