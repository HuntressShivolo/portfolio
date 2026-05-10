// ─────────────────────────────────────────────
//  Laina Shivolo Portfolio — app.js
// ─────────────────────────────────────────────

// ── 1. CUSTOM CURSOR ──────────────────────────
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .project-card, .badge-item, .skill-category, .stat-box, .social-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.classList.add('hovered');
    cursorRing.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('hovered');
    cursorRing.classList.remove('hovered');
  });
});


// ── 2. CONSTELLATION BACKGROUND ───────────────
const canvas = document.getElementById('constellation');
const ctx    = canvas.getContext('2d');
let cW, cH, stars = [], mX = 0, mY = 0;

function resizeCanvas() {
  cW = canvas.width  = window.innerWidth;
  cH = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); buildStars(); });
document.addEventListener('mousemove', e => { mX = e.clientX; mY = e.clientY; });

function buildStars() {
  stars = [];
  for (let i = 0; i < 110; i++) {
    stars.push({
      x: Math.random() * cW,
      y: Math.random() * cH,
      r: Math.random() * 1.3 + 0.2,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      alpha: Math.random() * 0.55 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.018 + 0.004,
    });
  }
}
buildStars();

function drawFrame() {
  ctx.clearRect(0, 0, cW, cH);

  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 125) {
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.strokeStyle = `rgba(198,156,109,${(1 - d / 125) * 0.11})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  stars.forEach(s => {
    s.pulse += s.pulseSpeed;
    const a = s.alpha + Math.sin(s.pulse) * 0.14;
    const dx = s.x - mX, dy = s.y - mY;
    const d  = Math.sqrt(dx * dx + dy * dy);
    if (d < 90) { s.x += dx / d * 0.45; s.y += dy / d * 0.45; }
    s.x += s.vx; s.y += s.vy;
    if (s.x < 0 || s.x > cW) s.vx *= -1;
    if (s.y < 0 || s.y > cH) s.vy *= -1;

    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.5);
    g.addColorStop(0,   `rgba(232,201,154,${a})`);
    g.addColorStop(0.5, `rgba(198,156,109,${a * 0.35})`);
    g.addColorStop(1,   'transparent');
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(240,210,160,${a})`; ctx.fill();
  });

  requestAnimationFrame(drawFrame);
}
drawFrame();


// ── 3. TYPEWRITER ─────────────────────────────
// EDIT: change these phrases to whatever you want
const phrases = [
  'Cybersecurity Specialist',
  'Threat Hunter',
  'Web Developer',
  'Security Analyst',
  'Ethical Hacker',
  'Problem Solver',
];

let pi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');

function type() {
  const phrase = phrases[pi];
  if (!deleting) {
    tw.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) { deleting = true; setTimeout(type, 2200); return; }
  } else {
    tw.textContent = phrase.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(type, deleting ? 45 : 85);
}
setTimeout(type, 1800);


// ── 4. SCROLL REVEAL ──────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .timeline-item').forEach(el => revealObs.observe(el));


// ── 5. SKILL BARS ─────────────────────────────
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 200);
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => skillObs.observe(el));


// ── 6. NAV SCROLL EFFECT ──────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('nav').style.background =
    window.scrollY > 60 ? 'rgba(34,24,48,0.97)' : 'rgba(34,24,48,0.78)';
});


// ── 7. MOBILE HAMBURGER ───────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
let open = false;

hamburger.addEventListener('click', () => {
  open = !open;
  if (open) {
    navLinks.style.cssText = `
      display:flex; flex-direction:column; position:absolute;
      top:72px; left:0; right:0; gap:20px; padding:24px 32px;
      background:rgba(34,24,48,0.98);
      border-bottom:1px solid rgba(198,156,109,0.18);
    `;
  } else {
    navLinks.style.display = 'none';
  }
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    open = false;
    navLinks.style.display = 'none';
  });
});
