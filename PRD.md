# Product Requirements Document: Valentine's Day Proposal Website

## 1. Overview

### 1.1 Purpose
A romantic single-page web application designed to ask someone to be your Valentine through an interactive and playful experience.

### 1.2 Target User
One specific user (the girlfriend) accessing via a shared link.

### 1.3 Core Experience
A three-stage journey: CAPTCHA challenge → Valentine proposal → Celebration message

---

## 2. User Flow

```
Entry → CAPTCHA Page → Proposal Page → Congratulations Page
```

**Navigation Rules:**
- No back button functionality
- Linear progression only
- No way to skip stages
- Entire experience should feel cohesive and intentional

---

## 3. Page Specifications

### 3.1 Page 1: CAPTCHA Challenge

#### 3.1.1 Layout
- Clean, minimal design mimicking real CAPTCHA interfaces
- Centered content on neutral background (#f9f9f9 or similar)
- Google reCAPTCHA-style branding (but obviously fake/playful)

#### 3.1.2 Components

**Header Text:**
```
Please verify you are human
```

**Challenge Text:**
```
Select all squares containing the love of your life
```

**Image Grid:**
- 3x3 grid (9 squares total)
- 4-5 squares should contain photos of YOU (the boyfriend)
- 4-5 squares should contain other photos (landscapes, objects, other people)
- Each square should be clickable with visual feedback (border highlight when selected)
- Square dimensions: uniform sizing, responsive

**Verification Button:**
- "Verify" button below the grid
- Initially disabled/greyed out
- Enabled only when user has made selections

#### 3.1.3 Behavior
- User must select ALL squares containing photos of you
- If correct selections made → smooth transition to Proposal Page
- If incorrect → shake animation + error message: "Please try again" (don't reveal which ones are wrong)
- Selected squares show visual indicator (checkmark overlay or border)
- Allow unlimited attempts

#### 3.1.4 Technical Notes
- Images should be stored in `/assets/captcha/` folder
- You'll provide: `boyfriend-1.jpg` through `boyfriend-5.jpg` and `other-1.jpg` through `other-4.jpg`
- Images should be preloaded for smooth experience

---

### 3.2 Page 2: Valentine Proposal

#### 3.2.1 Layout
- Romantic, warm design with soft colors
- Gradient background (soft pinks, reds, or warm tones)
- Centered content with ample white space
- Floating hearts or subtle animations (CSS animations)

#### 3.2.2 Components

**Main Heading:**
```
Will you be my Valentine?
```
- Large, elegant font (serif or romantic script)
- Prominent placement at top-center
- Consider subtle animations (fade in, gentle pulse)

**Subtext (Optional):**
```
The answer seems pretty obvious after that CAPTCHA... 
```
- Smaller, playful font
- Light humor to maintain warmth

**Yes Button:**
- Large, prominent button
- Text: "Yes! 💕" or "Of course!"
- Primary accent color (pink/red)
- Hover effects (scale slightly, glow)
- Fixed position, always centered

**No Button:**
- Smaller than Yes button initially
- Text: "No" or "Not really"
- Secondary/neutral color
- **Special Behavior:** (choose ONE implementation)

#### 3.2.3 "No" Button Mechanics (Choose One)

**Option A: Mouse Evasion**
- Button moves away from cursor when mouse gets within 100px radius
- Moves to random position on screen
- Never overlaps with Yes button
- Smoothly animated movement (200-300ms transitions)
- Gets progressively harder (moves faster after each attempt)

**Option B: Shrinking Button**
- Button shrinks by 10-15% each time it's hovered over
- After 5-6 hovers, becomes too small to click (1-2px)
- Optional: disappears entirely with a poof animation

**Option C: Running Away Button**
- Button runs to opposite side of screen when cursor approaches
- Accelerates if user gets close multiple times
- Eventually runs off-screen entirely
- After disappearing, show message: "The 'No' option has left the building"

**Recommended: Option A** (most playful and interactive)

#### 3.2.4 Page Behavior
- Page is fullscreen and responsive
- Background animations (floating hearts, sparkles)
- When Yes clicked → confetti animation → transition to Congratulations Page
- Music/sound optional (can be muted button in corner)

#### 3.2.5 Technical Notes
- Use CSS transforms for smooth button movements
- Track mouse position with JavaScript event listeners
- Debounce mouse tracking for performance
- Ensure mobile responsiveness (touch events for "No" button)

---

### 3.3 Page 3: Congratulations

#### 3.3.1 Layout
- Celebratory, romantic design
- Rich, warm color scheme (deeper reds/pinks or elegant dark theme with gold accents)
- Full-screen confetti animation on entry (fades after 3-5 seconds)
- Scrollable content area for long message

#### 3.3.2 Components

**Header:**
```
I knew you'd say yes! 💖
```
- Large, joyful typography
- Animation on entry (scale + fade in)

**Message Container:**
- Clean, readable content area
- Maximum width: 700px, centered
- Padding for comfortable reading
- Semi-transparent background card for text contrast

**Personal Message:**
```
[PLACEHOLDER: Long personal message goes here]

This will be replaced with your actual heartfelt message.
Recommended length: 200-500 words
```

- Use placeholder text formatted nicely
- Should support:
  - Line breaks
  - Paragraphs
  - Basic formatting (bold, italic if needed)
  - Emojis

**Optional Elements:**
- Photo gallery/slideshow of you together
- "Save this moment" button (generates screenshot or downloads page)
- Animated hearts or romantic elements
- Soft background music player (with mute option)

#### 3.3.3 Technical Notes
- Content should be in editable HTML/Markdown format
- You'll replace the placeholder with your actual message
- Consider using a nice serif or romantic font
- Ensure mobile scrolling works smoothly

---

## 4. Technical Requirements

### 4.1 Technology Stack
**Recommended:**
- Pure HTML/CSS/JavaScript (no framework dependencies)
- Alternative: React or Vue if agent prefers

### 4.2 File Structure
```
/valentine-website
  /index.html
  /styles.css
  /script.js
  /assets
    /captcha
      boyfriend-1.jpg to boyfriend-5.jpg
      other-1.jpg to other-4.jpg
    /confetti.js (library or custom)
  /README.md
```

### 4.3 Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (iOS Safari, Chrome Mobile)
- No IE11 support needed

### 4.4 Performance
- Total page load under 2 seconds
- Smooth animations (60fps)
- Preload all images on first page
- Optimize image sizes (compress without quality loss)

### 4.5 Libraries (Optional)
- **Confetti:** canvas-confetti or tsparticles
- **Animations:** anime.js or pure CSS
- **Icons/Emojis:** Native emoji or Font Awesome

---

## 5. Design Guidelines

### 5.1 Color Palette
**Primary Colors:**
- Romantic Red: #FF4757 or #E63946
- Soft Pink: #FFB3BA or #FFD6E8
- Warm Accent: #FFA07A or #FF6B9D

**Supporting Colors:**
- White: #FFFFFF
- Light Background: #FFF5F7
- Text: #2C3E50 or #4A4A4A

**Gradients:**
- Example: `linear-gradient(135deg, #FFB3BA 0%, #FF6B9D 100%)`

### 5.2 Typography
**Headings:**
- Font: Playfair Display, Cormorant Garamond, or Lora (serif)
- Or: Pacifico, Dancing Script (script fonts)

**Body:**
- Font: Open Sans, Inter, or Roboto (sans-serif)
- Line height: 1.6-1.8 for readability

**Sizes:**
- H1: 48-64px (desktop) / 32-40px (mobile)
- H2: 32-40px (desktop) / 24-28px (mobile)
- Body: 16-18px
- Small text: 14px

### 5.3 Animation Principles
- Smooth, gentle animations (avoid jarring movements)
- Use easing functions: `ease-in-out` or `cubic-bezier`
- Duration: 200-500ms for interactions, 1-2s for entrances
- Respect `prefers-reduced-motion` for accessibility

### 5.4 Romantic Elements
- Floating hearts (SVG or Unicode)
- Subtle sparkle effects
- Soft shadows and glows
- Rounded corners on buttons and cards
- Gentle pulse animations

---

## 6. Content Placeholders

### 6.1 Images to Provide
**Boyfriend Photos (5):**
- `boyfriend-1.jpg` to `boyfriend-5.jpg`
- Preferred: Clear, recognizable photos
- Square crop recommended (1:1 ratio)
- Optimized size: 400x400px

**Other Photos (4):**
- `other-1.jpg` to `other-4.jpg`
- Nature, objects, random people
- Same dimensions as boyfriend photos

### 6.2 Text Content
**Congratulations Message:**
- Location in code clearly marked with:
  ```html
  <!-- REPLACE WITH YOUR MESSAGE -->
  ```
- Support for multi-paragraph format
- Include placeholder romantic text for testing

---

## 7. Behavior & Edge Cases

### 7.1 CAPTCHA Page
- **All correct:** Proceed to next page
- **Some wrong:** Show error, allow retry
- **None selected:** Disable verify button
- **Too many attempts:** Optional hint after 3 failures

### 7.2 Proposal Page
- **Yes clicked:** Confetti → transition (1-2 second delay)
- **No button escape:** Track attempts, increase difficulty
- **Mobile touch:** Ensure "No" button works on touch screens
- **Window resize:** Reposition "No" button if needed

### 7.3 Congratulations Page
- **Long message:** Ensure smooth scrolling
- **Replay:** Optional button to restart experience
- **Share:** Optional "Save" or "Screenshot" feature

### 7.4 Accessibility Considerations
- Alt text for all images
- Keyboard navigation support (Tab, Enter)
- Semantic HTML (headings, buttons, sections)
- Color contrast ratios meet WCAA AA standards
- Optional: respect `prefers-reduced-motion`

---

## 8. Deployment Notes

### 8.1 Hosting Options
- **Recommended:** Netlify, Vercel, or GitHub Pages (free, simple)
- Single HTML file option for easy sharing
- Custom domain optional (youandme.love, etc.)

### 8.2 Security & Privacy
- No data collection
- No analytics needed
- No form submissions
- Static site only

### 8.3 Testing Checklist
- [ ] All images load correctly
- [ ] CAPTCHA validation works
- [ ] "No" button behavior is smooth and fun
- [ ] "Yes" button leads to congratulations
- [ ] Confetti animation works
- [ ] Message displays correctly with formatting
- [ ] Mobile responsive on various screen sizes
- [ ] Works in different browsers
- [ ] All transitions are smooth
- [ ] No console errors

---

## 9. Future Enhancements (Optional)

- Photo gallery carousel on congratulations page
- Background music toggle
- "Save this moment" screenshot feature
- Share to social media (with privacy controls)
- Countdown timer to Valentine's Day
- Interactive photo booth effect
- Augmented reality rose overlay (WebAR)

---

## 10. Success Criteria

**Primary Goals:**
✅ She completes the CAPTCHA successfully
✅ She laughs at the "No" button behavior
✅ She clicks "Yes"
✅ She reads your heartfelt message
✅ She says yes in real life! 💕

**Technical Goals:**
✅ Zero bugs or broken interactions
✅ Smooth, romantic user experience
✅ Fast load times
✅ Works on her device (test beforehand!)

---

## Appendix A: Sample Code Structure

### Page State Management
```javascript
const pages = {
  CAPTCHA: 'captcha',
  PROPOSAL: 'proposal',
  CONGRATS: 'congrats'
};

let currentPage = pages.CAPTCHA;

function showPage(page) {
  // Hide all pages
  // Show requested page
  // Play transition animation
}
```

### No Button Evasion (Sample)
```javascript
const noButton = document.getElementById('no-btn');
const yesButton = document.getElementById('yes-btn');

document.addEventListener('mousemove', (e) => {
  const noRect = noButton.getBoundingClientRect();
  const distance = Math.hypot(
    e.clientX - (noRect.left + noRect.width / 2),
    e.clientY - (noRect.top + noRect.height / 2)
  );
  
  if (distance < 100) {
    // Move button to random position
    moveToRandomPosition(noButton);
  }
});
```

---

**Document Version:** 1.0  
**Created:** February 2026  
**For:** Valentine's Day Website Implementation  
**Status:** Ready for Development

---

## Notes to Developer Agent

This PRD provides complete specifications for building a romantic, interactive Valentine's Day proposal website. Please:

1. Implement all three pages as specified
2. Use the recommended "No" button evasion strategy (Option A)
3. Mark placeholder locations clearly for image and message insertion
4. Test thoroughly on both desktop and mobile
5. Optimize for a smooth, romantic user experience
6. Add comments in code for easy customization

**Priority:** The experience should feel magical, romantic, and fun - not buggy or frustrating. Polish the animations and interactions to perfection!