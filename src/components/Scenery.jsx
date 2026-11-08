import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion } from '../hooks'

/** Layer that shifts a little with the pointer — deeper layers move less. */
function Layer({ depth, mx, my, children, className = '' }) {
  const x = useTransform(mx, (v) => v * depth)
  const y = useTransform(my, (v) => v * depth * 0.6)
  return (
    <motion.div className={`absolute inset-[-4%] ${className}`} style={{ x, y }}>
      {children}
    </motion.div>
  )
}

const Cloud = ({ top, size, duration, delay, opacity }) => (
  <div
    className="absolute left-0"
    style={{
      top, opacity,
      animation: `drift ${duration}s linear ${delay}s infinite`,
      willChange: 'transform',
    }}
  >
    <svg width={size} height={size * 0.4} viewBox="0 0 200 80">
      <g fill="#ffffff">
        <ellipse cx="60" cy="50" rx="46" ry="22" />
        <ellipse cx="100" cy="38" rx="42" ry="28" />
        <ellipse cx="140" cy="50" rx="44" ry="22" />
        <ellipse cx="100" cy="56" rx="70" ry="16" />
      </g>
    </svg>
  </div>
)

const Flower = ({ x, y, color, delay, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <g style={{ transformOrigin: '0px 0px', animation: `sway ${4 + delay}s ease-in-out ${delay}s infinite` }}>
      <path d="M0 0 C1 -14 -1 -22 0 -32" stroke="#7fa88f" strokeWidth="2" fill="none" strokeLinecap="round" />
      <g transform="translate(0 -34)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-5" rx="3.6" ry="5.5" fill={color} transform={`rotate(${a})`} />
        ))}
        <circle r="2.6" fill="#fff6d8" />
      </g>
    </g>
  </g>
)

