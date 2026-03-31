// Portfolio interactive sounds
(function () {
    'use strict';

    // Preload click sound assets
    const clickSounds = [
        new Audio('clickSound.play 1.wav'),
        new Audio('clickSound.play 2.wav'),
        new Audio('clickSound.play 3.wav'),
        new Audio('clickSound.play 4.wav'),
    ];
    clickSounds.forEach(s => { s.volume = 0.45; });

    // Sound on/off — remember preference, default to off
    let soundEnabled = localStorage.getItem('soundEnabled') === 'true';

    // Inject the toggle button into the page header
    function injectToggle() {
        const header = document.querySelector('header');
        if (!header) return;
        const btn = document.createElement('button');
        btn.id = 'sound-toggle';
        btn.setAttribute('aria-label', 'Toggle sounds');
        btn.textContent = soundEnabled ? '🔊' : '🔇';
        btn.addEventListener('click', function (e) {
            e.stopPropagation(); // don't also trigger a click sound for this press
            soundEnabled = !soundEnabled;
            localStorage.setItem('soundEnabled', soundEnabled);
            btn.textContent = soundEnabled ? '🔊' : '🔇';
        });
        header.appendChild(btn);
    }

    // Play a random click sound on every click of interactive elements
    document.addEventListener('click', function (e) {
        if (!soundEnabled) return;
        const target = e.target.closest('a, button, input[type="submit"], input[type="button"]');
        if (!target || target.id === 'sound-toggle') return;
        const sound = clickSounds[Math.floor(Math.random() * clickSounds.length)];
        sound.currentTime = 0;
        sound.play().catch(() => {}); // ignore autoplay policy errors
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectToggle);
    } else {
        injectToggle();
    }
})();

