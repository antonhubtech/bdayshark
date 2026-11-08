import { useEffect, useRef, useState } from 'react'
import Butterfly from './Butterfly'
import { useFinePointer, useReducedMotion } from '../hooks'

const CLICKABLE = 'button, a, input, [role="button"], [data-clickable]'

/**
 * Desktop: a blue butterfly that glides after the pointer, leaves a fading
 * sparkle trail, drifts gently when idle, and glows over clickable things.
 * Touch: tapping releases a little burst of sparkles instead.
 * Everything is pointer-events:none so it never blocks clicks or scrolling.
 */
export default function ButterflyCursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const bfRef = useRef(null)
  const canvasRef = useRef(null)
  const [glow, setGlow] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('butterfly-on', fine)
    return () => document.documentElement.classList.remove('butterfly-on')
  }, [fine])

  // ── desktop butterfly ────────────────────────────────────────────
  useEffect(() => {
    if (!fine) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const pos = { ...target }
    let lastMove = performance.now()
    let angle = 0
    let raf
    const sparks = []

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      lastMove = performance.now()
      setGlow(!!e.target.closest?.(CLICKABLE))
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const tick = (t) => {
      const idle = t - lastMove > 1400
      // idle: float in a lazy figure-eight around the last position
      const tx = idle && !reduced ? target.x + Math.sin(t / 700) * 14 : target.x
      const ty = idle && !reduced ? target.y + Math.sin(t / 430) * 9 - 4 : target.y
      const dx = tx - pos.x
      const dy = ty - pos.y
      pos.x += dx * 0.14
      pos.y += dy * 0.14

      const speed = Math.hypot(dx, dy)
      if (speed > 1.2) angle += (Math.atan2(dy, dx) + Math.PI / 2 - angle) * 0.08
      else angle *= 0.96
      const tilt = Math.max(-0.5, Math.min(0.5, Math.sin(angle) * 0.5))

      if (bfRef.current) {
        bfRef.current.style.transform = `translate3d(${pos.x - 17}px, ${pos.y - 17}px, 0) rotate(${tilt}rad)`
      }

      // trail sparkles
      if (!reduced && (speed > 2.2 || (idle && Math.random() < 0.08))) {
        if (Math.random() < 0.7) {
          sparks.push({
            x: pos.x + (Math.random() - 0.5) * 8,
            y: pos.y + 6 + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 0.4,
            vy: Math.random() * 0.5 + 0.1,
            life: 1,
            r: Math.random() * 1.8 + 0.8,
          })
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.life -= 0.022
        if (s.life <= 0) { sparks.splice(i, 1); continue }
        ctx.globalAlpha = s.life * 0.9
        ctx.fillStyle = '#eaf4ff'
        ctx.shadowColor = '#a9cdf5'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (sparks.length > 80) sparks.splice(0, sparks.length - 80)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [fine, reduced])

  // ── touch alternative: tap sparkle burst ─────────────────────────
  useEffect(() => {
    if (fine || reduced) return
    const onTap = (e) => {
      const host = document.getElementById('tap-sparkles')
      if (!host) return
      for (let i = 0; i < 7; i++) {
        const s = document.createElement('span')
        const a = (Math.PI * 2 * i) / 7 + Math.random() * 0.6
        const d = 22 + Math.random() * 26
        s.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:6px;height:6px;margin:-3px;border-radius:50%;background:#eef6ff;box-shadow:0 0 8px 2px rgba(170,205,245,.9);pointer-events:none;transition:transform .8s ease-out,opacity .8s ease-out;opacity:1;z-index:90`
        host.appendChild(s)
        requestAnimationFrame(() => {
          s.style.transform = `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d - 10}px) scale(.3)`
          s.style.opacity = '0'
        })
        setTimeout(() => s.remove(), 850)
      }
    }
    window.addEventListener('pointerdown', onTap, { passive: true })
    return () => window.removeEventListener('pointerdown', onTap)
  }, [fine, reduced])

  if (!fine) return <div id="tap-sparkles" aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]" />

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div ref={bfRef} className="absolute left-0 top-0 will-change-transform" style={{ transition: 'filter .3s' }}>
        <Butterfly size={34} flapSpeed={glow ? 0.22 : 0.55} glow={glow} id="cur" />
      </div>
    </div>
  )
}
