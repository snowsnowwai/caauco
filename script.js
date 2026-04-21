const startMatchingBtn = document.getElementById("startMatchingBtn");
const requestForm = document.getElementById("requestForm");
const formMessage = document.getElementById("formMessage");
const requestButtons = document.querySelectorAll(".like-btn");
const heroCarousel = document.getElementById("heroCarousel");
const heroSlides = heroCarousel ? heroCarousel.querySelectorAll(".hero-slide") : [];
const heroDots = heroCarousel ? heroCarousel.querySelectorAll(".dot") : [];
let currentSlideIndex = 0;
let carouselIntervalId = null;

if (startMatchingBtn) {
  startMatchingBtn.addEventListener("click", () => {
    const artistsSection = document.getElementById("artists");
    if (artistsSection) {
      artistsSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

requestButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const requestSection = document.getElementById("request");
    if (requestSection) {
      requestSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

if (requestForm) {
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "Request sent! Your matched artist will respond shortly.";
    requestForm.reset();
  });
}

function showHeroSlide(index) {
  if (!heroSlides.length) {
    return;
  }

  currentSlideIndex = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === currentSlideIndex);
  });

  heroDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === currentSlideIndex);
  });
}

function startHeroCarousel() {
  if (heroSlides.length <= 1) {
    return;
  }

  carouselIntervalId = window.setInterval(() => {
    showHeroSlide(currentSlideIndex + 1);
  }, 3200);
}

function resetHeroCarousel() {
  if (carouselIntervalId) {
    window.clearInterval(carouselIntervalId);
  }
  startHeroCarousel();
}

if (heroCarousel && heroSlides.length) {
  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showHeroSlide(index);
      resetHeroCarousel();
    });
  });

  heroCarousel.addEventListener("mouseenter", () => {
    if (carouselIntervalId) {
      window.clearInterval(carouselIntervalId);
    }
  });

  heroCarousel.addEventListener("mouseleave", () => {
    resetHeroCarousel();
  });

  showHeroSlide(0);
  startHeroCarousel();
}
