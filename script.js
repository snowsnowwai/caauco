const startMatchingBtn = document.getElementById("startMatchingBtn");
const saveForLaterBtn = document.getElementById("saveForLaterBtn");
const cycleMatchBtn = document.getElementById("cycleMatchBtn");
const heroCarousel = document.getElementById("heroCarousel");
const heroSlides = heroCarousel ? heroCarousel.querySelectorAll(".hero-slide") : [];
const heroDots = heroCarousel ? heroCarousel.querySelectorAll(".dot") : [];
const matchDeck = document.getElementById("matchDeck");
const matchSlides = matchDeck ? matchDeck.querySelectorAll(".match-slide") : [];
const FILTER_PREFS_STORAGE_KEY = "quickdraw_filter_prefs";

const BIO_LABEL_TO_SLUGS = {
  "digital illustrations": ["digital-illustrations"],
  "graphic designs": ["graphic-designs"],
  "motion graphics": ["motion-graphics"],
  "3d models": ["3d-models"],
  typography: ["typography"],
  "page layout": ["page-layout"],
  "video thumbnail artist": ["video-thumbnail-artist"],
  "template designer": ["template-designer"],
  "cover artist": ["cover-artist"],
  "apparel design": ["apparel-design"],
  "apparel designer": ["apparel-design"],
  colorist: ["colorist"],
  "design researcher": ["design-researcher"],
  "cover designer": ["cover-designer"],
  "collage artist": ["collage-artist"],
  "poster designs": ["poster-designs"],
  "logo and branding": ["logo-branding"],
  "mascot design": ["mascot-design"],
  "character concepts": ["character-concepts"],
  "comic panels": ["comic-panels"],
  "infographics": ["infographics"],
  "vector artist": ["digital-illustrations", "graphic-designs"],
  "instagram posts": ["social-media-posts"],
  "club merchandise": ["merchandise"],
  "school club events": ["school-club-events"],
  "class projects": ["school-projects"],
  "social media posts": ["social-media-posts"],
  "student campaigns": ["student-campaigns"],
  presentations: ["presentations"],
  "yearbook features": ["yearbook"],
  "school website": ["school-website"],
  "print flyers": ["print-flyers"],
  "campus announcements": ["announcements"],
};