export default function Scenery() {
  const reduced = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 40, damping: 20, mass: 0.8 })
  const my = useSpring(rawY, { stiffness: 40, damping: 20, mass: 0.8 })

  useEffect(() => {
    if (reduced) return
    const onMove = (e) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * -36)
      rawY.set((e.clientY / window.innerHeight - 0.5) * -22)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced, rawX, rawY])

  const flowers = [
    [60, 40, '#f4f7fb', 0.2, 1.1], [140, 70, '#c6d9f0', 0.9, 0.9], [240, 30, '#ffffff', 1.4, 1.2],
    [340, 80, '#b8cdea', 0.5, 1], [470, 45, '#f1f6fb', 1.1, 1.1], [600, 85, '#d3e1f3', 0.3, 0.9],
    [720, 35, '#ffffff', 1.7, 1.2], [860, 75, '#bdd0ea', 0.8, 1], [980, 40, '#f4f7fb', 0.1, 1.1],
    [1090, 80, '#d3e1f3', 1.3, 0.95], [1200, 35, '#ffffff', 0.6, 1.2], [1320, 70, '#c0d3ee', 1.0, 1],
    [1440, 40, '#f4f7fb', 0.4, 1.1], [1520, 80, '#d3e1f3', 1.5, 0.9],
  ]

  return (
    <div className="fixed inset-0 overflow-hidden" aria-hidden="true" style={{ zIndex: 0 }}>
      {/* sky */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg,#a9c9e6 0%,#c4dcee 38%,#e3eff8 62%,#f3f0e6 100%)' }}
      />
      {/* soft sun glow */}
      <div
        className="absolute"
        style={{
          left: '62%', top: '8%', width: '46vmax', height: '46vmax', transform: 'translate(-50%,-30%)',
          background: 'radial-gradient(circle, rgba(255,250,235,0.85) 0%, rgba(255,250,235,0.35) 28%, transparent 62%)',
        }}
      />
      {/* light rays */}
      {!reduced && (
        <motion.div
          className="absolute inset-0 origin-top-right"
          style={{
            background:
              'conic-gradient(from 195deg at 66% -6%, transparent 0deg, rgba(255,255,255,0.22) 6deg, transparent 14deg, rgba(255,255,255,0.16) 22deg, transparent 30deg, rgba(255,255,255,0.2) 40deg, transparent 52deg)',
            mixBlendMode: 'soft-light',
          }}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* clouds */}
      <div className="absolute inset-x-0 top-0 h-[55%] overflow-hidden">
        <Cloud top="6%" size={240} duration={140} delay={-30} opacity={0.75} />
        <Cloud top="18%" size={170} duration={170} delay={-110} opacity={0.6} />
        <Cloud top="30%" size={300} duration={200} delay={-60} opacity={0.5} />
        <Cloud top="12%" size={130} duration={120} delay={-90} opacity={0.55} />
      </div>

      {/* far mountains */}
      <Layer depth={0.25} mx={mx} my={my}>
        <svg className="absolute bottom-[26%] w-full h-[46%]" viewBox="0 0 1600 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="farM" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#b6cbe3" />
              <stop offset="1" stopColor="#d3e2f0" />
            </linearGradient>
          </defs>
          <path d="M0 400 L0 250 L120 170 L210 215 L360 70 L470 190 L560 140 L700 230 L820 110 L940 200 L1060 90 L1190 210 L1310 140 L1440 220 L1600 150 L1600 400 Z" fill="url(#farM)" />
          {/* snow caps */}
          <path d="M360 70 L322 118 L345 108 L362 126 L384 106 L405 120 Z" fill="#fbfdff" opacity="0.9" />
          <path d="M1060 90 L1022 140 L1045 128 L1064 146 L1086 126 L1106 140 Z" fill="#fbfdff" opacity="0.9" />
          <path d="M820 110 L790 150 L810 142 L824 156 L842 140 L856 150 Z" fill="#fbfdff" opacity="0.85" />
        </svg>
      </Layer>

      {/* mid mountains */}
      <Layer depth={0.5} mx={mx} my={my}>
        <svg className="absolute bottom-[22%] w-full h-[36%]" viewBox="0 0 1600 300" preserveAspectRatio="none">
          <defs>
            <linearGradient id="midM" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8fb0cf" />
              <stop offset="1" stopColor="#b3cbe0" />
            </linearGradient>
          </defs>
          <path d="M0 300 L0 190 L140 120 L260 190 L420 90 L560 200 L720 130 L860 210 L1010 100 L1170 200 L1320 120 L1460 190 L1600 130 L1600 300 Z" fill="url(#midM)" opacity="0.95" />
        </svg>
      </Layer>

      {/* hills, village + lake */}
      <Layer depth={0.8} mx={mx} my={my}>
        <svg className="absolute bottom-0 w-full h-[44%]" viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#bcd6ec" />
              <stop offset="1" stopColor="#d9e8f3" />
            </linearGradient>
            <linearGradient id="meadow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#a9c8a9" />
              <stop offset="1" stopColor="#c9dcc0" />
            </linearGradient>
          </defs>
          {/* back green hill */}
          <path d="M0 200 C200 150 400 170 600 190 C820 210 1000 150 1200 170 C1400 190 1500 170 1600 160 L1600 420 L0 420 Z" fill="#9bbd9f" opacity="0.85" />
          {/* lake */}
          <path d="M0 240 C300 226 600 236 900 228 C1200 222 1400 236 1600 230 L1600 420 L0 420 Z" fill="url(#lake)" />
          {/* mountain reflection shimmer */}
          <g opacity="0.25" fill="#ffffff">
            <rect x="260" y="258" width="120" height="3" rx="1.5" />
            <rect x="620" y="272" width="180" height="3" rx="1.5" />
            <rect x="1020" y="262" width="140" height="3" rx="1.5" />
            <rect x="1280" y="282" width="100" height="3" rx="1.5" />
          </g>
          {/* village across the lake */}
          <g transform="translate(1040 190)">
            {[[0, 0, 26, 18, '#f3ecdf'], [34, 4, 22, 14, '#ede6d8'], [64, -4, 30, 22, '#f6f0e4'], [102, 2, 20, 16, '#efe8da']].map(([x, y, w, h, c], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                <rect y={-h} width={w} height={h} fill={c} />
                <path d={`M-3 ${-h} L${w / 2} ${-h - 11} L${w + 3} ${-h}Z`} fill="#8f7f86" opacity="0.8" />
              </g>
            ))}
            {/* chapel */}
            <g transform="translate(138 0)">
              <rect y="-30" width="14" height="30" fill="#f6f0e4" />
              <path d="M-2 -30 L7 -48 L16 -30Z" fill="#8a97b3" />
            </g>
          </g>
          {/* front meadow */}
          <path d="M0 330 C260 300 520 320 800 308 C1080 296 1340 318 1600 300 L1600 420 L0 420 Z" fill="url(#meadow)" />
          {/* little trees */}
          {[[180, 318, 1], [250, 326, 0.8], [1400, 312, 1.1], [1470, 320, 0.85]].map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
              <rect x="-2" y="-8" width="4" height="12" fill="#8c7c78" />
              <path d="M0 -52 L16 -10 L-16 -10Z" fill="#7da58a" />
              <path d="M0 -40 L18 -2 L-18 -2Z" fill="#6f9a7e" />
            </g>
          ))}
        </svg>
      </Layer>

      {/* foreground flowers */}
      <Layer depth={1.3} mx={mx} my={my}>
        <svg className="absolute bottom-0 w-full h-[16%]" viewBox="0 0 1600 120" preserveAspectRatio="xMidYMax slice">
          {flowers.map(([x, y, c, d, s], i) => (
            <Flower key={i} x={x} y={y + 40} color={c} delay={d} scale={s} />
          ))}
        </svg>
      </Layer>

      {/* gentle mist + readability overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(219,233,244,0.18) 0%, rgba(235,244,251,0.10) 50%, rgba(251,248,241,0.22) 100%)' }}
      />
    </div>
  )
}
