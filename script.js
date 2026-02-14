/* ============================================================
 *  Valentine's Day Proposal Website — Main Script
 *  Three-stage SPA: CAPTCHA → Proposal → Congratulations
 * ============================================================ */

// ── Page State ────────────────────────────────────────────────
const Pages = Object.freeze({
  CAPTCHA: 'captcha-page',
  PROPOSAL: 'proposal-page',
  CONGRATS: 'congrats-page',
});

let currentPage = Pages.CAPTCHA;

// ── DOM References ────────────────────────────────────────────
const captchaPage      = document.getElementById('captcha-page');
const proposalPage     = document.getElementById('proposal-page');
const congratsPage     = document.getElementById('congrats-page');
const captchaGrid      = document.getElementById('captcha-grid');
const captchaContainer = document.getElementById('captcha-container');
const verifyBtn        = document.getElementById('captcha-verify-btn');
const captchaError     = document.getElementById('captcha-error');
const captchaHint      = document.getElementById('captcha-hint');
const yesBtn           = document.getElementById('yes-btn');
const noBtn            = document.getElementById('no-btn');
const noGoneMsg        = document.getElementById('no-gone-msg');
const heartsContainer  = document.getElementById('hearts-container');
const confettiCanvas   = document.getElementById('confetti-canvas');
const replayBtn        = document.getElementById('replay-btn');
const envelopeWrapper  = document.getElementById('envelope-wrapper');
const envelopePrompt   = document.getElementById('envelope-prompt');
const messageCard      = document.getElementById('message-card');
const starfieldCanvas  = document.getElementById('starfield-canvas');

// ── CAPTCHA Configuration ─────────────────────────────────────
const CAPTCHA_IMAGES = [
  { src: 'assets/captcha/boyfriend-1.jpg', isTarget: true,  alt: 'Photo candidate 1' },
  { src: 'assets/captcha/boyfriend-2.jpg', isTarget: true,  alt: 'Photo candidate 2' },
  { src: 'assets/captcha/boyfriend-3.jpg', isTarget: true,  alt: 'Photo candidate 3' },
  { src: 'assets/captcha/boyfriend-4.jpg', isTarget: true,  alt: 'Photo candidate 4' },
  { src: 'assets/captcha/other-1.jpg',     isTarget: false, alt: 'Photo candidate 5' },
  { src: 'assets/captcha/other-2.jpg',     isTarget: false, alt: 'Photo candidate 6' },
  { src: 'assets/captcha/other-3.jpg',     isTarget: false, alt: 'Photo candidate 7' },
  { src: 'assets/captcha/other-4.jpg',     isTarget: false, alt: 'Photo candidate 8' },
  { src: 'assets/captcha/other-5.jpg',     isTarget: false, alt: 'Photo candidate 9' },
];

let selectedCells = new Set();
let failureCount = 0;

// ================================================================
//  PAGE NAVIGATION
// ================================================================

/**
 * Transition to a specific page with fade animation.
 * @param {string} pageId - The page ID to show.
 */
function showPage(pageId) {
  // Deactivate all pages
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));

  // Activate requested page
  const target = document.getElementById(pageId);
  if (target) {
    // Small delay for CSS transition to pick up the class removal
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.classList.add('active');
      });
    });
  }

  currentPage = pageId;
}

// ================================================================
//  PAGE 1 — CAPTCHA
// ================================================================

/**
 * Shuffle an array in-place using Fisher-Yates algorithm.
 * @param {Array} arr
 * @returns {Array} The shuffled array
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build the 3×3 CAPTCHA grid with randomized image positions.
 */
