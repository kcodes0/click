export const PUZZLE_CSS = String.raw`/* confuzzled — spatial puzzle styles */

.pz-hero{padding:3.5rem 0 2.4rem;position:relative;text-align:center}
.pz-hero::before{content:"★";position:absolute;top:1rem;left:12%;font-size:2.4rem;color:var(--sun);transform:rotate(-12deg)}
.pz-hero::after{content:"✦";position:absolute;top:1rem;right:10%;font-size:2.2rem;color:var(--teal);transform:rotate(14deg)}
.pz-hero h1{font-size:clamp(2.6rem,9vw,5rem);line-height:.95;margin-bottom:.9rem;letter-spacing:-.015em}
.pz-hero h1 .wob-1{display:inline-block;transform:rotate(-3deg);color:var(--orange)}
.pz-hero h1 .wob-2{display:inline-block;transform:rotate(2deg);color:var(--lav)}
.pz-hero p{font-family:var(--ff-read);font-size:1.25rem;color:var(--ink-soft);max-width:540px;margin:0 auto 1.6rem;transform:rotate(-.4deg);display:inline-block}

.pz-shell{position:relative}
.pz-topline{display:flex;justify-content:space-between;gap:1.6rem 1.5rem;align-items:flex-start;margin-bottom:1.4rem;flex-wrap:wrap}
.pz-bar{flex:1 1 auto;min-width:0}
.pz-title{font-size:clamp(2rem,4.5vw,2.8rem);line-height:1;display:inline-block;transform:rotate(-2deg);color:var(--lav)}
.pz-stats{display:flex;gap:1.4rem;flex-wrap:wrap;align-items:flex-start}
.pz-stats .stat-val{color:var(--lav)}
.pz-stats .stat--timer .stat-val{color:var(--orange);font-size:2rem}
.pz-canvas{display:flex;justify-content:center;padding:1rem 0 1.4rem}

/* shared grid */
.pz-grid{display:grid;gap:0;width:min(100%,420px);aspect-ratio:1;border:3px solid var(--ink);border-radius:6px;overflow:hidden}
.pz-cell{position:relative;display:flex;align-items:center;justify-content:center;background:var(--paper);color:var(--ink);font:400 clamp(1.1rem,4vw,1.6rem) var(--ff-goofy);border:1px solid rgba(42,28,16,.25);cursor:pointer;user-select:none;-webkit-user-select:none;padding:0;aspect-ratio:1;-webkit-tap-highlight-color:transparent;transition:background .1s ease}
.pz-cell:hover:not(:disabled){background:rgba(255,207,43,.15)}

@keyframes pz-solved{0%{transform:scale(1)}50%{transform:scale(1.02)}100%{transform:scale(1)}}
.pz-grid.solved,.nono-table.solved,.tents-table.solved{animation:pz-solved .5s ease}
.pz-grid.solved .pz-cell{background:rgba(16,191,160,.18)}

.pz-actions{display:flex;gap:1rem;margin-top:1.2rem;flex-wrap:wrap;align-items:center}

/* rules */
.pz-rules{margin-top:1.2rem;padding:1rem 1.4rem 1.2rem;border:3px dashed var(--ink);border-radius:18px 26px 14px 22px/22px 14px 26px 16px;background:rgba(255,251,240,.85);max-width:600px}
.pz-rules h3{font:400 1.4rem var(--ff-goofy);color:var(--lav);display:inline-block;transform:rotate(-2deg);margin:0 0 .6rem}
.pz-rules-list{margin:0;padding:0 0 0 1.5rem;font:1rem/1.6 var(--ff-read);color:var(--ink)}
.pz-rules-list li{padding:.2rem 0}
.pz-rules-list li::marker{color:var(--lav);font-family:var(--ff-goofy);font-weight:700}

/* result */
.result-banner{margin:.8rem 0;padding:.8rem 1.2rem;border:3px dashed var(--teal);border-radius:14px 22px 14px 22px/20px 14px 22px 14px;background:rgba(16,191,160,.12);font-family:var(--ff-read);transform:rotate(-.3deg)}
.result-banner.hidden{display:none}

/* leaderboard */
.pz-side{margin-top:1.6rem}
.pz-side-heading{font:400 1.4rem var(--ff-goofy);color:var(--lav);margin-bottom:.6rem;display:inline-block;transform:rotate(-3deg)}
.board-table{width:100%;border-collapse:collapse;font-family:var(--ff-read);font-size:1.1rem}
.board-table th{text-align:left;font:400 1.05rem var(--ff-goofy);color:var(--lav);padding:.5rem .4rem;border-bottom:3px dashed var(--ink)}
.board-table td{padding:.55rem .4rem;border-bottom:2px dotted rgba(42,28,16,.25)}
.board-table tbody tr:hover td{background:rgba(255,207,43,.25)}
.board-table td:first-child{font:400 1.4rem var(--ff-goofy);width:2.4rem;color:var(--ink-soft)}
.board-table tbody tr:nth-child(1) td:first-child{color:var(--sun)}
.board-table tbody tr:nth-child(2) td:first-child{color:#b7a890}
.board-table tbody tr:nth-child(3) td:first-child{color:var(--orange)}
.board-table--wide{overflow-x:auto;display:block}

/* daily hub */
.hub{max-width:700px;margin:0 auto}
.hub-header{text-align:center;margin-bottom:1.6rem}
.hub-date{font:400 2rem var(--ff-goofy);color:var(--lav);transform:rotate(-1.5deg);display:inline-block}
.hub-subtitle{font:1rem var(--ff-read);color:var(--ink-soft);margin-top:.3rem}
.hub-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem}
.hub-card{display:flex;flex-direction:column;align-items:center;gap:.4rem;padding:1.2rem .8rem;border:3px solid var(--ink);border-radius:16px 22px 14px 20px/20px 14px 22px 16px;background:var(--paper);text-decoration:none;color:var(--ink);transition:transform .12s ease,background .12s ease;text-align:center}
.hub-card:hover{transform:rotate(-1deg) scale(1.03);background:var(--paper-2)}
.hub-card-diff{font:700 .75rem var(--ff-read);text-transform:uppercase;letter-spacing:.08em;padding:.15rem .5rem;border-radius:6px;color:var(--paper)}
.hub-card--medium .hub-card-diff{background:var(--teal)}
.hub-card--hard .hub-card-diff{background:var(--orange)}
.hub-card--expert .hub-card-diff{background:var(--pink)}
.hub-card-name{font:400 1.4rem var(--ff-goofy);color:var(--ink)}
.hub-card-cta{font:400 1.1rem var(--ff-goofy);color:var(--lav)}
.hub-card-time{font:400 1.3rem var(--ff-goofy);color:var(--teal)}
.hub-card--done{border-style:dashed;border-color:var(--teal);background:rgba(16,191,160,.08)}
.hub-leaderboard{margin-top:1rem}

/* nonogram */
.nono-wrapper{display:flex;justify-content:center}
.nono-table{border-collapse:collapse;user-select:none;-webkit-user-select:none}
.nono-table td{width:clamp(28px,5vw,42px);height:clamp(28px,5vw,42px);text-align:center;vertical-align:middle;font:700 clamp(.7rem,2vw,.95rem) var(--ff-goofy)}
.nono-corner{background:transparent}
.nono-col-clue{color:var(--lav);background:transparent;padding:1px 2px}
.nono-row-clue{color:var(--lav);background:transparent;padding:1px 4px}
.nono-cell{border:1px solid rgba(42,28,16,.3);background:var(--paper);cursor:pointer;transition:background .08s}
.nono-cell:hover{background:rgba(255,207,43,.15)}
.nono-cell--filled{background:var(--ink) !important}
.nono-cell--x{background:var(--paper);color:var(--ink-soft);font-size:1.2rem}
.nono-cell--x::after{content:"×";opacity:.4}
.nono-table.solved .nono-cell--filled{background:var(--teal) !important}

/* star battle */
.sb-grid{width:min(100%,420px)}
.sb-cell{font-size:clamp(1.2rem,4vw,1.8rem);color:var(--orange)}
.sb-cell--star{background:rgba(255,207,43,.3) !important}
.sb-border-l{border-left:3px solid var(--ink) !important}
.sb-border-r{border-right:3px solid var(--ink) !important}
.sb-border-t{border-top:3px solid var(--ink) !important}
.sb-border-b{border-bottom:3px solid var(--ink) !important}
.sb-grid.solved .sb-cell--star{background:rgba(16,191,160,.3) !important}

/* tents */
.tents-wrapper{display:flex;justify-content:center}
.tents-table{border-collapse:collapse;user-select:none;-webkit-user-select:none}
.tents-table td{width:clamp(32px,5.5vw,48px);height:clamp(32px,5.5vw,48px);text-align:center;vertical-align:middle;font-size:clamp(1rem,3vw,1.4rem)}
.tents-corner{background:transparent}
.tents-col-clue,.tents-row-clue{font:700 clamp(.8rem,2vw,1.1rem) var(--ff-goofy);color:var(--lav);background:transparent}
.tents-cell{border:1px solid rgba(42,28,16,.25);background:var(--paper);cursor:pointer;transition:background .08s}
.tents-cell:hover{background:rgba(255,207,43,.12)}
.tents-cell--tree{background:rgba(16,191,160,.15);cursor:default;font-size:clamp(.9rem,2.5vw,1.2rem)}
.tents-cell--tree:hover{background:rgba(16,191,160,.15)}
.tents-cell--tent{background:rgba(255,107,26,.2)}
.tents-cell--grass{color:var(--ink-soft);opacity:.4}
.tents-table.solved .tents-cell--tent{background:rgba(16,191,160,.25)}

@media(max-width:720px){
  .pz-topline{flex-direction:column;gap:.6rem}
  .pz-stats{width:100%}
  .pz-title{font-size:1.6rem}
  .pz-grid{width:100%}
  .board-table--wide{font-size:.85rem}
  .board-table--wide th,.board-table--wide td{padding:.35rem .25rem}
}
@media(max-width:600px){.hub-cards{grid-template-columns:1fr}}
`;
