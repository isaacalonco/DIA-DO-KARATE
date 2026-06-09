
document.addEventListener('DOMContentLoaded', () => {

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const introOverlay = document.getElementById('introOverlay');
    const introSkip = document.getElementById('introSkip');
    const introClickStart = document.getElementById('introClickStart');
    const introIframe = document.getElementById('introVideo');

    if (introOverlay) {
        if (sessionStorage.getItem('introVista')) {
            introOverlay.remove();
        } else {
            introOverlay.style.display = 'flex';
            document.body.classList.add('intro-active');

            function closeIntro() {
                introOverlay.classList.add('fade-out');
                document.body.classList.remove('intro-active');
                sessionStorage.setItem('introVista', 'true');
                setTimeout(() => { introOverlay.remove(); }, 1500);
            }

            if (introClickStart && introIframe) {
                introClickStart.addEventListener('click', () => {
                    introClickStart.style.display = 'none';
                    introIframe.style.display = 'block';
                    if (introSkip) introSkip.style.display = 'flex';

                    if (typeof Vimeo !== 'undefined') {
                        const player = new Vimeo.Player(introIframe);
                        player.setVolume(1);
                        player.play();
                        player.on('timeupdate', (data) => {
                            if (data.seconds >= 34) {
                                player.pause();
                                closeIntro();
                            }
                        });
                    }
                });
            }

            if (introSkip) {
                introSkip.addEventListener('click', closeIntro);
            }
        }
    }

    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    const counters = entry.target.querySelectorAll('.stat-number[data-count]');
                    counters.forEach(counter => {
                        if (!counter.classList.contains('counted')) {
                            animateCounter(counter);
                        }
                    });
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    function animateCounter(counterElement) {
        counterElement.classList.add('counted');
        const target = +counterElement.getAttribute('data-count');
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counterElement.innerText = Math.ceil(current) + (target === 40 ? '+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                counterElement.innerText = target + (target === 40 ? '+' : '');
            }
        };

        updateCounter();
    }


    const albumCover = document.getElementById('albumCover');
    const audio = document.getElementById('themeSong');
    const playerContainer = document.getElementById('playerContainer');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    
    if (albumCover && playerContainer) {
        let isPlaying = false;
        let hasAudioError = false;

        if(audio) {
            audio.volume = 0.5;
            
            audio.addEventListener('error', () => {
                console.warn("Áudio não encontrado.");
                hasAudioError = true;
            });
        }

        albumCover.addEventListener('click', () => {
            if (isPlaying) {
                if (!hasAudioError && audio) audio.pause();
                playerContainer.classList.remove('is-playing');
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
                isPlaying = false;
            } else {
                if (!hasAudioError && audio) {
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {
                            hasAudioError = true;
                            console.warn("Autoplay was prevented or audio failed to load.");
                        });
                    }
                }
                
                playerContainer.classList.add('is-playing');
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
                isPlaying = true;
            }
        });

        if(audio) {
            audio.addEventListener('ended', () => {
                playerContainer.classList.remove('is-playing');
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
                isPlaying = false;
                audio.currentTime = 0;
            });
        }
    }

});
