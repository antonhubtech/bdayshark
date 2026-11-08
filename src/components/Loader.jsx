import { motion } from 'framer-motion'
import Butterfly from './Butterfly'

/** Opening splash: a butterfly flutters along a looping path while the world wakes up. */
export default function Loader() {
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg,#cfe2f1 0%,#eaf4fb 100%)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      role="status"
      aria-label="Loading"
    >
      <div className="relative h-24 w-40">
        <motion.div
          className="absolute left-1/2 top-1/2 -ml-[22px] -mt-[22px]"
          animate={{ x: [0, 46, 0, -46, 0], y: [0, -26, -6, -26, 0], rotate: [0, 18, 0, -18, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Butterfly size={44} flapSpeed={0.35} glow id="load" />
        </motion.div>
      </div>
      <motion.p
        className="mt-4 font-script text-3xl text-ink/80"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        just a moment...
      </motion.p>
    </motion.div>
  )
}
