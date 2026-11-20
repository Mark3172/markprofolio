# markprofolio

The portfolio of **Myo Set Paing (Mark)**, Junior ERP Support Specialist and IT graduate. It has two views built from the same data:

- **Classic view** (the landing page): a fast, recruiter-friendly single page that scores 99–100 in Lighthouse and has a downloadable CV.
- **Game mode**: an explorable 3D floating island, one click away. Every landmark is a project, certificate or chapter of the story.

`?view=3d` links straight into the game. Browsers without WebGL 2 always get the classic view.

---

## Quick start

```bash
npm install
npm run dev                      # http://localhost:5173 (development mode)
npm run build && npm run preview # http://localhost:4173 (the real, production speed)
```

> **Testing speed?** Use `npm run preview`, not `npm run dev`. Dev mode serves the 3D engine unbundled and unminified (about 5.9 MB), so game mode loads much more slowly there than it will for visitors (about 140 KB compressed).

## Edit your content

Almost everything lives in **one file: [`src/data/portfolio.js`](src/data/portfolio.js)**. Both views (and the CV) read from it, so one edit updates everything. It was filled in from Mark's LinkedIn, LinkedIn posts and GitHub (Nov 2026).

| What | Where in `portfolio.js` |
| --- | --- |
| Name, title, tagline, location, status | `profile` |
| Photo | `profile.photo` (file in `public/media/`) |
| Email, LinkedIn, GitHub, socials, CV link | `profile.links` |
| "Why hire me" cards (each links to its proof) | `profile.whyHire` |
| "At a glance" facts for recruiters | `profile.atAGlance` |
| Growth timeline (2022 → 2026) | `profile.milestones` |
| Big numbers under the hero | `profile.keyFacts` |
| Skills (chips that filter projects) | `profile.skills` |
| Recommendation quote | `profile.testimonial` |
| Projects (11) | `projects` |
| Jobs and education | `experience` |
| Certificates and licenses | `certificates` |
| Hackathons, events and awards | `achievements` |
| News posts | `news` |

To add a project, certificate, hackathon or job, copy an existing block in the same list. The 3D world lays it out automatically. Set `featured: true` to put an item in the front row (keep it to the biggest few). Search the file for `TODO` to find optional facts still missing (availability, work authorisation, languages).

**Only add what is true.** Leave a line out rather than guess.

### News

LinkedIn and Instagram don't let a personal site pull posts automatically, so add a block to the top of `news` when you post:

```js
{
  date: '2026-11-15',            // or '2026-11' if you only know the month
  source: 'linkedin',            // linkedin | github | instagram | facebook
  title: 'We built AstroMed at NASA Space Apps Challenge Yangon',
  text: 'One or two sentences about the post.',
  link: 'https://www.linkedin.com/...',
  image: 'media/nasa.jpg',       // optional
},
```

The newest post becomes the banner at the top of the classic view and the news board in the 3D plaza. Posts from the last 45 days get a "New" badge.

### Photos

Put photos in [`public/media/`](public/media) and point items at them with `image: 'media/your-file.jpg'`. Aim for at least 1200 px wide. A missing file is hidden rather than shown broken.

After adding or replacing photos, run:

```bash
pip install pillow               # once
python scripts/optimize_media.py
```

This makes small WebP copies in `public/media/opt/` so phones download a fraction of the size. The site still works if you skip it.

### Your CV

The **Download CV** buttons (menu, hero and contact) serve [`public/cv/Myo-Set-Paing-CV.pdf`](public/cv/Myo-Set-Paing-CV.pdf). It is generated from `portfolio.js`, so rebuild it after editing your details:

```bash
npm i -D playwright && npx playwright install chromium   # once
node scripts/build_cv.mjs
```

The layout follows recruiter and ATS advice: A4, two pages, one column, real text, standard headings (Profile, Experience, Hackathons & Projects, Education, Certifications, Skills, Awards), dates on the right and no photo. `public/cv/Myo-Set-Paing-CV.html` is the page it prints from.

## The classic view

Built for recruiters who scan in seconds:

