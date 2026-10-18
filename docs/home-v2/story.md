# Home v2 — Story & copy

Status: **draft 6**, scenes 1–3 + CTA built at `/home-v2` · Branch: `feat/home-v2-story`

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

One scene, one camera, no cuts: the pattern from scenes 1–2 is the factory's floor. The camera pulls back from it while the factory rises out of the floor, until the whole factory is in view.

## Look

- **Palette:** brand charcoal with one glowing line of HIIIVE yellow (`--hv-accent`, `#f7f42c`), like the brand renders. The aurora keeps cool steel/teal curtains but burns yellow along its lower edge; the spark is yellow and casts warm white light on charcoal beads.
- **Header (night variant):** transparent over the story, dark glass once you scroll, CTA with a glowing yellow edge. The email link is hidden here. Only active on `/home-v2` for now.

## Rules from review

- **No hexagons, honeycombs, hives or bees.** The name HIIIVE has nothing to do with bees, so the visuals never play on it.
- **Hiiive is a software factory.** From the Phrasso reference (ref 01) the point is the factory machine itself and its render quality, not only the `+` checkpoints. A first take on scenes 3–5 (gate, hex core, Germany map) was cut for missing both.
- **Change texture and light, not shapes,** when polishing what was approved.
- **Type:** sentence case everywhere, Inter at weight 500 with tight tracking for headings. No all caps, no heavy display type (the HIIIVE logo keeps its own font).
- **Talk about the company, not service details.** Sections explain what makes Hiiive different, without slogans; services and numbers stay secondary.
- **No camera tour of the factory's parts.** Once the whole factory is in view the camera holds still.
- **No hard transitions.** A crossfade and a dip to black between the pattern and the factory were both rejected; the pattern has to flow into the factory. It is the factory's floor, not its roof.

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

**Visual:** an isometric factory in the Phrasso style (ref 01): matte off-white modules with a painted yellow band under each top plate, a glass intake tube, a glass build line, a quality gate and four output lanes of LED chips, on a dark floor.

**Transition (pull back, factory rises):** the bead field from scene 2 is the factory's floor. The camera pulls back and up from it while the factory rises out of the floor as an unlit silhouette, lit from inside by the spark, which goes into the AI lab. The field stays as the floor under the whole line, flattening out and fading at its edges.

**Scroll ("power on"):** with the whole factory in view the camera holds still. Each station powers on as it becomes the active step, from intake to output: its slits, LEDs and floor glow switch on and its parts start moving, while the room light comes up. The stepper on the left and the glowing `+` of the active station show where you are.

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

### Why Hiiive

What sets the company apart, not a list of services (a services bento was cut for being crowded and too detailed).

- **Headline:** An AI lab, not an agency.
- **Intro:** Agencies deliver a project and move on. We build our own products, run on our own AI, and keep building what we ship.
- **Points** (copy left, one isometric illustration right, in the factory's look: modules with the yellow band on a bead floor):
  1. **We run it ourselves first.** Our products and the AI behind our services run in our own company first (Content OS in daily use, Spoky with real users, Komplyo in build). Illustration: the three products as modules, live / validating / in build.
  2. **Built with one, made for many.** What we build with one company becomes a product the next one starts from. Illustration: one module feeding five smaller ones along lit lanes.
  3. **Senior people, inside your team.** The people you meet build; no layers, no hand-offs. Illustration: a team as dark blocks with three lit Hiiive blocks among them.
- **Part of:** NVIDIA Inception, KI Bundesverband, Telekom TechBoost, Berlin Partner, Wayra (white versions in `public/img/home-v2/partners/`).

### 04 · Proof (photo cards, ref 10)

- **Headline:** Proof, not promises. (copy and numbers from the live /work page)
- **Cards** in a carousel that runs to the screen edge: Mindverse (3.4×, drawn as a growth chart), ahead (2 wks, FIBO 2026 booth photo), Wavelr (8 wks, solar field photo), then a "Book a call" card.
- **Images:** Google Flow was out of credits, so Mindverse has a chart instead of a photo and Wavelr uses a crop of its existing image without the baked-in logo. Swap in Flow photos once credits refresh.

### Still to do

- **Footer:** the current footer is light (paper); the new home needs a dark variant like the header.

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

- **One three.js scene** (`components/pages/HomeV2/homeScene.js`): the factory, standing on scenes 1–2 as a particle layer (`storyLayer.js`) laid out as its floor. The camera follows the story camera inside the pattern, then pulls back (distance grows exponentially) to a fixed shot of the whole line, sized to the viewport so it always sits right of the copy; the factory rises out of the floor on the way.
- **The factory** is modelled in code (`factory/factoryModel.js`): each station owns its lights and moving parts, so it can power on by itself. Lit like a product shot: area lights, crisp shadows, AO, bloom on the light slits only, film grain and a vignette.
- **One timeline** (`homeTimeline.js`) in screens of scroll drives the scene and the copy: story, pull-out, station power-on, CTA.
- **Review a moment (dev only):** `/home-v2?s=5.2` pins the story at 5.2 screens; `/home-v2/factory` is the factory look-dev page.
- **Mobile:** fewer particles, no AO, the factory framed in the top half with the copy at the bottom; only the active station's text shows.
- **Google Flow (not needed so far):** images for posters, case photos and a reduced-motion fallback.
- **CMS (to do):** turn the story into Puck blocks so the copy is editable in en + de.

## Open questions

1. Are the numbers still true for the sections after the story (12+ systems, 6 wks, 4 industries)?
2. Products to show after the story: SPOKY, Content OS, Komplyo — still the right three?
3. German copy for every scene (English only so far).
