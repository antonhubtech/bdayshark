import { useEffect, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { startAmbience, stopAmbience } from '../audio/ambience'

/** Off by default. Sound only begins after the visitor clicks this. */
export default function AudioToggle() {
  const [on, setOn] = useState(false)

  useEffect(() => () => stopAmbience(), [])

  const toggle = async () => {
    if (on) {
      stopAmbience()
      setOn(false)
    } else {
      await startAmbience()
      setOn(true)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Mute ambient sounds' : 'Play soft ambient sounds'}
      title={on ? 'Mute' : 'Soft ambient sounds'}
      className="glass fixed right-4 top-4 z-[60] flex h-11 w-11 items-center justify-center rounded-full text-ink shadow-[0_6px_20px_rgba(90,120,170,0.18)] transition hover:scale-105 hover:bg-white/60 active:scale-95 sm:right-6 sm:top-6"
    >
      {on ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  )
}
