import { useEffect, useMemo } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { Heart } from 'lucide-react'
import { rand, useReducedMotion } from '../hooks'

/** Wax seal with a tiny heart. Rendered as two halves so it can crack open. */
function Seal({ broken }) {
  const face = (
    <div
      className="flex h-full w-full items-center justify-center rounded-full"
      style={{
        background: 'radial-gradient(circle at 35% 30%, #aebfe4 0%, #7f98cc 55%, #6580b8 100%)',
        boxShadow: 'inset 0 -3px 6px rgba(50,70,120,0.35), inset 0 3px 5px rgba(255,255,255,0.45), 0 5px 12px rgba(60,85,140,0.35)',
        border: '2px solid rgba(140,165,215,0.9)',
      }}
    >
      <div className="flex h-[68%] w-[68%] items-center justify-center rounded-full" style={{ border: '1.5px dashed rgba(240,246,255,0.55)' }}>
        <Heart size={18} fill="#eef4ff" strokeWidth={0} style={{ filter: 'drop-shadow(0 1px 1px rgba(40,60,110,0.5))' }} />
      </div>
    </div>
  )
  const half = (clip, x, rot) => (
    <motion.div
      className="absolute inset-0"
      style={{ clipPath: clip }}
      animate={broken ? { x, y: 46, rotate: rot, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
      transition={{ duration: broken ? 0.9 : 0, ease: 'easeIn' }}
    >
      {face}
    </motion.div>
  )
  return (
    <motion.div
      className="absolute left-1/2 z-[6] h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 sm:h-[64px] sm:w-[64px]"
      style={{ top: '52%' }}
      animate={broken ? {} : { scale: [1, 1.04, 1] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      {half('inset(-24px 50% -24px -24px)', -26, -28)}
      {half('inset(-24px -24px -24px 50%)', 26, 28)}
    </motion.div>
  )
}

/** Little lights that gently orbit the envelope. */
function Glimmers({ count }) {
  const items = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      id: i, left: rand(-14, 112), top: rand(-30, 120), s: rand(3, 6), d: rand(3, 6), dl: rand(0, 4),
    })),
    [count]
  )
  return items.map((g) => (
    <motion.span
      key={g.id}
      className="absolute rounded-full"
      style={{
        left: `${g.left}%`, top: `${g.top}%`, width: g.s, height: g.s, background: '#f4f9ff',
        boxShadow: '0 0 10px 3px rgba(190,220,255,0.9)',
      }}
      animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4], y: [0, -12, 0] }}
      transition={{ duration: g.d, delay: g.dl, repeat: Infinity, ease: 'easeInOut' }}
    />
  ))
}

/**
 * phase: 'locked' | 'opening'
 * shakeKey: increment to play the gentle "not quite" shake.
 */
export default function Envelope({ phase, shakeKey }) {
  const reduced = useReducedMotion()
  const shake = useAnimationControls()
  const opening = phase === 'opening'

  useEffect(() => {
    if (!shakeKey) return
    shake.start({
      x: reduced ? 0 : [0, -11, 10, -7, 5, -2, 0],
      rotate: reduced ? 0 : [0, -2.2, 2, -1.2, 0.8, 0],
      transition: { duration: 0.6, ease: 'easeInOut' },
    })
  }, [shakeKey, shake, reduced])

  return (
    <motion.div animate={shake} className="relative mx-auto w-[min(80vw,340px,38vh)] min-w-[220px] sm:w-[min(360px,38vh)]">
      <motion.div
        className="relative"
        animate={reduced || opening ? { y: 0 } : { y: [0, -9, 0], rotate: [-0.6, 0.6, -0.6] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Glimmers count={reduced ? 0 : 12} />

        <div className="relative w-full" style={{ aspectRatio: '3 / 2', perspective: 900 }}>
          {/* back inside */}
          <div
            className="absolute inset-0 rounded-md"
            style={{ background: 'linear-gradient(180deg,#9db9d8,#adc6e1)', boxShadow: '0 22px 38px rgba(70,100,150,0.28), 0 6px 12px rgba(70,100,150,0.18)' }}
          />

          {/* the letter peeking out */}
          <motion.div
            className="paper absolute left-[7%] right-[7%] top-[10%] z-[2] rounded-sm"
            style={{ height: '82%', boxShadow: '0 2px 8px rgba(70,100,150,0.2)' }}
            animate={opening ? { y: '-62%', scale: 1.04 } : { y: 0, scale: 1 }}
            transition={{ duration: 1, delay: opening ? 0.95 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto mt-5 h-[3px] w-1/2 rounded bg-baby/70" />
            <div className="mx-auto mt-3 h-[3px] w-2/3 rounded bg-baby/50" />
            <div className="mx-auto mt-3 h-[3px] w-1/3 rounded bg-baby/40" />
          </motion.div>

          {/* front pocket */}
          <svg className="absolute inset-0 z-[3] h-full w-full" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="env-side" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#c9dcf0" /><stop offset="1" stopColor="#b3cde8" />
              </linearGradient>
              <linearGradient id="env-bottom" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#c3d9ef" /><stop offset="1" stopColor="#abc6e3" />
              </linearGradient>
            </defs>
            <path d="M0 0 L150 108 L0 200 Z" fill="url(#env-side)" />
            <path d="M300 0 L150 108 L300 200 Z" fill="url(#env-side)" />
            <path d="M0 200 L150 104 L300 200 Z" fill="url(#env-bottom)" />
            <path d="M0 200 L150 104 L300 200" fill="none" stroke="#e9f1f9" strokeWidth="1.2" opacity="0.85" />
            <path d="M0 0 L150 108 L0 200 M300 0 L150 108 L300 200" fill="none" stroke="#e1ebf6" strokeWidth="0.8" opacity="0.6" />
            <rect x="0.6" y="0.6" width="298.8" height="198.8" rx="3" fill="none" stroke="#e6eef7" strokeWidth="1.2" opacity="0.8" />
          </svg>

          {/* flap */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[56%]"
            style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
            initial={false}
            animate={opening ? { rotateX: 180, zIndex: [5, 5, 1] } : { rotateX: 0, zIndex: 5 }}
            transition={{ duration: 0.95, delay: opening ? 0.45 : 0, ease: 'easeInOut', zIndex: { duration: 0.95, delay: opening ? 0.45 : 0, times: [0, 0.45, 0.46] } }}
          >
            <svg className="h-full w-full" viewBox="0 0 300 112" preserveAspectRatio="none" aria-hidden="true" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#dbe9f6" /><stop offset="1" stopColor="#c0d7ee" />
                </linearGradient>
              </defs>
              <path d="M0 0 L300 0 L150 108 Z" fill="url(#env-flap)" stroke="#eef4fa" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M12 3 L150 97" stroke="#f6faff" strokeWidth="0.8" opacity="0.7" fill="none" />
              <path d="M288 3 L150 97" stroke="#f6faff" strokeWidth="0.8" opacity="0.7" fill="none" />
            </svg>
          </motion.div>

          <Seal broken={opening} />
        </div>

        {/* soft ground shadow */}
        <motion.div
          className="mx-auto mt-6 h-4 w-[70%] rounded-[50%]"
          style={{ background: 'radial-gradient(ellipse, rgba(70,100,150,0.28), transparent 70%)' }}
          animate={reduced || opening ? {} : { scaleX: [1, 0.88, 1], opacity: [0.9, 0.6, 0.9] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  )
}
