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


// Photo Tilt Effect
const photoWrap = document.querySelector(".about-photo-wrap");
const photo = document.querySelector(".about-photo");

photoWrap.addEventListener("mousemove", (e) => {
  const rect = photoWrap.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top; 

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * -15; 
  const rotateY = ((x - centerX) / centerX) * 15;  

  photo.style.transform = `
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale(1.03)
  `;
});

photoWrap.addEventListener("mouseleave", () => {
  photo.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
});

// Scroll effects
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;

    if (entry.isIntersecting) {
      el.classList.add("show");
    } else {
      // IMPORTANT: reset when leaving viewport so it can replay
      el.classList.remove("show");
    }
  });
}, {
  threshold: 0.2
});

const hero = document.querySelector(".hero");
observer.observe(hero);

document.querySelectorAll(".reveal").forEach(el => {
  observer.observe(el);
});

// Animate on nav click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);

    if (!target) return;

    target.classList.remove("show");

    setTimeout(() => {
      target.classList.add("show");
    }, 50);
  });
});



// Projects section interactions
(function () {

  // tab switching
  const tabs       = document.querySelectorAll('.proj-tab');
  const panels     = document.querySelectorAll('.proj-panel');
  const indicator  = document.querySelector('.tab-indicator');

  function moveIndicator(tab) {
    const tabsBox = tab.closest('.proj-tabs').getBoundingClientRect();
    const tabBox  = tab.getBoundingClientRect();
    indicator.style.width  = tabBox.width  + 'px';
    indicator.style.left   = (tabBox.left - tabsBox.left) + 'px';
  }

  function activateTab(tab) {
    const target = tab.dataset.tab;

    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    moveIndicator(tab);

    panels.forEach(p => {
      if (p.dataset.panel === target) {
        p.classList.remove('animating-in');
        void p.offsetWidth;                    
        p.classList.add('active', 'animating-in');
      } else {
        p.classList.remove('active', 'animating-in');
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));
  });

  const activeTab = document.querySelector('.proj-tab.active');
  if (activeTab) {
    requestAnimationFrame(() => moveIndicator(activeTab));
  }

  window.addEventListener('resize', () => {
    const current = document.querySelector('.proj-tab.active');
    if (current) moveIndicator(current);
  });
})();