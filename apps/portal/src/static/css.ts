// Portal-specific styles. Layered on top of @kcodes/ui's BASE_CSS via the
// extraCss prop on Layout. Just needs the homebase grid and game-card
// styles for now — header / nav / fonts / buttons all come from BASE_CSS.

export const PORTAL_CSS = String.raw`/* games.kcodes.me — homebase styles */

.portal-hero {
  padding: 3.5rem 0 2.2rem;
  position: relative;
  text-align: center;
}
.portal-hero::before {
  content: "✦";
  position: absolute;
  top: .8rem; left: 12%;
  font-size: 2.6rem;
  color: var(--sun);
  transform: rotate(-14deg);
}
.portal-hero::after {
  content: "✿";
  position: absolute;
  top: 1rem; right: 14%;
  font-size: 2.4rem;
  color: var(--pink);
  transform: rotate(18deg);
}
.portal-hero h1 {
  font-size: clamp(2.8rem, 9vw, 5.2rem);
  line-height: .95;
  margin-bottom: .8rem;
  letter-spacing: -.015em;
}
.portal-hero h1 .wob-1 { display: inline-block; transform: rotate(-3deg); color: var(--orange); }
.portal-hero h1 .wob-2 { display: inline-block; transform: rotate(2deg); color: var(--pink); }
.portal-hero p {
  font-family: var(--ff-read);
  font-size: 1.25rem;
  color: var(--ink-soft);
  max-width: 540px;
  margin: 0 auto;
  transform: rotate(-.4deg);
  display: inline-block;
}

/* Game grid — each card is a tilted slip of paper. */
.portal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem 2.4rem;
  padding: 1.5rem 0 4rem;
}

.game-card {
  position: relative;
  display: block;
  padding: 1.6rem 1.5rem 1.4rem;
  background: var(--paper-2);
  border: 3px dashed var(--ink);
  border-radius: 22px 14px 26px 18px / 18px 26px 14px 22px;
  color: var(--ink);
  text-decoration: none;
  transform: rotate(-1.4deg);
  transition: transform .15s ease, box-shadow .15s ease;
  box-shadow: 0 8px 22px -10px rgba(42,28,16,.35);
}
.game-card:nth-child(2n) { transform: rotate(1.6deg); }
.game-card:nth-child(3n) { transform: rotate(-.8deg); }
.game-card:hover {
  transform: rotate(0) translateY(-3px) scale(1.02);
  text-decoration: none;
  box-shadow: 0 16px 30px -14px rgba(42,28,16,.45);
}

.game-card-title {
  font: 400 2.2rem/1 var(--ff-goofy);
  color: var(--ink);
  margin-bottom: .6rem;
  display: block;
}
.game-card-title .bang { color: var(--orange); display: inline-block; transform: rotate(8deg); }

.game-card-tag {
  display: inline-block;
  font: 400 .95rem var(--ff-goofy);
  color: var(--pink);
  transform: rotate(-2.5deg);
  margin-bottom: .4rem;
}

.game-card-desc {
  font: 1.1rem/1.45 var(--ff-read);
  color: var(--ink);
  margin-bottom: .9rem;
}

.game-card-meta {
  font: .9rem var(--ff-read);
  color: var(--ink-soft);
}

.game-card--soon {
  opacity: .82;
  filter: saturate(.85);
}
.game-card--soon::after {
  content: "soon";
  position: absolute;
  top: -.6rem; right: -.4rem;
  background: var(--sun);
  color: var(--ink);
  font: 400 .9rem var(--ff-goofy);
  padding: .2rem .55rem;
  border: 2px solid var(--ink);
  border-radius: 8px 12px 8px 12px;
  transform: rotate(8deg);
}

@media (max-width: 720px) {
  .portal-hero { padding: 2rem 0 1.4rem; }
  .portal-hero h1 { margin-bottom: .5rem; }
  .portal-grid { gap: 1.4rem; padding: 1rem 0 2.6rem; }
  .game-card { padding: 1.2rem 1.2rem 1rem; }
  .game-card-title { font-size: 1.9rem; }
}
`;
