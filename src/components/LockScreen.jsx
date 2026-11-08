import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, Sparkles } from 'lucide-react'
import Envelope from './Envelope'
import PinInput from './PinInput'
import { VALID_CODES } from '../config'

const EMPTY = ['', '', '', '']
const ERROR_TEXT = "Hmm... mali naman ihhhhh. 💙"
const INCOMPLETE_TEXT = 'Four little digits, pede? pede poo?. 💙'

/**
 * The first page. All state here (including the typed digits) lives only in this component,
 * so when the letter closes and this screen mounts again, everything starts fresh.
 */
export default function LockScreen({ onUnlocked }) {
  const [digits, setDigits] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | error | success
  const [message, setMessage] = useState('')
  const [shakeKey, setShakeKey] = useState(0)
  const [focusSignal, setFocusSignal] = useState(0)
  const [phase, setPhase] = useState('locked') // locked | opening
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))

  const submit = () => {
    if (status === 'success') return
    const code = digits.join('')
    if (code.length < 4) {
      setStatus('error')
      setMessage(INCOMPLETE_TEXT)
      setShakeKey((k) => k + 1)
      setFocusSignal((n) => n + 1)
      return
    }
    if (VALID_CODES.includes(code)) {
      setMessage('')
      setStatus('success')
      later(() => setPhase('opening'), 750) // let the boxes glow first
      later(() => onUnlocked(), 2900)
    } else {
      setStatus('error')
      setMessage(ERROR_TEXT)
      setShakeKey((k) => k + 1)
      later(() => {
        setDigits(EMPTY)
        setFocusSignal((n) => n + 1)
      }, 650)
    }
  }

  const handleChange = (next) => {
    setDigits(next)
    if (status === 'error') { setStatus('idle'); setMessage('') }
  }

  const busy = status === 'success'

  return (
    <motion.main
      className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-5 py-10 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.9 } }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.h1
        className="font-script text-[2.6rem] leading-tight text-ink sm:text-6xl"
        style={{ textShadow: '0 2px 18px rgba(255,255,255,0.85)' }}
        animate={phase === 'opening' ? { opacity: 0, y: -8 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        A little something for you...
      </motion.h1>

      <div className="mt-8 w-full sm:mt-10">
        <Envelope phase={phase} shakeKey={shakeKey} />
      </div>

      <motion.div
        className="mt-5 flex w-full max-w-md flex-col items-center sm:mt-7"
        animate={phase === 'opening' ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p className="font-serif text-xl font-medium text-ink sm:text-2xl" style={{ textShadow: '0 1px 12px rgba(255,255,255,0.9)' }}>
          Hello? Peñabatan na po ba to?
        </p>
        <p className="mt-1.5 font-serif text-base italic text-ink/80 sm:text-lg" style={{ textShadow: '0 1px 10px rgba(255,255,255,0.9)' }}>
          wait... are you her or here kasi nakiki chismis ka?? jk.
        </p>

        <form
          className="glass mt-6 flex w-full flex-col items-center gap-5 rounded-[2rem] px-5 py-6 shadow-[0_18px_44px_rgba(90,120,170,0.18)] sm:px-8"
          onSubmit={(e) => { e.preventDefault(); submit() }}
        >
          <PinInput
            digits={digits}
            onChange={handleChange}
            onSubmit={submit}
            status={status}
            disabled={busy}
            focusSignal={focusSignal}
          />

          <motion.button
            type="submit"
            disabled={busy}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="group relative flex min-h-[48px] items-center gap-2 overflow-hidden rounded-full px-8 py-3 font-sans text-base font-semibold tracking-wide text-white shadow-[0_10px_24px_rgba(100,140,200,0.4)] transition-shadow hover:shadow-[0_14px_30px_rgba(100,140,200,0.5)] disabled:opacity-80"
            style={{ background: 'linear-gradient(135deg,#9bbbe3 0%,#7e9fd0 100%)' }}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            {busy ? <Sparkles size={18} /> : <KeyRound size={18} />}
            <span className="relative">{busy ? 'Unlocking...' : 'Unlock'}</span>
          </motion.button>

          <p
            role="status"
            aria-live="polite"
            className="min-h-[3rem] max-w-xs font-serif text-base italic leading-snug text-ink sm:text-lg"
          >
            {message}
          </p>
        </form>
      </motion.div>

      <motion.footer
        className="mt-8 font-serif text-base italic text-ink/75"
        style={{ textShadow: '0 1px 10px rgba(255,255,255,0.9)' }}
        animate={phase === 'opening' ? { opacity: 0 } : { opacity: 1 }}
      >
        YOOOOOHOOOOOOOOOOO. ♡
      </motion.footer>
    </motion.main>
  )
}
