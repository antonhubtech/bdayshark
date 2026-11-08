import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks'
import babyImg from '../assets/stickers/baby.webp'
import yellowImg from '../assets/stickers/yellow.webp'
import pinkImg from '../assets/stickers/pink.webp'

// Photo stickers that drift down with the leaves. To use other photos, replace the .webp files
// in src/assets/stickers/ (keep the same names) or add more imports to this list.
const STICKER_SRC = [babyImg, yellowImg, pinkImg]

// ── maple leaf geometry (right half, mirrored) in a 100×100 box ─────────────
const RIGHT = [
  [50, 0], [57, 15], [64, 11], [67, 27], [79, 21], [76, 38], [93, 33], [87, 47],
  [99, 54], [80, 63], [85, 73], [60, 69], [55, 82], [53, 100],
]
const outline = [...RIGHT, ...RIGHT.slice().reverse().map(([x, y]) => [100 - x, y])]
const LEAF = new Path2D(
  outline.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ') + 'Z'
)
const VEINS = new Path2D(
  'M50 10 L50 100 M50 72 L27 56 M50 72 L73 56 M50 54 L22 41 M50 54 L78 41 M50 38 L36 24 M50 38 L64 24'
)

const BLUES = ['#a9c6e6', '#bfd6ee', '#8fb0d8', '#d7e6f5', '#ffffff', '#9db8dc', '#c9dcf1', '#7f9fcf']
const AUTUMN = ['#d9a87a', '#c98f7c', '#e0c28a', '#d1a089']
const pick = (a) => a[Math.floor(Math.random() * a.length)]
const r = (a, b) => Math.random() * (b - a) + a

/**
 * Canvas-drawn falling maple leaves (one canvas, one rAF loop = light on the GPU/CPU).
 * `active` false → no new leaves spawn and everything fades away slowly.
 */
