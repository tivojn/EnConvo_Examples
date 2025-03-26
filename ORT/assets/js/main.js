/**
 * Oxford Reading Tree - Interactive Story
 * Main JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const pages = document.querySelectorAll('.page');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    let currentPage = 0;
    const totalPages = pages.length;
    let isMuted = false;

    // Audio elements
    const allAudio = document.querySelectorAll('audio');
    const narrationButtons = document.querySelectorAll('.play-narration');
    const soundButtons = document.querySelectorAll('.play-sound');
    const muteToggleButton = document.querySelector('.mute-toggle');

    // Update progress bar
    function updateProgressBar() {
        const progress = ((currentPage) / (totalPages - 1)) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Function to stop all audio
    function stopAllAudio() {
        allAudio.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        
        // Reset all narration buttons
        narrationButtons.forEach(button => {
            button.innerHTML = '<i class="fas fa-play"></i> Play Narration';
        });
        
        // Reset all sound buttons
        soundButtons.forEach(button => {
            const soundName = button.dataset.soundName || button.textContent.trim().replace('Play ', '');
            button.innerHTML = `<i class="fas fa-volume-up"></i> ${soundName}`;
        });
    }

    // Function to play narration followed by sound effect on the current page
    function playCurrentNarration() {
        if (!isMuted) {
            const activePage = document.querySelector('.page.active');
            if (activePage) {
                const narrationBtn = activePage.querySelector('.play-narration');
                if (narrationBtn) {
                    setTimeout(() => {
                        // First stop any playing audio
                        stopAllAudio();
                        
                        // Get the narration audio element
                        const audioId = narrationBtn.getAttribute('data-audio');
                        const audio = document.getElementById(audioId);
                        
                        // Try to play the narration, handling autoplay policy
                        const playPromise = audio.play();
                        
                        // Handle potential autoplay restrictions
                        if (playPromise !== undefined) {
                            playPromise.then(() => {
                                // Autoplay started successfully
                                narrationBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Narration';
                                
                                // When narration ends, play the sound effect if available
                                audio.onended = function() {
                                    narrationBtn.innerHTML = '<i class="fas fa-play"></i> Play Narration';
                                    
                                    // Find and play sound effect if it exists
                                    const soundBtn = activePage.querySelector('.play-sound');
                                    if (soundBtn) {
                                        const soundId = soundBtn.getAttribute('data-audio');
                                        const soundAudio = document.getElementById(soundId);
                                        if (soundAudio && !isMuted) {
                                            soundAudio.play().catch(e => {
                                                console.log('Sound effect autoplay prevented:', e);
                                            });
                                        }
                                    }
                                };
                            }).catch(e => {
                                // Autoplay was prevented by the browser
                                console.log('Narration autoplay prevented:', e);
                                narrationBtn.innerHTML = '<i class="fas fa-play"></i> Play Narration';
                                // Indicate to the user that they need to interact to play audio
                                const notification = document.createElement('div');
                                notification.className = 'autoplay-notification';
                                notification.innerHTML = 'Click the Play button to start the narration';
                                notification.style.position = 'absolute';
                                notification.style.top = '10px';
                                notification.style.left = '50%';
                                notification.style.transform = 'translateX(-50%)';
                                notification.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                notification.style.padding = '10px 15px';
                                notification.style.borderRadius = '5px';
                                notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                                notification.style.zIndex = '1000';
                                activePage.appendChild(notification);
                                
                                // Remove notification after 5 seconds
                                setTimeout(() => {
                                    if (notification.parentNode) {
                                        notification.parentNode.removeChild(notification);
                                    }
                                }, 5000);
                            });
                        }
                    }, 500); // Small delay to ensure page transition is complete
                }
            }
        }
    }

    // Show current page
    function showPage(pageIndex) {
        pages.forEach((page, index) => {
            if (index === pageIndex) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        // Update navigation buttons
        prevBtn.disabled = pageIndex === 0;
        nextBtn.disabled = pageIndex === totalPages - 1;
        
        // Update page number in URL for bookmarking
        window.history.replaceState({}, '', `#page-${pageIndex}`);
        
        // Update progress bar
        updateProgressBar();
        
        // Auto-play narration when page loads
        playCurrentNarration();
    }

    // Mute toggle functionality
    muteToggleButton.addEventListener('click', function() {
        isMuted = !isMuted;
        
        if (isMuted) {
            this.innerHTML = '<i class="fas fa-volume-mute"></i> Sound Off';
            this.dataset.status = 'muted';
            stopAllAudio();
        } else {
            this.innerHTML = '<i class="fas fa-volume-up"></i> Sound On';
            this.dataset.status = 'unmuted';
            playCurrentNarration();
        }
    });

    // Navigation event listeners
    prevBtn.addEventListener('click', function() {
        if (currentPage > 0) {
            stopAllAudio();
            currentPage--;
            showPage(currentPage);
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages - 1) {
            stopAllAudio();
            currentPage++;
            showPage(currentPage);
        }
    });

    // Narration button listeners
    narrationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const audioId = this.getAttribute('data-audio');
            const audio = document.getElementById(audioId);
            
            if (audio.paused) {
                stopAllAudio();
                if (!isMuted) {
                    audio.play();
                    this.innerHTML = '<i class="fas fa-pause"></i> Pause Narration';
                    
                    audio.onended = function() {
                        button.innerHTML = '<i class="fas fa-play"></i> Play Narration';
                    };
                }
            } else {
                audio.pause();
                this.innerHTML = '<i class="fas fa-play"></i> Play Narration';
            }
        });
    });

    // Sound effect button listeners
    soundButtons.forEach(button => {
        const soundName = button.textContent.trim().replace('Play ', '');
        button.dataset.soundName = soundName;
        
        button.addEventListener('click', function() {
            const audioId = this.getAttribute('data-audio');
            const audio = document.getElementById(audioId);
            
            stopAllAudio();
            if (!isMuted) {
                audio.play();
                
                audio.onended = function() {
                    button.innerHTML = `<i class="fas fa-volume-up"></i> ${soundName}`;
                };
            }
        });
    });

    // Touch events for mobile swiping
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50; // Min distance to be considered a swipe
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left (next page)
            if (!nextBtn.disabled) {
                nextBtn.click();
            }
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right (previous page)
            if (!prevBtn.disabled) {
                prevBtn.click();
            }
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
            prevBtn.click();
        } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
            nextBtn.click();
        } else if (e.key === 'm') {
            // 'M' key toggles mute
            muteToggleButton.click();
        }
    });

    // Check for hash in URL to load specific page
    const hash = window.location.hash;
    if (hash) {
        const pageMatch = hash.match(/page-(\d+)/);
        if (pageMatch && pageMatch[1]) {
            const pageIndex = parseInt(pageMatch[1]);
            if (pageIndex >= 0 && pageIndex < totalPages) {
                currentPage = pageIndex;
                showPage(currentPage);
            }
        }
    } else {
        // Initialize first page
        showPage(currentPage);
    }

    // Initialize progress bar
    updateProgressBar();
});