# Roadmap — Hand-built 3D World (Blender → Web)

Goal: a stylised (not photoreal) beachfront building you walk through with arrow
keys, balconies over the sea, soft grass and waves, and a room per project
category. It loads as a bare mesh, then **textures animate in** to bring it to
life, with "Welcome" / "Feel free to explore my projects" titles and a camera
pan to the entrance steps.

This roadmap is built so **you design the look in Blender** and **I (AI) turn it
into the website**. You never have to touch the hard code; I never have to guess
the look. We hand off through **one file** (`world.glb`).

---

## 0. The golden rule — who does what

| You (in Blender) | Me (in the website code) |
| --- | --- |
| The **look**: shapes, layout, rooms, balcony, steps, props, materials/textures, lighting mood | Loading the `.glb`, the **texture-reveal animation**, intro titles + logo |
| Place named markers (spawn point, room doors, display slots) | **Arrow-key movement**, looking around, collision (you can't walk through walls) |
| Export one optimised `world.glb` | **Room entry**, showing your projects on the display slots |
| Re-export whenever you change something | Soft **grass-in-wind + animated water** shaders, sky, polish, deploy |

**Why this split works:** you keep full creative control and can iterate the
world forever without me; I keep the parts you can't edit. Every time you
re-export `world.glb` and drop it in, the site updates. Tight feedback loop.

> The fancy "fade out of my existing portfolio → white → logo → into the 3D
> site" transition is **deliberately NOT part of this project** (your call, and
> correct). It's a small effect we bolt onto the *existing* site at the very
> end. Parked in Phase 8.

---

## 1. How the pieces connect — the handoff contract

When you export, follow these so it drops straight into the site. Don't stress
about perfection — at minimum give me `world.glb` and tell me roughly where
things are; I can place markers myself. But if you add these, it's plug-and-play.

