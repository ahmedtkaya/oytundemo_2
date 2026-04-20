/* ============================================
   OYTUN DIŞ TİCARET - MAIN JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- NAVBAR SCROLL EFFECT ----------
  const navbar = document.querySelector('.navbar');
  
  const handleScroll = () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ---------- MOBILE MENU ----------
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ---------- SCROLL ANIMATIONS ----------
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // ---------- COUNTER ANIMATION ----------
  const counterElements = document.querySelectorAll('[data-count]');

  if (counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(element) {
    const target = element.getAttribute('data-count');
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    // Parse the target number
    let targetNum;
    if (target.includes('K')) {
      targetNum = parseFloat(target.replace('K', '')) * 1000;
    } else {
      targetNum = parseFloat(target.replace(/[^0-9.]/g, ''));
    }

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      let current = Math.floor(eased * targetNum);

      // Format the number
      let formattedNum;
      if (target.includes('K')) {
        formattedNum = (current / 1000).toFixed(current >= 1000 ? 0 : 0) + 'K';
        if (progress === 1) formattedNum = target;
      } else {
        formattedNum = current.toString();
        if (progress === 1) formattedNum = target.replace(/[^0-9]/g, '');
      }

      element.textContent = prefix + formattedNum + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ---------- CONTACT FORM HANDLING ----------
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Show success message
      const btn = contactForm.querySelector('.btn-submit');
      const originalText = btn.innerHTML;
      btn.innerHTML = '✓ Gönderildi!';
      btn.style.background = '#22c55e';
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ---------- SEARCH FUNCTIONALITY (PRODUCTS) ----------
  const searchInput = document.querySelector('#productSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.category-card');
      
      cards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
        
        if (title.includes(query) || desc.includes(query) || query === '') {
          card.style.display = '';
          card.style.opacity = '1';
          card.style.transform = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (!title.includes(searchInput.value.toLowerCase()) && !desc.includes(searchInput.value.toLowerCase())) {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  }
});
