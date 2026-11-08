import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useReducedMotion } from '../hooks'
import { PERSONAL_MESSAGE, LETTER_HEADING, LETTER_SIGNOFF, LETTER_SIGNATURE } from '../config'

const Corner = ({ className }) => (
  <svg className={`absolute h-10 w-10 text-corn/60 sm:h-14 sm:w-14 ${className}`} viewBox="0 0 56 56" fill="none" aria-hidden="true">
    <path d="M4 52 V18 C4 10 10 4 18 4 H52" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M12 52 V24 C12 17 17 12 24 12 H52" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
    <circle cx="18" cy="18" r="2" fill="currentColor" opacity="0.7" />
  </svg>
)

const Divider = () => (
  <div className="flex items-center justify-center gap-3 text-corn/70" aria-hidden="true">
    <span className="h-px w-14 bg-gradient-to-r from-transparent to-baby sm:w-24" />
    <Heart size={13} fill="currentColor" strokeWidth={0} />
    <Heart size={9} fill="currentColor" strokeWidth={0} className="opacity-60" />
    <Heart size={13} fill="currentColor" strokeWidth={0} />
    <span className="h-px w-14 bg-gradient-to-l from-transparent to-baby sm:w-24" />
  </div>
)

export default function Letter({ onClose }) {
  const reduced = useReducedMotion()
  const scrollRef = useRef(null)
  const paragraphs = PERSONAL_MESSAGE.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

  useEffect(() => {
    scrollRef.current?.focus({ preventScroll: true })
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      ref={scrollRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Your love letter"
      className="letter-scroll fixed inset-0 z-20 overflow-y-auto overflow-x-hidden outline-none"
      style={{ perspective: 1200 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.1, delay: 0.25 } }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex min-h-full items-center justify-center px-3 py-16 sm:px-6 sm:py-20">
        <motion.article
          className="paper relative w-full max-w-2xl rounded-[6px] shadow-[0_30px_70px_rgba(70,100,150,0.32),0_8px_18px_rgba(70,100,150,0.16)]"
          style={{ transformOrigin: '50% 100%' }}
          initial={{ opacity: 0, y: 90, scale: 0.9, rotateX: 18 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, y: 40, scaleY: 0.18, rotateX: -70, transition: { duration: 1, ease: 'easeInOut' } }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* gentle floating */}
          <motion.div
            animate={reduced ? {} : { y: [0, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="relative px-6 pb-10 pt-12 sm:px-14 sm:pb-14 sm:pt-16"
          >
            {/* decorative border */}
            <div className="pointer-events-none absolute inset-2.5 rounded-[4px] border border-baby/80 sm:inset-4" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-[14px] rounded-[3px] border border-dashed border-baby/40 sm:inset-[22px]" aria-hidden="true" />
            <Corner className="left-3 top-3 sm:left-5 sm:top-5" />
            <Corner className="right-3 top-3 -scale-x-100 sm:right-5 sm:top-5" />
            <Corner className="bottom-3 left-3 -scale-y-100 sm:bottom-5 sm:left-5" />
            <Corner className="bottom-3 right-3 -scale-100 sm:bottom-5 sm:right-5" />

            {/* wax stamp-ish heart */}
            <div className="relative mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#aebfe4] to-[#7f98cc] text-white shadow-[0_4px_10px_rgba(80,110,170,0.35)]" aria-hidden="true">
              <Heart size={18} fill="currentColor" strokeWidth={0} />
            </div>

            <motion.h2
              className="relative text-center font-script text-[2.1rem] leading-[1.25] text-ink sm:text-5xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1 }}
            >
              {LETTER_HEADING}
            </motion.h2>

            <div className="relative my-7 sm:my-9"><Divider /></div>

            {/* ✏️ The text itself comes from src/config.js → PERSONAL_MESSAGE */}
            <motion.div
              className="relative space-y-5 text-center font-serif text-[1.3rem] leading-[1.75] text-[#3a4f70] sm:text-[1.5rem] sm:leading-[1.8]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 1.2 }}
            >
              {paragraphs.map((p, i) => (
                <p key={i} className="whitespace-pre-line">{p}</p>
              ))}
            </motion.div>

            <div className="relative mt-9 text-center sm:mt-12">
              <p className="font-script text-3xl text-corn sm:text-4xl">{LETTER_SIGNOFF}</p>
              {LETTER_SIGNATURE && <p className="mt-1 font-script text-3xl text-ink sm:text-4xl">{LETTER_SIGNATURE}</p>}
              <Heart size={20} fill="currentColor" strokeWidth={0} className="mx-auto mt-3 text-corn/80" aria-hidden="true" />
            </div>

            <div className="relative mt-9 flex justify-center sm:mt-12">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.045, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative min-h-[52px] overflow-hidden rounded-full px-9 py-3.5 font-serif text-xl font-semibold tracking-wide text-white shadow-[0_12px_28px_rgba(100,140,200,0.4)] transition-shadow hover:shadow-[0_16px_34px_rgba(100,140,200,0.52)]"
                style={{ background: 'linear-gradient(135deg,#a3c1e6 0%,#7e9fd0 100%)' }}
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Close♡</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.article>
      </div>
    </motion.div>
  )
}
