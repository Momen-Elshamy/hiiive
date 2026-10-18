# Home v2 — Story & copy

Status: **draft 4**, scenes 1–3 + CTA built at `/home-v2` · Branch: `feat/home-v2-story`

## The idea in one line

**The lab where AI gets to work.**
Hiiive is an AI lab and tech house: smart people and smart systems inventing AI products, agent systems, SaaS, custom software and AI-powered services (SEO, GEO). Co-developing with one company and turning the result into SaaS is one proven path, not the whole story.

## The story arc

| # | Beat | What it says |
|---|---|---|
| 1 | Hero | Hiiive is the lab where AI gets to work on your hardest problems. |
| 2 | The spark | We find the pattern in the noise. |
| 3 | The software factory | Problems go in, working software comes out, station by station. |
| — | CTA | Bring us your hardest problem. |

Scenes 1–2 are one particle system on one camera; the factory crossfades in over the last frame of scene 2.

## Look

- **Palette:** brand charcoal with one glowing line of HIIIVE yellow (`--hv-accent`, `#f7f42c`), like the brand renders. The aurora keeps cool steel/teal curtains but burns yellow along its lower edge; the spark is yellow and casts warm white light on charcoal beads.
- **Header (night variant):** transparent over the story, dark glass once you scroll, CTA with a glowing yellow edge. The email link is hidden here. Only active on `/home-v2` for now.

## Rules from review

- **No hexagons, honeycombs, hives or bees.** The name HIIIVE has nothing to do with bees, so the visuals never play on it.
- **Hiiive is a software factory.** From the Phrasso reference (ref 01) the point is the factory machine itself and its render quality, not only the `+` checkpoints. A first take on scenes 3–5 (gate, hex core, Germany map) was cut for missing both.

---

## Scene 1 — Hero

**Visual:** dark space full of drifting particles, bending into aurora bands with a yellow lower edge (ref 03 + brand). Nothing lines up yet.

- **Kicker:** HIIIVE · AI lab & tech house, Berlin
- **Headline:** The lab where AI gets to work **on your hardest problems.**
- **Sub:** Smart people and smart systems, inventing AI products, agents and software, and putting them to work for real companies.
- **CTAs:** Book a call · See what we build
- **Tags:** AI agents · SaaS products · Custom software · AI-powered SEO & GEO

## Scene 2 — The spark

**Visual:** a single drop of yellow light falls into the field (ref 02). On impact a ripple runs out and the particles snap into a grid of charcoal beads.

- **Kicker:** 01 · The spark
- **Headline:** We find the pattern in the noise.
- **Body:** A senior crew of engineers and AI specialists. We spot the work companies keep doing by hand, and build the AI that does it for them.

## Scene 3 — The software factory

**Visual:** an isometric factory in the Phrasso style (ref 01): matte off-white modules with a painted yellow band under each top plate, a glass intake tube, a glass build line, a quality gate and four output lanes of LED chips, on a dark floor. It fades in over the last frame of scene 2. Scroll moves the camera from station to station, then pulls back to the whole line.

- **Kicker:** 02 · The software factory
- **Headline:** Problems go in. Working software comes out.
- **Stations** (a stepper on the left; the active one opens, and a `+` checkpoint on each station jumps to it):
  1. **Intake:** Real problems in. We start inside your team, with the work that slows it down.
  2. **AI lab:** We design the models and agents that can take that work on.
  3. **Build line:** Engineers and AI turn it into real software and internal tools, fast.
  4. **Quality gate:** Only what works in production ships. The rest goes back in.
  5. **Shipped:** SaaS products, AI agents, custom software and AI-powered SEO & GEO.

## CTA

Over the final overview of the factory.

- **Kicker:** Your turn
- **Headline:** Bring us your hardest problem.
- **Body:** Tell us what slows your team down. We'll show you what AI can do about it, and how fast.
- **Buttons:** Book a call · See what we build

---

## After the story

| Section | Style | Content |
|---|---|---|
| Products & services | Bento cards (ref 09): dark card, dot grid, one coloured glow, small UI mock or a WebM loop | SPOKY · Content OS · Komplyo + the 5 Studio services |
| Cases | Photo cards (ref 10): desaturated photo, client logo top-left, result as the headline, carousel | −64% manual ticket handling · 7 wks to paid pilot · 3.2× organic sessions |
| Final CTA + footer | Current footer | — |

---

## References

All images are in `refs/`.

| # | Source | What we take | Used in | How they built it |
|---|---|---|---|---|
| 01 | [phrasso.com](https://phrasso.com) | Isometric "factory" + `+` hotspots | Scene 4 hotspots | 8 s pre-rendered 3D video loop + HTML buttons |
| 02 | [Harness (Pixel Point)](https://pixel-point-harness.vercel.app) | Light drop + rippling disc field | Scene 2 | 13 s video in a 6500px sticky section, played in segments on scroll |
| 03 | Colorpong *Aurora* | Particle bands, blue → green | Scene 1 | Image |
| 04 | *Luminal* cover | Glowing orbital light trails | Scene 5 | Image |
| 05 | Light corridor | Two walls of light, a passage | Scene 3 | Image |
| 06 | Palantir Q3 update | Exploded isometric layers with labels | Scene 4 | Image |
| 07 | Layer stack video | Particles → glass → grid → network → glowing base | Scene 4 | Video |
| 08 | [invertase.io](https://invertase.io) | Hex core of stacked layers + orbit labels | Scene 4 | 9 s WebM loop + SVG rings and labels |
| 09 | [invertase.io](https://invertase.io) | Bento cards | Products & services | CSS + WebM loops |
| 10 | [Harness (Pixel Point)](https://pixel-point-harness.vercel.app) | Customer photo cards | Cases | CSS + images |

**Shared look:** black/navy background · light is the hero (glow + bloom) · blue → teal/green, with a warm accent only on key moments · particles turning into structure · isometric layers.

## How we build it

- **three.js, real time:** scenes 1–2 are one particle system (`components/pages/HomeV2/storyScene.js`, scroll ranges in `storyTimeline.js`). The factory is modelled in code (`factory/factoryModel.js`), lit like a product shot (`factory/factoryView.js`: area lights, crisp shadows, AO, bloom on the light slits only, grain and vignette) and toured on scroll (`factory/factoryTour.js`).
- **Review a frame (dev only):** `/home-v2?p=0.6` pins scenes 1–2, `/home-v2?f=0.53` pins the factory tour; `/home-v2/factory` is the factory look-dev page.
- **Mobile:** fewer particles, no AO, its own camera framing with the scene in the top half and the copy at the bottom; only the active station's text shows.
- **Google Flow (not needed so far):** images for posters, case photos and a reduced-motion fallback.
- **CMS (to do):** turn the story into Puck blocks so the copy is editable in en + de.

## Open questions

1. Are the numbers still true for the sections after the story (12+ systems, 6 wks, 4 industries)?
2. Products to show after the story: SPOKY, Content OS, Komplyo — still the right three?
3. German copy for every scene (English only so far).
