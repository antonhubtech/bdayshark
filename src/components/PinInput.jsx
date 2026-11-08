import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * Four rounded digit boxes.
 * - typing a digit jumps to the next box
 * - Backspace clears, and steps back when the box is already empty
 * - ← / → move between boxes, Enter submits
 * - pasting "1234" (or "1 2 3 4") fills all four
 */
export default function PinInput({ digits, onChange, onSubmit, status, disabled, focusSignal }) {
  const refs = useRef([])

  // focus the first empty box on mount / whenever the parent asks (e.g. after a reset or error)
  useEffect(() => {
    const t = setTimeout(() => {
      const idx = digits.findIndex((d) => d === '')
      refs.current[idx === -1 ? 0 : idx]?.focus({ preventScroll: true })
    }, 60)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusSignal])

  const set = (i, v) => {
    const next = [...digits]
    next[i] = v
    onChange(next)
  }

  const handleInput = (i, e) => {
    const v = e.target.value.replace(/\D/g, '')
    if (!v) return set(i, '')
    if (v.length > 1) return fill(v, i) // e.g. mobile autofill / fast typing
    set(i, v)
    if (i < 3) refs.current[i + 1]?.focus()
  }

  const fill = (raw, start = 0) => {
    const clean = raw.replace(/\D/g, '').slice(0, 4 - start)
    if (!clean) return
    const next = [...digits]
    clean.split('').forEach((ch, k) => { next[start + k] = ch })
    onChange(next)
    refs.current[Math.min(start + clean.length, 3)]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      if (digits[i]) { set(i, ''); e.preventDefault() }
      else if (i > 0) { e.preventDefault(); set(i - 1, ''); refs.current[i - 1]?.focus() }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault(); refs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowRight' && i < 3) {
      e.preventDefault(); refs.current[i + 1]?.focus()
    } else if (e.key === 'Enter') {
      e.preventDefault(); onSubmit()
    } else if (e.key.length === 1 && /\D/.test(e.key) && !e.ctrlKey && !e.metaKey) {
      e.preventDefault() // digits only
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    fill(e.clipboardData.getData('text'), 0)
  }

  const glow = status === 'success'

  return (
    <div role="group" aria-label="Four digit secret code" className="flex items-center justify-center gap-2.5 sm:gap-3">
      {digits.map((d, i) => (
        <motion.input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          onChange={(e) => handleInput(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={4}
          aria-label={`Digit ${i + 1} of 4`}
          animate={
            glow
              ? { boxShadow: ['0 0 0 0 rgba(160,205,255,0)', '0 0 22px 6px rgba(160,205,255,0.85)', '0 0 14px 4px rgba(160,205,255,0.6)'], scale: [1, 1.08, 1.04] }
              : { boxShadow: '0 4px 14px rgba(110,140,190,0.16)', scale: 1 }
          }
          transition={glow ? { duration: 0.7, delay: i * 0.09 } : { duration: 0.2 }}
          className={`h-14 w-12 rounded-2xl border bg-white/80 text-center font-serif text-3xl font-semibold text-ink outline-none transition-colors placeholder:text-baby sm:h-16 sm:w-14 ${
            status === 'error' ? 'border-rose-300/80' : glow ? 'border-sky' : 'border-baby focus:border-corn'
          }`}
          style={{ caretColor: '#7e9fd0' }}
        />
      ))}
    </div>
  )
}