export default function MapleLeaves({ active }) {
  const canvasRef = useRef(null)
  const activeRef = useRef(active)
  const reduced = useReducedMotion()

  useEffect(() => { activeRef.current = active }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0
    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const mobile = () => W < 640
    const leaves = []
    const sparks = []
    let global = 1 // overall opacity multiplier, drops to 0 on close
    let last = performance.now()
    let spawnClock = 0
    let raf

    const newLeaf = (startAnywhere = false) => {
      const size = r(mobile() ? 20 : 24, mobile() ? 38 : 48)
      const autumn = Math.random() < 0.16
      return {
        x: r(-0.05 * W, 1.05 * W),
        y: startAnywhere ? r(-0.1 * H, 0.7 * H) : r(-60, -20),
        size,
        color: autumn ? pick(AUTUMN) : pick(BLUES),
        vy: r(34, 74) * (0.6 + size / 60), // px / s – bigger leaves drift a little faster
        rot: r(0, Math.PI * 2),
        vrot: r(-0.9, 0.9),
        swayAmp: r(24, 70),
        swayFreq: r(0.5, 1.25),
        phase: r(0, Math.PI * 2),
        flip: r(0, Math.PI * 2),
        vflip: r(0.8, 2.2),
        baseX: 0,
        alpha: r(0.55, 0.9),
        t: 0,
      }
    }

    // reduced motion: a quiet, static scatter instead of a falling animation
    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H)
      const n = mobile() ? 7 : 12
      for (let i = 0; i < n; i++) {
        const l = newLeaf(true)
        l.y = r(0.04 * H, 0.9 * H)
        ctx.save()
        ctx.globalAlpha = 0.45
        ctx.translate(l.x, l.y)
        ctx.rotate(l.rot)
        ctx.scale(l.size / 100, l.size / 100)
        ctx.translate(-50, -50)
        ctx.fillStyle = l.color
        ctx.fill(LEAF)
        ctx.restore()
      }
    }
    if (reduced) {
      drawStatic()
      const fade = setInterval(() => {
        if (!activeRef.current) { canvas.style.opacity = '0' }
      }, 200)
      canvas.style.transition = 'opacity 1.6s ease'
      return () => { clearInterval(fade); window.removeEventListener('resize', resize) }
    }

    // a few leaves are already mid-air so the scene never feels empty
    for (let i = 0; i < 6; i++) { const l = newLeaf(true); l.baseX = l.x; leaves.push(l) }

    // ── photo stickers ────────────────────────────────────────────
    const stickerImgs = STICKER_SRC.map((src) => { const im = new Image(); im.src = src; return im })
    const stickers = []
    let stickerClock = 0
    let nextSticker = 2.2 // first one appears shortly after the letter opens
    let order = 0
    const spawnSticker = () => {
      const img = stickerImgs[order++ % stickerImgs.length]
      if (!img.complete || !img.naturalWidth) return
      const target = mobile() ? r(84, 108) : r(120, 156) // longest side in px
      const sc = target / Math.max(img.naturalWidth, img.naturalHeight)
      const x = r(0.08 * W, 0.92 * W)
      stickers.push({
        img, w: img.naturalWidth * sc, h: img.naturalHeight * sc,
        baseX: x, y: -img.naturalHeight * sc, vy: r(32, 46),
        swayAmp: r(36, 70), swayFreq: r(0.35, 0.6), phase: r(0, Math.PI * 2),
        tilt: r(0.12, 0.26), tiltFreq: r(0.5, 0.9), t: 0,
      })
    }

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const on = activeRef.current
      if (!on) global = Math.max(0, global - dt / 2.6)

      const maxLeaves = mobile() ? 20 : 36
      spawnClock += dt
      if (on && spawnClock > (mobile() ? 0.55 : 0.38) && leaves.length < maxLeaves) {
        spawnClock = 0
        const l = newLeaf()
        l.baseX = l.x
        leaves.push(l)
      }

      ctx.clearRect(0, 0, W, H)

      for (let i = leaves.length - 1; i >= 0; i--) {
        const l = leaves[i]
        l.t += dt
        l.y += l.vy * dt
        l.rot += l.vrot * dt
        l.flip += l.vflip * dt
        // the breeze: a slow sway plus a gentle constant drift
        const x = l.baseX + Math.sin(l.t * l.swayFreq + l.phase) * l.swayAmp + l.t * 8
        // fade out over the bottom 22% of the screen
        const fadeStart = H * 0.78
        const bottomFade = l.y > fadeStart ? Math.max(0, 1 - (l.y - fadeStart) / (H * 0.22)) : 1
        const a = l.alpha * bottomFade * global

        if (l.y > H + 40 || bottomFade <= 0) { leaves.splice(i, 1); continue }

        // leaves occasionally shed a tiny sparkle
        if (on && Math.random() < 0.012 && sparks.length < 40) {
          sparks.push({ x, y: l.y, vx: r(-8, 8), vy: r(6, 22), life: 1, s: r(0.9, 2.2) })
        }

        ctx.save()
        ctx.globalAlpha = a
        ctx.translate(x, l.y)
        ctx.rotate(l.rot)
        const flipScale = 0.35 + 0.65 * Math.abs(Math.cos(l.flip)) // fake 3D tumble
        ctx.scale((l.size / 100) * flipScale, l.size / 100)
        ctx.translate(-50, -50)
        ctx.shadowColor = 'rgba(80,110,160,0.25)'
        ctx.shadowBlur = 6 * dpr
        ctx.fillStyle = l.color
        ctx.fill(LEAF)
        ctx.shadowBlur = 0
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'
        ctx.lineWidth = 1.6
        ctx.lineCap = 'round'
        ctx.stroke(VEINS)
        ctx.restore()
      }

      // photo stickers: slow, gently rocking, fading at the bottom like the leaves
      stickerClock += dt
      if (on && stickerClock > nextSticker && stickers.length < (mobile() ? 2 : 3)) {
        stickerClock = 0
        nextSticker = r(mobile() ? 6 : 5, mobile() ? 9 : 8)
        spawnSticker()
      }
      for (let i = stickers.length - 1; i >= 0; i--) {
        const s = stickers[i]
        s.t += dt
        s.y += s.vy * dt
        const x = s.baseX + Math.sin(s.t * s.swayFreq + s.phase) * s.swayAmp
        const rot = Math.sin(s.t * s.tiltFreq + s.phase) * s.tilt
        const fadeStart = H * 0.8
        const bf = s.y > fadeStart ? Math.max(0, 1 - (s.y - fadeStart) / (H * 0.2)) : 1
        if (s.y > H + 20 || bf <= 0) { stickers.splice(i, 1); continue }
        ctx.save()
        ctx.globalAlpha = 0.97 * bf * global
        ctx.translate(x, s.y + s.h / 2)
        ctx.rotate(rot)
        ctx.shadowColor = 'rgba(60,90,140,0.35)'
        ctx.shadowBlur = 14 * dpr
        ctx.shadowOffsetY = 4
        ctx.drawImage(s.img, -s.w / 2, -s.h / 2, s.w, s.h)
        ctx.restore()
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx * dt
        s.y += s.vy * dt
        s.life -= dt * 0.9
        if (s.life <= 0) { sparks.splice(i, 1); continue }
        ctx.globalAlpha = s.life * 0.9 * global
        ctx.fillStyle = '#f2f8ff'
        ctx.shadowColor = '#b8d6fa'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // pause when the tab is hidden
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else { last = performance.now(); raf = requestAnimationFrame(tick) }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduced])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[30] h-full w-full"
    />
  )
}
