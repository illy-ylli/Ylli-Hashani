import { portfolio } from '../../config/portfolio'

type GallerySelection = { projectIndex: number; selectProject: (index: number) => void }

function Projects({ projectIndex: index, selectProject }: GallerySelection) {
  const count = portfolio.projects.length
  if (!count) return <p>Projects will appear here as they are added.</p>
  const project = portfolio.projects[index]
  const move = (offset: number) => selectProject((index + offset + count) % count)
  return <div className="project-gallery" aria-label="Project gallery">
    <article className="project-card" key={project.name}>
      <img src={import.meta.env.BASE_URL + project.image} alt={project.imageAlt}
        loading="lazy" width="800" height="400" />
      <div className="project-copy">
        {project.placeholder && <span className="placeholder">Placeholder project</span>}
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        <ul className="tags" aria-label="Technologies">{project.technologies.map((tag) => <li key={tag}>{tag}</li>)}</ul>
        {(project.repository || project.demo) && <div className="project-links">
          {project.repository && <a href={project.repository}>GitHub repository</a>}
          {project.demo && <a href={project.demo}>Live demo</a>}
        </div>}
      </div>
    </article>
    {count > 1 && <div className="gallery-controls">
      <button className="small-button" onClick={() => move(-1)} aria-label="Previous project">Previous</button>
      <span role="status">{index + 1} / {count}<span className="visually-hidden"> {project.name}</span></span>
      <button className="small-button" onClick={() => move(1)} aria-label="Next project">Next</button>
    </div>}
  </div>
}

export function PortfolioSections(selection: GallerySelection) {
  const contacts = portfolio.contact.filter(({ url }) => url)
  return <main id="portfolio">
    <section tabIndex={-1} id="arrival" className="chapter arrival" aria-labelledby="arrival-title">
      <div className="chapter-frame hero-frame">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Interactive portfolio</p>
          <h1 id="arrival-title">Hi, I’m <em>{portfolio.name}.</em></h1>
          <p className="hero-role">{portfolio.field} student at {portfolio.school}.</p>
          <p className="hero-intro">{portfolio.introduction}</p>
          <a className="button primary" href="#about">Explore the portfolio</a>
        </div>
      </div>
      <a className="scroll-prompt" href="#about"><span className="scroll-mouse" aria-hidden="true" />Scroll to explore</a>
    </section>
    <section tabIndex={-1} id="about" className="chapter align-right" aria-labelledby="about-title">
      <div className="chapter-frame">
        <div className="panel glass">
          <p className="eyebrow"><span /> The pavilion</p>
          <h2 id="about-title">About me</h2>
          <p>{portfolio.about}</p>
          <div className="education"><span className="education-icon" aria-hidden="true">✦</span><div>
            <strong>{portfolio.school}</strong><span>{portfolio.field}</span>
          </div></div>
        </div>
      </div>
    </section>
    <section tabIndex={-1} id="skills" className="chapter" aria-labelledby="skills-title">
      <div className="chapter-frame">
        <div className="panel glass skills-panel">
          <p className="eyebrow"><span /> The orbital lab</p>
          <h2 id="skills-title">Technical skills</h2>
          <ul className="skills-grid">{portfolio.skills.map(({ name, symbol, note }) => <li key={name}>
            <span className="skill-symbol" aria-hidden="true">{symbol}</span>
            <span><strong>{name}</strong><small>{note}</small></span>
          </li>)}</ul>
        </div>
      </div>
    </section>
    <section tabIndex={-1} id="projects" className="chapter align-right" aria-labelledby="projects-title">
      <div className="chapter-frame">
        <div className="panel glass gallery-panel">
          <p className="eyebrow"><span /> The exhibition</p>
          <h2 id="projects-title">Projects</h2>
          <Projects {...selection} />
        </div>
      </div>
    </section>
    <section tabIndex={-1} id="vision" className="chapter" aria-labelledby="vision-title">
      <div className="chapter-frame">
        <div className="panel glass">
          <p className="eyebrow"><span /> The conservatory</p>
          <h2 id="vision-title">Interests &amp; vision</h2>
          <p>{portfolio.vision}</p>
          <ul className="tags interests">{portfolio.interests.map((interest) => <li key={interest}>{interest}</li>)}</ul>
        </div>
      </div>
    </section>
    <section tabIndex={-1} id="contact" className="chapter align-right contact" aria-labelledby="contact-title">
      <div className="chapter-frame">
        <div className="panel glass">
          <p className="eyebrow"><span /> The horizon</p>
          <h2 id="contact-title">Contact</h2>
          {contacts.length ? <ul className="contact-links">{contacts.map(({ label, url }) =>
            <li key={label}><a className="button" href={url}>{label}</a></li>)}</ul>
            : <p>Contact links will appear here once they’re added.</p>}
          <a className="button" href="#arrival">Return to arrival</a>
        </div>
      </div>
    </section>
  </main>
}
