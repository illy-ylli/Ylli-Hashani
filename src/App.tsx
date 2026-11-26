import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useJourney } from './animations/useJourney'
import { Navigation } from './components/navigation/Navigation'
import { PortfolioSections } from './components/sections/PortfolioSections'
import { SceneBoundary } from './components/ui/SceneBoundary'
import { portfolio } from './config/portfolio'
import { useMedia } from './hooks/useMedia'
import './styles/site.css'

const Experience = lazy(() => import('./experience/Experience'))

function supportsWebGL() {
  try {
    const context = document.createElement('canvas').getContext('webgl2')
    if (!context) return false
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

export default function App() {
  const { input, active, progressBar } = useJourney()
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)')
  const handheld = useMedia('(max-width: 820px), (pointer: coarse)')
  const [supported] = useState(supportsWebGL)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [lite, setLite] = useState(false)
  const [staticView, setStaticView] = useState(false)
  const [projectIndex, setProjectIndex] = useState(0)
  const [allowMotion, setAllowMotion] = useState(false)
  const still = reducedMotion && !allowMotion
  const low = handheld || lite
  const showScene = supported && !failed && !staticView
  const markReady = useCallback(() => setReady(true), [])
  const markFailed = useCallback(() => setFailed(true), [])
  const lowerQuality = useCallback(() => setLite(true), [])

  useEffect(() => {
    if (!showScene || ready) return
    const timeout = window.setTimeout(markFailed, 12000)
    return () => window.clearTimeout(timeout)
  }, [markFailed, ready, showScene])

  return <>
    <div className={`world ${showScene && ready ? 'world-live' : 'world-fallback'}`} aria-hidden="true">
      <div className="fallback-landscape"><i /><b /></div>
      {showScene && <div className="world-canvas">
        <SceneBoundary onFail={markFailed}>
          <Suspense fallback={null}>
            <Experience input={input} low={low} still={still} onReady={markReady}
              onFail={markFailed} onSlow={lowerQuality} projectIndex={projectIndex} />
          </Suspense>
        </SceneBoundary>
      </div>}
    </div>
    <Navigation name={portfolio.name} active={active} progressBar={progressBar} />
    <PortfolioSections projectIndex={projectIndex} selectProject={setProjectIndex} />
    <div className="view-controls">
      {showScene && !ready && <span role="status"><i className="brand-orb" /> Loading 3D world</span>}
      {showScene && reducedMotion && <button type="button" className="view-button"
        onClick={() => setAllowMotion((value) => !value)}>{still ? 'Enable 3D motion' : 'Use reduced motion'}</button>}
      {!supported || failed ? <span>Static view</span>
        : <button type="button" className="view-button"
          onClick={() => { setReady(false); setStaticView((value) => !value) }}>
          <span aria-hidden="true" />{staticView ? 'Enable 3D' : 'Static view'}
        </button>}
    </div>
  </>
}