function initCaptchaGrid() {
  captchaGrid.innerHTML = '';
  selectedCells.clear();
  updateVerifyButton();

  // Shuffle images for random layout each time
  const shuffled = shuffleArray([...CAPTCHA_IMAGES]);

  shuffled.forEach((imgData, index) => {
    const cell = document.createElement('div');
    cell.classList.add('captcha-cell');
    cell.setAttribute('role', 'checkbox');
    cell.setAttribute('aria-checked', 'false');
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('aria-label', imgData.alt);
    cell.dataset.index = index;
    cell.dataset.isTarget = imgData.isTarget;

    const img = document.createElement('img');
    img.src = imgData.src;
    img.alt = imgData.alt;
    img.draggable = false;
    img.loading = 'eager';

    // Checkmark overlay
    const checkOverlay = document.createElement('div');
    checkOverlay.classList.add('check-overlay');
    checkOverlay.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    `;

    cell.appendChild(img);
    cell.appendChild(checkOverlay);
    captchaGrid.appendChild(cell);

    // Click handler
    cell.addEventListener('click', () => toggleCell(cell, index));

    // Keyboard support (Enter/Space)
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCell(cell, index);
      }
    });
  });
}

/**
 * Toggle a CAPTCHA cell selection.
 * @param {HTMLElement} cell
 * @param {number} index
 */
function toggleCell(cell, index) {
  if (selectedCells.has(index)) {
    selectedCells.delete(index);
    cell.classList.remove('selected');
    cell.setAttribute('aria-checked', 'false');
  } else {
    selectedCells.add(index);
    cell.classList.add('selected');
    cell.setAttribute('aria-checked', 'true');
  }
  updateVerifyButton();

  // Hide error when user makes a new selection
  captchaError.classList.remove('visible');
}

/**
 * Enable or disable the verify button based on selections.
 */
function updateVerifyButton() {
  verifyBtn.disabled = selectedCells.size === 0;
}

/**
 * Verify the user's CAPTCHA selections.
 */
function verifyCaptcha() {
  const cells = captchaGrid.querySelectorAll('.captcha-cell');
  let allCorrect = true;

  cells.forEach((cell) => {
    const index = parseInt(cell.dataset.index);
    const isTarget = cell.dataset.isTarget === 'true';
    const isSelected = selectedCells.has(index);

    // A correct answer means: selected if target, not selected if not target
    if (isTarget !== isSelected) {
      allCorrect = false;
    }
  });

  if (allCorrect) {
    // ✅ Success → transition to Proposal page
    captchaContainer.style.transition = 'transform 400ms ease, opacity 400ms ease';
    captchaContainer.style.transform = 'scale(0.95)';
    captchaContainer.style.opacity = '0';

    setTimeout(() => {
      showPage(Pages.PROPOSAL);
      startFloatingHearts();
    }, 500);
  } else {
    // ❌ Wrong → shake + show error with escalating messages
    failureCount++;
    captchaContainer.classList.add('shake');

    // Cycle through different messages per attempt
    const messages = [
      "Hmm, that's not right. Try again",
      "Umm ... come on now",
      "Ok now i'm offended 💔",
    ];
    const msgIndex = Math.min(failureCount - 1, messages.length - 1);
    captchaError.textContent = messages[msgIndex];
    captchaError.classList.add('visible');

    // Show hint on every failure
    captchaHint.classList.add('visible');

    // Remove shake class after animation completes
    setTimeout(() => captchaContainer.classList.remove('shake'), 500);
  }
}

// Wire up verify button
verifyBtn.addEventListener('click', verifyCaptcha);

// ================================================================
//  PAGE 2 — PROPOSAL (Floating Hearts & No Button Evasion)
// ================================================================

// ── Floating Hearts ───────────────────────────────────────────

const HEART_EMOJIS = ['💗', '💕', '💖', '❤️', '💘', '💝', '🩷', '♥️'];
let heartInterval = null;

/**
 * Spawn floating heart elements in the background.
 */
function startFloatingHearts() {
  if (heartInterval) return;

  function spawnHeart() {
    const heart = document.createElement('span');
    heart.classList.add('floating-heart');
    heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];

    // Random horizontal position
    heart.style.left = Math.random() * 100 + '%';

    // Random animation duration (6–14 seconds)
    const duration = 6 + Math.random() * 8;
    heart.style.animationDuration = duration + 's';

    // Random delay
    heart.style.animationDelay = Math.random() * 2 + 's';

    // Random size
    const size = 0.8 + Math.random() * 1.5;
    heart.style.fontSize = size + 'rem';

    heartsContainer.appendChild(heart);

    // Remove after animation completes
    setTimeout(() => heart.remove(), (duration + 2) * 1000);
  }

  // Spawn hearts periodically
  heartInterval = setInterval(spawnHeart, 400);

  // Spawn a few immediately
  for (let i = 0; i < 8; i++) {
    setTimeout(spawnHeart, i * 200);
  }
}

/**
 * Stop spawning floating hearts and clear existing ones.
 */
function stopFloatingHearts() {
  if (heartInterval) {
    clearInterval(heartInterval);
    heartInterval = null;
  }
}

// ── No Button Evasion (Option A: Mouse Evasion) ──────────────

let noEvadeAttempts = 0;
const MAX_EVADE_BEFORE_GONE = 8; // After this many evasions, button disappears
let noButtonGone = false;

/**
 * Move the "No" button to a random position away from the cursor.
 * @param {MouseEvent|TouchEvent} e
 */
function evadeNoButton(e) {
  if (noButtonGone) return;

  const noBtnRect = noBtn.getBoundingClientRect();
  const btnCenterX = noBtnRect.left + noBtnRect.width / 2;
  const btnCenterY = noBtnRect.top + noBtnRect.height / 2;

  let clientX, clientY;
  if (e.touches) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  const distance = Math.hypot(clientX - btnCenterX, clientY - btnCenterY);

  // Detection radius shrinks as attempts increase (gets harder)
  const detectionRadius = Math.max(60, 120 - noEvadeAttempts * 5);

  if (distance < detectionRadius) {
    noEvadeAttempts++;

    // After MAX attempts, remove the button entirely
    if (noEvadeAttempts >= MAX_EVADE_BEFORE_GONE) {
      noBtn.style.transition = 'transform 400ms ease, opacity 400ms ease';
      noBtn.style.transform = 'scale(0)';
      noBtn.style.opacity = '0';
      noButtonGone = true;

      setTimeout(() => {
        noBtn.style.display = 'none';
        noGoneMsg.textContent = 'Feck Aff...';
        noGoneMsg.classList.add('visible');
      }, 400);

      return;
    }

    // Make button evade
    if (!noBtn.classList.contains('evading')) {
      noBtn.classList.add('evading');
    }

    // Calculate new random position (within viewport, avoiding Yes button)
    const padding = 20;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const btnW = noBtnRect.width;
    const btnH = noBtnRect.height;

    const yesRect = yesBtn.getBoundingClientRect();

    let newX, newY;
    let attempts = 0;

    do {
      newX = padding + Math.random() * (vw - btnW - padding * 2);
      newY = padding + Math.random() * (vh - btnH - padding * 2);
      attempts++;
    } while (
      // Ensure it doesn't overlap with the Yes button
      attempts < 50 &&
      newX < yesRect.right + 30 &&
      newX + btnW > yesRect.left - 30 &&
      newY < yesRect.bottom + 30 &&
      newY + btnH > yesRect.top - 30
    );

    // Speed up transition as attempts increase
    const transitionSpeed = Math.max(150, 300 - noEvadeAttempts * 15);
    noBtn.style.transition = `left ${transitionSpeed}ms cubic-bezier(0.68, -0.55, 0.265, 1.55), top ${transitionSpeed}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
  }
}

// Track mouse movement for No button evasion (debounced)
let lastEvadeCheck = 0;
document.addEventListener('mousemove', (e) => {
  if (currentPage !== Pages.PROPOSAL) return;

  const now = Date.now();
  if (now - lastEvadeCheck < 50) return; // Debounce to 50ms
  lastEvadeCheck = now;

  evadeNoButton(e);
});

// Touch support for mobile
document.addEventListener('touchmove', (e) => {
  if (currentPage !== Pages.PROPOSAL) return;
  evadeNoButton(e);
}, { passive: true });

// Also evade on touchstart (immediate reaction on mobile)
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  evadeNoButton(e);
}, { passive: false });

