# 💖 Valentine's Day Proposal Website

A romantic, interactive single-page web application designed to ask someone to be your Valentine through a playful three-stage experience.

## ✨ Features

### 🔒 Stage 1: CAPTCHA Challenge
- Google reCAPTCHA-inspired design with a romantic twist
- 3×3 image grid with randomized positions
- "Select all squares containing the **love of your life**"
- Shake animation on wrong answers, hint after 3 failures
- Smooth transition on success

### 💗 Stage 2: Valentine Proposal
- "Will you be my Valentine?" with elegant serif typography
- Floating heart emoji animations in the background
- **"No" button evasion** — the button runs away from your cursor!
  - Gets progressively harder to click
  - Eventually disappears: *"The 'No' option has left the building 🚪💨"*
- Pulsing "Yes! 💕" button with glow effects

### 🎉 Stage 3: Congratulations
- Custom canvas confetti explosion on entry
- Elegant dark theme with glassmorphism message card
- Heartfelt personal message (fully customisable)
- "Start over?" button to replay the experience

## 🛠 Tech Stack

- **Pure HTML/CSS/JavaScript** — zero dependencies
- Custom canvas-based confetti engine
- CSS animations & transitions
- Responsive design (mobile + desktop)
- Accessible (ARIA attributes, keyboard navigation, `prefers-reduced-motion`)

## 📁 Project Structure

```
valentine-website/
├── index.html              # Main SPA page
├── styles.css              # Complete design system
├── script.js               # CAPTCHA, evasion, confetti logic
├── assets/
│   └── captcha/
│       ├── boyfriend-1.png  # Replace with YOUR photos
│       ├── boyfriend-2.png
│       ├── boyfriend-3.png
│       ├── boyfriend-4.png
│       ├── boyfriend-5.png
│       ├── other-1.png      # Distractor images
│       ├── other-2.png
│       ├── other-3.png
│       └── other-4.png
├── PRD.md                  # Product requirements
└── README.md               # This file
```

## 🚀 Getting Started

### 1. Replace Placeholder Images
Swap the images in `assets/captcha/` with your own:
- `boyfriend-1.png` through `boyfriend-5.png` → Clear photos of **you**
- `other-1.png` through `other-4.png` → Random photos (landscapes, food, pets, etc.)

> **Tip:** Square images (1:1 ratio) around 400×400px work best.

### 2. Write Your Personal Message
Open `index.html` and find the section marked:
```html
<!-- REPLACE WITH YOUR MESSAGE -->
```
Edit the `<p>` tags inside the `.message-card` div with your heartfelt message.

### 3. Preview Locally
Simply open `index.html` in any modern browser:
```bash
open index.html
```

### 4. Deploy
Host on any static site platform:
- **GitHub Pages** — Push to a repo and enable Pages
- **Netlify** — Drag and drop the folder
- **Vercel** — `npx vercel .`

## 🎨 Customisation

### Colors
Edit the CSS custom properties in `styles.css` under `:root`:
```css
--romantic-red: #E63946;
--soft-pink: #FFD6E8;
--warm-accent: #FF6B9D;
```

### Fonts
The site uses Google Fonts:
- **Headings:** Playfair Display (serif)
- **Script/Signature:** Dancing Script (cursive)
- **Body:** Inter (sans-serif)

### "No" Button Behavior
The evasion parameters can be tuned in `script.js`:
```javascript
const MAX_EVADE_BEFORE_GONE = 8; // Attempts before button disappears
const detectionRadius = Math.max(60, 120 - noEvadeAttempts * 5);
```

## 📱 Browser Support
- ✅ Chrome, Firefox, Safari, Edge (latest)
- ✅ iOS Safari, Chrome Mobile
- ✅ Responsive from 320px to ultrawide

## 📝 License
This is a personal project made with love. Use it however you like! 💕
