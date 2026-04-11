// Maze-specific styles. Layered on top of @kcodes/ui's BASE_CSS via the
// extraCss prop on Layout. The placeholder home page only needs a hero
// block for now — actual maze gameplay styles will be added when the
// renderer + solver land.

export const MAZE_CSS = String.raw`/* maze.kcodes.me — game-specific styles */

.maze-hero {
  padding: 3.5rem 0 2.4rem;
  position: relative;
  text-align: center;
}
.maze-hero::before {
  content: "✦";
  position: absolute;
  top: .8rem; left: 14%;
  font-size: 2.4rem;
  color: var(--lav);
  transform: rotate(-12deg);
}
.maze-hero::after {
  content: "✿";
  position: absolute;
  top: 1.1rem; right: 12%;
  font-size: 2.2rem;
  color: var(--teal);
  transform: rotate(14deg);
}
.maze-hero h1 {
  font-size: clamp(2.8rem, 9vw, 5rem);
  line-height: .95;
  margin-bottom: .9rem;
  letter-spacing: -.015em;
}
.maze-hero h1 .wob-1 { display: inline-block; transform: rotate(-3deg); color: var(--teal); }
.maze-hero h1 .wob-2 { display: inline-block; transform: rotate(2deg); color: var(--lav); }
.maze-hero p {
  font-family: var(--ff-read);
  font-size: 1.25rem;
  color: var(--ink-soft);
  max-width: 540px;
  margin: 0 auto;
  transform: rotate(-.4deg);
  display: inline-block;
}

.maze-coming-soon {
  display: inline-block;
  margin-top: 1.6rem;
  padding: .9rem 1.6rem;
  font: 400 1.4rem var(--ff-goofy);
  color: var(--ink);
  background: var(--sun);
  border: 3px dashed var(--ink);
  border-radius: 18px 26px 14px 22px / 22px 14px 26px 16px;
  transform: rotate(-1.5deg);
}
`;
