/**
 * ALEX VANCE PORTFOLIO - MAIN INTERACTIVE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all core modules
  initTheme();
  initNavigation();
  initParticleCanvas();
  initTypewriter();
  initStatsCounter();
  initSkillFilter();
  initProjectFilter();
  initProjectModal();
  initTestimonialSlider();
  initContactForm();
});

/* ==========================================================================
   1. THEME SWITCHER MODULE
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Read stored theme or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* ==========================================================================
   2. NAVIGATION & MOBILE MENU MODULE
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-item');

  // Sticky Navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy Active Link
    let currentSection = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSection}`) {
        item.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close Mobile Menu on link click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   3. BACKGROUND PARTICLE CANVAS MODULE
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.fillStyle = isDark ? `rgba(99, 102, 241, ${this.alpha})` : `rgba(79, 70, 229, ${this.alpha * 0.7})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Create particle pool
  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 60);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const lineAlpha = (1 - dist / 120) * 0.15;
          ctx.strokeStyle = isDark ? `rgba(168, 85, 247, ${lineAlpha})` : `rgba(147, 51, 234, ${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   4. TYPEWRITER EFFECT MODULE
   ========================================================================== */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter');
  if (!typewriterElement) return;

  const words = ['Full-Stack Web Apps', 'AI-Driven Interfaces', 'Cloud Microservices', 'High-Performance UI/UX'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenWords = 2000;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let nextTimeout = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      nextTimeout = delayBetweenWords;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      nextTimeout = 500;
    }

    setTimeout(type, nextTimeout);
  }

  type();
}

/* ==========================================================================
   5. STATS COUNTER ANIMATION MODULE
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function startCounter() {
    const section = document.getElementById('about');
    if (!section) return;

    const sectionPos = section.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.3;

    if (sectionPos < screenPos && !animated) {
      animated = true;
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const suffix = stat.textContent.replace(/[0-9]/g, '');
        let count = 0;
        const increment = Math.ceil(target / 40);

        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            stat.textContent = target + suffix;
            clearInterval(timer);
          } else {
            stat.textContent = count + suffix;
          }
        }, 40);
      });
    }
  }

  window.addEventListener('scroll', startCounter);
  startCounter();
}

/* ==========================================================================
   6. SKILL FILTERING MODULE
   ========================================================================== */
