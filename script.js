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
let matchSequence = [];
let currentMatchSequencePosition = 0;

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

function shuffleIndices(indices) {
  const next = [...indices];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function buildMatchSequence() {
  const guideIndex = Array.from(matchSlides).findIndex((slide) =>
    Boolean(slide.querySelector(".match-card-face--back-guide"))
  );
  const allIndices = Array.from(matchSlides, (_, index) => index);
  const nonGuideIndices = allIndices.filter((index) => index !== guideIndex);
  const seenSignatures = new Set();
  const uniqueNonGuideIndices = nonGuideIndices.filter((index) => {
    const slide = matchSlides[index];
    const name = slide.querySelector(".artist-info h3")?.textContent?.trim() || "";
    const subtitle = slide.querySelector(".artist-info p")?.textContent?.trim() || "";
    const frontImageSrc = slide.querySelector(".match-card-face--front img")?.getAttribute("src") || "";
    const placeholderBg =
      slide.querySelector(".match-card-face--front .placeholder-tile")?.getAttribute("style") || "";
    const signature = `${name}|${subtitle}|${frontImageSrc}|${placeholderBg}`;

    if (seenSignatures.has(signature)) {
      return false;
    }
    seenSignatures.add(signature);
    return true;
  });
  const randomizedUniqueNonGuide = shuffleIndices(uniqueNonGuideIndices);

  if (guideIndex >= 0) {
    // Guide appears only at the beginning and end of each full round.
    matchSequence = [guideIndex, ...randomizedUniqueNonGuide, guideIndex];
  } else {
    matchSequence = randomizedUniqueNonGuide;
  }
}

function showMatchSequence(position) {
  if (!matchSequence.length) {
    return;
  }

  const boundedPosition = Math.max(0, Math.min(position, matchSequence.length - 1));
  currentMatchSequencePosition = boundedPosition;
  currentMatchIndex = matchSequence[currentMatchSequencePosition];

  matchSlides.forEach((slide) => {
    slide.classList.remove("is-front", "is-back-1", "is-back-2", "is-hidden");
    slide.classList.add("is-hidden");
  });

  const frontIndex = matchSequence[currentMatchSequencePosition];
  const backOneIndex = matchSequence[currentMatchSequencePosition + 1];
  const backTwoIndex = matchSequence[currentMatchSequencePosition + 2];

  if (typeof frontIndex === "number" && matchSlides[frontIndex]) {
    matchSlides[frontIndex].classList.remove("is-hidden");
    matchSlides[frontIndex].classList.add("is-front");
  }
  if (typeof backOneIndex === "number" && matchSlides[backOneIndex]) {
    matchSlides[backOneIndex].classList.remove("is-hidden");
    matchSlides[backOneIndex].classList.add("is-back-1");
  }
  if (typeof backTwoIndex === "number" && matchSlides[backTwoIndex]) {
    matchSlides[backTwoIndex].classList.remove("is-hidden");
    matchSlides[backTwoIndex].classList.add("is-back-2");
  }

  setMatchSavedState(savedMatches[currentMatchIndex] === true);
}

function showNextMatchInSequence() {
  if (!matchSequence.length) {
    return;
  }

  const atEndOfRound = currentMatchSequencePosition >= matchSequence.length - 1;
  if (atEndOfRound) {
    // Start a new round: guide card first, randomized cards after it.
    buildMatchSequence();
    showMatchSequence(0);
    return;
  }

  showMatchSequence(currentMatchSequencePosition + 1);
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
      showNextMatchInSequence();
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

  buildMatchSequence();
  showMatchSequence(0);
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
