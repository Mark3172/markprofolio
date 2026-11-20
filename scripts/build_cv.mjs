// Builds public/cv/Myo-Set-Paing-CV.pdf (and the .html it is printed from)
// from src/data/portfolio.js, so the CV and the website never disagree.
//
//   npm i -D playwright && npx playwright install chromium   (once)
//   node scripts/build_cv.mjs
//
// Layout follows recruiter / ATS advice: A4, one column, real text, standard
// headings, dates on the right, no photo, no graphics, one accent colour.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { profile, experience, projects, achievements, certificates } from '../src/data/portfolio.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/cv');
const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const bare = (u = '') => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const range = (e) => (e.start === e.end ? e.start : `${e.start} – ${e.end}`);

const work = experience.filter((e) => e.type !== 'education');
const edu = experience.filter((e) => e.type === 'education');
const hackProjects = projects.filter((p) => p.category === 'hackathon');
const otherProjects = projects.filter((p) => ['university', 'personal'].includes(p.category) && !/portfolio/i.test(p.title)).slice(0, 2);
const hackEvent = (p) => achievements.find((a) => a.result && a.result.includes(p.title));
// skip the AIESEC volunteer certificate (covered under experience) and undated items
const certs = certificates.filter((c) => c.kind !== 'award' && c.date);
const extra = achievements.filter((a) => a.kind !== 'hackathon' && /award|excellence/i.test(a.title));
const role = work[0]?.role || profile.title;

const item = (title, sub, when, body = '') => `
  <div class="item">
    <div class="row"><b>${title}</b><span class="when">${esc(when)}</span></div>
    ${sub ? `<div class="sub">${sub}</div>` : ''}
    ${body}
  </div>`;
const ul = (xs) => (xs?.length ? `<ul>${xs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(profile.fullName || profile.name)} · CV</title>
<style>
  @page { size: A4; margin: 13mm 15mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 9.6pt/1.42 'Inter', 'Segoe UI', Arial, sans-serif; color: #1b2330; }
  h1 { font-size: 22pt; margin: 0; letter-spacing: -0.01em; }
  .title { font-size: 11.5pt; color: #1f56d6; font-weight: 600; margin: 2px 0 6px; }
  .contact { color: #4b5563; font-size: 9.2pt; }
  .contact a { color: inherit; text-decoration: none; }
  .contact span + span::before { content: '·'; margin: 0 6px; color: #9ca3af; }
  h2 { font-size: 10.5pt; text-transform: uppercase; letter-spacing: 0.08em; color: #1f56d6; border-bottom: 1px solid #d6dbe4; padding-bottom: 3px; margin: 14px 0 7px; }
  p { margin: 0 0 4px; }
  .item { margin: 0 0 8px; break-inside: avoid; }
  .row { display: flex; justify-content: space-between; gap: 12px; }
  .when { color: #4b5563; white-space: nowrap; font-size: 9.2pt; }
  .sub { color: #374151; font-style: italic; font-size: 9.4pt; }
  ul { margin: 3px 0 0; padding-left: 15px; }
  li { margin: 1px 0; }
  .skills div { display: grid; grid-template-columns: 132px 1fr; margin: 0 0 3px; }
  .skills b { font-weight: 600; }
  .two { columns: 2; column-gap: 22px; }
  .two .item { margin-bottom: 5px; }
</style></head><body>
  <header>
    <h1>${esc(profile.fullName || profile.name)}${profile.nickname && profile.nickname !== (profile.fullName || profile.name) ? ` (${esc(profile.nickname)})` : ''}</h1>
    <div class="title">${esc(role)} · IT Graduate</div>
    <div class="contact">
      <span>${esc(profile.location)} · open to roles in Singapore (on-site, hybrid or remote)</span><br>
      ${profile.links.email ? `<span><a href="mailto:${esc(profile.links.email)}">${esc(profile.links.email)}</a></span>` : ''}
      ${profile.links.linkedin ? `<span><a href="${esc(profile.links.linkedin)}">${esc(bare(profile.links.linkedin))}</a></span>` : ''}
      ${profile.links.github ? `<span><a href="${esc(profile.links.github)}">${esc(bare(profile.links.github))}</a></span>` : ''}
    </div>
  </header>

  <h2>Profile</h2>
  <p>${esc(profile.tagline)} Curtin Singapore IT graduate (Class of 2026), currently leading the ExpoTrans helpdesk team at Global Connect Asia and helping clients go live on Odoo ERP. Background in systems and networking (CCNA), UI/UX design and AI tooling, with ${hackProjects.length} hackathon builds in 2026.</p>

  <h2>Experience</h2>
  ${work.map((e) => item(esc(e.role), `${esc(e.org)}${e.location ? ` · ${esc(e.location)}` : ''}`, range(e), `<p>${esc(e.summary)}</p>${ul(e.points.filter((x) => !/^Skills:/.test(x) && !x.startsWith(e.role)).slice(0, 3))}`)).join('')}

  <h2>Hackathons &amp; Projects</h2>
  ${hackProjects.map((p) => { const a = hackEvent(p); return item(`${esc(p.title)}`, esc(p.tagline), p.year || a?.date || '', ul(p.highlights.slice(0, 2))); }).join('')}
  ${achievements.filter((a) => a.kind === 'hackathon' && !a.result).map((a) => item(esc(a.title), `${esc(a.event)} · ${esc(a.role)}`, a.date)).join('')}
  ${otherProjects.map((p) => item(esc(p.title), esc(p.tagline), p.year || '', ul(p.highlights.slice(0, 2)))).join('')}

  <h2>Education</h2>
  ${edu.slice(0, 4).map((e) => item(esc(e.role), esc(e.org), range(e), e.summary ? `<p>${esc(e.summary)}</p>` : '')).join('')}

  <h2>Certifications</h2>
  <div class="two">
  ${certs.map((c) => item(esc(c.name), esc(c.issuer), c.date)).join('')}
  </div>

  <h2>Skills</h2>
  <div class="skills">
  ${profile.skills.map((g) => `<div><b>${esc(g.group)}</b>${esc(g.items.join(', '))}</div>`).join('')}
  </div>

  ${extra.length ? `<h2>Awards</h2>
  ${extra.map((a) => item(esc(a.title), esc(a.event), a.date, a.description ? `<p>${esc(a.description)}</p>` : '')).join('')}` : ''}
</body></html>`;

mkdirSync(outDir, { recursive: true });
const htmlPath = resolve(outDir, 'Myo-Set-Paing-CV.html');
writeFileSync(htmlPath, html);

const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(htmlPath).href);
await page.pdf({ path: resolve(outDir, 'Myo-Set-Paing-CV.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log('Wrote public/cv/Myo-Set-Paing-CV.pdf');
