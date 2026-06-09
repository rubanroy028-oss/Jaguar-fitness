document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Preloader Fade-out
  // ==========================================
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    // Add a slight delay for aesthetic premium feel
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }, 800);
  });

  // ==========================================
  // 2. Sticky Navbar Transition
  // ==========================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 3. Mobile Navigation Menu Toggle
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isMenuOpen = navMenu.classList.contains('active');

    // Toggle hamburger icon between bars and close X
    mobileToggle.innerHTML = isMenuOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });

  // ==========================================
  // 4. Scroll Reveal Animations (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================
  // 5. Statistics Counter Animations
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');

  const startCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);

      // Handle the "+" signs or "%" signs formatting
      if (target === 95) {
        element.textContent = currentValue + '%';
      } else if (target === 5000 || target === 10) {
        element.textContent = currentValue + '+';
      } else {
        element.textContent = currentValue;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        if (target === 95) {
          element.textContent = target + '%';
        } else if (target === 5000 || target === 10) {
          element.textContent = target + '+';
        } else {
          element.textContent = target;
        }
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  statNumbers.forEach(number => {
    counterObserver.observe(number);
  });

  // ==========================================
  // 6. Before/After Transformation Slider
  // ==========================================
  const slider = document.getElementById('before-after-slider');
  const sliderBar = document.getElementById('slider-bar');
  const afterImgContainer = document.querySelector('.transform-after-img-container');

  if (slider && sliderBar && afterImgContainer) {
    let isDragging = false;

    const slideTo = (x) => {
      const rect = slider.getBoundingClientRect();
      // Calculate position relative to container in percentage
      let position = ((x - rect.left) / rect.width) * 100;

      // Constrain inside bounds
      if (position < 0) position = 0;
      if (position > 100) position = 100;

      // Update UI elements
      sliderBar.style.left = `${position}%`;
      afterImgContainer.style.width = `${position}%`;
    };

    // Pointer Events handle both touch & mouse inputs perfectly
    const startDrag = (e) => {
      isDragging = true;
      slider.style.cursor = 'ew-resize';
      slideTo(e.clientX);
    };

    const stopDrag = () => {
      isDragging = false;
      slider.style.cursor = 'default';
    };

    const drag = (e) => {
      if (!isDragging) return;
      slideTo(e.clientX);
    };

    // Events on the slider container
    slider.addEventListener('pointerdown', startDrag);
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointermove', drag);

    // Prevent image drag defaults
    slider.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', (e) => e.preventDefault());
    });
  }

  // ==========================================
  // 7. Testimonials Carousel
  // ==========================================
  const testimonialTrack = document.getElementById('testimonial-track');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  const dotsContainer = document.getElementById('carousel-dots');
  const dots = document.querySelectorAll('.carousel-dot');

  let currentSlide = 0;
  const slideCount = testimonialSlides.length;
  let autoplayInterval;

  const updateSlidePosition = () => {
    testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update active dot
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slideCount;
    updateSlidePosition();
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    updateSlidePosition();
  };

  // Nav Button Events
  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }

  // Dot Navigation Events
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      currentSlide = parseInt(e.target.getAttribute('data-slide'), 10);
      updateSlidePosition();
      resetAutoplay();
    });
  });

  // Autoplay Setup
  const startAutoplay = () => {
    autoplayInterval = setInterval(nextSlide, 5000); // Change slide every 5s
  };

  const resetAutoplay = () => {
    clearInterval(autoplayInterval);
    startAutoplay();
  };

  if (testimonialTrack) {
    startAutoplay();

    // Pause autoplay on hover
    testimonialTrack.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    testimonialTrack.addEventListener('mouseleave', startAutoplay);
  }

  // ==========================================
  // 8. Contact Form Simulation
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Show processing feedback
      submitBtn.disabled = true;
      submitBtn.textContent = 'TRANSMITTING RESERVATION...';
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
        // Reset form & display success message
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';

        formSuccess.style.display = 'block';

        // Hide success message after 5 seconds
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 5000);
      }, 1500);
    });
  }
});
