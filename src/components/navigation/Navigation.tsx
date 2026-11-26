import { type RefObject } from 'react'
import { stations } from '../../config/chapters'

export function Navigation({ active, name, progressBar }: {
  active: number; name: string; progressBar: RefObject<HTMLDivElement | null>
}) {
  return <>
    <a className="skip" href="#about">Skip to portfolio content</a>
    <header className="topbar glass">
      <a className="brand" href="#arrival"><span className="brand-orb" aria-hidden="true" />{name}<span className="brand-divider">Portfolio</span></a>
      <nav aria-label="Chapters" className="nav-links">
        {stations.map(({ id, label }, index) => <a key={id} href={`#${id}`}
          aria-current={active === index ? 'location' : undefined}>{label}</a>)}
      </nav>
      <details className="mobile-nav">
        <summary>{stations[active].label}<span aria-hidden="true">⌄</span></summary>
        <nav aria-label="Chapters">
          {stations.map(({ id, label }, index) => <a key={id} href={`#${id}`}
            onClick={(event) => event.currentTarget.closest('details')?.removeAttribute('open')}
            aria-current={active === index ? 'location' : undefined}>{label}</a>)}
        </nav>
      </details>
      <div className="route-progress" aria-hidden="true"><div ref={progressBar} /></div>
    </header>
    <nav className="chapter-rail" aria-label="Chapter shortcuts">
      {stations.map(({ id, label }, index) => <a key={id} aria-label={label} href={`#${id}`}
        aria-current={active === index ? 'location' : undefined}><span /></a>)}
    </nav>
  </>
}
