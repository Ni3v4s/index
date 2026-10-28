// Portfolio interactive sounds
(function () {
    'use strict';

    const ambientTrack = new Audio('https://raw.githubusercontent.com/Ni3v4s/index/main/asset/audio/%237%20Instante%20del%20Mundo_EmiliaRamunda-2026.mp3');
    ambientTrack.loop = true;
    ambientTrack.volume = 0.2;
    ambientTrack.preload = 'none';

    const ambientLabels = {
        es: { play: 'Activar música de fondo', pause: 'Pausar música de fondo' },
        en: { play: 'Play background music', pause: 'Pause background music' },
        fr: { play: 'Activer la musique de fond', pause: 'Mettre la musique de fond en pause' },
    };

    let ambientButton;

    function updateAmbientButton() {
        if (!ambientButton) return;

        const labels = ambientLabels[document.documentElement.lang] || ambientLabels.es;
        const isPlaying = !ambientTrack.paused;
        const icon = ambientButton.querySelector('.ambient-audio-icon');
        ambientButton.setAttribute('aria-label', isPlaying ? labels.pause : labels.play);
        ambientButton.title = isPlaying ? labels.pause : labels.play;
        ambientButton.setAttribute('aria-pressed', String(isPlaying));
        ambientButton.classList.toggle('is-playing', isPlaying);
        if (icon) icon.textContent = isPlaying ? '❚❚' : '▶';
    }

    function bindAmbientControl() {
        ambientButton = document.getElementById('ambient-audio-toggle');
        if (!ambientButton) return;

        ambientButton.addEventListener('click', function () {
            if (!ambientTrack.paused) {
                ambientTrack.pause();
                updateAmbientButton();
                return;
            }

            document.querySelectorAll('.custom-audio-controls audio').forEach(function (audio) {
                if (!audio.paused) {
                    audio.pause();
                    if (typeof window.resetPlayer === 'function') window.resetPlayer(audio);
                }
            });

            ambientTrack.play().then(updateAmbientButton).catch(function (error) {
                console.error('No se pudo reproducir la música de fondo:', ambientTrack.currentSrc, error);
                updateAmbientButton();
            });
        });
        updateAmbientButton();
    }

    document.addEventListener('site-language-change', updateAmbientButton);
    document.addEventListener('play', function (event) {
        const target = event.target;
        if (target instanceof HTMLAudioElement && target.matches('.custom-audio-controls audio') && !ambientTrack.paused) {
            ambientTrack.pause();
            updateAmbientButton();
        }
    }, true);

    ambientTrack.addEventListener('error', function () {
        console.error('Error al cargar la música de fondo:', ambientTrack.currentSrc, ambientTrack.error);
        updateAmbientButton();
    });

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
        if (header) {
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
        bindAmbientControl();
    }

    // Play a random click sound on every click of interactive elements
    document.addEventListener('click', function (e) {
        if (!soundEnabled) return;
        const target = e.target.closest('a, button, input[type="submit"], input[type="button"]');
        if (!target || target.closest('.custom-audio-controls') || target.id === 'sound-toggle' || target.id === 'ambient-audio-toggle') return;
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
