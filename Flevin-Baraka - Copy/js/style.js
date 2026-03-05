$(document).ready(function () {
  $(".sidenav").sidenav();
});

particlesJS('particles-js', {
  particles: {
    number: { value: 70 },
    color: { value: 'random' },
    shape: { type: 'star' },
    opacity: { value: 0.8, random: true },
    size: { value: 3.5, random: true },
    line_linked: {
      enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1
    },
    move: {
      enable: true,
      speed: 1.2,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      attract: { enable: false, rotateX: 3000, rotateY: 3000 }
    }
  },
  interactivity: {
    // react to mouse movement anywhere on the page (including hero)
    detect_on: 'window',
    events: {
      onhover: { enable: true, mode: 'grab' },
      onclick: { enable: true, mode: 'push' },
      resize: true
    },
    modes: {
      grab: {
        distance: 170,
        line_linked: { opacity: 0.7 }
      },
      push: { particles_nb: 3 },
      remove: { particles_nb: 2 }
    }
  },
  retina_detect: true
});

// --- Typewriter Effect Implementation ---
var TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.holdSpace = false; // keep a visual space after deleting a word
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  // Render the current text.
  // When a word has just been fully deleted, briefly show a non‑breaking space
  // so the cursor appears one space after the letter "a", then start the next
  // word directly from that position.
  var displayTxt = this.txt;
  if (!this.isDeleting && this.txt === '' && this.holdSpace) {
    displayTxt = '&nbsp;';
  }
  this.el.innerHTML = '<span class="wrap">' + displayTxt + '</span>';

  var that = this;
  var delta = 150 - Math.random() * 50;

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    this.holdSpace = true;
    // Slightly longer pause after deleting a word before starting the next one
    delta = this.period * 0.7;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

window.onload = function () {
  var elements = document.getElementsByClassName('typewrite');
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-type');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period);
    }
  }
};

// --- edge.studio Effects Implementation ---

// 1. Lenis Smooth Scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync ScrollTrigger with Lenis
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000) });
gsap.ticker.lagSmoothing(0);

// Fade out hero scroll-down arrow once scrolling begins
const scrollArrow = document.querySelector('.scroll-down-arrow');
if (scrollArrow) {
  lenis.on('scroll', ({ scroll }) => {
    const targetOpacity = scroll > 40 ? 0 : 1;
    gsap.to(scrollArrow, {
      opacity: targetOpacity,
      duration: 0.4,
      ease: "power2.out"
    });
  });
}

// Parallax-style drift of the particles background with cursor
const particlesLayer = document.getElementById('particles-js');
if (particlesLayer) {
  const xTo = gsap.quickTo(particlesLayer, "x", { duration: 0.35, ease: "power2.out" });
  const yTo = gsap.quickTo(particlesLayer, "y", { duration: 0.35, ease: "power2.out" });

  document.addEventListener('mousemove', (e) => {
    const relX = e.clientX / window.innerWidth - 0.5;
    const relY = e.clientY / window.innerHeight - 0.5;
    const maxOffset = 12;

    xTo(-relX * maxOffset);
    yTo(-relY * maxOffset);
  });
}


// 3. Magnetic Buttons
const magneticWrappers = document.querySelectorAll('.magnetic-wrap');
magneticWrappers.forEach((wrap) => {
  const child = wrap.children[0];
  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate distance from center
    const x = ((relX - centerX) / centerX) * 20; // Max movement in px
    const y = ((relY - centerY) / centerY) * 20;

    gsap.to(child, { x: x, y: y, duration: 0.3, ease: 'power2.out' });
  });

  wrap.addEventListener('mouseleave', () => {
    gsap.to(child, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
  });
});

// 4. GSAP Scroll Reveals
const revealElements = document.querySelectorAll('.reveal-up');
revealElements.forEach((el) => {
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 85%", // Trigger when top of element hits 85% of viewport
      toggleActions: "play none none reverse"
    },
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out"
  });
});

// 5. About spec drop details
const specPills = document.querySelectorAll('.spec-pill');
const specDetails = document.querySelectorAll('.spec-detail');

