import { profile, projects, experience, certificates } from '../data/portfolio.js';
import { esc, sampleTag, contactButtons, KIND_LABEL, TYPE_LABEL, TYPE_COLOR } from './cards.js';

/** Fast, accessible 2D version of the portfolio (phones, no-WebGL, or by choice). */
export function renderClassic(root, { canExplore, onExplore }) {
  document.body.classList.add('classic-mode');
  const initials = profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('');

  root.innerHTML = `
  <div class="classic">
    <header class="c-nav">
      <div class="c-brand"><span class="hud-avatar" style="width:32px;height:32px;font-size:13px">${esc(initials)}</span>${esc(profile.nickname)}</div>
      <nav aria-label="Sections"><a href="#projects">Projects</a><a href="#experience">Experience</a><a href="#certificates">Certificates</a><a href="#contact">Contact</a></nav>
      ${canExplore ? '<button class="btn btn-primary" data-explore style="padding:9px 16px">Explore in 3D</button>' : ''}
    </header>

    <section class="c-hero">
      ${profile.status ? `<span class="intro-kicker"><span class="dot"></span>${esc(profile.status)}</span>` : ''}
      <h1>Hi, I'm <span class="grad" style="background:linear-gradient(90deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent">${esc(profile.nickname)}</span>.<br/>${esc(profile.name)}</h1>
      <p class="lead">${esc(profile.tagline)}</p>
      <p class="lead" style="font-size:15px">${esc(profile.title)} · ${esc(profile.location)}</p>
      <div class="intro-actions" style="justify-content:flex-start;margin-top:24px">${contactButtons()}</div>
    </section>

    <section class="c-section" id="about">
      <h2>About</h2>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))">
        <div class="tile">${profile.about.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        <div class="tile" style="--c:var(--accent-2)">
          ${profile.skills.map((g) => `<div style="margin-bottom:12px"><div class="meta">${esc(g.group)}</div><div class="chips" style="margin:6px 0 0">${g.items.map((i) => `<span class="chip">${esc(i)}</span>`).join('')}</div></div>`).join('')}
        </div>
      </div>
    </section>

    <section class="c-section" id="projects">
      <h2>Projects <small>${projects.length} builds</small></h2>
      <div class="grid">
        ${projects.map((p) => `
          <article class="tile" style="--c:${esc(p.color)}">
            <div class="meta">${esc(p.year || '')}</div>
            <h3>${esc(p.title)}${sampleTag(p)}</h3>
            <div class="meta">${esc(p.tagline)}</div>
            <p>${esc(p.description)}</p>
            <div class="chips">${(p.tech || []).map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>
            <div class="links">
              ${p.links?.demo ? `<a href="${esc(p.links.demo)}" target="_blank" rel="noopener">Live demo ↗</a>` : ''}
              ${p.links?.code ? `<a href="${esc(p.links.code)}" target="_blank" rel="noopener">Code ↗</a>` : ''}
            </div>
          </article>`).join('')}
      </div>
    </section>

    <section class="c-section" id="experience">
      <h2>Experience & Education</h2>
      <div class="timeline">
        ${experience.map((e) => `
          <article class="tile" style="--c:${TYPE_COLOR[e.type] || '#7cf5ff'}">
            <div class="meta">${esc(TYPE_LABEL[e.type] || '')} · ${esc(e.start)} – ${esc(e.end)}</div>
            <h3>${esc(e.role)}${sampleTag(e)}</h3>
            <div class="meta">${esc(e.org)}${e.location ? ' · ' + esc(e.location) : ''}</div>
            ${e.summary ? `<p>${esc(e.summary)}</p>` : ''}
            ${e.points?.length ? `<ul style="color:#cfd3f2;line-height:1.55">${e.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
          </article>`).join('')}
      </div>
    </section>

    <section class="c-section" id="certificates">
      <h2>Certificates & Licenses</h2>
      <div class="grid">
        ${certificates.map((c) => `
          <article class="tile" style="--c:${esc(c.color)}">
            <div class="meta">${esc(KIND_LABEL[c.kind] || '')}${c.date ? ' · ' + esc(c.date) : ''}</div>
            <h3>${esc(c.name)}${sampleTag(c)}</h3>
            <div class="meta">${esc(c.issuer)}</div>
            ${c.credentialId ? `<p style="font-size:14px">${esc(c.credentialId)}</p>` : ''}
            ${c.url ? `<div class="links" style="margin-top:12px"><a href="${esc(c.url)}" target="_blank" rel="noopener">Show credential ↗</a></div>` : ''}
          </article>`).join('')}
      </div>
    </section>

    <section class="c-section" id="contact">
      <h2>Let's talk</h2>
      <div class="tile" style="text-align:center;padding:40px 22px">
        <h3 style="font-size:26px">Got an idea, a role or a question?</h3>
        <p>I'm always happy to chat about projects, internships and collaborations.</p>
        <div class="intro-actions">${contactButtons()}</div>
      </div>
    </section>

    <footer class="c-footer"><span>© ${new Date().getFullYear()} ${esc(profile.name)}</span><span>Built with Three.js & Vite</span></footer>
  </div>`;

  root.querySelector('[data-explore]')?.addEventListener('click', onExplore);
}
