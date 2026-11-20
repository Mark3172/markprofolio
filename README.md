# markprofolio

Mark's (Myo Set Paing) portfolio: a fast, recruiter-friendly page that also opens as an explorable 3D floating island.

Visitors land on the **classic view** first, so the information is there straight away. Game mode is one
click away from three places: the "Play game mode" button in the menu, the card in the hero section, and a
floating "Game mode" button that follows the visitor down the page. `?view=3d` links straight into the game.

In game mode, visitors walk around the island in third person (or first person with **V**). Every landmark opens a card:

| Landmark | What's inside |
| --- | --- |
| **Project Workshop** | One glowing pedestal per project |
| **Hall of Badges** | Floating medallions for certificates, licenses and awards |
| **Timeline Trail** | Monoliths for each job and your education |
| **Hackathon Arena** | Trophy boards for hackathons, events and awards (the biggest ones in the front row) |
| **The Beacon** | About me, skills (the orbiting crystals) and contact links |

### Things to do on the island

- **Highlights tour**: an arrow and a light pillar lead visitors through the five areas in order.
- **Byte, the guide drone**: follows the player and explains each area the first time they arrive, plus a few tips.
- **Explorer quests** (top right): seven goals such as visiting every area, opening exhibits and reading the news board. Each one raises the visitor's rank, from Visitor up to Island Legend. Finishing all seven opens the contact card.
- **Island Dash**: start at the yellow flag in the plaza and run through 8 glowing rings against the clock. The best time is saved in the browser.
- **Data shards**: 9 hidden collectibles. One sits on the Sky Lookout at the top of a floating parkour route.
- **News board** in the plaza: shows the newest post and opens the full news list.
- **Sound effects**: made in the browser with no audio files. The speaker button mutes them.
- Also a jump pad, a minimap you can click to travel, and fast travel. Fall off the island and you respawn at the plaza.

Phones get a touch joystick. Browsers without WebGL 2 (and anyone who clicks
"Classic view") get a recruiter-friendly scrolling portfolio built from the same data:
latest news, career highlights, experience, a project spotlight, a hackathon photo wall,
certifications, education, skills and contact. It has a moving 3D backdrop and an
announcement banner for the newest post.

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

### News & announcements

LinkedIn and Instagram do not let a personal site pull posts automatically, so news is a short list
you add to when you post. Add a block to the top of the `news` list in `src/data/portfolio.js`:

```js
{
  date: '2026-11-15',            // or '2026-11' if you only know the month
  source: 'linkedin',            // linkedin | github | instagram | facebook
  title: 'We built AstroMed at NASA Space Apps Challenge Yangon',
  text: 'One or two sentences about the post.',
  link: 'https://www.linkedin.com/...', // the post URL
  image: 'media/nasa.jpg',       // optional
},
```

The newest item becomes the banner at the top of the classic view and the news board in the 3D plaza.
Posts newer than 45 days get a "New" badge.

### Photos

Photos and screenshots live in [`public/media/`](public/media). Point an item at one with
`image: 'media/your-file.jpg'` (projects, hackathons and news), or `photo` for the profile picture.
Aim for at least 1200 px wide so they stay sharp. If a file is missing, the site hides the picture
instead of showing a broken image.

After adding or replacing photos, run `python scripts/optimize_media.py` (needs `pip install pillow`).
It makes small WebP copies in `public/media/opt/`, so phones download a fraction of the size.
The site still works if you skip this step: new photos just load at full size.

### Contact

The contact email, LinkedIn, GitHub, Facebook and Instagram links are in `profile.links`.
The email shows on the "Email me" buttons and in the contact section for business inquiries.
The "I can help with" list comes from `profile.services`.

The only optional thing still missing is a résumé PDF (search the file for `TODO`).

To add a project, certificate, hackathon or job, copy an existing block in the same list.
The 3D world lays them out automatically.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

The site opens on the classic view. Add `?view=3d` to the URL to open game mode directly.

## Deploy

`netlify.toml` is included: connect the repo in Netlify and it builds with
`npm run build` and publishes `dist/`. Vercel also works with no config (it builds
a preview for every pull request). Any static host works.

## Controls

- **WASD / arrow keys** walk, **Shift** sprint, **Space** jump
- **Click** the world to capture the mouse for free look (**Esc** releases it); in that mode the crosshair picks what **E** or a click opens
- **V** switches between third-person and first-person view, **scroll** zooms the third-person camera
- **E** opens whatever you are aiming at or standing next to; you can also click glowing things directly
- **E** at the yellow flag starts the Island Dash; fast travel during a dash cancels it
- **Touch**: joystick bottom-left (push it all the way to run), drag anywhere to look, JUMP and camera buttons bottom-right, tap things to open them

## Speed, accessibility and search

The classic view follows Google's web.dev and Lighthouse guidance. In a local Lighthouse mobile run it scores
98 for performance and 100 for accessibility, best practices and SEO. The largest paint takes about 1.6 s,
well inside the 2.5 s that Google counts as good.

- The hero shows instantly. Only the sections below it fade in.
- Fonts load without blocking the first paint.
- Photos come in responsive WebP sizes.
- The 3D background loads only after the page has finished, and is skipped on data-saver or slow connections.
- There is a "Skip to content" link for keyboard users, and every button has a label.
- Search engines get a descriptive title and description, `robots.txt`, and Person structured data
  (name, role, employer, LinkedIn and GitHub).

## Tech

Three.js + Vite, plain JavaScript, no framework. All 3D text is drawn on canvas
at runtime, so there are no models or fonts to download. The 3D code is
lazy-loaded (about 155 KB gzipped) and the classic view never loads it.
Quality drops automatically on phones and slow GPUs (no bloom/shadows, lower
resolution), and rendering pauses when the tab is hidden.
