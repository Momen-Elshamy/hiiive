# Home v2 — Story & copy

Status: **draft 3**, all five scenes built at `/home-v2` · Branch: `feat/home-v2-story`

## The idea in one line

**The lab where AI gets to work.**
Hiiive is an AI lab and tech house: smart people and smart systems inventing AI products, agent systems, SaaS, custom software and AI-powered services (SEO, GEO). Co-developing with one company and turning the result into SaaS is one proven path, not the whole story.

## The story arc

| # | Beat | What it says |
|---|---|---|
| 1 | Hero | Hiiive is the lab where AI gets to work on your hardest problems. |
| 2 | The spark | We find the pattern in the noise. |
| 3 | The gate | We build inside real work: agents, internal tools, custom software. |
| 4 | The core | Every build makes the lab smarter: a reusable core with products on top. |
| 5 | Many | Built with one, made for many: from Berlin across Germany. |

One camera, one continuous scroll. Each scene turns into the next one; nothing cuts.

## Look

- **Palette:** brand charcoal with one glowing line of HIIIVE yellow (`--hv-accent`, `#f7f42c`), like the brand renders. The aurora keeps cool steel/teal curtains but burns yellow along its lower edge; the spark is yellow and casts warm white light on charcoal beads.
- **Header (night variant):** transparent over the story, dark glass once you scroll, CTA with a glowing yellow edge. The email link is hidden here. Only active on `/home-v2` for now.

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

## Scene 3 — The gate

**Visual:** the bead field folds up on two hinges into the walls of a gate of light (ref 05). The spark flies ahead down the middle and leaves a thin yellow line on the floor; the camera follows it through.

- **Kicker:** 02 · Inside real work
- **Headline:** We build where the work happens.
- **Body:** Our engineers sit inside your team, on your real data and processes. Agents, internal tools and custom software, live in production, not in a sandbox.

## Scene 4 — The core

**Visual:** the particles stream out of the walls onto three charcoal hex plates with thin glowing yellow rims (the brand cube, as a hive cell; refs 06, 07, 08). The plates separate into an exploded stack. The middle plate carries a network of glowing nodes. Service labels ride an orbit ring around it, and a `+` hotspot on each plate opens a short card (ref 01).

- **Kicker:** 03 · The core
- **Headline:** Every build makes the lab smarter.
- **Body:** What proves itself becomes a reusable core of data, models and agents, with products on top. Ready for the next company, and the next service.
- **Hotspots (bottom → top):**
  - **Data:** your systems, documents and history, connected.
  - **Models & agents:** AI that reasons, decides and takes real work off your team.
  - **Products & services:** SaaS, internal tools and AI-powered services like SEO and GEO.
- **Orbit labels:** AI agents · SaaS products · Custom software · SEO & GEO · Internal tools

## Scene 5 — Many

**Visual:** the core shrinks into a small glowing pin on Berlin while its beads rain down into a honeycomb dot map of Germany. The map lights up outwards from Berlin and light trails arc to ten cities (ref 04), each landing with a ping and a label.

- **Kicker:** 04 · Made for many
- **Headline:** Built with one. Made for many.
- **Body:** From Berlin across Germany, our SaaS products and AI-powered services carry what we learn to every company that needs it.
- **Numbers:** 12+ AI systems in production · 6 wks to a first release · 4 industries

## CTA

Over the lit map.

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

- **three.js (built):** all five scenes run in real time from one particle system; one scroll progress value drives everything. Code: `components/pages/HomeV2/` (`storyTimeline.js` holds every scroll range, `storyCamera.js` the camera path).
- **Review a frame (dev only):** `/home-v2?p=0.77` pins the story to one moment; `?spark=blue` swaps the yellow spark for the blue one.
- **Mobile:** fewer particles, its own camera framing, copy at the bottom; hotspots and city labels hidden.
- **Google Flow (not needed yet):** images for posters, case photos and a reduced-motion fallback.
- **CMS (to do):** turn the story into one Puck block so the copy is editable in en + de.

## Open questions

1. Are the numbers still true: 12+ AI systems in production, 6 wks to a first release, 4 industries?
2. Market: "Germany" (map + copy) or "DACH"?
3. Products to show after the story: SPOKY, Content OS, Komplyo — still the right three?
4. German copy for every scene (the story is English only so far).
