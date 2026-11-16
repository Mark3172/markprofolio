# markprofolio

Mark's (Myo Set Paing) portfolio as an explorable 3D floating island.

Visitors walk around the island in third person (or first person with **V**). Every landmark opens a card:

| Landmark | What's inside |
| --- | --- |
| **Project Workshop** | One glowing pedestal per project |
| **Hall of Badges** | Floating medallions for certificates, licenses and awards |
| **Timeline Trail** | Monoliths for each job and your education |
| **Hackathon Arena** | Trophy boards for hackathons, events and awards (the biggest ones in the front row) |
| **The Beacon** | About me, skills (the orbiting crystals) and contact links |

There are also 9 hidden **data shards** to collect (one sits on the Sky Lookout at the top of a floating
parkour route), a jump pad, a minimap, and fast travel. Fall off the island and you respawn at the plaza.
Phones get a touch joystick. Browsers without WebGL 2 (and anyone who clicks
"Classic view") get a recruiter-friendly scrolling portfolio built from the same data:
career highlights, experience, filterable projects, hackathons, certifications,
education, skills and contact.

## Edit your content

Everything lives in **one file: [`src/data/portfolio.js`](src/data/portfolio.js)**.
It is filled in from Mark's LinkedIn profile, LinkedIn posts and GitHub (Nov 2026):

- **Projects**: 11, including three 2026 hackathon builds:
  - [AstroMed](https://github.com/Planet-Coders/AstroMed) for NASA Space Apps Challenge Yangon ([live demo](https://astro-med-ashy.vercel.app))
  - [HRChronicle AI](https://github.com/vibecode-ting/hr_chronicle_ai) for the Google Cloud AI Builder Cup ([live app](https://myanmardev.web.app))
  - [GreenLens AI](https://github.com/Mark3172/greenlens-ai) for the Cursor Myanmar Hackathon ([live demo](https://greentechai.netlify.app/scan))
- **Hackathons & achievements**: 4 hackathons, tech events (GITEX Asia, Myanmar-China Expo, ASEAN Data Science Program and more), leadership and awards
- **Experience & education**: Global Connect Asia, AIESEC, Curtin Singapore and more
- **Certifications**: all licenses & certifications from LinkedIn, with verify links
- **About**: skills, career highlights, a recommendation, and a contact email for business inquiries

Set `featured: true` on an item to highlight it: featured projects get the big cards, and featured
hackathons and certificates go in the front row in 3D and in the classic view. Keep it to the biggest few.

The only optional thing still missing is a résumé PDF (search the file for `TODO`).

To add a project, certificate, hackathon or job, copy an existing block in the same list.
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
`npm run build` and publishes `dist/`. Vercel also works with no config (it builds
a preview for every pull request). Any static host works.

## Controls

- **WASD / arrow keys** walk, **Shift** sprint, **Space** jump
- **Click** the world to capture the mouse for free look (**Esc** releases it); in that mode the crosshair picks what **E** or a click opens
- **V** switches between third-person and first-person view, **scroll** zooms the third-person camera
- **E** opens whatever you are aiming at or standing next to; you can also click glowing things directly
- **Touch**: joystick bottom-left (push it all the way to run), drag anywhere to look, JUMP and camera buttons bottom-right, tap things to open them

## Tech

Three.js + Vite, plain JavaScript, no framework. All 3D text is drawn on canvas
at runtime, so there are no models or fonts to download. The 3D code is
lazy-loaded (about 155 KB gzipped) and the classic view never loads it.
Quality drops automatically on phones and slow GPUs (no bloom/shadows, lower
resolution), and rendering pauses when the tab is hidden.
