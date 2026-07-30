/* --- ALWAYS RESET TO HOME (TOP) ON REFRESH --- */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
if (window.location.hash) {
  history.replaceState(null, null, window.location.pathname);
}

/* --- LOADING SCREEN & THEME INITIALIZATION --- */
(function() {
  // Apply saved theme immediately before render so loader uses correct theme colors
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const loadingScreen = document.getElementById('loading-screen');
  const barFill = document.getElementById('loader-bar-fill');
  const percentEl = document.getElementById('loader-percent');

  if (!loadingScreen) return;

  // Lock scrolling while loading
  document.body.style.overflow = 'hidden';

  let progress = 0;
  const totalDuration = 1800; // ms
  const interval = 30;
  const steps = totalDuration / interval;
  const increment = 100 / steps;

  const timer = setInterval(() => {
    // Add slight randomness for a more natural feel
    progress += increment * (0.8 + Math.random() * 0.6);
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      // Small pause at 100% before hiding
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.classList.add('page-loaded');
        document.body.style.overflow = '';
      }, 300);
    }
    barFill.style.width = progress + '%';
    percentEl.textContent = Math.floor(progress) + '%';
  }, interval);
})();

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. LANGUAGE SWITCHING --- */
  const langToggle = document.getElementById('lang-toggle');
  let currentLang = localStorage.getItem('lang') || 'id';
  
  // Set initial language
  document.documentElement.setAttribute('lang', currentLang);
  
  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'id' ? 'en' : 'id';
    document.documentElement.setAttribute('lang', currentLang);
    localStorage.setItem('lang', currentLang);
    
    // Restart typewriter with new language list
    initTypewriter();
  });

  /* --- 2. THEME SWITCHING --- */
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');
  
  let currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcons(currentTheme);
  
  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcons(currentTheme);
  });
  
  function updateThemeIcons(theme) {
    if (theme === 'dark') {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  }

  /* --- 3. DYNAMIC TYPING EFFECT (BILINGUAL) --- */
  const typedTextSpan = document.getElementById('typed-text');
  
  const words = {
    id: [
      "Mahasiswa Teknologi Informasi",
      "Web Developer",
      "Laravel Developer",
      "Flutter Developer",
      "Internet of Things"
    ],
    en: [
      "Information Technology Student",
      "Web Developer",
      "Laravel Developer",
      "Flutter Developer",
      "Internet of Things"
    ]
  };
  
  let typingTimer = null;
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function initTypewriter() {
    // Clear any active timers
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
    typedTextSpan.textContent = '';
    charIndex = 0;
    isDeleting = false;
    // Don't reset wordIndex so it continues naturally, just clamp it in case lists vary
    wordIndex = wordIndex % words[currentLang].length;
    typeEffect();
  }
  
  function typeEffect() {
    const currentWordList = words[currentLang];
    const currentWord = currentWordList[wordIndex];
    
    if (isDeleting) {
      typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let typeSpeed = isDeleting ? 40 : 100;
    
    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      typeSpeed = 1500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % currentWordList.length;
      // Pause before typing next word
      typeSpeed = 500;
    }
    
    typingTimer = setTimeout(typeEffect, typeSpeed);
  }
  
  // Start typewriter on load
  initTypewriter();

  /* --- 4. MOBILE HAMBURGER MENU --- */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
  
  // Close menu when clicking nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });

  /* --- 5. SKILLS FILTERING --- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  const skillsGrid = document.querySelector('.skills-grid');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Active state on button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      if (skillsGrid) {
        if (filterValue !== 'all') {
          skillsGrid.classList.add('is-filtered');
        } else {
          skillsGrid.classList.remove('is-filtered');
        }
      }
      
      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = skillsGrid && filterValue !== 'all' ? 'flex' : 'block';
          // Force a tiny stagger entrance
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --- 6. CERTIFICATE LIGHTBOX MODAL --- */
  const certCards = document.querySelectorAll('.cert-card');
  const modal = document.getElementById('certificate-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  
  // Custom styled visual template for simulated certificates inside modal body
  function generateSimulatedCertificate(type, lang) {
    const btnLabel = lang === 'id' ? 'Buka / Unduh Dokumen PDF' : 'Open / Download PDF Document';

    // Config per type: imgPath and optional pdfPath
    const config = {
      pemilwa: { img: 'assets/cert-pemilwa.png', pdf: 'assets/pemilwa2025.pdf' },
      kmfv:    { img: 'assets/cert-kmfv.png',    pdf: null },
      hmps:    { img: 'assets/cert-hmps.png',     pdf: 'assets/HMPSTI.pdf' },
      pkkmb:   { img: 'assets/yuwa.png',          pdf: null },
    };
    const { img: imgPath, pdf: pdfPath } = config[type] || { img: '', pdf: null };

    const pdfButton = pdfPath ? `
      <div style="margin-top: 0.75rem; text-align: center;">
        <a href="${pdfPath}" target="_blank" class="neo-btn btn-primary btn-sm"
           style="display: inline-block; text-decoration: none; padding: 0.5rem 1rem; font-size: 0.85rem;">
          📄 ${btnLabel} &rarr;
        </a>
      </div>` : '';

    return `
      <div style="border: 3px solid #000; padding: 0.5rem; background-color: #ffffff; box-shadow: 6px 6px 0px #000; display: inline-block; max-width: 100%;">
        <img src="${imgPath}" alt="Certificate Document" style="max-width: 100%; max-height: 60vh; display: block; border: 1px solid #000;" />
      </div>
    `;
  }
  
  certCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't re-trigger if a link inside the card was clicked
      if (e.target.closest('a') && !e.target.closest('.cert-detail-btn')) {
        return;
      }
      const type = card.getAttribute('data-type');
      const titleId = card.getAttribute('data-title');
      const titleEn = card.getAttribute('data-title-en');
      const descId = card.getAttribute('data-desc');
      const descEn = card.getAttribute('data-desc-en');
      
      const title = currentLang === 'id' ? titleId : titleEn;
      const desc = currentLang === 'id' ? descId : descEn;
      
      // Select modal body content areas
      const modalBody = modal.querySelector('.modal-body');
      
      // Clear previous simulated certs
      const prevCert = modalBody.querySelector('.simulated-cert');
      if (prevCert) prevCert.remove();
      
      // Inject simulated styled credential layout
      const certHTML = document.createElement('div');
      certHTML.className = 'simulated-cert';
      certHTML.style.marginBottom = '1.5rem';
      certHTML.innerHTML = generateSimulatedCertificate(type, currentLang);
      
      modalBody.insertBefore(certHTML, modalTitle);
      
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    });
  });
  
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Unlock background scrolling
  }
  
  modalClose.addEventListener('click', closeModal);
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  /* --- 7. SCROLL REVEAL ANIMATION --- */
  const revealElements = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
  });
  
  revealElements.forEach(el => {
    observer.observe(el);
  });


  /* --- 9. HERO PHOTO SLIDER --- */
  const sliderPrev = document.getElementById('slider-prev');
  const sliderNext = document.getElementById('slider-next');
  const sliderImages = document.querySelectorAll('.slider-img');
  const sliderDots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;

  function showSlide(index) {
    if (sliderImages.length === 0) return;
    sliderImages.forEach(img => img.classList.remove('active'));
    sliderDots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (index + sliderImages.length) % sliderImages.length;
    
    sliderImages[currentSlide].classList.add('active');
    sliderDots[currentSlide].classList.add('active');
  }

  let heroSliderInterval = null;
  const autoSlideDelay = 3500; // 3.5 seconds

  function startHeroAutoSlide() {
    stopHeroAutoSlide();
    heroSliderInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, autoSlideDelay);
  }

  function stopHeroAutoSlide() {
    if (heroSliderInterval) {
      clearInterval(heroSliderInterval);
      heroSliderInterval = null;
    }
  }

  if (sliderPrev && sliderNext) {
    sliderPrev.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startHeroAutoSlide();
    });
    sliderNext.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      startHeroAutoSlide();
    });
    
    sliderDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        showSlide(index);
        startHeroAutoSlide();
      });
    });

    // Start auto slide on init
    startHeroAutoSlide();

    // Pause on hover
    const heroSliderContainer = document.querySelector('.hero-slider-container');
    if (heroSliderContainer) {
      heroSliderContainer.addEventListener('mouseenter', stopHeroAutoSlide);
      heroSliderContainer.addEventListener('mouseleave', startHeroAutoSlide);
    }
  }

  /* --- 10. PROJECT LIGHTBOX MODAL --- */
  const projectCards = document.querySelectorAll('.project-card');
  const projectModal = document.getElementById('project-modal');
  const projectModalClose = document.getElementById('project-modal-close');
  const projectModalTitle = document.getElementById('project-modal-title');
  const projectModalDesc = document.getElementById('project-modal-desc');
  const projectModalVisual = document.getElementById('project-modal-visual');
  const projectModalTags = document.getElementById('project-modal-tags');
  const projectModalLink = document.getElementById('project-modal-link');
  const projectModalContact = document.getElementById('project-modal-contact');

  let currentProjectTitleId = "";
  let currentProjectTitleEn = "";

  let modalSliderIntervalId = null;

  function initModalSlider() {
    if (modalSliderIntervalId) clearInterval(modalSliderIntervalId);
    
    const slider = projectModalVisual.querySelector('.project-slider');
    if (!slider) return;
    
    const images = slider.querySelectorAll('.project-slider-img');
    const dots = projectModalVisual.querySelectorAll('.project-slider-dot');
    let currentIdx = 0;
    
    function showImage(idx) {
      if (images.length === 0) return;
      images.forEach(img => img.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      
      currentIdx = (idx + images.length) % images.length;
      images[currentIdx].classList.add('active');
      if (dots[currentIdx]) {
        dots[currentIdx].classList.add('active');
      }
    }
    
    function startAutoSlide() {
      if (modalSliderIntervalId) clearInterval(modalSliderIntervalId);
      modalSliderIntervalId = setInterval(() => {
        showImage(currentIdx + 1);
      }, 3000);
    }
    
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(dot.getAttribute('data-index'));
        showImage(idx);
        startAutoSlide();
      });
    });
    
    startAutoSlide();
  }

  function openProjectModal(card) {
    const titleId = card.getAttribute('data-title-id');
    const titleEn = card.getAttribute('data-title-en');
    const descId = card.getAttribute('data-desc-id');
    const descEn = card.getAttribute('data-desc-en');
    const link = card.getAttribute('data-link');
    
    currentProjectTitleId = titleId;
    currentProjectTitleEn = titleEn;

    // Clone visual content and background color
    const originalVisual = card.querySelector('.project-visual');
    projectModalVisual.innerHTML = originalVisual.innerHTML;
    
    // Check if it has a slider and initialize
    const hasSlider = originalVisual.querySelector('.project-slider');
    if (hasSlider) {
      projectModalVisual.style.padding = '0';
      projectModalVisual.style.backgroundColor = 'transparent';
      initModalSlider();
    } else {
      projectModalVisual.style.padding = '';
      projectModalVisual.style.backgroundColor = window.getComputedStyle(originalVisual).backgroundColor;
      if (modalSliderIntervalId) {
        clearInterval(modalSliderIntervalId);
        modalSliderIntervalId = null;
      }
    }

    // Clone tags content
    projectModalTags.innerHTML = card.querySelector('.project-tags').innerHTML;

    // Set title and description based on language
    projectModalTitle.textContent = currentLang === 'id' ? titleId : titleEn;
    projectModalDesc.textContent = currentLang === 'id' ? descId : descEn;

    // Handle Visit Project link button
    if (link) {
      projectModalLink.href = link;
      projectModalLink.style.display = 'inline-block';
    } else {
      projectModalLink.style.display = 'none';
    }

    projectModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  }

  function closeProjectModal() {
    projectModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Unlock background scrolling
    if (modalSliderIntervalId) {
      clearInterval(modalSliderIntervalId);
      modalSliderIntervalId = null;
    }
  }

  projectCards.forEach(card => {
    // Open modal when card is clicked (but ignore if clicking actual anchor links inside card if any)
    card.addEventListener('click', (e) => {
      // Don't trigger modal if user clicked something else that is an anchor (like a direct link in card, if any)
      if (e.target.closest('a') && !e.target.closest('.project-detail-btn')) {
        return;
      }
      openProjectModal(card);
    });
  });

  if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
  }

  // Close project modal on background click
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // Handle "Tanyakan Detail" in modal - auto-fill contact form message
  if (projectModalContact) {
    projectModalContact.addEventListener('click', (e) => {
      e.preventDefault();
      const projectTitle = currentLang === 'id' ? currentProjectTitleId : currentProjectTitleEn;
      const messageInput = document.getElementById('message');
      if (messageInput) {
        messageInput.value = currentLang === 'id'
          ? `Halo Eka, saya tertarik dengan proyek "${projectTitle}" Anda. Bisa tolong bagikan detail lebih lanjut?`
          : `Hi Eka, I am interested in your "${projectTitle}" project. Could you please share more details?`;
      }
      closeProjectModal();
      
      // Smooth scroll to contact section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* --- 11. PROJECT IMAGE SLIDERS --- */
  function initProjectSliders() {
    const sliders = document.querySelectorAll('.project-visual .project-slider');
    sliders.forEach(slider => {
      const parent = slider.closest('.project-visual');
      const images = slider.querySelectorAll('.project-slider-img');
      const dots = parent.querySelectorAll('.project-slider-dot');
      let currentIdx = 0;
      let intervalId = null;

      function showImage(idx) {
        if (images.length === 0) return;
        images.forEach(img => img.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        currentIdx = (idx + images.length) % images.length;
        images[currentIdx].classList.add('active');
        if (dots[currentIdx]) {
          dots[currentIdx].classList.add('active');
        }
      }

      function startAutoSlide() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
          showImage(currentIdx + 1);
        }, 3000);
      }

      function stopAutoSlide() {
        if (intervalId) clearInterval(intervalId);
      }

      dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation(); // Stop click from bubbling to card modal trigger
          const idx = parseInt(dot.getAttribute('data-index'));
          showImage(idx);
          startAutoSlide(); // Reset timer
        });
      });

      parent.addEventListener('mouseenter', stopAutoSlide);
      parent.addEventListener('mouseleave', startAutoSlide);

      startAutoSlide();
    });
  }

  initProjectSliders();

  /* --- CONTACT FORM (Formspree) --- */
  const contactForm = document.getElementById('portfolio-contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const lang = document.documentElement.getAttribute('lang') || 'id';

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = lang === 'id'
        ? '<span class="lang-id">Mengirim...</span>'
        : '<span class="lang-en">Sending...</span>';

      formStatus.className = 'form-status';
      formStatus.textContent = '';

      try {
        const data = new FormData(contactForm);
        const response = await fetch('https://formspree.io/f/meeynegw', {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formStatus.className = 'form-status form-status--success';
          formStatus.textContent = lang === 'id'
            ? '✅ Pesan terkirim! Terima kasih, saya akan membalas segera.'
            : "✅ Message sent! Thank you, I'll reply as soon as possible.";
          contactForm.reset();
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        formStatus.className = 'form-status form-status--error';
        formStatus.textContent = lang === 'id'
          ? '❌ Gagal mengirim pesan. Coba lagi atau hubungi via email.'
          : '❌ Failed to send message. Please try again or contact via email.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = lang === 'id'
          ? '<span class="lang-id">Kirim Sekarang &rarr;</span>'
          : '<span class="lang-en">Send Message &rarr;</span>';
      }
    });
  }

});