// ── Yes Button → Confetti + Transition ────────────────────────

yesBtn.addEventListener('click', () => {
  // Stop hearts
  stopFloatingHearts();

  // Launch confetti 🎉
  launchConfetti();

  // Transition to congratulations page after confetti launches
  setTimeout(() => {
    showPage(Pages.CONGRATS);
    // Start the starfield after page transitions in
    setTimeout(startStarfield, 700);
  }, 1200);

  // Stop confetti after a few seconds
  setTimeout(() => {
    stopConfetti();
  }, 5000);
});

// ================================================================
//  ENVELOPE INTERACTION
// ================================================================

let envelopeOpened = false;

/**
 * Handle clicking the envelope to reveal the love letter.
 */
function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  // Step 1: Open the flap (3D rotation)
  envelopeWrapper.classList.add('opened');

  // Step 2: After flap opens, collapse the envelope and show the message
  setTimeout(() => {
    // Hide the prompt text
    envelopePrompt.classList.add('hidden');

    // Collapse envelope out of the way
    envelopeWrapper.classList.add('revealed');

    // Reveal the message + gallery row
    showGallery();
    messageCard.classList.add('revealing');

    // Start the typewriter effect after the card reveal animation
    setTimeout(() => {
      startTypewriter(() => {
        // Callback: show replay button after typing finishes
        replayBtn.classList.remove('hidden');
      });
    }, 600);
  }, 900);
}

