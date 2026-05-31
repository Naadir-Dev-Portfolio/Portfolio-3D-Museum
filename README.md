# Naadir Duglas — 3D Portfolio Museum

An interactive **3D beachfront museum** that reimagines my [classic portfolio](https://naadir-dev-portfolio.github.io/) as a space you can walk through. You land on a golden-hour beach, click **Enter**, and the camera sweeps down into a glass pavilion on the sand. Inside, each project sits in its own glass display case — a backlit screenshot with a floating 3D emblem for its category. Click any case and the camera flies up to it and reveals the details.

Built with [three.js](https://threejs.org/). **No build step** — it's plain ES modules loaded from a CDN, so it deploys straight to GitHub Pages.

> This is a **concept / starter** — a foundation to build on, not a finished product. See [Ideas & next steps](#ideas--next-steps).

## Controls

| Action | How |
| --- | --- |
| Look around | Drag (mouse / touch) |
| Travel between galleries | Click the glowing **▲ / ▼** floor arrows, or `↑`/`↓` (`W`/`S`) |
| Turn to the side displays | Click the **◀ / ▶** floor arrows, or `←`/`→` (`A`/`D`) |
| Inspect a project | Click its display case |
| Back to the gallery | `Esc`, or the **← Back** button on the detail card |

## Run locally

ES modules need to be served over HTTP (opening `index.html` from disk won't work). Any static server does it:

```bash
# Python (already installed on most machines)
python -m http.server 5173

# …or Node
npx serve -l 5173 .
```

Then open <http://localhost:5173>.

## Deploy to GitHub Pages

1. Create a repo (e.g. `Portfolio-3D-Museum`) and push these files.
2. **Settings → Pages → Build and deployment → Deploy from a branch**, branch `main`, folder `/ (root)`.
3. It goes live at `https://<user>.github.io/Portfolio-3D-Museum/`.

The included `.nojekyll` file stops GitHub from running the files through Jekyll, so everything is served as-is.

## How it's built

```
index.html        # import map (pins three.js) + HUD / intro markup
styles.css        # overlay + HUD styling (matches the portfolio palette)
src/
  main.js         # boots renderer/scene/camera, runs the render loop
  config.js       # shared world coordinates & scale
  data.js         # the curated project data (edit this to change content)
  world.js        # sky, animated sea, sloping sand beach, sun, palms, rocks
  museum.js       # the glass pavilion (deck, steel frame, glass walls, roof)
  displays.js     # project cases + procedural category emblems + labels
  experience.js   # camera journey: waypoints, floor arrows, click-to-focus
  intro.js        # the "Enter" splash
  util.js         # tiny tween engine, canvas text textures, safe image loader
```

Everything is **modelled procedurally in code** — the sea and sky use three.js'
`Water` and `Sky` add-ons, and the building, display cases and category emblems
are generated from primitives. Project screenshots are pulled live from the
portfolio repos; if one can't be fetched, the case falls back to a generated
title card so it's never blank.

### Editing the content

All projects live in [`src/data.js`](src/data.js). Each section becomes a gallery
and each entry becomes a display case:

```js
{
  title: 'Finance Dashboard',
  desc:  'Interactive finance KPI dashboard …',
  img:   'https://raw.githubusercontent.com/.../FinanceScreen.png',
  tags:  ['Python', 'PyQt6', 'Data-Viz'],
  details: 'https://github.com/.../README.md',
  demo:  'https://…',        // optional — adds a "Live demo" button
}
```

`emblem` on a section picks which procedural 3D object floats in the case:
`code · chart · orb · browser · game · phone · puzzle`.

## Ideas & next steps

- Pointer-lock first-person walking as an alternative to waypoints
- Real GLTF models / richer environment (boardwalk, gulls, day-night cycle)
- Pull the full project list automatically from `data.js` in the main portfolio
- Reflections/sound, loading screen, mobile joystick
- Per-gallery rooms instead of one open hall

## Credits

- [three.js](https://threejs.org/) (MIT) — `Sky` and `Water` are from its examples
- Design language & content from the [Naadir Duglas portfolio](https://naadir-dev-portfolio.github.io/)