function hideAllSpecDetails() {
  if (!specDetails.length) return;
  gsap.set(specDetails, {
    opacity: 0,
    scale: 0.8,
    y: -10,
    pointerEvents: "none"
  });
}

if (specPills.length && specDetails.length) {
  hideAllSpecDetails();

  specPills.forEach((pill) => {
    pill.addEventListener('mouseenter', () => {
      const spec = pill.dataset.spec;
      const target = document.querySelector('.spec-detail[data-spec="' + spec + '"]');
      if (!target) return;

      hideAllSpecDetails();

      // Drop effect: start as a small "drop" and expand into a card
      gsap.fromTo(target,
        {
          opacity: 0,
          scale: 0.4,
          y: -20,
          borderRadius: "999px"
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          borderRadius: "18px",
          duration: 0.55,
          ease: "back.out(1.8)"
        }
      );

      gsap.to(target, { pointerEvents: "auto", duration: 0.01 });
    });

    pill.addEventListener('mouseleave', () => {
      const spec = pill.dataset.spec;
      const target = document.querySelector('.spec-detail[data-spec="' + spec + '"]');
      if (!target) return;

      gsap.to(target, {
        opacity: 0,
        scale: 0.8,
        y: -10,
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: () => {
          target.style.pointerEvents = "none";
        }
      });
    });
  });
}

// 5. Hero image effects
const heroImg = document.querySelector('.hero-img');
const heroWrapper = document.querySelector('.hero-image-wrapper');

if (heroImg) {
  // Subtle floating / breathing animation
  const floatTween = gsap.to(heroImg, {
    y: -10,
    scale: 1.03,
    duration: 3,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });

  if (heroWrapper) {
    // Mouse-based parallax / tilt
    heroWrapper.addEventListener('mousemove', (e) => {
      const rect = heroWrapper.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const xNorm = (relX - centerX) / centerX;
      const yNorm = (relY - centerY) / centerY;

      const maxShift = 15;
      const maxTilt = 10;

      const xOffset = xNorm * maxShift;
      const yOffset = yNorm * maxShift;
      const rotateY = xNorm * maxTilt;
      const rotateX = -yNorm * (maxTilt * 0.6);

      floatTween.pause();

      gsap.to(heroImg, {
        x: xOffset,
        y: yOffset,
        rotationY: rotateY,
        rotationX: rotateX,
        transformPerspective: 800,
        transformOrigin: "center center",
        duration: 0.4,
        ease: "power3.out"
      });
    });

    heroWrapper.addEventListener('mouseleave', () => {
      gsap.to(heroImg, {
        x: 0,
        y: -10,
        rotationY: 0,
        rotationX: 0,
        scale: 1.03,
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => floatTween.resume()
      });
    });

    // Scroll-linked reveal specifically for hero image
    gsap.fromTo(heroWrapper,
      {
        opacity: 0,
        y: 60,
        scale: 0.95,
        filter: "blur(14px)"
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heroWrapper,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }
}

// 6. Hero → About parallax transition (subtle background shift)
const aboutSection = document.querySelector('.about-overview');
if (aboutSection) {
  gsap.to(aboutSection, {
    backgroundPositionY: "40%",
    ease: "none",
    scrollTrigger: {
      trigger: aboutSection,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
}

// 7. Contact Redesign Animations
const contactTile = document.querySelector('.contact-info-tile');
if (contactTile) {
  gsap.from(contactTile, {
    scrollTrigger: {
      trigger: contactTile,
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    opacity: 0,
    y: 30,
    scale: 0.98,
    duration: 1,
    ease: "power3.out"
  });
}

const auroraBlobs = document.querySelectorAll('.aurora-blob');
if (auroraBlobs.length) {
  const blobData = Array.from(auroraBlobs).map(blob => ({
    xTo: gsap.quickTo(blob, "x", { duration: 1.5, ease: "power2.out" }),
    yTo: gsap.quickTo(blob, "y", { duration: 1.5, ease: "power2.out" })
  }));

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;

    blobData.forEach((data, i) => {
      data.xTo(x * (i + 1) * 0.5);
      data.yTo(y * (i + 1) * 0.5);
    });
  });
}