// Click handler
envelopeWrapper.addEventListener('click', openEnvelope);

// Keyboard support (Enter/Space)
envelopeWrapper.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openEnvelope();
  }
});

// ================================================================
//  CONFETTI ENGINE (Lightweight custom canvas implementation)
// ================================================================

const ctx = confettiCanvas.getContext('2d');
let confettiPieces = [];
let confettiAnimationId = null;

const CONFETTI_COLORS = [
  '#E63946', '#FF6B9D', '#FFB3BA', '#FFD6E8',
  '#FF4757', '#FF6348', '#FFA07A', '#FFFFFF',
  '#C2185B', '#F50057', '#FF80AB', '#FFCDD2',
];

/**
 * Resize canvas to fill viewport.
 */
function resizeConfettiCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeConfettiCanvas);
resizeConfettiCanvas();

/**
 * Create a single confetti piece.
 * @returns {Object} Confetti piece configuration
 */
function createConfettiPiece() {
  return {
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * confettiCanvas.height - confettiCanvas.height,
    w: 6 + Math.random() * 8,
    h: 4 + Math.random() * 6,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    velocityX: (Math.random() - 0.5) * 4,
    velocityY: 1.5 + Math.random() * 3,
    oscillateAmplitude: Math.random() * 3,
    oscillateSpeed: 0.02 + Math.random() * 0.03,
    phase: Math.random() * Math.PI * 2,
    opacity: 1,
  };
}

/**
 * Draw and animate all confetti pieces.
 */
function animateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiPieces.forEach((piece) => {
    piece.phase += piece.oscillateSpeed;
    piece.x += piece.velocityX + Math.sin(piece.phase) * piece.oscillateAmplitude;
    piece.y += piece.velocityY;
    piece.rotation += piece.rotationSpeed;

    // Fade out near bottom
    if (piece.y > confettiCanvas.height * 0.8) {
      piece.opacity = Math.max(0, 1 - (piece.y - confettiCanvas.height * 0.8) / (confettiCanvas.height * 0.2));
    }

    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate((piece.rotation * Math.PI) / 180);
    ctx.globalAlpha = piece.opacity;
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
    ctx.restore();
  });

  // Remove pieces that went off screen
  confettiPieces = confettiPieces.filter(
    (p) => p.y < confettiCanvas.height + 50 && p.opacity > 0.01
  );

  if (confettiPieces.length > 0) {
    confettiAnimationId = requestAnimationFrame(animateConfetti);
  }
}