function normalizeBioLabel(text) {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function mapBioLabelToSlugs(label) {
  const slugs = BIO_LABEL_TO_SLUGS[normalizeBioLabel(label)];
  return slugs || [];
}

function getActiveFilterSlugs() {
  try {
    const raw = localStorage.getItem(FILTER_PREFS_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    const commission = Array.isArray(parsed.commission_type) ? parsed.commission_type : [];
    const usage = Array.isArray(parsed.usage_type) ? parsed.usage_type : [];
    const combined = [...commission, ...usage];
    return combined.length ? new Set(combined) : null;
  } catch {
    return null;
  }
}

function getCardPreferenceTags(slide) {
  const tags = new Set();
  const dataAttr = slide.getAttribute("data-bio-preferences");
  if (dataAttr) {
    dataAttr.split(/\s+/).filter(Boolean).forEach((slug) => tags.add(slug));
  }
  slide.querySelectorAll(".profile-back__badge-list .profile-back__badge").forEach((el) => {
    mapBioLabelToSlugs(el.textContent).forEach((slug) => tags.add(slug));
  });
  return tags;
}

function slideMatchesSavedPreferences(slideIndex, filterSlugs) {
  if (!filterSlugs || filterSlugs.size === 0) {
    return true;
  }
  const slide = matchSlides[slideIndex];
  if (!slide) {
    return false;
  }
  const cardTags = getCardPreferenceTags(slide);
  if (!cardTags.size) {
    return false;
  }
  for (const slug of filterSlugs) {
    if (cardTags.has(slug)) {
      return true;
    }
  }
  return false;
}

function updateMotionGraphicsFoilClasses() {
  if (!matchSlides.length) {
    return;
  }

  matchSlides.forEach((slide) => {
    const cardTags = getCardPreferenceTags(slide);
    slide.classList.toggle("has-motion-graphics", cardTags.has("motion-graphics"));
  });
}

function getBackTemplateMarkup() {
  return `
    <div class="skye-template">
      <div class="skye-template__top">
        <div class="skye-template__red-square" aria-hidden="true"></div>
        <div class="skye-template__top-right">
          <div class="skye-template__field-labels">
            <span>School Year</span>
            <span>Current Major</span>
          </div>
          <div class="skye-template__tool-row" aria-hidden="true">
            <span class="skye-template__tool-square"></span>
            <span class="skye-template__tool-square"></span>
            <span class="skye-template__tool-square"></span>
            <span class="skye-template__tool-square"></span>
          </div>
          <div class="skye-template__bio">
            <span class="skye-template__section-label">Bio:</span>
            <div class="skye-template__bio-box"></div>
          </div>
        </div>
      </div>
      <div class="skye-template__artworks">
        <span class="skye-template__section-label">Artworks:</span>
        <div class="skye-template__art-grid" aria-hidden="true">
          <div class="skye-template__art-square"></div>
          <div class="skye-template__art-square"></div>
          <div class="skye-template__art-square"></div>
        </div>
      </div>
    </div>
  `;
}

function applyUnifiedBackTemplate() {
  if (!matchSlides.length) {
    return;
  }

  const excludedNames = new Set(["Audrey Wai"]);
  const skyePortraitSrc = "UserCards/RandomAdditions/momo.jpg";
  const colePortraitSrc = "UserCards/Cole-PXL_20250717_0005526912.jpg";
  const stevenPortraitSrc = "UserCards/RandomAdditions/Steven%20Yeun.jpg";
  const reesePortraitSrc = "UserCards/RandomAdditions/Yunjin.jpg";
  const averyPortraitSrc = "UserCards/RandomAdditions/chaeyoung.jpg";
  const jordanPortraitSrc = "UserCards/RandomAdditions/marktuan.jpg";
  const paulPortraitSrc = "UserCards/RandomAdditions/guy.jpg";
  const coleArtSrcs = [
    "UserCards/Cole-Gray%20Uniform%20Poster.png",
    "UserCards/Cole-DsGD100A_Pr1_Poster_Louie_ColeF.jpg",
    "UserCards/Cole-Curryoke_F.jpg",
  ];
  const stevenArtSrcs = [
    "UserCards/RandomAdditions/Invincible%20Poster%202.jpg",
    "UserCards/RandomAdditions/INVINCIBLE%20TV%20SHOW%20POSTER.jpg",
    "UserCards/RandomAdditions/invincible.png",
  ];
  const reeseArtSrcs = [
    "UserCards/RandomAdditions/goose.jpg",
    "UserCards/RandomAdditions/shirt1.png",
    "UserCards/RandomAdditions/type.jpg",
  ];
  const averyArtSrcs = [
    "UserCards/RandomAdditions/sweater1.jpg",
    "UserCards/RandomAdditions/stamp.jpg",
    "UserCards/RandomAdditions/tanktop.jpg",
  ];
  const jordanArtSrcs = [
    "UserCards/RandomAdditions/color1.jpg",
    "UserCards/RandomAdditions/flash.jpg",
    "UserCards/RandomAdditions/superman2.jpg",
  ];
  const paulArtSrcs = [
    "UserCards/RandomAdditions/3D1.jpg",
    "UserCards/RandomAdditions/3D2.jpg",
    "UserCards/RandomAdditions/3D3.jpg",
  ];
  const skyeArtSrcs = [
    "UserCards/RandomAdditions/CORTIS.jpg",
    "UserCards/RandomAdditions/GOT7.jpg",
    "UserCards/RandomAdditions/Jennie.jpg",
  ];
  const templateMarkup = getBackTemplateMarkup();

  matchSlides.forEach((slide) => {
    const artistName = slide.querySelector(".artist-info h3")?.textContent?.trim() || "";
    if (excludedNames.has(artistName)) {
      return;
    }

    const backFace = slide.querySelector(".match-card-face--back-profile");
    if (!backFace) {
      return;
    }

    const profileBack = backFace.querySelector(".profile-back");
    if (!profileBack) {
      backFace.innerHTML = `<div class="profile-back profile-back--skye-template">${templateMarkup}</div>`;
    } else {
      profileBack.classList.add("profile-back--skye-template");
      if (!profileBack.querySelector(".skye-template")) {
        profileBack.innerHTML = templateMarkup;
      }
    }

    const effectiveProfileBack = backFace.querySelector(".profile-back");
    const fieldLabels = effectiveProfileBack
      ? effectiveProfileBack.querySelector(".skye-template__field-labels")
      : null;
    const redSquare = effectiveProfileBack ? effectiveProfileBack.querySelector(".skye-template__red-square") : null;
    const isSkye = artistName === "Skye Harper";
    const isCole = artistName === "Cole Louie";
    const isSteven = artistName === "Steven Yuen";
    const isReese = artistName === "Reese Nova";
    const isAvery = artistName === "Avery Stone";
    const isJordan = artistName === "Jordan Vale";
    const isPaul = artistName === "Paul Rogers";
    if (redSquare) {
      if (isSkye) {
        effectiveProfileBack?.classList.add("profile-back--skye-icons");
        effectiveProfileBack?.classList.remove("profile-back--cole-icons");
        effectiveProfileBack?.classList.remove("profile-back--reese-icons");
        redSquare.innerHTML = `<img class="skye-template__portrait" src="${skyePortraitSrc}" alt="Skye Harper portrait">`;
      } else if (isCole) {
        effectiveProfileBack?.classList.remove("profile-back--skye-icons");
        effectiveProfileBack?.classList.add("profile-back--cole-icons");
        effectiveProfileBack?.classList.remove("profile-back--reese-icons");
        redSquare.innerHTML = `<img class="skye-template__portrait" src="${colePortraitSrc}" alt="Cole Louie portrait">`;
      } else if (isSteven) {
        effectiveProfileBack?.classList.remove("profile-back--skye-icons");
        effectiveProfileBack?.classList.remove("profile-back--cole-icons");
        effectiveProfileBack?.classList.remove("profile-back--reese-icons");
        redSquare.innerHTML = `<img class="skye-template__portrait" src="${stevenPortraitSrc}" alt="Steven Yuen portrait">`;
      } else if (isReese) {
        effectiveProfileBack?.classList.remove("profile-back--skye-icons");
        effectiveProfileBack?.classList.remove("profile-back--cole-icons");
        effectiveProfileBack?.classList.add("profile-back--reese-icons");
        redSquare.innerHTML = `<img class="skye-template__portrait" src="${reesePortraitSrc}" alt="Reese Nova portrait">`;
      } else if (isAvery) {
        effectiveProfileBack?.classList.remove("profile-back--skye-icons");
        effectiveProfileBack?.classList.remove("profile-back--cole-icons");
        effectiveProfileBack?.classList.remove("profile-back--reese-icons");
        redSquare.innerHTML = `<img class="skye-template__portrait" src="${averyPortraitSrc}" alt="Avery Stone portrait">`;
      } else if (isJordan) {
        effectiveProfileBack?.classList.remove("profile-back--skye-icons");
        effectiveProfileBack?.classList.remove("profile-back--cole-icons");
        effectiveProfileBack?.classList.remove("profile-back--reese-icons");
        redSquare.innerHTML = `<img class="skye-template__portrait" src="${jordanPortraitSrc}" alt="Jordan Vale portrait">`;
      } else if (isPaul) {
        effectiveProfileBack?.classList.remove("profile-back--skye-icons");
        effectiveProfileBack?.classList.remove("profile-back--cole-icons");
        effectiveProfileBack?.classList.remove("profile-back--reese-icons");
        redSquare.innerHTML = `<img class="skye-template__portrait" src="${paulPortraitSrc}" alt="Paul Rogers portrait">`;
      } else {
        effectiveProfileBack?.classList.remove("profile-back--skye-icons");
        effectiveProfileBack?.classList.remove("profile-back--cole-icons");
        effectiveProfileBack?.classList.remove("profile-back--reese-icons");
        redSquare.innerHTML = "";
      }
    }

    if (fieldLabels) {
      if (isSkye) {
        fieldLabels.innerHTML = `
          <span>Year 3</span>
          <span>Graphic Design BFA</span>
        `;
      } else if (isReese) {
        fieldLabels.innerHTML = `
          <span>Year 2</span>
          <span>Digital Media Studies</span>
        `;
      }
    }

    const artSquares = effectiveProfileBack
      ? Array.from(effectiveProfileBack.querySelectorAll(".skye-template__art-square"))
      : [];
    if (artSquares.length) {
      if (isSkye) {
        artSquares.forEach((sq, idx) => {
          const src = skyeArtSrcs[idx];
          if (src) {
            sq.innerHTML = `<img class="skye-template__art-image" src="${src}" alt="Skye artwork ${idx + 1}">`;
          }
        });
      } else if (isCole) {
        artSquares.forEach((sq, idx) => {
          const src = coleArtSrcs[idx];
          if (src) {
            sq.innerHTML = `<img class="skye-template__art-image" src="${src}" alt="Cole artwork ${idx + 1}">`;
          }
        });
      } else if (isSteven) {
        artSquares.forEach((sq, idx) => {
          const src = stevenArtSrcs[idx];
          if (src) {
            sq.innerHTML = `<img class="skye-template__art-image" src="${src}" alt="Steven artwork ${idx + 1}">`;
          }
        });
      } else if (isReese) {
        artSquares.forEach((sq, idx) => {
          const src = reeseArtSrcs[idx];
          if (src) {
            sq.innerHTML = `<img class="skye-template__art-image" src="${src}" alt="Reese artwork ${idx + 1}">`;
          }
        });
      } else if (isAvery) {
        artSquares.forEach((sq, idx) => {
          const src = averyArtSrcs[idx];
          if (src) {
            sq.innerHTML = `<img class="skye-template__art-image" src="${src}" alt="Avery artwork ${idx + 1}">`;
          }
        });
      } else if (isJordan) {
        artSquares.forEach((sq, idx) => {
          const src = jordanArtSrcs[idx];
          if (src) {
            sq.innerHTML = `<img class="skye-template__art-image" src="${src}" alt="Jordan artwork ${idx + 1}">`;
          }
        });
      } else if (isPaul) {
        artSquares.forEach((sq, idx) => {
          const src = paulArtSrcs[idx];
          if (src) {
            sq.innerHTML = `<img class="skye-template__art-image" src="${src}" alt="Paul artwork ${idx + 1}">`;
          }
        });
      } else {
        artSquares.forEach((sq) => {
          sq.innerHTML = "";
        });
      }
    }

    const bioBox = effectiveProfileBack ? effectiveProfileBack.querySelector(".skye-template__bio-box") : null;
    if (bioBox) {
      if (isSkye) {
        bioBox.innerHTML = `
          <div class="profile-back__badge-list" aria-label="Skye Harper categories">
            <span class="profile-back__badge">Typography</span>
            <span class="profile-back__badge">Page Layout</span>
            <span class="profile-back__badge">Graphic Designs</span>
            <span class="profile-back__badge">Template Designer</span>
            <span class="profile-back__badge">Design Researcher</span>
          </div>
        `;
      } else if (isCole) {
        bioBox.innerHTML = `
          <div class="profile-back__badge-list" aria-label="Cole Louie categories">
            <span class="profile-back__badge">Motion Graphics</span>
            <span class="profile-back__badge">Graphic Designs</span>
            <span class="profile-back__badge">Typography</span>
            <span class="profile-back__badge">Poster Designs</span>
            <span class="profile-back__badge">Infographics</span>
          </div>
        `;
      } else if (isSteven) {
        bioBox.innerHTML = `
          <div class="profile-back__badge-list" aria-label="Steven Yuen categories">
            <span class="profile-back__badge">Digital Illustration</span>
            <span class="profile-back__badge">Mascot Design</span>
            <span class="profile-back__badge">Character Concepts</span>
            <span class="profile-back__badge">Page Layout</span>
          </div>
        `;
      } else if (isReese) {
        bioBox.innerHTML = `
          <div class="profile-back__badge-list" aria-label="Reese Nova categories">
            <span class="profile-back__badge">Poster Design</span>
            <span class="profile-back__badge">Logo and Branding</span>
            <span class="profile-back__badge">Apparel Designer</span>
            <span class="profile-back__badge">Collage Artist</span>
            <span class="profile-back__badge">Digital Illustrations</span>
          </div>
        `;
      } else if (isAvery) {
        bioBox.innerHTML = `
          <div class="profile-back__badge-list" aria-label="Avery Stone categories">
            <span class="profile-back__badge">Apparel Design</span>
            <span class="profile-back__badge">Digital Illustrations</span>
            <span class="profile-back__badge">Graphic Designs</span>
            <span class="profile-back__badge">Logo and Branding</span>
          </div>
        `;
      } else if (isJordan) {
        bioBox.innerHTML = `
          <div class="profile-back__badge-list" aria-label="Jordan Vale categories">
            <span class="profile-back__badge">Digital Illustrations</span>
            <span class="profile-back__badge">Page Layout</span>
            <span class="profile-back__badge">Colorist</span>
            <span class="profile-back__badge">Cover Designer</span>
            <span class="profile-back__badge">Character Concepts</span>
            <span class="profile-back__badge">Design Researcher</span>
          </div>
        `;
      } else if (isPaul) {
        bioBox.innerHTML = `
          <div class="profile-back__badge-list" aria-label="Paul Rogers categories">
            <span class="profile-back__badge">3D Models</span>
            <span class="profile-back__badge">Page Layout</span>
            <span class="profile-back__badge">Infographics</span>
            <span class="profile-back__badge">Cover Designer</span>
          </div>
        `;
      } else {
        bioBox.innerHTML = "";
      }
    }
  });
}

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
  const filterSlugs = getActiveFilterSlugs();
  let preferencePool = uniqueNonGuideIndices;
  if (filterSlugs && filterSlugs.size > 0) {
    const filtered = uniqueNonGuideIndices.filter((index) =>
      slideMatchesSavedPreferences(index, filterSlugs)
    );
    preferencePool = filtered.length > 0 ? filtered : uniqueNonGuideIndices;
  }

  const skyeIndex = uniqueNonGuideIndices.find((index) => {
    const name = matchSlides[index]?.querySelector(".artist-info h3")?.textContent?.trim();
    return name === "Skye Harper";
  });
  if (typeof skyeIndex === "number" && skyeIndex >= 0 && !preferencePool.includes(skyeIndex)) {
    preferencePool = [skyeIndex, ...preferencePool];
  }

  const randomizedUniqueNonGuide = shuffleIndices(preferencePool);
  if (typeof skyeIndex === "number" && skyeIndex >= 0) {
    const skyePosition = randomizedUniqueNonGuide.indexOf(skyeIndex);
    if (skyePosition > 0) {
      randomizedUniqueNonGuide.splice(skyePosition, 1);
      randomizedUniqueNonGuide.unshift(skyeIndex);
    }
  }

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

function refreshMatchDeckFromSavedPreferences() {
  if (!matchDeck || !matchSlides.length) {
    return;
  }
  matchSlides.forEach((slide) => slide.classList.remove("is-flipped"));
  buildMatchSequence();
  showMatchSequence(0);
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
  applyUnifiedBackTemplate();
  updateMotionGraphicsFoilClasses();
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

const filterTrigger = document.getElementById("filterTrigger");
const filterPreferencesModal = document.getElementById("filterPreferencesModal");
const filterPreferencesCloseBtn = document.getElementById("filterPreferencesCloseBtn");
const filterPreferencesForm = document.getElementById("filterPreferencesForm");
const filterPreferencesBackdrop = filterPreferencesModal
  ? filterPreferencesModal.querySelector("[data-filter-close]")
  : null;

function restoreFilterPreferencesFromStorage() {
  if (!filterPreferencesForm) {
    return;
  }

  try {
    const raw = localStorage.getItem(FILTER_PREFS_STORAGE_KEY);
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw);
    const commission = Array.isArray(parsed.commission_type) ? parsed.commission_type : [];
    const usage = Array.isArray(parsed.usage_type) ? parsed.usage_type : [];

    filterPreferencesForm.querySelectorAll('input[name="commission_type"]').forEach((input) => {
      input.checked = commission.includes(input.value);
    });
    filterPreferencesForm.querySelectorAll('input[name="usage_type"]').forEach((input) => {
      input.checked = usage.includes(input.value);
    });
  } catch {
    // Ignore malformed storage.
  }
}

function persistFilterPreferences() {
  if (!filterPreferencesForm) {
    return;
  }

  const formData = new FormData(filterPreferencesForm);
  const payload = {
    commission_type: formData.getAll("commission_type"),
    usage_type: formData.getAll("usage_type"),
  };
  localStorage.setItem(FILTER_PREFS_STORAGE_KEY, JSON.stringify(payload));
}

function closeFilterPreferencesModal() {
  if (!filterPreferencesModal) {
    return;
  }
  filterPreferencesModal.hidden = true;
  document.body.style.overflow = "";
}

function openFilterPreferencesModal() {
  if (!filterPreferencesModal) {
    return;
  }
  restoreFilterPreferencesFromStorage();
  filterPreferencesModal.hidden = false;
  document.body.style.overflow = "hidden";
}

if (filterPreferencesForm) {
  restoreFilterPreferencesFromStorage();
}

if (filterTrigger && filterPreferencesModal) {
  filterTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    openFilterPreferencesModal();
  });

  if (filterPreferencesCloseBtn) {
    filterPreferencesCloseBtn.addEventListener("click", closeFilterPreferencesModal);
  }

  if (filterPreferencesBackdrop) {
    filterPreferencesBackdrop.addEventListener("click", closeFilterPreferencesModal);
  }

  if (filterPreferencesForm) {
    filterPreferencesForm.addEventListener("submit", (event) => {
      event.preventDefault();
      persistFilterPreferences();
      closeFilterPreferencesModal();
      refreshMatchDeckFromSavedPreferences();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !filterPreferencesModal.hidden) {
      closeFilterPreferencesModal();
    }
  });
}

