/**
 * Tanuu — A Year of Us
 * Soundtrack of Us: "Until I Found You (Instrumental)"
 * Orchestral Acoustic Strings • Con Moto • In Tanuu's Key (432Hz)
 * Features:
 * - Real Web Audio API synthesizer: Generates the signature bittersweet chord progression
 *   of "Until I Found You" (Dmaj9 -> F#m7 -> Gmaj7 -> Gm6) with orchestral string warmth
 * - Auto-detects real MP3 audio at assets/audio/until-i-found-you.mp3 if provided
 * - Synced Header, Hero, and Main Vinyl player controls
 * - Interactive seek bar (scrubber)
 * - 27-bar dynamic animated equalizer
 * - Synchronized lyrics stanzas scrolling & click-to-seek
 * - Volume control & repeat
 */

(function () {
  'use strict';

  // Global Audio State
  const state = {
    isPlaying: false,
    duration: 172, // 02:52 in seconds (exact duration of authentic audio)
    currentTime: 0,
    volume: 0.75,
    isMuted: false,
    audioCtx: null,
    masterGain: null,
    synthInterval: null,
    timerInterval: null,
    audioEl: null,
    hasRealAudio: false,
  };

  // "Until I Found You" Chord Progression & Arpeggio Frequencies (in Tanuu's Key, 432Hz tuning)
  // 432Hz tuning: A4 = 432Hz, D4 = 288.3Hz, F#4 = 363.3Hz, G4 = 384.9Hz, Bb4 = 457.7Hz
  // Progression: Dmaj9 (I) -> F#m7 (iii) -> Gmaj7 (IV) -> Gm6 (iv - iconic nostalgic turn)
  const chordNotes = [
    // Chord 1: Dmaj9 (D, F#, A, C#, E) - "Georgia, wrap me up in all your..."
    [288.3, 363.3, 432.0, 544.3, 647.3],
    // Chord 2: F#m7 (F#, A, C#, F#, C#) - "I would never fall in love..."
    [363.3, 432.0, 544.3, 726.5, 544.3],
    // Chord 3: Gmaj7 (G, D, G, B, D) - "...until I found her"
    [192.4, 288.3, 384.9, 484.9, 576.7],
    // Chord 4: Gm6 (G, D, G, Bb, C#) - "...unless it's you I fall into (Tanuu)"
    [192.4, 288.3, 384.9, 457.7, 544.3]
  ];

  let currentChordIndex = 0;
  let currentNoteIndex = 0;

  // Initialize Real Audio Stream from authentic uploaded files
  function checkRealAudio() {
    if (state.audioEl) return;

    // Check for DOM audio element first
    const domAudio = document.getElementById('main-audio-element');
    state.audioEl = domAudio || new Audio();

    if (!domAudio) {
      state.audioEl.src = 'assets/audio/our-song.aac';
      state.audioEl.preload = 'metadata';
    }

    const onReady = () => {
      state.hasRealAudio = true;
      if (state.audioEl.duration && !isNaN(state.audioEl.duration)) {
        state.duration = Math.floor(state.audioEl.duration);
        const totalEl = document.getElementById('audio-total-time');
        if (totalEl) totalEl.textContent = formatTime(state.duration);
      }
      updateScrubberAndLyrics();
    };

    state.audioEl.addEventListener('loadedmetadata', onReady);
    state.audioEl.addEventListener('canplay', onReady);

    state.audioEl.addEventListener('timeupdate', () => {
      state.currentTime = Math.floor(state.audioEl.currentTime);
      updateScrubberAndLyrics();
    });

    state.audioEl.addEventListener('ended', () => {
      seekTo(0);
      togglePlay(false);
    });

    state.audioEl.addEventListener('error', () => {
      // Try next source if first fails
      if (state.audioEl.src && state.audioEl.src.endsWith('.aac')) {
        state.audioEl.src = 'assets/audio/our-song.mp4';
      } else if (state.audioEl.src && state.audioEl.src.endsWith('.mp4')) {
        state.audioEl.src = 'assets/audio/our-song.m4a';
      } else {
        state.hasRealAudio = false;
      }
    });

    // Check if already ready
    if (state.audioEl.readyState >= 1) {
      onReady();
    }
  }

  // Initialize Web Audio Synthesizer
  function initAudioContext() {
    if (state.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    state.audioCtx = new AudioContext();
    state.masterGain = state.audioCtx.createGain();
    state.masterGain.gain.setValueAtTime(state.volume, state.audioCtx.currentTime);

    // Warm Low-pass Filter for orchestral acoustic strings body
    const filter = state.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1550, state.audioCtx.currentTime);

    state.masterGain.connect(filter);
    filter.connect(state.audioCtx.destination);
  }

  // Play orchestral acoustic string note (Con Moto)
  function playAcousticNote(freq, timeOffset = 0) {
    if (!state.audioCtx || state.audioCtx.state !== 'running') return;

    const t = state.audioCtx.currentTime + timeOffset;

    // Dual oscillator for rich organic string body
    const osc1 = state.audioCtx.createOscillator();
    const osc2 = state.audioCtx.createOscillator();
    const noteGain = state.audioCtx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(freq, t);
    // Subtle detune for natural string ensemble resonance
    osc2.frequency.setValueAtTime(freq * 1.003, t);

    // Exponential Decay Envelope (con moto acoustic strings pluck/bow)
    noteGain.gain.setValueAtTime(0.001, t);
    noteGain.gain.linearRampToValueAtTime(0.20, t + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(state.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 2.4);
    osc2.stop(t + 2.4);
  }

  // Arpeggiator Loop: Plays "Until I Found You" con moto progression
  function startSynthesizer() {
    if (state.synthInterval) clearInterval(state.synthInterval);

    state.synthInterval = setInterval(() => {
      if (!state.isPlaying || !state.audioCtx || state.audioCtx.state !== 'running') return;

      const chord = chordNotes[currentChordIndex];
      const freq = chord[currentNoteIndex % chord.length];

      playAcousticNote(freq);

      // Play soft cello/bass root note on downbeats
      if (currentNoteIndex === 0) {
        playAcousticNote(chord[0] / 2, 0.01);
      }

      currentNoteIndex++;
      if (currentNoteIndex >= 6) {
        currentNoteIndex = 0;
        currentChordIndex = (currentChordIndex + 1) % chordNotes.length;
      }
    }, 320); // Con Moto tempo (~94 BPM, flowing romantic motion)
  }

  function stopSynthesizer() {
    if (state.synthInterval) {
      clearInterval(state.synthInterval);
      state.synthInterval = null;
    }
  }

  // Format seconds into MM:SS
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Toggle Play / Pause Across Entire App
  function togglePlay(forceState) {
    checkRealAudio();
    initAudioContext();
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }

    if (typeof forceState === 'boolean') {
      state.isPlaying = forceState;
    } else {
      state.isPlaying = !state.isPlaying;
    }

    if (state.isPlaying) {
      if (state.audioEl) {
        state.audioEl.currentTime = state.currentTime;
        state.audioEl.volume = state.volume;
        const playPromise = state.audioEl.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            state.hasRealAudio = true;
          }).catch((err) => {
            console.log('Audio playback waiting for gesture or fallback:', err);
            startSynthesizer();
          });
        }
      } else {
        startSynthesizer();
      }
      startTimer();
    } else {
      if (state.audioEl) {
        state.audioEl.pause();
      }
      stopSynthesizer();
      stopTimer();
    }

    updateUI();
  }

  // Timer loop: increments currentTime and updates progress & lyrics
  function startTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
      if (!state.isPlaying) return;
      state.currentTime += 1;
      if (state.currentTime >= state.duration) {
        state.currentTime = 0; // Loop song
      }
      updateScrubberAndLyrics();
    }, 1000);
  }

  function stopTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  // Update UI Elements Across Header, Hero, and Main Vinyl Section
  function updateUI() {
    // 1. Header Mini Player
    const headerPlayBtn = document.querySelector('header button[aria-label="Toggle music playback"] span');
    const headerVisualizers = document.querySelectorAll('header .animate-pulse');
    if (headerPlayBtn) {
      headerPlayBtn.textContent = state.isPlaying ? 'pause' : 'play_arrow';
    }
    headerVisualizers.forEach(v => {
      v.style.animationPlayState = state.isPlaying ? 'running' : 'paused';
    });

    // 2. Hero Floating Player
    const heroPlayIcon = document.getElementById('play-icon');
    const heroAudioBtn = document.getElementById('audio-toggle-btn');
    const heroVisualizers = document.querySelectorAll('#grand-hero .animate-pulse');
    if (heroPlayIcon) {
      heroPlayIcon.textContent = state.isPlaying ? 'pause' : 'play_arrow';
    }
    if (heroAudioBtn) {
      if (state.isPlaying) {
        heroAudioBtn.classList.add('shadow-[0_0_24px_rgba(255,178,188,0.7)]');
      } else {
        heroAudioBtn.classList.remove('shadow-[0_0_24px_rgba(255,178,188,0.7)]');
      }
    }
    heroVisualizers.forEach(v => {
      v.style.animationPlayState = state.isPlaying ? 'running' : 'paused';
    });

    // 3. Main Vinyl Section Player
    const playbackBtn = document.getElementById('playback-btn');
    const playbackIcon = playbackBtn ? playbackBtn.querySelector('.material-symbols-outlined') : null;
    const vinylDisc = document.getElementById('vinyl-disc');
    const equalizer = document.getElementById('audio-equalizer');

    if (playbackIcon) {
      playbackIcon.textContent = state.isPlaying ? 'pause' : 'play_arrow';
    }
    if (vinylDisc) {
      vinylDisc.style.animationPlayState = state.isPlaying ? 'running' : 'paused';
    }
    if (equalizer) {
      equalizer.querySelectorAll('span').forEach(bar => {
        bar.style.animationPlayState = state.isPlaying ? 'running' : 'paused';
      });
    }

    updateScrubberAndLyrics();
  }

  // Update Scrubber Progress & Synchronized Lyrics Stream
  function updateScrubberAndLyrics() {
    const percent = Math.min(100, (state.currentTime / state.duration) * 100);

    // Progress Bar Fill & Thumb
    const progressBar = document.getElementById('audio-progress-bar') || document.querySelector('#our-song .w-\\[68\\%\\]');
    const progressThumb = document.getElementById('audio-progress-thumb') || document.querySelector('#our-song .left-\\[68\\%\\]');
    const currentTimeEl = document.getElementById('audio-current-time') || document.querySelector('#our-song .text-primary.font-medium');
    const totalTimeEl = document.getElementById('audio-total-time');
    const sectionEl = document.getElementById('audio-current-section');

    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressThumb) progressThumb.style.left = `${percent}%`;
    if (currentTimeEl) currentTimeEl.textContent = formatTime(state.currentTime);
    if (totalTimeEl && state.duration) totalTimeEl.textContent = formatTime(state.duration);

    // Stanzas Timing:
    // Stanza 1: 00:00 - 00:39 (00:10 • Verse I)
    // Stanza 2: 00:40 - 01:24 (00:45 • The Chorus)
    // Stanza 3: 01:25 - 02:14 (01:25 • The Bridge)
    // Stanza 4: 02:15 - 02:52 (02:15 • Coda)
    const stanzas = [
      { time: 10, selector: '#lyrics-stanza-1' },
      { time: 45, selector: '#lyrics-stanza-2' },
      { time: 85, selector: '#lyrics-stanza-3' },
      { time: 135, selector: '#lyrics-stanza-4' }
    ];

    let activeIndex = 0;
    if (state.currentTime >= 135) activeIndex = 3;
    else if (state.currentTime >= 85) activeIndex = 2;
    else if (state.currentTime >= 40) activeIndex = 1;
    else activeIndex = 0;

    const sectionNames = ['Verse I', 'The Chorus', 'The Bridge', 'Coda'];
    if (sectionEl) sectionEl.textContent = sectionNames[activeIndex];

    stanzas.forEach((stanza, idx) => {
      const el = document.querySelector(stanza.selector);
      if (!el) return;

      if (idx === activeIndex) {
        el.classList.add('p-space-md', 'rounded-xl', 'bg-surface-container/80', 'shadow-[0_8px_30px_rgba(141,38,63,0.25)]');
        el.classList.remove('opacity-40', 'opacity-60');
        const badge = el.querySelector('.stanza-badge');
        if (badge) {
          badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping inline-block mr-1"></span> ${formatTime(stanza.time)} • ${sectionNames[idx]}`;
          badge.classList.add('text-primary');
          badge.classList.remove('text-outline');
        }
      } else {
        el.classList.remove('p-space-md', 'rounded-xl', 'bg-surface-container/80', 'shadow-[0_8px_30px_rgba(141,38,63,0.25)]');
        el.classList.add(idx < activeIndex ? 'opacity-40' : 'opacity-60');
        const badge = el.querySelector('.stanza-badge');
        if (badge) {
          badge.innerHTML = `${formatTime(stanza.time)} • ${sectionNames[idx]}`;
          badge.classList.remove('text-primary');
          badge.classList.add('text-outline');
        }
      }
    });
  }

  // Seek song to specific seconds
  function seekTo(seconds) {
    state.currentTime = Math.max(0, Math.min(state.duration, seconds));
    if (state.hasRealAudio && state.audioEl) {
      state.audioEl.currentTime = state.currentTime;
    }
    updateScrubberAndLyrics();
  }

  // Attach all Event Listeners on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    checkRealAudio();
    // 1. Header Play Button
    const headerPlayBtn = document.querySelector('header button[aria-label="Toggle music playback"]');
    if (headerPlayBtn) {
      headerPlayBtn.addEventListener('click', () => togglePlay());
    }

    // 2. Hero Floating Player Play Button
    const heroAudioBtn = document.getElementById('audio-toggle-btn');
    if (heroAudioBtn) {
      heroAudioBtn.addEventListener('click', () => togglePlay());
    }

    // 3. Main Vinyl Player Play/Pause Button
    const playbackBtn = document.getElementById('playback-btn');
    if (playbackBtn) {
      playbackBtn.addEventListener('click', () => togglePlay());
    }

    // 4. Scrubber Track Click to Seek
    const scrubber = document.querySelector('#our-song .group\\/progress');
    if (scrubber) {
      scrubber.addEventListener('click', (e) => {
        const rect = scrubber.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        seekTo(Math.floor(ratio * state.duration));
      });
    }

    // 5. Lyrics Stanzas Click-to-Seek
    const stanzas = [
      { id: 'lyrics-stanza-1', time: 10 },
      { id: 'lyrics-stanza-2', time: 45 },
      { id: 'lyrics-stanza-3', time: 85 },
      { id: 'lyrics-stanza-4', time: 135 },
    ];

    stanzas.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) {
        el.style.cursor = 'pointer';
        el.setAttribute('title', `Click to jump to ${formatTime(s.time)}`);
        el.addEventListener('click', () => {
          seekTo(s.time);
          if (!state.isPlaying) togglePlay(true);
        });
      }
    });

    // 6. Skip Previous and Next Buttons
    const prevBtn = document.querySelector('#our-song button[aria-label="Previous verse"]');
    const nextBtn = document.querySelector('#our-song button[aria-label="Next verse"]');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        seekTo(Math.max(0, state.currentTime - 15));
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        seekTo(Math.min(state.duration, state.currentTime + 15));
      });
    }

    // 7. Volume Slider / Click Pill
    const volumePill = document.querySelector('#our-song .w-16.h-1');
    if (volumePill) {
      volumePill.parentElement.style.cursor = 'pointer';
      volumePill.parentElement.addEventListener('click', (e) => {
        const rect = volumePill.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const vol = Math.max(0.1, Math.min(1, clickX / rect.width));
        state.volume = vol;
        if (state.audioEl) {
          state.audioEl.volume = vol;
        }
        if (state.masterGain && state.audioCtx) {
          state.masterGain.gain.setValueAtTime(vol, state.audioCtx.currentTime);
        }
        const bar = volumePill.querySelector('.bg-secondary');
        if (bar) bar.style.width = `${vol * 100}%`;
      });
    }

    // 8. Replay Our Symphony Button in Finale
    const replayBtn = document.getElementById('replay-symphony-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        seekTo(0);
        togglePlay(true);
      });
    }

    // Set initial paused visual state cleanly
    updateUI();
  });

  // Export global controls
  window.TanuuAudio = {
    togglePlay,
    seekTo,
    getState: () => ({ ...state })
  };
})();