/**
 * Launch a burst of confetti.
 */
function launchConfetti() {
  resizeConfettiCanvas();

  // Create 150 pieces
  for (let i = 0; i < 150; i++) {
    confettiPieces.push(createConfettiPiece());
  }

  // Secondary burst after a short delay
  setTimeout(() => {
    for (let i = 0; i < 80; i++) {
      confettiPieces.push(createConfettiPiece());
    }
  }, 400);

  if (!confettiAnimationId) {
    animateConfetti();
  }
}

/**
 * Stop confetti animation and clear the canvas.
 */
function stopConfetti() {
  // Let existing pieces fall, don't add more
  // They'll naturally fade and be removed by the filter
}

// ================================================================
//  STARFIELD ENGINE — Twinkling stars on congrats page
// ================================================================

const starCtx = starfieldCanvas.getContext('2d');
let stars = [];
let starAnimId = null;

/**
 * Resize the starfield canvas to match its section.
 */
function resizeStarfield() {
  const section = document.getElementById('congrats-page');
  starfieldCanvas.width = section.offsetWidth;
  starfieldCanvas.height = section.scrollHeight;
}

/**
 * Create the star array with randomized positions, sizes, and twinkle speeds.
 */
function createStars() {
  stars = [];
  const count = Math.min(200, Math.floor((starfieldCanvas.width * starfieldCanvas.height) / 4000));

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * starfieldCanvas.width,
      y: Math.random() * starfieldCanvas.height,
      radius: 0.4 + Math.random() * 1.8,
      baseAlpha: 0.3 + Math.random() * 0.7,
      alpha: 0,
      twinkleSpeed: 0.005 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
      // Some stars have a faint warm tint
      hue: Math.random() > 0.7 ? 340 + Math.random() * 40 : 0,
      saturation: Math.random() > 0.7 ? 30 + Math.random() * 40 : 0,
    });
  }
}

/**
 * Animation loop for twinkling stars.
 */
