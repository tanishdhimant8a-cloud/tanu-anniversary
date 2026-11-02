/**
 * Tanuu — A Year of Us
 * Feature 2: Interactive 9:16 Cinematic Anniversary Reel Engine
 * Plays 14 real vertical photos with slow Ken-Burns zoom, captions, and transitions
 * Auto-detects assets/videos/anniversary-reel.mp4 if user adds pre-rendered video
 */

(function () {
  'use strict';

  const slides = [
    { src: 'assets/images/optimized/reel/reel-01.jpg', caption: 'The beginning of our quiet forever', zoomClass: 'ken-burns-in' },
    { src: 'assets/images/optimized/reel/reel-02.jpg', caption: 'Stolen glances that stopped time', zoomClass: 'ken-burns-out' },
    { src: 'assets/images/optimized/reel/reel-03.jpg', caption: 'Peaceful afternoons by your side', zoomClass: 'ken-burns-in' },
    { src: 'assets/images/optimized/reel/reel-04.jpg', caption: 'Your effortless, unfiltered laughter', zoomClass: 'ken-burns-out' },
    { src: 'assets/images/optimized/reel/reel-05.jpg', caption: 'Every journey feels like home with you', zoomClass: 'ken-burns-in' },
    { src: 'assets/images/optimized/reel/reel-06.jpg', caption: 'Warm golden hours and shared dreams', zoomClass: 'ken-burns-out' },
    { src: 'assets/images/optimized/reel/reel-07.jpg', caption: 'Quiet conversations beneath evening skies', zoomClass: 'ken-burns-in' },
    { src: 'assets/images/optimized/reel/reel-08.jpg', caption: 'The gentle grace you bring to my world', zoomClass: 'ken-burns-out' },
    { src: 'assets/images/optimized/reel/reel-09.jpg', caption: 'Unconditional joy, zero pretense', zoomClass: 'ken-burns-in' },
    { src: 'assets/images/optimized/reel/reel-10.jpg', caption: 'Finding sanctuary in every embrace', zoomClass: 'ken-burns-out' },
    { src: 'assets/images/optimized/reel/reel-11.jpg', caption: 'Dressed up evenings, forever in love', zoomClass: 'ken-burns-in' },
    { src: 'assets/images/optimized/reel/reel-12.jpg', caption: 'A thousand memories, one devotion', zoomClass: 'ken-burns-out' },
    { src: 'assets/images/optimized/reel/reel-13.jpg', caption: '365 sunrises of choosing you', zoomClass: 'ken-burns-in' },
    { src: 'assets/images/optimized/reel/reel-14.jpg', caption: 'Here\'s to our every tomorrow • Forever', zoomClass: 'ken-burns-out' }
  ];

  const reelState = {
    currentIndex: 0,
    isPlaying: false,
    interval: null,
    slideDuration: 4000, // 4 seconds per slide = ~56 seconds total
    hasRealMp4: false
  };

  // Keep reel strictly as the 14 personal photos slideshow with authentic song playing behind it
  function checkRealVideo() {
    reelState.hasRealMp4 = false;
  }

  function renderSlide(index) {
    if (reelState.hasRealMp4) return;

    const imgEl = document.getElementById('reel-active-img');
    const captionEl = document.getElementById('reel-active-caption');
    const stepEl = document.getElementById('reel-slide-step');
    const progressEl = document.getElementById('reel-progress-fill');

    if (!imgEl || !captionEl) return;

    const slide = slides[index];

    // Smooth fade transition
    imgEl.style.opacity = '0';
    captionEl.style.opacity = '0';

    setTimeout(() => {
      imgEl.src = slide.src;
      imgEl.className = `w-full h-full object-cover transition-transform duration-[4000ms] ease-out ${slide.zoomClass}`;
      captionEl.textContent = slide.caption;

      imgEl.style.opacity = '1';
      captionEl.style.opacity = '1';

      if (stepEl) stepEl.textContent = `${index + 1} / ${slides.length}`;
      if (progressEl) progressEl.style.width = `${((index + 1) / slides.length) * 100}%`;
    }, 300);
  }

  function nextSlide() {
    if (reelState.currentIndex >= slides.length - 1) {
      // Reached finale slide
      showEndingTitle();
      stopReel();
      return;
    }
    reelState.currentIndex++;
    renderSlide(reelState.currentIndex);
  }

  function prevSlide() {
    if (reelState.currentIndex > 0) {
      reelState.currentIndex--;
      renderSlide(reelState.currentIndex);
    }
  }

  function showEndingTitle() {
    const endCard = document.getElementById('reel-end-card');
    if (endCard) {
      endCard.classList.remove('opacity-0', 'pointer-events-none');
    }
  }

  function hideEndingTitle() {
    const endCard = document.getElementById('reel-end-card');
    if (endCard) {
      endCard.classList.add('opacity-0', 'pointer-events-none');
    }
  }

  function toggleReel() {
    if (reelState.hasRealMp4) {
      const mp4El = document.getElementById('reel-mp4-video');
      if (mp4El) {
        if (mp4El.paused) mp4El.play();
        else mp4El.pause();
      }
      return;
    }

    reelState.isPlaying = !reelState.isPlaying;

    const playBtn = document.getElementById('reel-play-btn');
    const playIcon = playBtn ? playBtn.querySelector('.material-symbols-outlined') : null;

    if (reelState.isPlaying) {
      hideEndingTitle();
      if (playIcon) playIcon.textContent = 'pause';

      // Start romantic music if not already playing
      if (window.TanuuAudio && !window.TanuuAudio.getState().isPlaying) {
        window.TanuuAudio.togglePlay(true);
      }

      reelState.interval = setInterval(nextSlide, reelState.slideDuration);
    } else {
      stopReel();
    }
  }

  function stopReel() {
    reelState.isPlaying = false;
    const playBtn = document.getElementById('reel-play-btn');
    const playIcon = playBtn ? playBtn.querySelector('.material-symbols-outlined') : null;
    if (playIcon) playIcon.textContent = 'play_arrow';

    if (reelState.interval) {
      clearInterval(reelState.interval);
      reelState.interval = null;
    }

    // Pause the soundtrack when the reel is paused/stopped
    if (window.TanuuAudio && window.TanuuAudio.getState().isPlaying) {
      window.TanuuAudio.togglePlay(false);
    }
  }

  function replayReel() {
    hideEndingTitle();
    reelState.currentIndex = 0;
    renderSlide(0);
    if (window.TanuuAudio) {
      window.TanuuAudio.seekTo(0);
    }
    toggleReel();
  }

  document.addEventListener('DOMContentLoaded', () => {
    checkRealVideo();

    const playBtn = document.getElementById('reel-play-btn');
    const nextBtn = document.getElementById('reel-next-btn');
    const prevBtn = document.getElementById('reel-prev-btn');
    const replayBtn = document.getElementById('reel-replay-btn');
    const endReplayBtn = document.getElementById('reel-end-replay-btn');

    if (playBtn) playBtn.addEventListener('click', toggleReel);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (replayBtn) replayBtn.addEventListener('click', replayReel);
    if (endReplayBtn) endReplayBtn.addEventListener('click', replayReel);

    // Initial render
    renderSlide(0);
  });
})();
