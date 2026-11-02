/**
 * Tanuu — A Year of Us
 * Feature 1: Personal Voice Message Player Controller
 * Plays Tanish's authentic voice recording for Tanuu (49 seconds)
 */

(function () {
  'use strict';

  const voiceState = {
    audio: null,
    isPlaying: false,
    duration: 49, // 49 seconds (exact duration of Tanish's authentic voice recording)
    currentTime: 0,
    hasRealAudio: false,
    synthInterval: null,
    audioCtx: null
  };

  // Load authentic voice recording
  function initVoiceAudio() {
    if (voiceState.audio) return;

    // Check for DOM audio element first
    const domAudio = document.getElementById('voice-audio-element');
    voiceState.audio = domAudio || new Audio('assets/audio/my-voice-note.aac');
    voiceState.audio.preload = 'metadata';

    const onReady = () => {
      voiceState.hasRealAudio = true;
      if (voiceState.audio.duration && !isNaN(voiceState.audio.duration)) {
        voiceState.duration = Math.floor(voiceState.audio.duration);
        updateTimeDisplay();
      }
    };

    voiceState.audio.addEventListener('loadedmetadata', onReady);
    voiceState.audio.addEventListener('canplay', onReady);

    voiceState.audio.addEventListener('timeupdate', () => {
      voiceState.currentTime = Math.floor(voiceState.audio.currentTime);
      updateWaveformAndProgress();
    });

    voiceState.audio.addEventListener('ended', () => {
      stopVoice();
      voiceState.currentTime = 0;
      updateWaveformAndProgress();
    });

    voiceState.audio.addEventListener('error', () => {
      if (voiceState.audio.src && voiceState.audio.src.endsWith('.aac')) {
        voiceState.audio.src = 'assets/audio/my-voice-note.mp4';
      } else if (voiceState.audio.src && voiceState.audio.src.endsWith('.mp4')) {
        voiceState.audio.src = 'assets/audio/my-voice-note.m4a';
      } else {
        voiceState.hasRealAudio = false;
      }
    });

    if (voiceState.audio.readyState >= 1) {
      onReady();
    }
  }

  // Fallback melodic chime when file is loading or on strict devices
  function playFallbackChime() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!voiceState.audioCtx) voiceState.audioCtx = new AudioCtx();
    if (voiceState.audioCtx.state === 'suspended') voiceState.audioCtx.resume();

    const t = voiceState.audioCtx.currentTime;
    const osc = voiceState.audioCtx.createOscillator();
    const gain = voiceState.audioCtx.createGain();

    // Warm soft bell frequency
    const notes = [432, 544.3, 648.7, 432];
    const n = notes[Math.floor(voiceState.currentTime / 2) % notes.length];
    osc.type = 'sine';
    osc.frequency.setValueAtTime(n, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);

    osc.connect(gain);
    gain.connect(voiceState.audioCtx.destination);
    osc.start(t);
    osc.stop(t + 1.0);
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function updateTimeDisplay() {
    const currentEl = document.getElementById('voice-current-time');
    const totalEl = document.getElementById('voice-total-time');
    if (currentEl) currentEl.textContent = formatTime(voiceState.currentTime);
    if (totalEl) totalEl.textContent = formatTime(voiceState.duration);
  }

  function updateWaveformAndProgress() {
    updateTimeDisplay();

    const percent = Math.min(100, (voiceState.currentTime / voiceState.duration) * 100);
    const bar = document.getElementById('voice-progress-bar');
    if (bar) bar.style.width = `${percent}%`;

    // Highlight played waveform bars
    const waveBars = document.querySelectorAll('#voice-waveform span');
    const activeCount = Math.floor((percent / 100) * waveBars.length);
    waveBars.forEach((b, idx) => {
      if (idx <= activeCount) {
        b.classList.remove('bg-outline-variant/40');
        b.classList.add('bg-primary');
      } else {
        b.classList.remove('bg-primary');
        b.classList.add('bg-outline-variant/40');
      }
      b.style.animationPlayState = voiceState.isPlaying ? 'running' : 'paused';
    });
  }

  function toggleVoice() {
    initVoiceAudio();

    // Pause background song when voice note starts
    if (!voiceState.isPlaying && window.TanuuAudio) {
      const audioState = window.TanuuAudio.getState();
      if (audioState && audioState.isPlaying) {
        window.TanuuAudio.togglePlay(false);
      }
    }

    voiceState.isPlaying = !voiceState.isPlaying;

    const heartBtn = document.getElementById('voice-heart-btn');
    const heartIcon = heartBtn ? heartBtn.querySelector('.material-symbols-outlined') : null;

    if (voiceState.isPlaying) {
      if (heartIcon) heartIcon.textContent = 'pause';
      if (heartBtn) heartBtn.classList.add('scale-105', 'shadow-[0_0_25px_rgba(255,178,188,0.7)]');

      if (voiceState.audio) {
        voiceState.audio.currentTime = voiceState.currentTime;
        const playPromise = voiceState.audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            voiceState.hasRealAudio = true;
          }).catch(() => {
            // Fallback simulation loop
            voiceState.synthInterval = setInterval(() => {
              voiceState.currentTime += 1;
              if (voiceState.currentTime % 2 === 0) playFallbackChime();
              if (voiceState.currentTime >= voiceState.duration) {
                stopVoice();
              } else {
                updateWaveformAndProgress();
              }
            }, 1000);
          });
        }
      } else {
        voiceState.synthInterval = setInterval(() => {
          voiceState.currentTime += 1;
          if (voiceState.currentTime % 2 === 0) playFallbackChime();
          if (voiceState.currentTime >= voiceState.duration) {
            stopVoice();
          } else {
            updateWaveformAndProgress();
          }
        }, 1000);
      }
    } else {
      stopVoice();
    }
  }

  function stopVoice() {
    voiceState.isPlaying = false;
    const heartBtn = document.getElementById('voice-heart-btn');
    const heartIcon = heartBtn ? heartBtn.querySelector('.material-symbols-outlined') : null;

    if (heartIcon) heartIcon.textContent = 'favorite';
    if (heartBtn) heartBtn.classList.remove('scale-105', 'shadow-[0_0_25px_rgba(255,178,188,0.7)]');

    if (voiceState.audio) {
      voiceState.audio.pause();
    }
    if (voiceState.synthInterval) {
      clearInterval(voiceState.synthInterval);
      voiceState.synthInterval = null;
    }

    const waveBars = document.querySelectorAll('#voice-waveform span');
    waveBars.forEach(b => (b.style.animationPlayState = 'paused'));
  }

  function replayVoice() {
    voiceState.currentTime = 0;
    if (voiceState.audio) {
      voiceState.audio.currentTime = 0;
    }
    updateWaveformAndProgress();
    if (!voiceState.isPlaying) {
      toggleVoice();
    }
  }

  // Seek on progress bar click
  function seekVoice(e) {
    const track = document.getElementById('voice-progress-track');
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    voiceState.currentTime = Math.floor(ratio * voiceState.duration);
    if (voiceState.audio && voiceState.hasRealAudio) {
      voiceState.audio.currentTime = voiceState.currentTime;
    }
    updateWaveformAndProgress();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const heartBtn = document.getElementById('voice-heart-btn');
    const replayBtn = document.getElementById('voice-replay-btn');
    const track = document.getElementById('voice-progress-track');

    if (heartBtn) heartBtn.addEventListener('click', toggleVoice);
    if (replayBtn) replayBtn.addEventListener('click', replayVoice);
    if (track) track.addEventListener('click', seekVoice);

    initVoiceAudio();
    updateTimeDisplay();
    updateWaveformAndProgress();
  });
})();
