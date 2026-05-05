const startMatchingBtn = document.getElementById("startMatchingBtn");
const saveForLaterBtn = document.getElementById("saveForLaterBtn");
const cycleMatchBtn = document.getElementById("cycleMatchBtn");
const heroCarousel = document.getElementById("heroCarousel");
const heroSlides = heroCarousel ? heroCarousel.querySelectorAll(".hero-slide") : [];
const heroDots = heroCarousel ? heroCarousel.querySelectorAll(".dot") : [];
const matchDeck = document.getElementById("matchDeck");
const matchSlides = matchDeck ? matchDeck.querySelectorAll(".match-slide") : [];
const flipAudio = new Audio("Audio/card1.mp3");
flipAudio.volume = 0.35;
let currentSlideIndex = 0;
let carouselIntervalId = null;
let currentMatchIndex = 0;
const savedMatches = [];

function playFlipAudio() {
  flipAudio.currentTime = 0;
  flipAudio.play().catch(() => {
    // Ignore interrupted play errors on rapid taps.
  });
}

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

  setMatchSavedState(savedMatches[currentMatchIndex] === true);
}

function setMatchSavedState(saved) {
  if (matchSlides[currentMatchIndex]) {
    matchSlides[currentMatchIndex].classList.toggle("is-saved", saved);
    savedMatches[currentMatchIndex] = saved;
  }
  if (saveForLaterBtn) {
    saveForLaterBtn.setAttribute("aria-pressed", saved ? "true" : "false");
  }
}

if (matchDeck && matchSlides.length) {
  matchSlides.forEach(() => savedMatches.push(false));

  if (saveForLaterBtn) {
    saveForLaterBtn.addEventListener("click", () => {
      const next = !(savedMatches[currentMatchIndex] === true);
      setMatchSavedState(next);
    });
  }

  if (cycleMatchBtn) {
    cycleMatchBtn.addEventListener("click", () => {
      showMatchSlide(currentMatchIndex + 1);
    });
  }

  matchSlides.forEach((slide) => {
    slide.addEventListener("click", () => {
      if (!slide.classList.contains("is-front")) {
        return;
      }
      slide.classList.toggle("is-flipped");
      playFlipAudio();
    });
  });

  showMatchSlide(2);
}

const cardIndexTrigger = document.getElementById("cardIndexTrigger");
const cardIndexModal = document.getElementById("cardIndexModal");
const cardIndexCloseBtn = document.getElementById("cardIndexCloseBtn");
const cardIndexBackdrop = cardIndexModal ? cardIndexModal.querySelector("[data-card-index-close]") : null;

function closeCardIndexModal() {
  if (!cardIndexModal) {
    return;
  }
  cardIndexModal.hidden = true;
  document.body.style.overflow = "";
}

function openCardIndexModal() {
  if (!cardIndexModal) {
    return;
  }
  cardIndexModal.hidden = false;
  document.body.style.overflow = "hidden";
}

if (cardIndexTrigger && cardIndexModal) {
  cardIndexTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    openCardIndexModal();
  });

  if (cardIndexCloseBtn) {
    cardIndexCloseBtn.addEventListener("click", closeCardIndexModal);
  }

  if (cardIndexBackdrop) {
    cardIndexBackdrop.addEventListener("click", closeCardIndexModal);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !cardIndexModal.hidden) {
      closeCardIndexModal();
    }
  });
}