const COMMISSION_REQUEST_STORAGE_KEY = "quickdraw_commission_requests";

const commissionRequestModal = document.getElementById("commissionRequestModal");
const requestMatchBtn = document.getElementById("requestMatchBtn");
const commissionRequestCloseBtn = document.getElementById("commissionRequestCloseBtn");
const commissionRequestCancelBtn = document.getElementById("commissionRequestCancelBtn");
const commissionRequestForm = document.getElementById("commissionRequestForm");
const commissionRequestArtistEl = document.getElementById("commissionRequestArtist");
const commissionRequestSuccessEl = document.getElementById("commissionRequestSuccess");
const commissionRequestBackdrop = commissionRequestModal
  ? commissionRequestModal.querySelector("[data-request-close]")
  : null;
const commissionRequestSubmitBtn = document.getElementById("commissionRequestSubmitBtn");
const requestTimeFrameSelect = document.getElementById("requestTimeFrame");

function syncRequestTimeFrameAsapColor() {
  if (!requestTimeFrameSelect) {
    return;
  }
  requestTimeFrameSelect.classList.toggle("is-value-asap", requestTimeFrameSelect.value === "ASAP");
}

function getFrontCardArtistName() {
  if (!matchSlides.length) {
    return "";
  }
  const slide = matchSlides[currentMatchIndex];
  if (!slide) {
    return "";
  }
  return slide.querySelector(".artist-info h3")?.textContent?.trim() || "";
}

