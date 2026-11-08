/** A delicate blue butterfly. Wings flap via CSS (see index.css). */
export default function Butterfly({ size = 34, flapSpeed = 0.55, glow = false, id = 'bf' }) {
  const style = { animationDuration: `${flapSpeed}s` }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={{ overflow: 'visible', filter: glow ? 'drop-shadow(0 0 7px rgba(190,220,255,0.95))' : 'drop-shadow(0 2px 3px rgba(80,110,160,0.25))' }}
    >
      <defs>
        <linearGradient id={`${id}-w`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d6e6f7" />
          <stop offset="0.55" stopColor="#9fc0e6" />
          <stop offset="1" stopColor="#7f9fd2" />
        </linearGradient>
      </defs>
      {/* left wings */}
      <g className="wing-l" style={style}>
        <path d="M31 30 C20 8 4 8 4 20 C4 28 16 34 31 33Z" fill={`url(#${id}-w)`} stroke="#f4f9ff" strokeWidth="0.8" opacity="0.95" />
        <path d="M31 34 C18 36 8 46 14 54 C20 58 28 46 31 37Z" fill={`url(#${id}-w)`} stroke="#f4f9ff" strokeWidth="0.8" opacity="0.9" />
        <circle cx="13" cy="19" r="2.2" fill="#f4f9ff" opacity="0.85" />
        <circle cx="16" cy="49" r="1.6" fill="#f4f9ff" opacity="0.8" />
      </g>
      {/* right wings */}
      <g className="wing-r" style={style}>
        <path d="M33 30 C44 8 60 8 60 20 C60 28 48 34 33 33Z" fill={`url(#${id}-w)`} stroke="#f4f9ff" strokeWidth="0.8" opacity="0.95" />
        <path d="M33 34 C46 36 56 46 50 54 C44 58 36 46 33 37Z" fill={`url(#${id}-w)`} stroke="#f4f9ff" strokeWidth="0.8" opacity="0.9" />
        <circle cx="51" cy="19" r="2.2" fill="#f4f9ff" opacity="0.85" />
        <circle cx="48" cy="49" r="1.6" fill="#f4f9ff" opacity="0.8" />
      </g>
      {/* body + antennae */}
      <ellipse cx="32" cy="34" rx="1.7" ry="10" fill="#5d7aa6" />
      <path d="M32 24 C30 18 27 15 25 14 M32 24 C34 18 37 15 39 14" stroke="#5d7aa6" strokeWidth="0.9" fill="none" strokeLinecap="round" />
    </svg>
  )
}
