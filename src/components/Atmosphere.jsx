import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Butterfly from './Butterfly'
import { rand, useReducedMotion } from '../hooks'

/** Soft glowing fireflies drifting over the meadow. */
function Fireflies({ count }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: rand(3, 97),
        top: rand(35, 95),
        size: rand(3, 6),
        dur: rand(7, 14),
        delay: rand(0, 6),
        dx: rand(-60, 60),
        dy: rand(-70, 30),
      })),
    [count]
  )
  return items.map((f) => (
    <motion.span
      key={f.id}
      className="absolute rounded-full"
      style={{
        left: `${f.left}%`, top: `${f.top}%`, width: f.size, height: f.size,
        background: '#fffbe6',
        boxShadow: '0 0 10px 3px rgba(255,248,210,0.85), 0 0 22px 8px rgba(190,220,255,0.35)',
      }}
      animate={{ x: [0, f.dx, -f.dx / 2, 0], y: [0, f.dy, f.dy / 2, 0], opacity: [0.15, 1, 0.3, 0.9, 0.15] }}
      transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  ))
}

/** Tiny hearts that bubble up now and then. */
function FloatingHearts() {
  const [hearts, setHearts] = useState([])
  useEffect(() => {
    let id = 0
    const spawn = () => {
      const h = { id: id++, left: rand(8, 92), size: rand(10, 18), dur: rand(7, 11) }
      setHearts((p) => [...p.slice(-5), h])
      setTimeout(() => setHearts((p) => p.filter((x) => x.id !== h.id)), h.dur * 1000)
    }
    const iv = setInterval(spawn, 3800)
    const first = setTimeout(spawn, 1200)
    return () => { clearInterval(iv); clearTimeout(first) }
  }, [])
  return hearts.map((h) => (
    <motion.span
      key={h.id}
      className="absolute bottom-[-24px]"
      style={{ left: `${h.left}%`, color: '#c9dcf2' }}
      initial={{ y: 0, opacity: 0, scale: 0.7 }}
      animate={{ y: '-105vh', opacity: [0, 0.9, 0.9, 0], scale: [0.7, 1, 1, 0.9], x: [0, 14, -10, 8] }}
      transition={{ duration: h.dur, ease: 'easeOut' }}
    >
      <Heart size={h.size} fill="currentColor" strokeWidth={0} />
    </motion.span>
  ))
}

/** Dust motes of light. */
function Motes({ count }) {
  const items = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ id: i, left: rand(0, 100), top: rand(0, 100), s: rand(1.5, 3.2), d: rand(10, 20), dl: rand(0, 8) })),
    [count]
  )
  return items.map((m) => (
    <motion.span
      key={m.id}
      className="absolute rounded-full bg-white"
      style={{ left: `${m.left}%`, top: `${m.top}%`, width: m.s, height: m.s, boxShadow: '0 0 6px rgba(255,255,255,0.9)' }}
      animate={{ y: [0, -40, 0], opacity: [0, 0.8, 0] }}
      transition={{ duration: m.d, delay: m.dl, repeat: Infinity, ease: 'easeInOut' }}
    />
  ))
}

/** A little butterfly that crosses the sky every so often. */
function PassingButterfly() {
  const [run, setRun] = useState(null)
  useEffect(() => {
    let timer
    const go = () => {
      const ltr = Math.random() > 0.5
      setRun({ key: Math.random(), ltr, y1: rand(15, 55), y2: rand(10, 60), y3: rand(15, 55) })
      timer = setTimeout(go, rand(16000, 26000))
    }
    timer = setTimeout(go, 6000)
    return () => clearTimeout(timer)
  }, [])
  if (!run) return null
  const from = run.ltr ? '-8vw' : '108vw'
  const to = run.ltr ? '108vw' : '-8vw'
  return (
    <motion.div
      key={run.key}
      className="absolute left-0 top-0"
      initial={{ x: from, y: `${run.y1}vh` }}
      animate={{ x: [from, to], y: [`${run.y1}vh`, `${run.y2}vh`, `${run.y3}vh`] }}
      transition={{ duration: 14, ease: 'linear' }}
      onAnimationComplete={() => setRun(null)}
      style={{ scaleX: run.ltr ? 1 : -1 }}
    >
      <div style={{ transform: `rotate(${run.ltr ? 90 : -90}deg)` }}>
        <Butterfly size={30} flapSpeed={0.3} glow id="fly" />
      </div>
    </motion.div>
  )
}

export default function Atmosphere() {
  const reduced = useReducedMotion()
  const small = typeof window !== 'undefined' && window.innerWidth < 640
  if (reduced) return null
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 1 }} aria-hidden="true">
      <Motes count={small ? 14 : 26} />
      <Fireflies count={small ? 9 : 18} />
      <FloatingHearts />
      <PassingButterfly />
    </div>
  )
}