function openCommissionRequestModal() {
  if (!commissionRequestModal || !commissionRequestForm) {
    return;
  }
  commissionRequestForm.reset();
  syncRequestTimeFrameAsapColor();
  if (commissionRequestSuccessEl) {
    commissionRequestSuccessEl.hidden = true;
  }
  const name = getFrontCardArtistName();
  if (commissionRequestArtistEl) {
    commissionRequestArtistEl.textContent = name ? `To: ${name}` : "To: —";
  }
  commissionRequestModal.hidden = false;
  document.body.style.overflow = "hidden";
  requestTimeFrameSelect?.focus();
}

function closeCommissionRequestModal() {
  if (!commissionRequestModal) {
    return;
  }
  commissionRequestModal.hidden = true;
  document.body.style.overflow = "";
  if (commissionRequestSuccessEl) {
    commissionRequestSuccessEl.hidden = true;
  }
  if (commissionRequestSubmitBtn) {
    commissionRequestSubmitBtn.disabled = false;
  }
}

function persistCommissionRequest(entry) {
  try {
    const raw = localStorage.getItem(COMMISSION_REQUEST_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(list) ? list : [];
    next.push(entry);
    localStorage.setItem(COMMISSION_REQUEST_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures (private mode, quota).
  }
}

if (requestMatchBtn && commissionRequestModal && commissionRequestForm) {
  requestMatchBtn.addEventListener("click", () => {
    openCommissionRequestModal();
  });

  if (commissionRequestCloseBtn) {
    commissionRequestCloseBtn.addEventListener("click", closeCommissionRequestModal);
  }

  if (commissionRequestCancelBtn) {
    commissionRequestCancelBtn.addEventListener("click", closeCommissionRequestModal);
  }

  if (commissionRequestBackdrop) {
    commissionRequestBackdrop.addEventListener("click", closeCommissionRequestModal);
  }

  commissionRequestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (commissionRequestSubmitBtn) {
      commissionRequestSubmitBtn.disabled = true;
    }
    const fd = new FormData(commissionRequestForm);
    const payload = {
      artist: getFrontCardArtistName(),
      time_frame: String(fd.get("time_frame") || "").trim(),
      price: String(fd.get("price") || "").trim(),
      description: String(fd.get("description") || "").trim(),
      commission_function: fd.getAll("commission_function").filter(Boolean),
      additional_notes: String(fd.get("additional_notes") || "").trim(),
      createdAt: Date.now(),
    };
    persistCommissionRequest(payload);
    if (commissionRequestSuccessEl) {
      commissionRequestSuccessEl.hidden = false;
    }
    window.setTimeout(() => {
      closeCommissionRequestModal();
      commissionRequestForm.reset();
      syncRequestTimeFrameAsapColor();
      if (commissionRequestSubmitBtn) {
        commissionRequestSubmitBtn.disabled = false;
      }
    }, 900);
  });

  requestTimeFrameSelect?.addEventListener("change", syncRequestTimeFrameAsapColor);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && commissionRequestModal && !commissionRequestModal.hidden) {
      closeCommissionRequestModal();
    }
  });
}
