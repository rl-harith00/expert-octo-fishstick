/* =========================================================
   ✏️  EDIT EVERYTHING HERE
   ========================================================= */
const CONFIG = {
  /* PHOTOS
     1. Put your pictures in  assets/images/
     2. Name them photo1.jpg, photo2.jpg … (or change the paths below)
     3. Edit the captions
     Add or remove lines to change how many photos appear.
     If a file is missing, a pretty placeholder shows instead. */
  photos: [
    { src: "assets/images/photo1.jpeg" },
    { src: "assets/images/photo2.jpeg" },
    { src: "assets/images/photo3.jpeg" },
    { src: "assets/images/photo4.jpeg" },
    { src: "assets/images/photo5.jpeg" },
    { src: "assets/images/photo6.jpeg" }
  ],

  /* APPRECIATION MESSAGES: add, remove or rewrite freely */
  messages: [
    "I hope you never forget how beautiful you are, inside and out.",
    "I'm genuinely grateful that our paths crossed.",
    "Your presence makes ordinary days feel a little more special.",
    "I hope life continues to give you reasons to smile.",
    "Thank you for being yourself. Never underestimate how wonderful that is."
  ],

  /* MUSIC
     Put your song at  assets/music/song.mp3  (or change the path)
     and type the title & artist. */
  music: {
    src: "assets/music/Novo Amor - Keep Me (official audio).mp3",
    title: "Keep Me",
    artist: "Novo Amor",
    loop: true
  }
};

/* =========================================================
   Below this line you normally don't need to change anything.
   ========================================================= */