function animateStars() {
  starCtx.clearRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);

  stars.forEach((star) => {
    star.phase += star.twinkleSpeed;
    star.alpha = star.baseAlpha * (0.5 + 0.5 * Math.sin(star.phase));

    starCtx.beginPath();
    starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

    if (star.saturation > 0) {
      starCtx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, 85%, ${star.alpha})`;
    } else {
      starCtx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    }

    starCtx.fill();

    // Glow effect for larger stars
    if (star.radius > 1.2) {
      starCtx.beginPath();
      starCtx.arc(star.x, star.y, star.radius * 2.5, 0, Math.PI * 2);
      starCtx.fillStyle = `rgba(255, 255, 255, ${star.alpha * 0.12})`;
      starCtx.fill();
    }
  });

  starAnimId = requestAnimationFrame(animateStars);
}

/**
 * Start the starfield animation.
 */
function startStarfield() {
  if (starAnimId) return;
  resizeStarfield();
  createStars();
  animateStars();
}

/**
 * Stop the starfield animation.
 */
function stopStarfield() {
  if (starAnimId) {
    cancelAnimationFrame(starAnimId);
    starAnimId = null;
  }
  stars = [];
  starCtx.clearRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);
}

// Resize starfield when window resizes (debounced)
let starResizeTimer = null;
window.addEventListener('resize', () => {
  if (starResizeTimer) clearTimeout(starResizeTimer);
  starResizeTimer = setTimeout(() => {
    if (starAnimId) {
      resizeStarfield();
      createStars();
    }
  }, 250);
});

// ================================================================
//  TYPEWRITER EFFECT — Letter-by-letter message reveal
// ================================================================

let typewriterAbortController = null;

// Store original HTML at load time so replay can restore it
const typewriterOriginals = [];
document.addEventListener('DOMContentLoaded', () => {
  messageCard.querySelectorAll('.typewriter-line').forEach((line) => {
    typewriterOriginals.push({
      el: line,
      originalHTML: line.innerHTML,
      isInstant: line.hasAttribute('data-typewriter-instant'),
    });
  });
});

/**
 * Type out the love letter paragraphs one by one.
 * @param {Function} onComplete - Callback when all lines are typed.
 */
function startTypewriter(onComplete) {
  typewriterAbortController = new AbortController();
  const signal = typewriterAbortController.signal;

  // Clear all lines and prepare for typing
  const lineData = typewriterOriginals.map((orig) => {
    orig.el.innerHTML = '';
    orig.el.classList.add('typewriter-active');
    return { ...orig };
  });

  let currentLineIdx = 0;

  function typeNextLine() {
    if (signal.aborted) return;
    if (currentLineIdx >= lineData.length) {
      // All done
      if (onComplete) onComplete();
      return;
    }

    const data = lineData[currentLineIdx];
    currentLineIdx++;

    if (data.isInstant) {
      // Instant reveal (for dividers, etc.)
      data.el.innerHTML = data.originalHTML;
      setTimeout(typeNextLine, 300);
      return;
    }

    // Parse the original HTML to extract text nodes while preserving tags
    typeHTMLContent(data.el, data.originalHTML, signal, () => {
      // Small pause between paragraphs
      setTimeout(typeNextLine, 400);
    });
  }

  typeNextLine();
}

/**
 * Type out HTML content character by character, preserving tags.
 * @param {HTMLElement} el - The target element
 * @param {string} html - The original HTML string
 * @param {AbortSignal} signal - Abort signal
 * @param {Function} onDone - Callback when done
 */
function typeHTMLContent(el, html, signal, onDone) {
  // Parse the HTML to separate tags from text
  const segments = [];
  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      // Find end of tag
      const tagEnd = html.indexOf('>', i);
      if (tagEnd !== -1) {
        segments.push({ type: 'tag', content: html.substring(i, tagEnd + 1) });
        i = tagEnd + 1;
      } else {
        segments.push({ type: 'char', content: html[i] });
        i++;
      }
    } else {
      segments.push({ type: 'char', content: html[i] });
      i++;
    }
  }

  let built = '';
  let segIdx = 0;

  // Create cursor
  const cursor = document.createElement('span');
  cursor.classList.add('typewriter-cursor');

  // Typing speed: ~35ms per character (fast but readable)
  const BASE_SPEED = 30;

  function typeNext() {
    if (signal.aborted) return;

    if (segIdx >= segments.length) {
      // Done typing this line — remove cursor
      el.innerHTML = built;
      if (onDone) onDone();
      return;
    }

    const seg = segments[segIdx];
    segIdx++;

    if (seg.type === 'tag') {
      // Tags appear instantly
      built += seg.content;
      typeNext();
      return;
    }

    // It's a character
    built += seg.content;
    el.innerHTML = built;
    el.appendChild(cursor);

    // Variable speed: pause longer on punctuation
    let delay = BASE_SPEED + Math.random() * 20;
    if ('.!?,;:'.includes(seg.content)) {
      delay += 120;
    }

    setTimeout(typeNext, delay);
  }

  el.innerHTML = '';
  el.appendChild(cursor);
  setTimeout(typeNext, 200);
}

/**
 * Abort any running typewriter and restore all lines to their original state.
 */
function resetTypewriter() {
  if (typewriterAbortController) {
    typewriterAbortController.abort();
    typewriterAbortController = null;
  }

  // Restore original content and hide all lines
  typewriterOriginals.forEach((orig) => {
    orig.el.innerHTML = orig.originalHTML;
    orig.el.classList.remove('typewriter-active');
  });
}

// ================================================================
//  DUAL SIDE GALLERIES — Crossfade photo slideshows
// ================================================================

const messageGalleryRow = document.getElementById('message-gallery-row');
const galleryLeftTrack  = document.getElementById('gallery-left-track');
const galleryRightTrack = document.getElementById('gallery-right-track');

let leftSlideIdx  = 0;
let rightSlideIdx = 0;
let leftAutoPlayId  = null;
let rightAutoPlayId = null;

/**
 * Advance one side gallery to the next photo with crossfade.
 * @param {HTMLElement} track - The .side-gallery-track element
 * @param {'left'|'right'} side - Which gallery
 */
function advanceSideGallery(side) {
  const track = side === 'left' ? galleryLeftTrack : galleryRightTrack;
  if (!track) return;

  const slides = track.querySelectorAll('.side-gallery-slide');
  if (slides.length === 0) return;

  // Current index
  let idx = side === 'left' ? leftSlideIdx : rightSlideIdx;

  // Remove active from current
  slides[idx].classList.remove('active');

  // Advance to next
  idx = (idx + 1) % slides.length;

  // Set new active
  slides[idx].classList.add('active');

  // Store index
  if (side === 'left') leftSlideIdx = idx;
  else rightSlideIdx = idx;
}

/**
 * Start auto-play for both side galleries.
 * Staggered timing: left every 4s, right every 4s offset by 2s.
 */
function startSideGalleries() {
  stopSideGalleries();

  leftAutoPlayId = setInterval(() => advanceSideGallery('left'), 4000);

  // Stagger the right gallery by 2 seconds
  setTimeout(() => {
    rightAutoPlayId = setInterval(() => advanceSideGallery('right'), 4000);
  }, 2000);
}

/**
 * Stop auto-play for both galleries.
 */
function stopSideGalleries() {
  if (leftAutoPlayId)  { clearInterval(leftAutoPlayId);  leftAutoPlayId = null; }
  if (rightAutoPlayId) { clearInterval(rightAutoPlayId); rightAutoPlayId = null; }
}

/**
 * Show the message + gallery row with animation.
 */
function showGallery() {
  messageGalleryRow.classList.remove('hidden');
  startSideGalleries();
}

/**
 * Reset gallery to initial hidden state.
 */
function resetGallery() {
  stopSideGalleries();
  messageGalleryRow.classList.add('hidden');

  // Reset both galleries to first slide
  [galleryLeftTrack, galleryRightTrack].forEach((track) => {
    if (!track) return;
    const slides = track.querySelectorAll('.side-gallery-slide');
    slides.forEach((s, i) => s.classList.toggle('active', i === 0));
  });
  leftSlideIdx = 0;
  rightSlideIdx = 0;
}

// ================================================================
//  REPLAY FUNCTIONALITY
// ================================================================

replayBtn.addEventListener('click', () => {
  // Hide replay button immediately
  replayBtn.classList.add('hidden');
  // Reset all state
  failureCount = 0;
  noEvadeAttempts = 0;
  noButtonGone = false;
  selectedCells.clear();

  // Reset No button
  noBtn.style.display = '';
  noBtn.style.transform = '';
  noBtn.style.opacity = '';
  noBtn.style.transition = '';
  noBtn.style.left = '';
  noBtn.style.top = '';
  noBtn.classList.remove('evading');
  noGoneMsg.textContent = '';
  noGoneMsg.classList.remove('visible');

  // Reset captcha container styles
  captchaContainer.style.transition = '';
  captchaContainer.style.transform = '';
  captchaContainer.style.opacity = '';

  // Hide error and hint
  captchaError.classList.remove('visible');
  captchaHint.classList.remove('visible');

  // Reset envelope state
  envelopeOpened = false;
  envelopeWrapper.classList.remove('opened', 'revealed');
  envelopePrompt.classList.remove('hidden');
  messageCard.classList.remove('revealing');

  // Reset typewriter
  resetTypewriter();

  // Reset gallery
  resetGallery();

  // Reset starfield
  stopStarfield();

  // Rebuild grid
  initCaptchaGrid();

  // Clear confetti
  confettiPieces = [];
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
  }

  // Stop hearts
  stopFloatingHearts();
  heartsContainer.innerHTML = '';

  // Navigate back to CAPTCHA
  showPage(Pages.CAPTCHA);
});

// ================================================================
//  INITIALIZATION
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  initCaptchaGrid();
});