**File**
- [ ] Export as **glTF Binary (`.glb`)**, one file, named `world.glb`.
- [ ] **Apply transforms before export** (select all, `Ctrl+A` → All Transforms). Skipping this is the #1 beginner bug — things load rotated/giant.
- [ ] Scale is real-world-ish: a **door ≈ 2 m**, a step ≈ 0.2 m. (Blender's units are metres; the web uses the same.)
- [ ] **+Z is up** in Blender; the glTF exporter converts to the web's +Y-up automatically — just don't fight it.

**Named markers** — add via `Shift+A → Empty → Plain Axes`, then rename in the
top-right Outliner (double-click the name). Names are case-sensitive:
- [ ] `spawn` — where the visitor stands when the walk begins.
- [ ] `cam_welcome` — (optional) a nice camera spot for the opening "Welcome" shot.
- [ ] One per room, at its doorway: `room_python`, `room_powerbi`, `room_ai`, `room_web`, `room_games`, `room_mobile`, `room_extensions`.
- [ ] Display slots inside rooms: `slot_python_1`, `slot_python_2`, … (a small empty where each project's screen/pedestal should sit). Don't have enough? I'll auto-fill spares.

**Keep it web-light** (a beginner-friendly budget):
- [ ] Whole scene under ~**200k triangles**, `world.glb` under ~**15 MB**.
- [ ] Textures **1K–2K** max; reuse the same material across many objects.
- [ ] Tick **Draco compression** in the export panel if it's there.

I'll give you a one-click Blender **export-check script** (paste-and-run) that
verifies all of the above before you hand it over.

---

## 2. Reality check — using AI to design in Blender

What AI is **actually** good for here (and what it isn't):

- ❌ "AI, build me a beach villa with rooms" → not a real button yet. Don't wait for it.
- ✅ **Kitbashing from free kits** — snap a building together from ready-made modular pieces. *This is your fastest path.* (Kenney, Quaternius — links below.)
- ✅ **AI props from text/images** — generate a single object (a deck chair, a planter, a statue, a surfboard) from a prompt, download `.glb`, import it. Tools: **Meshy**, **Tripo**, **Luma Genie**, **Rodin**. Great for one-off details, not whole scenes.
- ✅ **In-Blender asset browsers** — **BlenderKit** and **Poly Haven** add-ons let you drag finished models / materials / skies into your scene. This is the "import things into Blender" you remembered.
- ✅ **Me as your Blender tutor** — ask me the exact steps/hotkeys for *anything*, and I can **write Blender Python scripts** you paste into Blender's *Scripting* tab to automate boring jobs (scatter 50 grass clumps, rename all your room empties, set up a stylised material, lay out display slots in a grid). This is a big deal — lean on it.

**Bottom line:** download + kitbash + AI props + my scripts. You're the art
director assembling and arranging, not a sculptor starting from a blank cube.

---

## 3. The phases

Each phase has a clear "done when" and a handoff. **Phases 1–2 are the priority
— they get you walking your own layout in the browser within the first push.**

### Phase 1 — Blender Bootcamp (zero → comfortable)
**Goal:** you can move around, manipulate objects, import a model, apply a
material, and export a `.glb`. That's *all* you need to start.
- [ ] Learn the navigation (see the cheat-sheet in §4 — this fixes the "how do I even pan" pain).
- [ ] Watch **Grant Abbitt – "Get Good at Blender" / low-poly beginner series** (YouTube) *or* **Imphenzia – "Learn Low Poly Modeling in Blender"** (10-min, perfect for stylised). Skip the photoreal donut for now — wrong vibe for us.
- [ ] Practice: add a cube, move/rotate/scale it, give it a colour, import any free `.glb`, export the scene as `.glb`.
- **Done when:** you can do the above without googling. **Time: a focused half-day.**

### Phase 2 — Block out the world ("greybox") 🚦 *first real milestone*
**Goal:** the *layout*, in plain grey shapes — no textures, no detail. Building
footprint, the balcony over the sea, the entrance steps, one room per project
category, and a placeholder box where each display goes.
- [ ] Use big cubes/planes for floors, walls, balcony, steps. Ugly is fine.
- [ ] Place the named `spawn` + `room_*` empties (§1).
- [ ] Export `world.glb`.
- **Handoff → me:** I wire up arrow-key first-person movement + collision + room
  entry so **you can walk your own greybox in the browser.** You feel the space
  and fix the layout *before* spending hours on detail. **This is the modular
  heartbeat — we loop here until the layout feels right.** **Time: a day.**

### Phase 3 — Detail & kitbash
**Goal:** replace grey boxes with real stylised geometry.
- [ ] Swap placeholder walls/rails/steps for modular kit pieces (Kenney/Quaternius).
- [ ] Add props: furniture, plants, lamps, railings — from kits, BlenderKit, or AI-generated `.glb`s.
- [ ] Keep it low-poly and within the budget (§1).
- **Done when:** it reads as a real place in the greybox shape you validated. Re-export, re-walk. **Time: 1–3 sessions.**

### Phase 4 — Materials & texture (the stylised "soft" look)
**Goal:** colour and surface. Stylised = mostly flat/soft colours + a few
textures, *not* photoreal.
- [ ] Apply materials (Principled BSDF). For stylised, simple base colours + low roughness variation go a long way.
- [ ] Use a few PBR textures from Poly Haven where it helps (wood deck, sand, stone).
- [ ] Materials/textures **export inside the `.glb` automatically** — you don't manage files separately.
- **Done when:** it looks like *your* place. **Time: 1–2 sessions.**

### Phase 5 — Lighting & atmosphere
**Goal:** the golden-hour, serene mood.
- [ ] Add a Sun lamp + maybe an HDRI sky (Poly Haven) for soft light.
- [ ] (Optional) **Bake** lighting to textures for a richer look that's cheap on the web — I'll give you a script + steps if you want this.
- **Done when:** the mood feels like "peace and serenity." **Time: a session.**

### Phase 6 — Markers, optimise, final export (the contract)
- [ ] Add/clean all named empties: `spawn`, `cam_welcome`, `room_*`, `slot_*` (§1).
- [ ] Run my **export-check script**; fix anything it flags.
- [ ] Export the final optimised `world.glb` (Draco on).
- **Handoff → me.** **Time: an hour.**

### Phase 7 — AI polish into the website (my part)
I take `world.glb` and build the experience:
- [ ] Load the model; **mesh-first → texture-reveal animation** (wireframe/clay → your materials sweep/dissolve in). You give me *one* textured model; I generate the "before" look from it — you don't make two versions.
- [ ] Intro: **logo fades in → slides to top-left → "Welcome" and "Feel free to explore my projects" fade in/out → camera pans to the entrance steps.**
- [ ] **Arrow-key movement** (walk, climb steps, look around) + collision.
- [ ] **Enter rooms** from the balcony; show your projects on the `slot_*` displays (pulled from the project data, like the current site).
- [ ] Soft **grass-in-wind** (instanced + wind shader) and **animated sea waves**; sky.
- [ ] Deploy to the live URL.
- **You stay in the loop:** tweak the world in Blender, re-export, I refresh. Repeat.

### Phase 8 — (Later, separate) Transition from the main portfolio
Not part of this project. When the 3D site is good, we add a **"View 3D"**
button to your existing portfolio that zooms + fades to white with your logo,
then loads the (white-background) 3D site so it feels seamless. Small, bolt-on.

---

## 4. Blender cheat-sheet — the only controls you need to start

> No middle mouse button (laptop/trackpad)? **Edit → Preferences → Input →**
> tick **"Emulate 3 Button Mouse"** (then use `Alt`+drag to orbit) and
> **"Emulate Numpad"**.

**Moving the view (your main pain point):**
- **Orbit** the view: hold **Middle Mouse Button** and drag
- **Pan**: **Shift + Middle Mouse** and drag
- **Zoom**: **scroll wheel**
- **Frame the selected object** (find a lost object): select it, press **Numpad .**
- Front / Side / Top view: **Numpad 1 / 3 / 7**; back to perspective: **Numpad 5**

**Working with objects:**
- **Select**: Left-click · select all: **A** · deselect: **Alt+A**
- **Move**: **G** (then move mouse, click to drop). Lock to an axis: press **X**, **Y**, or **Z** after G.
- **Rotate**: **R** · **Scale**: **S** (same axis-lock trick)
- **Add** something: **Shift+A**
- **Apply transforms** (do before export!): **Ctrl+A**
- **Edit the shape** of an object: **Tab** (toggles Edit / Object mode)
- **Delete**: **X** · **Duplicate**: **Shift+D** · **Save**: **Ctrl+S**

**Export:** File → Export → **glTF 2.0 (.glb)**. In the right-hand panel: Format =
*glTF Binary*, tick *Apply Modifiers*, and *Compression* (Draco) if shown.

If you forget any of this: **ask me** — I'll give the exact clicks for your task.

---

## 5. Toolbox & free assets (all free, mostly CC0)

**Build / assemble**
- **Blender** — blender.org (free)
- **BlenderKit** add-on — in-Blender browser of models, materials, HDRIs (free tier)
- **Poly Haven** + its Blender add-on — CC0 textures, HDRI skies, models

**Ready-made stylised / low-poly pieces (kitbash these)**
- **Kenney** — kenney.nl (Nature Kit, City Kit, Furniture Kit, Holiday Kit — ideal building blocks)
- **Quaternius** — quaternius.com (low-poly nature/buildings/props)
- **Sketchfab** — sketchfab.com (filter: *Downloadable* + *glTF*; check the licence)

**AI props (text/image → 3D, export `.glb`)**
- **Meshy** · **Tripo** · **Luma Genie** · **Rodin** — for one-off detail objects

**Learn (pick one, don't binge)**
- **Grant Abbitt** (YouTube) — friendliest beginner, game-asset focused
- **Imphenzia** "Learn Low Poly Modeling in Blender" — fast, stylised, exactly our vibe
- Official **Blender manual** for reference only

---

## 6. Start today — your first 3 actions

1. **Fix navigation** (10 min): open Blender, set "Emulate 3 Button Mouse" if needed, and drill orbit/pan/zoom until it's muscle memory (§4).
2. **Import something** (15 min): grab any free `.glb` from Kenney, do `File → Import → glTF`, and move it around. Now you know the core loop.
3. **Greybox the layout** (the real work): rough out the building + balcony + steps + one box per room, in plain grey. Don't texture anything yet.

Then export `world.glb`, hand it to me, and I'll make it walkable in the
browser — that's our first milestone and the moment it starts feeling real.

---

## 7. Time estimate (honest)

- **Fast track to a walkable greybox you can show off:** a focused weekend (Bootcamp + greybox + my movement code).
- **A detailed, textured, atmospheric version:** a couple of weeks of evenings, iterating.
- Going zero-to-hero in Blender for a multi-room villa isn't a few-hours job — but kitbashing + AI props + my scripts + my web glue make a genuinely impressive result reachable far faster than modelling everything by hand.

*You bring the world. I'll bring it to life.*
