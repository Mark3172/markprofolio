# markprofolio

Mark's (Myo Set Paing) portfolio as an explorable 3D floating island.

Visitors fly a little drone around the island. Every landmark opens a card:

| Landmark | What's inside |
| --- | --- |
| **Project Workshop** | One glowing pedestal per project |
| **Hall of Badges** | Floating medallions for certificates, licenses and awards |
| **Timeline Trail** | Monoliths for each job and your education |
| **The Beacon** | About me, skills (the orbiting crystals) and contact links |

There are also 8 hidden **data shards** to collect, a minimap, and fast travel.
Phones get a touch joystick. Browsers without WebGL 2 (and anyone who clicks
"Classic view") get a fast, normal scrolling portfolio built from the same data.

## Edit your content

Everything lives in **one file: [`src/data/portfolio.js`](src/data/portfolio.js)**.
Search it for `TODO`. Items with `placeholder: true` show a dashed "sample" tag
on the site until you replace them and delete that line.

Still to fill in (LinkedIn blocks automated reading, so these are samples):

- Experience: your role, dates and achievements at Global Connect Asia, plus any earlier roles
- Education: exact degree name, campus and years at Curtin
- Certificates & licenses: names, issuers, dates and credential links
- Profile: email, résumé link, your own "about" text, skills, and the status line
- Projects: confirm the years, add live demo links, and add any of your other repos

To add a project, certificate or job, copy an existing block in the same list.
The 3D world lays them out automatically.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Add `?view=classic` to the URL to open the 2D view directly.

## Deploy

`netlify.toml` is included: connect the repo in Netlify and it builds with
`npm run build` and publishes `dist/`. Any static host works.

## Controls

- **WASD / arrow keys** fly, **Shift** boost, **E** open the nearest thing
- **Click** anything glowing to open it, click the ground to fly there
- **Drag** to look around, **scroll** to zoom, **Q / R** rotate the camera
- **Touch**: joystick bottom-left, tap things to open them

## Tech

Three.js + Vite, plain JavaScript, no framework. All 3D text is drawn on canvas
at runtime, so there are no models or fonts to download. The 3D code is
lazy-loaded (about 155 KB gzipped) and the classic view never loads it.
Quality drops automatically on phones and slow GPUs (no bloom/shadows, lower
resolution), and rendering pauses when the tab is hidden.
