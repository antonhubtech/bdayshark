import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Scenery from './components/Scenery'
import Atmosphere from './components/Atmosphere'
import ButterflyCursor from './components/ButterflyCursor'
import AudioToggle from './components/AudioToggle'
import Loader from './components/Loader'
import LockScreen from './components/LockScreen'
import Letter from './components/Letter'
import MapleLeaves from './components/MapleLeaves'

/**
 * stage: 'locked' → envelope + PIN   |   'letter' → the open letter
 * Nothing about a successful unlock is stored anywhere (no localStorage, no URL, no cookie).
 * Closing the letter bumps `lockKey`, which remounts <LockScreen/> so every input is blank again.
 */
export default function App() {
  const [loading, setLoading] = useState(true)
  const [stage, setStage] = useState('locked')
  const [lockKey, setLockKey] = useState(0)
  const [leavesOn, setLeavesOn] = useState(false)
  const [leavesMounted, setLeavesMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(t)
  }, [])

  const handleUnlocked = useCallback(() => {
    setStage('letter')
    setLeavesMounted(true)
    setLeavesOn(true)
  }, [])

  const handleClose = useCallback(() => {
    setLeavesOn(false) // leaves stop spawning and fade away
    setStage('locked')
    setLockKey((k) => k + 1) // brand-new lock screen: empty PIN, closed envelope
    setTimeout(() => setLeavesMounted(false), 3000)
  }, [])

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden">
      <Scenery />
      <Atmosphere />

      <AnimatePresence mode="wait">
        {!loading && stage === 'locked' && <LockScreen key={`lock-${lockKey}`} onUnlocked={handleUnlocked} />}
        {!loading && stage === 'letter' && <Letter key="letter" onClose={handleClose} />}
      </AnimatePresence>

      {leavesMounted && <MapleLeaves active={leavesOn} />}

      <AudioToggle />
      <ButterflyCursor />

      <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>
    </div>
  )
}
