# Home v2 — Story & copy

Status: **draft 2**, scenes 1–2 built at `/home-v2` · Branch: `feat/home-v2-story`

## The idea in one line

**The lab where AI gets to work.**
Hiiive is an AI lab and tech house: smart people and smart systems inventing AI products, agent systems, SaaS, custom software and AI-powered services (SEO, GEO). Co-developing with one company and turning the result into SaaS is one proven path, not the whole story.

## The story arc

| # | Beat | What it says |
|---|---|---|
| 1 | Hero | Hiiive is the lab where AI gets to work on your hardest problems. |
| 2 | The spark | We find the pattern in the noise. |
| 3 | The gate | We solve the problem *with* one company, inside its real work. |
| 4 | The core | What works becomes a product. |
| 5 | Many | The product serves the market, and every solution makes us sharper. |

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

**Visual:** the camera flies between two walls of light (ref 05) into the lab. The ripple-aligned particles stream through with it.

- **Kicker:** 02 · Co-developed
- **Headline:** We solve it with one company first.
- **Body:** Our engineers sit inside your team and build on your real operations: your data, your people, your edge cases. In production, not in a sandbox.

## Scene 4 — The core

**Visual:** the particles settle into a hexagonal core built from stacked layers (refs 06, 07, 08). Service labels orbit it (ref 08). `+` hotspots sit on each layer (ref 01).

- **Kicker:** 03 · Productized
- **Headline:** What works becomes a product.
- **Body:** The system we build with you gets hardened into a solution, ready for the next company with the same problem.
- **Layer hotspots:**
  - **Data:** your systems, documents and history, connected.
  - **Agents:** AI that takes real work off your team.
  - **Product:** the interface your people actually use.
- **Orbit labels:** AI agents · Internal tools · MVPs · Visibility · Funnels

## Scene 5 — Many

**Visual:** light trails sweep out of the core (ref 04) across a dot map of Germany. Cities light up one by one. On every full orbit the core gains one more layer.

- **Kicker:** 04 · Made for many
- **Headline:** Built with one. Made for many.
- **Body:** Every solution goes to market across Germany, and every one makes us sharper. The next problem gets solved faster, and bigger.
- **Numbers on the map:** 12+ tools in production · 6 wks to first release · 4 industries

## CTA

- **Headline:** Bring us the problem.
- **Body:** Tell us what slows your team down. We'll tell you if we can build it, and how fast.
- **Button:** Book a call

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

- **three.js:** scenes 1, 2, 4, 5 (particles, ripple, hex core, light trails). One scroll progress value drives the whole scene.
- **Google Flow video:** scene 3 (the gate), or a backup for any scene that is too heavy in real time.
- **Google Flow images:** posters, mobile fallbacks, textures, case photos.
- **Mobile:** fewer particles, or a pre-rendered fallback.
- **CMS:** the story is one Puck block so the copy stays editable in en + de.

## Open questions

1. Scenes 3–5 tell the co-develop → product path. Keep it as one chapter, or widen it to cover agents, SaaS, custom software and AI-powered services too?
2. Scene 5 headline still says *Built with one. Made for many.* Keep it there?
3. Are the numbers still true: 12+ tools, 6 wks, 4 industries?
4. Market: say "Germany" or "DACH"?
5. Products to show: SPOKY, Content OS, Komplyo — still the right three?
