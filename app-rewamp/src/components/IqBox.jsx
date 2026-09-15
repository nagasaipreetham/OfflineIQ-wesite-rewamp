import { useCallback, useEffect, useRef, useState } from 'react'
import { ShellInner } from './Shell.jsx'
import SectionPin from './SectionPin.jsx'
import { useImageDisintegrate } from '../lib/useImageDisintegrate.js'
import './IqBox.css'

const CYCLE_MS = 6500
/* Matches the demo’s [perspective:500px] feel — soft card lean, not a hard flip. */
const TILT_MAX = 18
const HOVER_SCALE = 1.08

const SPECS = [
  {
    tagline: 'The processing power.',
    name: 'Ryzen 9 9950X',
    image: '/Ryzen9.png',
    deviceClass: 'iqbox__device--ryzen',
  },
  {
    tagline: 'The working memory.',
    name: '59.4 GiB RAM',
    image: '/ram-stick.png',
    deviceClass: 'iqbox__device--ram',
  },
  {
    tagline: 'The AI powerhouse.',
    name: 'Radeon AI PRO R9700 · 34.2 GB VRAM',
    image: '/Radeon%20AI%20PRO%20R9700.png',
    deviceClass: 'iqbox__device--radeon',
  },
  {
    tagline: 'The storage foundation.',
    name: '4 TB NVMe',
    image: '/nvme-ssd.png',
    deviceClass: 'iqbox__device--nvme',
  },
]

function IqBox() {
  const stageRef = useRef(null)
  const visualRef = useRef(null)
  const canvasRef = useRef(null)
  const deviceRef = useRef(null)
  const tiltRaf = useRef(0)
  const playingRef = useRef(false)

  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [cycleKey, setCycleKey] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [dissolving, setDissolving] = useState(false)
  const [shownImage, setShownImage] = useState(SPECS[0].image)

  const commitImage = useCallback((src) => {
    setShownImage(src)
    setDissolving(false)
  }, [])

  const start = useCallback(() => {
    if (playingRef.current) return
    playingRef.current = true
    setPlaying(true)
    setCycleKey((k) => k + 1)
  }, [])

  const pause = useCallback(() => {
    if (!playingRef.current) return
    playingRef.current = false
    setPlaying(false)
  }, [])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return undefined

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start()
        else pause()
      },
      { threshold: 0.32, rootMargin: '0px 0px -8% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [start, pause])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!reducedMotion || !playing) return undefined
    const id = window.setInterval(() => {
      if (!playingRef.current) return
      setActive((i) => (i + 1) % SPECS.length)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [reducedMotion, playing, cycleKey])

  const advance = useCallback(() => {
    if (!playingRef.current) return
    setActive((i) => (i + 1) % SPECS.length)
  }, [])

  const select = (index) => {
    setActive(index)
    if (playingRef.current) setCycleKey((k) => k + 1)
  }

  const resetTilt = useCallback(() => {
    const device = deviceRef.current
    if (!device) return
    device.style.setProperty('--tilt-x', '0deg')
    device.style.setProperty('--tilt-y', '0deg')
    device.style.setProperty('--tilt-scale', '1')
    device.classList.remove('is-tilting')
  }, [])

  const onDeviceMove = useCallback(
    (e) => {
      if (reducedMotion) return
      const device = deviceRef.current
      if (!device) return

      const rect = device.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      const tiltY = (px - 0.5) * (TILT_MAX * 2)
      const tiltX = (0.5 - py) * (TILT_MAX * 2)

      cancelAnimationFrame(tiltRaf.current)
      tiltRaf.current = requestAnimationFrame(() => {
        device.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`)
        device.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`)
        device.style.setProperty('--tilt-scale', String(HOVER_SCALE))
        device.classList.add('is-tilting')
      })
    },
    [reducedMotion],
  )

  const onDeviceLeave = useCallback(() => {
    cancelAnimationFrame(tiltRaf.current)
    resetTilt()
  }, [resetTilt])

  useEffect(() => {
    resetTilt()
  }, [active, resetTilt])

  useEffect(() => () => cancelAnimationFrame(tiltRaf.current), [])

  const activeSpec = SPECS[active]
  const activeImage = activeSpec.image
  const shownSpec = SPECS.find((s) => s.image === shownImage) || activeSpec

  useImageDisintegrate({
    hostRef: visualRef,
    canvasRef,
    src: activeImage,
    reducedMotion,
    onBusyChange: setDissolving,
    onCommit: commitImage,
  })

  return (
    <section className="iqbox" id="the-iq-box">
      <ShellInner>
        <SectionPin>
          <h2 className="iqbox__title">
            <span className="iqbox__label">The IQ Box</span>
          </h2>
          <div className="iqbox__rule" aria-hidden="true" />
        </SectionPin>

        <div className="iqbox__intro">
          <p className="iqbox__eyebrow">Wonder where your AI lives?</p>
          <h3 className="iqbox__heading">
            Introducing <mark className="iqbox__mark">IQ BOX - VX01</mark>
          </h3>
          <p className="iqbox__caption">
            IQ BOX is OfflineIQ&rsquo;s AI computing system, built in partnership with AMD
            to run powerful AI models and apps directly within your environment.
          </p>
        </div>

        <div className="iqbox__stage" ref={stageRef}>
          <div className="iqbox__specs">
            <div className="iqbox__specs-head">
              <p className="iqbox__specs-label">The Inside</p>
            </div>
            {SPECS.map((spec, i) => {
              const isActive = i === active
              return (
                <button
                  key={spec.name}
                  type="button"
                  className={`iqbox__spec${isActive ? ' is-active' : ''}`}
                  aria-pressed={isActive}
                  onClick={() => select(i)}
                >
                  <p className="iqbox__spec-tagline">{spec.tagline}</p>
                  <p className="iqbox__spec-name">{spec.name}</p>
                  {playing && isActive && !reducedMotion ? (
                    <span
                      key={cycleKey}
                      className="iqbox__spec-line"
                      aria-hidden="true"
                      style={{ animationDuration: `${CYCLE_MS}ms` }}
                      onAnimationEnd={(e) => {
                        if (e.animationName !== 'iqbox-line-fill') return
                        advance()
                      }}
                    />
                  ) : null}
                </button>
              )
            })}
          </div>

          <div
            className={`iqbox__visual${activeImage ? ' has-device' : ''}${
              dissolving ? ' is-dissolving' : ''
            }`}
            ref={visualRef}
            aria-hidden={!activeImage && !dissolving}
          >
            <div
              className="iqbox__visual-bg"
              style={{ backgroundImage: 'url(/bg.webp)' }}
            />
            <canvas
              ref={canvasRef}
              className="iqbox__dissolve"
              aria-hidden="true"
            />
            {shownImage ? (
              <div
                className={`iqbox__visual-stage${dissolving ? ' is-hidden' : ''}`}
              >
                <div
                  ref={deviceRef}
                  className={`iqbox__device${
                    shownSpec.deviceClass ? ` ${shownSpec.deviceClass}` : ''
                  }`}
                  onMouseMove={
                    dissolving || reducedMotion ? undefined : onDeviceMove
                  }
                  onMouseLeave={
                    dissolving || reducedMotion ? undefined : onDeviceLeave
                  }
                >
                  <img
                    className="iqbox__visual-device"
                    src={shownImage}
                    alt=""
                    draggable={false}
                  />
                  <span
                    className="iqbox__device-shine"
                    style={{
                      WebkitMaskImage: `url(${shownImage})`,
                      maskImage: `url(${shownImage})`,
                    }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </ShellInner>
    </section>
  )
}

export default IqBox