function initSkillFilter() {
  const tabs = document.querySelectorAll('.skill-tab');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   7. PROJECT FILTERING MODULE
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   8. PROJECT MODAL MODULE
   ========================================================================== */
const projectData = {
  1: {
    title: 'Nexus SaaS E-Commerce Platform',
    category: 'E-Commerce SaaS',
    image: 'assets/images/project_ecommerce.png',
    description: 'Nexus is an enterprise-ready multi-vendor shopping solution built for scalability. Designed with micro-frontends, real-time inventory web sockets, Stripe Checkout integration, and automated invoice PDF rendering.',
    features: [
      'Multi-vendor merchant dashboard with real-time revenue analytics',
      'Stripe & PayPal integrated checkout with webhook resilience',
      'Elasticsearch integration for instant product filtering',
      'Lighthouse score of 98/100 across mobile & desktop'
    ],
    tech: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Stripe API', 'Tailwind CSS']
  },
  2: {
    title: 'NeuralPulse AI Insights Platform',
    category: 'AI & Data Science',
    image: 'assets/images/project_aianalytics.png',
    description: 'NeuralPulse leverages machine learning model outputs to convert unstructured telemetry data into real-time interactive vector charts, predictive trend graphs, and automated executive summaries.',
    features: [
      'Real-time streaming telemetry visualization with D3.js & Canvas',
      'Custom LLM prompt playground interface for business users',
      'Automated email notification triggers for data anomalies',
      'Role-based access control (RBAC) with JWT authentication'
    ],
    tech: ['TypeScript', 'Next.js', 'Python', 'FastAPI', 'D3.js', 'PostgreSQL']
  },
  3: {
    title: 'CarePulse Telemedicine Portal',
    category: 'HealthTech',
    image: 'assets/images/project_healthtech.png',
    description: 'CarePulse simplifies remote healthcare by allowing patients to book video consultations with board-certified physicians, upload medical records, and receive digital prescriptions securely.',
    features: [
      'End-to-end encrypted WebRTC HD video consultation room',
      'Automated appointment calendar scheduling with Google Sync',
      'HIPAA compliant record encryption in transit & at rest',
      'Instant SMS reminders powered by Twilio API'
    ],
    tech: ['Vue.js', 'Express.js', 'WebRTC', 'PostgreSQL', 'Twilio API', 'Redis']
  },
  4: {
    title: 'Aether Web3 Crypto Wallet Dashboard',
    category: 'FinTech & Web3',
    image: 'assets/images/project_fintech.png',
    description: 'Aether is a non-custodial crypto portfolio tracker that aggregates decentralized wallet balances across Ethereum, Polygon, and Arbitrum chains into a unified dark-mode dashboard.',
    features: [
      'Multi-chain token balance fetching via Ethers.js',
      'Gas fee calculator with real-time network congestion alerts',
      'Interactive historical portfolio yield charts',
      'Biometric & hardware wallet integration support'
    ],
    tech: ['React.js', 'Ethers.js', 'Chart.js', 'SASS / CSS Modules', 'MetaMask API']
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const viewDetailBtns = document.querySelectorAll('.view-details-btn');

  viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-id');
      const data = projectData[projectId];

      if (data) {
        modalBody.innerHTML = `
          <img src="${data.image}" alt="${data.title}" class="modal-project-img">
          <span class="project-badge" style="position: static; display: inline-block; margin-bottom: 12px;">${data.category}</span>
          <h3 class="modal-project-title">${data.title}</h3>
          <p class="modal-project-desc">${data.description}</p>
          
          <div class="modal-features-list">
            <h4>Key Features & Architecture:</h4>
            <ul>
              ${data.features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('')}
            </ul>
          </div>

          <div class="project-tags" style="margin-bottom: 24px;">
            ${data.tech.map(t => `<span>${t}</span>`).join('')}
          </div>

          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <a href="#contact" class="btn btn-primary modal-action-btn">
              <span>Request Demo</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
            <button class="btn btn-secondary modal-action-btn" onclick="document.getElementById('projectModal').classList.remove('active')">
              <span>Close Preview</span>
            </button>
          </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modal logic
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ==========================================================================
   9. TESTIMONIAL SLIDER MODULE
   ========================================================================= */
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  let currentIndex = 0;
  let autoPlayTimer;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      dots[i].classList.remove('active');
    });

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentIndex = index;
  }

  function nextSlide() {
    const next = (currentIndex + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    const prev = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-index'));
      showSlide(index);
      resetAutoPlay();
    });
  });

  function startAutoPlay() {
    autoPlayTimer = setInterval(nextSlide, 6000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  startAutoPlay();
}

/* ==========================================================================
   10. CONTACT FORM VALIDATION & TOAST NOTIFICATION MODULE
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (nameInput.value.trim() === '') {
      showFieldError('name', 'Please enter your full name');
      isValid = false;
    } else {
      clearFieldError('name');
    }

    // Validate Email
    if (!emailRegex.test(emailInput.value.trim())) {
      showFieldError('email', 'Please enter a valid email address');
      isValid = false;
    } else {
      clearFieldError('email');
    }

    // Validate Subject
    if (subjectInput.value.trim() === '') {
      showFieldError('subject', 'Please enter a message subject');
      isValid = false;
    } else {
      clearFieldError('subject');
    }

    // Validate Message
    if (messageInput.value.trim().length < 10) {
      showFieldError('message', 'Message must be at least 10 characters long');
      isValid = false;
    } else {
      clearFieldError('message');
    }

    if (isValid) {
      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

      setTimeout(() => {
        showToast('Message sent successfully! I will respond within 24 hours.', 'success');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;
      }, 1500);
    }
  });

  function showFieldError(fieldId, message) {
    const group = document.getElementById(fieldId).closest('.form-group');
    const errorSpan = document.getElementById(`${fieldId}Error`);
    group.classList.add('error');
    if (errorSpan) errorSpan.textContent = message;
  }

  function clearFieldError(fieldId) {
    const group = document.getElementById(fieldId).closest('.form-group');
    group.classList.remove('error');
  }
}

/* Toast Alert Helper */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