const $ = (sel) => document.querySelector(sel);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Placeholder image (used when a photo is missing) ---------- */
function placeholderFor(index) {
  const palettes = [["#FADADD", "#F8BBD0"], ["#FFE4EC", "#FADADD"], ["#F8BBD0", "#FFF0F3"]];
  const [a, b] = palettes[index % palettes.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
    `<rect width="400" height="500" fill="url(#g)"/>` +
    `<path d="M200 300 C120 240 110 170 160 160 C185 155 200 175 200 185 C200 175 215 155 240 160 C290 170 280 240 200 300 Z" fill="#fff" opacity=".8"/>` +
    `<text x="200" y="370" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#D96C91">Photo ${index + 1}</text>` +
    `<text x="200" y="402" text-anchor="middle" font-family="Georgia, serif" font-size="15" fill="#59434B" opacity=".6">replace me ♡</text>` +
    `</svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* ---------- Floating hearts & flowers ---------- */
function buildFloaters() {
  if (reduceMotion) return;
  const box = $("#floaters");
  const count = window.innerWidth < 600 ? 9 : 16;
  const chars = ["♡", "❀", "✦", "♡", "✿"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "floater";
    s.textContent = chars[i % chars.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.fontSize = 10 + Math.random() * 16 + "px";
    s.style.animationDuration = 14 + Math.random() * 14 + "s";
    s.style.animationDelay = -Math.random() * 20 + "s";
    s.style.setProperty("--drift", Math.random() * 80 - 40 + "px");
    box.appendChild(s);
  }
}

/* ---------- Gallery ---------- */
function buildGallery() {
  const grid = $("#galleryGrid");
  const rotations = [-3, 2, -1.5, 2.5, -2.5, 1.5];

  CONFIG.photos.forEach((photo, i) => {
    const wrap = document.createElement("div");
    wrap.className = "polaroid-wrap reveal";
    wrap.style.transitionDelay = (i % 3) * 90 + "ms";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "polaroid";
    btn.style.setProperty("--rot", rotations[i % rotations.length] + "deg");
    btn.setAttribute("aria-label", "View photo: " + photo.caption);

    const frame = document.createElement("span");
    frame.className = "polaroid__frame";

    const img = document.createElement("img");
    img.className = "polaroid__img";
    img.alt = photo.caption;
    img.loading = "lazy";
    img.decoding = "async";
    img.onerror = () => { img.onerror = null; img.src = placeholderFor(i); };
    img.src = photo.src || placeholderFor(i);

    const cap = document.createElement("span");
    cap.className = "polaroid__caption";
    cap.textContent = photo.caption;

    frame.appendChild(img);
    btn.append(frame, cap);
    wrap.appendChild(btn);
    grid.appendChild(wrap);

    btn.addEventListener("click", () => openLightbox(img.currentSrc || img.src, photo.caption));
  });
}

/* ---------- Appreciation cards ---------- */
function buildMessages() {
  const box = $("#messageCards");
  const icons = ["♡", "✿", "✦", "❀", "♡"];
  CONFIG.messages.forEach((text, i) => {
    const card = document.createElement("div");
    card.className = "card reveal";
    card.style.transitionDelay = (i % 3) * 110 + "ms";
    card.innerHTML =
      `<span class="card__icon" aria-hidden="true">${icons[i % icons.length]}</span>` +
      `<p class="card__text"></p>` +
      `<span class="card__num">no. ${i + 1}</span>`;
    card.querySelector(".card__text").textContent = `“${text}”`;
    box.appendChild(card);
  });
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  items.forEach((el) => io.observe(el));
}

/* ---------- Opening envelope ---------- */
const intro = $("#intro");
const envelope = $("#envelope");
const openBtn = $("#openBtn");
const site = $("#site");
const player = $("#player");
let opened = false;

function openSurprise() {
  if (opened) return;
  opened = true;
  openBtn.disabled = true;
  envelope.classList.add("is-open");

  setTimeout(() => {
    intro.classList.add("is-hidden");
    site.removeAttribute("aria-hidden");
    site.removeAttribute("inert");
    site.classList.add("is-visible");
    document.body.classList.remove("is-locked");
    window.scrollTo(0, 0);
    player.classList.add("is-shown");
    initReveal();
    setTimeout(() => { intro.style.display = "none"; }, 950);
  }, reduceMotion ? 150 : 1700);
}

// "click" fires for both mouse clicks and finger taps on iOS & Android
openBtn.addEventListener("click", openSurprise);
envelope.addEventListener("click", openSurprise);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openSurprise(); }
});

/* ---------- Header & mobile navigation ---------- */
const header = $("#header");
const nav = $("#nav");
const navToggle = $("#navToggle");

function setNav(open) {
  nav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
navToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  setNav(!nav.classList.contains("is-open"));
});
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setNav(false)));
document.addEventListener("click", (e) => {
  if (nav.classList.contains("is-open") && !nav.contains(e.target)) setNav(false);
});

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 10);
}, { passive: true });

/* ---------- Lightbox ---------- */
const lightbox = $("#lightbox");
const lightboxImg = $("#lightboxImg");
const lightboxCaption = $("#lightboxCaption");

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxImg.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  $("#lightboxClose").focus({ preventScroll: true });
}
function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}
$("#lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeLightbox(); setNav(false); }
});

/* ---------- Music player (never autoplays) ---------- */
const audio = $("#audio");
const playBtn = $("#playBtn");
const titleEl = $("#songTitle");
const artistEl = $("#songArtist");
const progressBar = $("#progressBar");
let noteTimer;

audio.src = CONFIG.music.src;
audio.loop = !!CONFIG.music.loop;
titleEl.textContent = CONFIG.music.title;
artistEl.textContent = CONFIG.music.artist;

function setPlaying(state) {
  player.classList.toggle("is-playing", state);
  playBtn.setAttribute("aria-label", state ? "Pause music" : "Play music");
}
function showNote(msg) {
  clearTimeout(noteTimer);
  artistEl.textContent = msg;
  noteTimer = setTimeout(() => { artistEl.textContent = CONFIG.music.artist; }, 4500);
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    const p = audio.play();
    if (p && p.catch) {
      p.catch(() => {
        setPlaying(false);
        showNote("Song not found. Add assets/music/song.mp3 ♡");
      });
    }
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => setPlaying(true));
audio.addEventListener("pause", () => setPlaying(false));
audio.addEventListener("ended", () => setPlaying(false));
audio.addEventListener("error", () => setPlaying(false));
audio.addEventListener("timeupdate", () => {
  if (audio.duration) progressBar.style.width = (audio.currentTime / audio.duration) * 100 + "%";
});

// Lock-screen / notification controls on phones
if ("mediaSession" in navigator) {
  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: CONFIG.music.title,
      artist: CONFIG.music.artist
    });
    navigator.mediaSession.setActionHandler("play", () => audio.play());
    navigator.mediaSession.setActionHandler("pause", () => audio.pause());
  } catch (_) { /* not supported, that's fine */ }
}

/* ---------- Start ---------- */
buildFloaters();
buildGallery();
buildMessages();