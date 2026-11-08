// Original, synthesized ambience (no audio files needed, so nothing to license):
// gentle wind, soft distant birds, and a slow, quiet pentatonic piano-ish melody.
// Nothing starts until start() is called from a user gesture.

let ctx = null
let master = null
let timers = []
let running = false

function noiseBuffer(c) {
  const len = c.sampleRate * 4
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1
    last = (last + 0.02 * w) / 1.02 // brown-ish noise
    d[i] = last * 3.5
  }
  return buf
}

function startWind(c) {
  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c)
  src.loop = true
  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 420
  filter.Q.value = 0.6
  const gain = c.createGain()
  gain.gain.value = 0.16
  // slow breathing of the wind
  const lfo = c.createOscillator()
  const lfoGain = c.createGain()
  lfo.frequency.value = 0.07
  lfoGain.gain.value = 0.07
  lfo.connect(lfoGain).connect(gain.gain)
  const lfo2 = c.createOscillator()
  const lfo2Gain = c.createGain()
  lfo2.frequency.value = 0.05
  lfo2Gain.gain.value = 180
  lfo2.connect(lfo2Gain).connect(filter.frequency)
  src.connect(filter).connect(gain).connect(master)
  src.start(); lfo.start(); lfo2.start()
}

function chirp(c) {
  const now = c.currentTime
  const base = 2400 + Math.random() * 1600
  const notes = 2 + Math.floor(Math.random() * 3)
  for (let i = 0; i < notes; i++) {
    const t = now + i * 0.13
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(base, t)
    o.frequency.exponentialRampToValueAtTime(base * (1.15 + Math.random() * 0.35), t + 0.08)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.035, t + 0.015)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)
    o.connect(g).connect(master)
    o.start(t)
    o.stop(t + 0.12)
  }
}

const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33] // C major pentatonic-ish

function pianoNote(c, freq, vel = 0.05) {
  const t = c.currentTime
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vel, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2)
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 2400
  ;[[1, 1], [2, 0.28], [3, 0.1]].forEach(([mult, amp]) => {
    const o = c.createOscillator()
    const og = c.createGain()
    o.type = 'sine'
    o.frequency.value = freq * mult
    og.gain.value = amp
    o.connect(og).connect(g)
    o.start(t)
    o.stop(t + 3.3)
  })
  g.connect(lp).connect(master)
}

function schedule(fn, min, max) {
  const loop = () => {
    if (!running) return
    fn()
    timers.push(setTimeout(loop, min + Math.random() * (max - min)))
  }
  timers.push(setTimeout(loop, min * 0.5))
}

export async function startAmbience() {
  if (running) return
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0
    // a soft echo to give the piano some air
    const delay = ctx.createDelay(1)
    delay.delayTime.value = 0.38
    const fb = ctx.createGain()
    fb.gain.value = 0.3
    delay.connect(fb).connect(delay)
    master.connect(delay).connect(ctx.destination)
    master.connect(ctx.destination)
    startWind(ctx)
  }
  if (ctx.state === 'suspended') await ctx.resume()
  running = true
  master.gain.cancelScheduledValues(ctx.currentTime)
  master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 2.5)
  schedule(() => chirp(ctx), 5000, 11000)
  schedule(() => {
    const f = SCALE[Math.floor(Math.random() * SCALE.length)]
    pianoNote(ctx, f, 0.045)
    if (Math.random() > 0.55) setTimeout(() => running && pianoNote(ctx, SCALE[Math.floor(Math.random() * SCALE.length)] / 2, 0.03), 700)
  }, 2800, 5200)
}

export function stopAmbience() {
  running = false
  timers.forEach(clearTimeout)
  timers = []
  if (ctx && master) {
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2)
    setTimeout(() => { if (!running && ctx) ctx.suspend() }, 1400)
  }
}
