// Shared base stylesheet for every kcodes game.
//
// Contains the design tokens, fonts, typography reset, and the visual frame
// that the @kcodes/ui Layout component renders: header, brand, nav,
// hamburger, buttons, inputs, auth boxes, forms, banners, page-content
// wrapper, and footer. Plus the mobile media queries for those primitives.
//
// Each game appends its own game-specific CSS via the `extraCss` prop on
// Layout — hero/board/game-shell/article styles live in each app, not here.

export const BASE_CSS = String.raw`/* kcodes games — derpy doodle base */

@font-face {
  font-family: "Papernotes";
  src: url(/static/fonts/papernotes-regular.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Papernotes";
  src: url(/static/fonts/papernotes-bold.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Poppin";
  src: url(/static/fonts/poppin-regular.ttf) format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

:root {
  --paper: #fdf3dc;
  --paper-2: #fae8bd;
  --ink: #2a1c10;
  --ink-soft: #6b5a44;
  --orange: #ff6b1a;
  --pink: #ff4f9a;
  --teal: #10bfa0;
  --sun: #ffcf2b;
  --lav: #a66bff;
  --sky: #4fb8ff;
  --red: #ff4747;
  --article-bg: #fffbf0;
  --ff-goofy: "Poppin", "Comic Sans MS", cursive;
  --ff-read: "Papernotes", Georgia, "Times New Roman", serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
::selection { background: var(--sun); color: var(--ink); }

html, body { min-height: 100vh; }

body {
  background: var(--paper);
  background-image:
    radial-gradient(rgba(255,107,26,.07) 1.5px, transparent 1.5px),
    radial-gradient(rgba(255,79,154,.06) 1.5px, transparent 1.5px),
    radial-gradient(ellipse at 15% 10%, rgba(255,207,43,.22), transparent 45%),
    radial-gradient(ellipse at 85% 85%, rgba(166,107,255,.18), transparent 50%);
  background-size: 28px 28px, 39px 39px, 100% 100%, 100% 100%;
  background-position: 0 0, 14px 20px, 0 0, 0 0;
  color: var(--ink);
  font: 400 18px/1.55 var(--ff-read);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--ff-goofy);
  color: var(--ink);
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: -.01em;
}

a {
  color: var(--orange);
  text-decoration: underline wavy var(--pink);
  text-underline-offset: 4px;
  text-decoration-thickness: 1.5px;
}
a:hover { color: var(--pink); text-decoration-color: var(--orange); }

.wrap {
  width: min(1080px, calc(100% - 2rem));
  margin: 0 auto;
  position: relative;
}

.hidden { display: none; }
.svg-defs { position: absolute; width: 0; height: 0; overflow: hidden; pointer-events: none; }

/* ==============================================================
   DERPY PRIMITIVES (no cards, just tilted words)
   ============================================================== */

.label {
  display: inline-block;
  font: 400 1.1rem var(--ff-goofy);
  color: var(--pink);
  transform: rotate(-3deg);
  margin-bottom: .5rem;
}
.label--sm { font-size: .95rem; }
.label--dark { color: var(--ink-soft); }

.sub {
  font-family: var(--ff-read);
  font-size: 1.2rem;
  color: var(--ink-soft);
  margin-bottom: 1.4rem;
  transform: rotate(-.6deg);
  display: inline-block;
}

/* ==============================================================
   HEADER
   ============================================================== */

.header {
  padding: 1.6rem 0 1.1rem;
  position: relative;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem 1.6rem;
  flex-wrap: wrap;
}

.logo {
  font: 400 2.6rem/.9 var(--ff-goofy);
  color: var(--ink);
  text-decoration: none;
  display: inline-block;
  transform: rotate(-4deg);
}
.logo:hover { color: var(--orange); text-decoration: none; }
.logo-bang {
  color: var(--orange);
  font-size: 3rem;
  display: inline-block;
  transform: rotate(8deg) translateY(2px);
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  flex-wrap: wrap;
  font-family: var(--ff-goofy);
  font-size: 1.4rem;
  font-weight: 400;
}
.nav a, .nav-btn {
  color: var(--ink);
  text-decoration: none;
  display: inline-block;
  transition: transform .12s ease;
}
.nav > :nth-child(1) { transform: rotate(-3deg); color: var(--orange); }
.nav > :nth-child(2) { transform: rotate(2deg); color: var(--pink); }
.nav > :nth-child(3) { transform: rotate(-1.5deg); color: var(--teal); }
.nav > :nth-child(4) { transform: rotate(2.5deg); color: var(--lav); }
.nav > :nth-child(5) { transform: rotate(-2deg); color: var(--sky); }
.nav > :nth-child(6) { transform: rotate(3deg); color: var(--orange); }
.nav a:hover, .nav-btn:hover {
  transform: rotate(0) scale(1.08);
  text-decoration: underline wavy currentColor;
  text-underline-offset: 4px;
}
.nav form { margin: 0; }
.nav-btn {
  background: none;
  border: none;
  font: 400 1.4rem var(--ff-goofy);
  cursor: pointer;
  padding: 0;
  color: inherit;
}

/* Hamburger toggle — hidden on desktop, visible on mobile via media query */
.nav-toggle-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.nav-toggle {
  display: none;
  align-items: center;
  gap: .55rem;
  cursor: pointer;
  padding: .5rem .9rem;
  border: 3px dashed var(--ink);
  background: var(--paper);
  border-radius: 16px 24px 14px 22px / 22px 14px 24px 16px;
  transform: rotate(-2deg);
  transition: transform .14s ease, background .14s ease;
  user-select: none;
  -webkit-user-select: none;
}
.nav-toggle:hover, .nav-toggle:focus-within { background: var(--sun); transform: rotate(1deg) scale(1.04); }
.nav-toggle-input:focus-visible + .nav-toggle { outline: 3px dashed var(--orange); outline-offset: 3px; }
.nav-toggle-lines {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  width: 22px;
}
.nav-toggle-lines > span {
  display: block;
  height: 3px;
  background: var(--ink);
  border-radius: 2px;
  transition: transform .2s ease, opacity .2s ease;
}
.nav-toggle-lines > span:nth-child(1) { transform: rotate(-3deg); }
.nav-toggle-lines > span:nth-child(3) { transform: rotate(3deg); }
.nav-toggle-word {
  font: 400 1.2rem var(--ff-goofy);
  color: var(--ink);
  transform: rotate(-1deg);
  display: inline-block;
}
.nav-toggle-input:checked + .nav-toggle .nav-toggle-lines > span:nth-child(1) {
  transform: translateY(7px) rotate(42deg);
}
.nav-toggle-input:checked + .nav-toggle .nav-toggle-lines > span:nth-child(2) {
  opacity: 0;
}
.nav-toggle-input:checked + .nav-toggle .nav-toggle-lines > span:nth-child(3) {
  transform: translateY(-7px) rotate(-42deg);
}

/* ==============================================================
   BUTTONS — doodle style, no shadow boxes
   ============================================================== */

.btn {
  position: relative;
  display: inline-block;
  background: transparent;
  color: var(--ink);
  border: none;
  padding: .75rem 1.6rem;
  font: 400 1.5rem/1 var(--ff-goofy);
  cursor: pointer;
  text-decoration: none;
  transform: rotate(-2deg);
  transition: transform .14s ease;
  z-index: 0;
  --btn-fill: var(--sun);
}
.btn::before {
  content: "";
  position: absolute;
  inset: -4px -6px;
  background: var(--btn-fill);
  border: 3px solid var(--ink);
  border-radius: 14px 22px 16px 24px / 22px 14px 24px 16px;
  z-index: -1;
  filter: url(#wobble);
}
.btn:hover {
  transform: rotate(2deg) scale(1.04);
  color: var(--ink);
  text-decoration: none;
  --btn-fill: var(--orange);
}
.btn:active { transform: rotate(-1deg) scale(.97); }
.btn--ghost {
  color: var(--ink);
  --btn-fill: transparent;
  transform: rotate(2deg);
}
.btn--ghost::before { border-style: dashed; }
.btn--ghost:hover { --btn-fill: var(--pink); color: var(--ink); }
.btn--sm { font-size: 1rem; padding: .45rem 1rem; }
.btn--sm::before { inset: -3px -4px; }

/* ==============================================================
   INPUTS — wobbly doodle
   ============================================================== */

input {
  width: 100%;
  padding: .7rem 1rem;
  border: 3px dashed var(--ink);
  background: var(--paper);
  color: var(--ink);
  font: 400 1.2rem var(--ff-read);
  border-radius: 16px 28px 14px 22px / 20px 14px 26px 16px;
}
input:focus {
  outline: none;
  border-color: var(--orange);
  background: var(--article-bg);
}

/* ==============================================================
   PAGE CONTENT WRAPPER (used by every game's secondary pages)
   ============================================================== */

.page-content { padding: 2.5rem 0 4rem; }

.page-content h1 {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  margin-bottom: .6rem;
  display: inline-block;
  transform: rotate(-1.5deg);
}

/* ==============================================================
   AUTH (register / login forms)
   ============================================================== */

.auth-box {
  max-width: 420px;
  margin: 1rem auto 0;
  position: relative;
}
.auth-box::before {
  content: "✦";
  position: absolute;
  top: -1.2rem; right: -.4rem;
  color: var(--sun);
  font-size: 2.4rem;
  transform: rotate(18deg);
}
.auth-box h1 { margin-bottom: .2rem; }

.form-stack {
  display: grid;
  gap: 1.1rem;
  margin-top: 1rem;
}
.form-stack label {
  display: grid;
  gap: .25rem;
  font: 400 1.1rem var(--ff-read);
  color: var(--ink);
}
.form-stack label > span {
  display: inline-block;
  transform: rotate(-1.5deg);
  color: var(--pink);
}
.form-stack label:nth-child(2) > span { color: var(--teal); transform: rotate(1deg); }
.form-stack label:nth-child(3) > span { color: var(--lav); transform: rotate(-1deg); }
.form-stack button { margin-top: .5rem; justify-self: start; }

/* ==============================================================
   BANNERS
   ============================================================== */

.error-banner, .success-banner {
  padding: .9rem 1.1rem;
  font: 1.2rem var(--ff-read);
  border: 3px dashed;
  border-radius: 18px 26px 14px 22px / 22px 14px 26px 16px;
  margin-bottom: 1.4rem;
  transform: rotate(-.6deg);
}
.error-banner { background: rgba(255,71,71,.12); border-color: var(--red); color: #a41f1f; }
.success-banner { background: rgba(16,191,160,.14); border-color: var(--teal); color: #0a7b66; }
.result-banner { font-weight: 700; }

/* ==============================================================
   FOOTER
   ============================================================== */

.footer {
  padding: 3.5rem 0 2.5rem;
  text-align: center;
  color: var(--ink-soft);
  font: 1.2rem var(--ff-read);
}
.footer p {
  display: inline-block;
  transform: rotate(-1.5deg);
}

/* ==============================================================
   RESPONSIVE — base primitives only
   ============================================================== */

@media (min-width: 721px) {
  .nav-toggle-input { display: none; }
}

@media (max-width: 720px) {
  body { font-size: 17px; }

  .wrap { width: min(1080px, calc(100% - 1.6rem)); }

  /* Header — swap full nav for hamburger drawer */
  .header { padding: 1rem 0 .8rem; }
  .header-inner {
    gap: .5rem;
    align-items: center;
    flex-wrap: nowrap;
    position: relative;
  }
  .logo { font-size: 2.1rem; }
  .logo-bang { font-size: 2.5rem; }

  .nav-toggle { display: inline-flex; }

  .nav {
    display: none;
    position: absolute;
    right: -.2rem;
    top: calc(100% + .8rem);
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.3rem 1.6rem 1.4rem;
    min-width: 190px;
    background: var(--paper);
    border: 3px dashed var(--ink);
    border-radius: 22px 14px 26px 16px / 16px 26px 14px 24px;
    box-shadow: 0 14px 32px rgba(42,28,16,.18);
    transform: rotate(-1.2deg);
    z-index: 40;
    font-size: 1.35rem;
  }
  .nav-toggle-input:checked ~ .nav { display: flex; }
  .nav > * {
    transform: none !important;
    width: 100%;
  }
  .nav a, .nav-btn { padding: .25rem 0; }
  .nav a:hover, .nav-btn:hover {
    transform: rotate(-1deg) scale(1.04) !important;
  }

  .btn { font-size: 1.25rem; padding: .65rem 1.3rem; }

  /* Page-content tighter on phones */
  .page-content { padding: 1.2rem 0 2.5rem; }

  /* Auth forms — full width inputs, bigger tap targets */
  .auth-box { margin-top: .4rem; }
  input {
    font-size: 16px; /* prevents iOS autozoom */
    padding: .8rem 1rem;
  }
  .form-stack button { justify-self: stretch; text-align: center; width: 100%; }

  /* Banners a touch smaller */
  .error-banner, .success-banner {
    font-size: 1.1rem;
    padding: .8rem 1rem;
  }

  .footer { padding: 2.5rem 0 1.8rem; font-size: 1.1rem; }
}

@media (max-width: 420px) {
  .wrap { width: calc(100% - 1.2rem); }
  .logo { font-size: 1.9rem; }
  .logo-bang { font-size: 2.2rem; }
}

@media (max-width: 900px) and (orientation: landscape) and (max-height: 500px) {
  .header { padding: .6rem 0 .4rem; }
}
`;
