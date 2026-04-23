const startMatchingBtn = document.getElementById("startMatchingBtn");
const saveForLaterBtn = document.getElementById("saveForLaterBtn");
const savedPill = document.getElementById("savedPill");
const saveForLaterGroup = document.getElementById("saveForLaterGroup");
const cycleMatchBtn = document.getElementById("cycleMatchBtn");
const heroCarousel = document.getElementById("heroCarousel");
const heroSlides = heroCarousel ? heroCarousel.querySelectorAll(".hero-slide") : [];
const heroDots = heroCarousel ? heroCarousel.querySelectorAll(".dot") : [];
const matchDeck = document.getElementById("matchDeck");
const matchSlides = matchDeck ? matchDeck.querySelectorAll(".match-slide") : [];
let currentSlideIndex = 0;
let carouselIntervalId = null;
let currentMatchIndex = 0;

if (startMatchingBtn) {
  startMatchingBtn.addEventListener("click", () => {
    const artistsSection = document.getElementById("artists");
    if (artistsSection) {
      artistsSection.scrollIntoView({ behavior: "smooth" });
    }
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

function showMatchSlide(index) {
  if (!matchSlides.length) {
    return;
  }

  currentMatchIndex = (index + matchSlides.length) % matchSlides.length;

  matchSlides.forEach((slide, slideIndex) => {
    const slideOffset = (slideIndex - currentMatchIndex + matchSlides.length) % matchSlides.length;
    slide.classList.remove("is-front", "is-back-1", "is-back-2", "is-hidden");

    if (slideOffset === 0) {
      slide.classList.add("is-front");
    } else if (slideOffset === 1) {
      slide.classList.add("is-back-1");
    } else if (slideOffset === 2) {
      slide.classList.add("is-back-2");
    } else {
      slide.classList.add("is-hidden");
    }
  });

  setMatchSavedState(false);
}

function setMatchSavedState(saved) {
  if (!saveForLaterGroup) {
    return;
  }
  saveForLaterGroup.classList.toggle("is-saved", saved);
  if (savedPill) {
    savedPill.setAttribute("aria-pressed", saved ? "true" : "false");
  }
  if (saveForLaterBtn) {
    saveForLaterBtn.setAttribute("aria-pressed", saved ? "true" : "false");
  }
}

if (matchDeck && matchSlides.length) {
  if (saveForLaterBtn) {
    saveForLaterBtn.addEventListener("click", () => {
      const next = !saveForLaterGroup.classList.contains("is-saved");
      setMatchSavedState(next);
    });
  }

  if (savedPill) {
    savedPill.addEventListener("click", () => {
      const next = !saveForLaterGroup.classList.contains("is-saved");
      setMatchSavedState(next);
    });
  }

  if (cycleMatchBtn) {
    cycleMatchBtn.addEventListener("click", () => {
      showMatchSlide(currentMatchIndex + 1);
    });
  }

  showMatchSlide(0);
}
