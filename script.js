// Theme toggle
(function () {
  const html   = document.documentElement;
  const toggle = document.getElementById('themeToggle');

  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();


// ID Card Swing Animation
let swingAnimation = null;
let velocity = 0;

const card = document.getElementById("idCard");

let rotation = 0;
let isDragging = false;
let lastX = 0;

const MAX = 24;
const SPRING_STRENGTH = 0.06;
const DAMPING = 0.95;
const REST_THRESHOLD = 0.04;

function apply() {
  card.style.transform = `rotate(${rotation}deg)`;
}

function animateSwing() {
  if (swingAnimation) cancelAnimationFrame(swingAnimation);

  function frame() {
    const springForce = -rotation * SPRING_STRENGTH;
    velocity += springForce;
    velocity *= DAMPING;
    rotation += velocity;

    if (Math.abs(rotation) < REST_THRESHOLD && Math.abs(velocity) < REST_THRESHOLD) {
      rotation = 0;
      velocity = 0;
      apply();
      swingAnimation = null;
      return;
    }

    rotation = Math.max(-MAX, Math.min(MAX, rotation));
    apply();
    swingAnimation = requestAnimationFrame(frame);
  }

  swingAnimation = requestAnimationFrame(frame);
}

function playSwing() {
  if (swingAnimation) {
    cancelAnimationFrame(swingAnimation);
    swingAnimation = null;
  }

  if (Math.abs(rotation) < 1) {
    rotation = (Math.random() - 0.5) * 12;
  }
  velocity = 0.14 + Math.random() * 0.12;
  animateSwing();
}

window.addEventListener("load", () => {
  setTimeout(() => {
    rotation = -22;
    velocity = 0.0004;

    apply();
    animateSwing();

  }, 500);
});

card.addEventListener("pointerdown", (e) => {
  isDragging = true;
  card.setPointerCapture(e.pointerId);
  lastX = e.clientX;
  card.classList.add("dragging");
  card.style.cursor = "grabbing";

  if (swingAnimation) {
    cancelAnimationFrame(swingAnimation);
    swingAnimation = null;
  }
  velocity = 0;
});

card.addEventListener("pointermove", (e) => {
  if (!isDragging) return;

  const deltaX = e.clientX - lastX;
  lastX = e.clientX;

  rotation -= deltaX * 0.42;
  rotation = Math.max(-MAX, Math.min(MAX, rotation));
  velocity = -deltaX * 0.28;

  apply();
});

function releaseCard() {
  if (!isDragging) return;
  isDragging = false;
  card.classList.remove("dragging");
  card.style.cursor = "grab";
  playSwing();
}

card.addEventListener("pointerup", releaseCard);
card.addEventListener("pointercancel", releaseCard);