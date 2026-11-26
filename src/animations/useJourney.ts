import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { stations } from '../config/chapters'

gsap.registerPlugin(ScrollTrigger)

export function useJourney() {
  const input = useRef({ progress: 0, pointerX: 0, pointerY: 0 })
  const progressBar = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const sections = stations.map(({ id }) => document.getElementById(id)!)
    const last = sections.length - 1
    let stops: number[] = []
    function update() {
      const scroll = window.scrollY
      const index = stops.findIndex((stop) => stop > scroll)
      const lower = index <= 0 ? 0 : index - 1
      const fraction = index < 0 ? 1 : Math.max(0, (scroll - stops[lower]) /
        Math.max(1, stops[lower + 1] - stops[lower]))
      const progress = index < 0 ? 1 : (lower + fraction) / last
      input.current.progress = progress
      setActive(Math.round(progress * last))
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${progress})`
    }
    function measure() {
      stops = sections.map((section) => section.getBoundingClientRect().top + window.scrollY)
      update()
    }
    // The browser can resolve its initial fragment before React mounts the sections.
    const initial = sections.find((section) => `#${section.id}` === window.location.hash)
    if (initial && Math.abs(initial.getBoundingClientRect().top) > 1) {
      initial.scrollIntoView({ behavior: 'instant' })
    }
    measure()
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: update,
      onRefresh: measure,
    })
    const observer = new ResizeObserver(() => ScrollTrigger.refresh())
    observer.observe(document.body)
    function pointer(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return
      input.current.pointerX = (event.clientX / window.innerWidth - 0.5) * 2
      input.current.pointerY = (0.5 - event.clientY / window.innerHeight) * 2
    }
    function resetPointer() {
      input.current.pointerX = 0
      input.current.pointerY = 0
    }
    window.addEventListener('pointermove', pointer, { passive: true })
    document.documentElement.addEventListener('pointerleave', resetPointer)
    return () => {
      observer.disconnect()
      trigger.kill()
      window.removeEventListener('pointermove', pointer)
      document.documentElement.removeEventListener('pointerleave', resetPointer)
    }
  }, [])
  return { input, active, progressBar }
}