- **Light theme by default**: warm off-white page, white cards, near-black text and one blue accent. Light pages read better in bright offices (NN/g) and recruiters favour simple, high-contrast layouts (Ladders eye-tracking). The moon button switches to a dark theme, and the choice is remembered.
- **Recruiter-first order**: hero → Why hire me + At a glance + recommendation + growth timeline → Projects → Hackathons → Experience → Certifications → Education → Skills → About → News → Contact.
- **Natural portrait**: the real photo in a simple rounded frame with an "Open to work" label.
- **Contact everywhere**: Email, Copy email, LinkedIn and Download CV in the hero, menu and contact section, plus a live Yangon time card.
- **Useful interactions**: skill chips filter the project list; project and hackathon tabs; stats count up; a soft light follows the cursor over cards; older certificates and education fold away behind "Show more".
- **No decorative charts**: no skill-percentage bars or radar charts, because recruiters read them as made-up numbers.
- **Phones**: a bottom tab bar, a swipeable growth timeline, and 40 px+ tap targets.
- **Game mode entry points**: the menu button, the hero card and a floating "Game mode" button. The 3D code starts downloading when a visitor hovers or taps one of these (or quietly once the page is idle), so the game starts faster.

## Game mode

Visitors land on a loading screen with real progress and control tips, then walk the island in third person (or first person with **V**).

| Landmark | What's inside |
| --- | --- |
| **Project Workshop** | A glowing pedestal per project |
| **Hall of Badges** | Floating medallions for certificates and awards |
| **Timeline Trail** | Monoliths for each job and education step |
| **Hackathon Arena** | Trophy boards, biggest wins in the front row |
| **The Beacon** | About, skills (the orbiting crystals) and contact |

Things to do:

- **Highlights tour**: an arrow and light pillar lead through the five areas.
- **Byte, the guide drone**: explains each area the first time a visitor arrives.
- **Explorer quests** (top right): seven goals that raise the visitor's rank from Visitor to Island Legend. Finishing all seven opens the contact card.
- **Island Dash**: a race through 8 rings from the yellow flag. The best time is saved in the browser.
- **Data shards**: 9 hidden collectibles, one at the top of a parkour route.
- **News board** in the plaza, sound effects made in the browser (the speaker button mutes them), a jump pad, a clickable minimap and fast travel. Fall off and you respawn at the plaza.

### Controls

- **WASD / arrows** walk, **Shift** sprint, **Space** jump
- **Click** the world for mouse look (**Esc** releases it)
- **V** first/third person, **scroll** zooms the camera
- **E** opens what you're aiming at or standing next to (or just click glowing things)
- **E** at the yellow flag starts the Island Dash
- **Touch**: joystick bottom-left, drag to look, JUMP and camera buttons bottom-right, tap things to open them

## Speed, accessibility and search

Lighthouse mobile (local production build): **99 performance, 100 accessibility, 100 best practices, 100 SEO**, with the largest paint at about 1.5 s (Google's "good" is under 2.5 s).

- The hero paints immediately, and fonts don't block it.
- Photos are served as responsive WebP.
- The 3D background (dark theme only) starts on the first interaction and is skipped on data-saver or slow connections.
- The game code is lazy-loaded and split from the classic view.
- Keyboard users get a "Skip to content" link, every button has a label, and reduced-motion users get no animations.
- Search engines get a descriptive title and description, Open Graph tags, `robots.txt` and Person structured data.

## Project structure

```
index.html              page shell, SEO tags, fonts
public/
  logo.svg, favicon.svg monogram logo
  media/                photos and screenshots (+ opt/ WebP copies)
  cv/                   generated CV (PDF + HTML source)
src/
  main.js               picks the view; game-mode loading screen
  data/portfolio.js     ALL the content
  ui/classic.js/.css    classic view (light/dark themes)
  ui/interactive.js     copy email, clock, skill filter, count-up, cursor light
  ui/cards.js, modal.js detail cards shared by both views
  ui/hud.js, sfx.js     game HUD, quests, Byte, sounds
  world/World.js        the 3D island (Three.js)
scripts/
  build_cv.mjs          builds the CV from portfolio.js
  optimize_media.py     makes WebP photo sizes
```

## Deploy

Vercel works with no config and builds a preview for every pull request. `netlify.toml` is included for Netlify. Any static host works: build with `npm run build` and publish `dist/`.

## Tech

Three.js and Vite, plain JavaScript, no framework. All 3D text is drawn on canvas at runtime, so there are no models or fonts to download. Quality drops automatically on phones and slow GPUs, and rendering pauses when the tab is hidden.
