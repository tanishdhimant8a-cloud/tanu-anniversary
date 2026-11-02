# Tanuu — A Year of Us
### Romantic First-Anniversary Retrospective Website

A luxury, dark-editorial romantic retrospective website built for Tanuu's first anniversary. Inspired directly by high-fashion editorial publishing, fine-art 35mm film photography, and nocturnal glassmorphism aesthetics from the Google Stitch designs.

---

## ✨ Features & Chapters

1. **Chapter I • The Prologue**
   - Private dedication banner with gold shimmer border and "Open Your Surprise" invitation CTA.
2. **Chapter II • The Grand Anniversary Hero**
   - Monogram T&T crest, archival badges, 3 Milestones (365 Days, 8,760 Hours, $\infty$ Moments of Love).
   - Real-time live elapsed clock ticking dynamically every second.
   - Cinematic Photo Monument with warm candlelight glow and archival stamps.
   - Floating Keepsake Audio Player with animated soundwaves.
3. **Chapter III • The Journey (Timeline)**
   - Luminous central vertical axis with 4 seasonal milestones (The First Spark, When Time Stood Still, Finding Home in You, A Year of Unconditional Love).
4. **Chapter IV • Our Memory Vault (Gallery)**
   - Interactive category filtering (All Frames, Candid, Journeys, Motion).
   - 6 Asymmetric Bento Cards (Kodak 35mm film strip, instant Polaroid with handwritten note, motion film .mov card, evening gala, hand macro, and rainy candid).
   - Interactive Memory Modal with high-res photo, title, tags, date, story description, and functional **Cherish** button.
   - "Unlock Full Archive" private keepsake vault modal with secret memories.
5. **Chapter V • The Soundtrack of Us (Vinyl Audio Suite)**
   - Realistic spinning vinyl record with concentric SVG grooves, center label, and tonearm.
   - Luxury framed album artwork: *Until I Found You (Instrumental) — Orchestral Acoustic Strings • Con Moto • In Tanuu's Key*.
   - Dynamic 27-bar audio equalizer and interactive seek scrubber.
   - **Authentic Soundtrack Playback**: Plays the user's authentic uploaded audio (`assets/audio/our-song.aac`, `our-song.mp4`, `our-song.m4a`, 02:52 duration) with Web Audio synthesizer fallback in 432Hz.
   - Synchronized lyrics stream with active verse highlighting (*"I would never fall in love until I found her..."*) and click-to-seek functionality.
6. **Chapter VI • A Letter for My Tanuu**
   - Parchment folio card with candlelight glow and floating rose petal silhouettes.
   - Complete personal heartfelt epistle from Tanish.
   - Interactive luxury burgundy wax seal emblem with tactile hover and click animation.
7. **Feature 1: Personal Voice Message**
   - Dedicated romantic audio player featuring Tanish's authentic 49-second personal voice recording (`assets/audio/my-voice-note.aac`, `my-voice-note.mp4`, `my-voice-note.mp3`).
   - Heart-shaped play/pause toggle button with pulse glow and active state.
   - 24-bar dynamic audio waveform with seek scrubber and replay function.
   - Exact runtime display (00:49) and caption: *"A little piece of my heart, just for you."*
8. **Feature 2: Our One-Year Anniversary Reel (9:16 Cinematic Photo Reel)**
   - 9:16 vertical player formatted for Instagram Reels featuring 14 curated high-resolution vertical photos (`reel-01.jpg` to `reel-14.jpg`).
   - Smooth Ken Burns zoom/pan transitions, synchronized captions, progress bar, slide counter, and opening/ending title cards (*"365 Days of Loving You"*, *"Happy First Anniversary, My Love"*).
   - **Soundtrack in the Background**: Plays your authentic romantic song (`our-song.aac` / `our-song.mp4`) seamlessly behind the photo slideshow with synchronized play/pause/replay controls.
9. **Chapter VII • Little Things That Make You Special**
   - 12 interactive cards (01 to 12) featuring custom icons, titles, and click-to-activate notes.
10. **Chapter VIII • My Promises (Unwavering Vows)**
    - 5 royal vow cards with glowing borders, icons, and hover states.
11. **Chapter IX • The Grand Finale**
    - Crescendo typography, arched portal portrait (*Amalfi Twilight*), proclamation banner, and Tanish signature.
    - **Replay Our Symphony ♫** button with floating hearts, sparkles, and rose petal celebration storm.
    - **Download Keepsake Memory Book**: Generates and prints an official *Certificate of Devoted Love* formatted for print/PDF.
12. **Ambient Rose Petals & Golden Embers Canvas**
    - Optimized HTML5 canvas with gentle drifting petals and firefly embers.

---

## 🚀 How to Run Locally

You can preview the website locally using any static web server:

```powershell
# Using Python
python -m http.server 8000

# Or using npx serve
npx serve .
```

Then open `http://localhost:8000` in your web browser.

---

## 🌐 GitHub Pages Deployment Guide

To deploy this website to GitHub Pages:

1. **Initialize Git Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Tanuu - A Year of Us"
   ```

2. **Create a GitHub Repository**:
   - Create a new public or private repository on [GitHub](https://github.com).
   - Link your local repository to GitHub:
     ```bash
     git remote add origin https://github.com/<your-username>/<repo-name>.git
     git branch -M main
     git push -u origin main
     ```

3. **Enable GitHub Pages**:
   - In your GitHub repository, navigate to **Settings** -> **Pages** (under Code and automation).
   - Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and folder `/ (root)`, then click **Save**.
   - Within 1–2 minutes, your website will be live at:
     `https://<your-username>.github.io/<repo-name>/`

---

## 📁 Project Structure

```
tanuu-anniversary/
├── index.html                   # Main semantic HTML structure
├── styles/
│   └── main.css                 # Custom typography, animations, glassmorphism, print styles
├── scripts/
│   ├── audio.js                 # Web Audio API "Until I Found You (Instrumental)" orchestral strings engine
│   ├── voice-player.js          # Feature 1: Personal voice note player with waveform
│   ├── reel-player.js           # Feature 2: 9:16 interactive cinematic reel engine
│   └── main.js                  # Navigation, modals, filter, celebration particles, timer
├── assets/
│   ├── audio/                   # Real audio files (`our-song.aac`, `our-song.mp4`, `our-song.m4a`, `my-voice-note.mp3`)
│   ├── videos/                  # Real anniversary reel (`anniversary-reel.mp4`)
│   ├── designs/                 # Reference screen captures from Google Stitch designs
│   └── images/
│       ├── optimized/           # Web-optimized editorial photos & milestones
│       │   └── reel/            # 14 curated 9:16 vertical reel slides
│       └── user_photos/         # Complete archive of 73 original photos
└── README.md                    # Documentation & deployment guide
```

---

*Dedicated to Tanuu with endless love by Tanish • 04.11.2026*
