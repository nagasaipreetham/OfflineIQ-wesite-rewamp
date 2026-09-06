import { useEffect, useRef } from 'react'

const MORPH_MS = 2100
const MAX_PARTICLES = 5200

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function containRect(iw, ih, cw, ch, maxFrac = 0.72) {
  const boxW = cw * maxFrac
  const boxH = ch * maxFrac
  const scale = Math.min(boxW / iw, boxH / ih)
  const w = iw * scale
  const h = ih * scale
  return {
    x: (cw - w) / 2,
    y: (ch - h) / 2,
    w,
    h,
  }
}

function maxFracFor(src) {
  if (!src) return 0.72
  if (src.includes('Ryzen')) return 0.42
  /* Match on-screen Radeon size (~93% of the visual). */
  if (src.includes('Radeon')) return 0.93
  if (src.includes('ram')) return 0.88
  if (src.includes('nvme')) return 0.88
  return 0.72
}

function measureDevice(host) {
  const img = host.querySelector('.iqbox__visual-device')
  if (!img || !img.naturalWidth) return null
  const hostRect = host.getBoundingClientRect()
  const r = img.getBoundingClientRect()
  if (r.width < 2 || r.height < 2) return null
  return {
    x: r.left - hostRect.left,
    y: r.top - hostRect.top,
    w: r.width,
    h: r.height,
  }
}

async function boxFor(src, host, cw, ch) {
  if (!src) return null
  const img = await loadImage(src)
  await new Promise((r) => requestAnimationFrame(r))
  return (
    measureDevice(host) ||
    containRect(img.naturalWidth, img.naturalHeight, cw, ch, maxFracFor(src))
  )
}

function isDustPixel(r, g, b, a) {
  /* Only solid hardware pixels — ignore transparent / fringe. */
  if (a < 96) return false
  return true
}

async function sampleParticles(src, box) {
  if (!src || !box) return []
  const img = await loadImage(src)

  const oc = document.createElement('canvas')
  oc.width = Math.max(1, Math.round(box.w))
  oc.height = Math.max(1, Math.round(box.h))
  const octx = oc.getContext('2d', { willReadFrequently: true })
  octx.drawImage(img, 0, 0, oc.width, oc.height)

  const { data } = octx.getImageData(0, 0, oc.width, oc.height)
  let step = 3
  const opaque = []
  for (let y = 0; y < oc.height; y += step) {
    for (let x = 0; x < oc.width; x += step) {
      const i = (y * oc.width + x) * 4
      if (isDustPixel(data[i], data[i + 1], data[i + 2], data[i + 3])) {
        opaque.push([x, y, i])
      }
    }
  }

  if (opaque.length > MAX_PARTICLES) {
    step = Math.ceil(step * Math.sqrt(opaque.length / MAX_PARTICLES))
    opaque.length = 0
    for (let y = 0; y < oc.height; y += step) {
      for (let x = 0; x < oc.width; x += step) {
        const i = (y * oc.width + x) * 4
        if (isDustPixel(data[i], data[i + 1], data[i + 2], data[i + 3])) {
          opaque.push([x, y, i])
        }
      }
    }
  }

  return opaque.map(([x, y, i]) => ({
    x: box.x + x + (Math.random() - 0.5) * 0.8,
    y: box.y + y + (Math.random() - 0.5) * 0.8,
    r: data[i],
    g: data[i + 1],
    b: data[i + 2],
    a: Math.min(0.95, data[i + 3] / 255),
    size: 0.55 + Math.random() * 0.85,
  }))
}

function pairParticles(fromParts, toParts) {
  const from = fromParts.length ? fromParts : toParts
  const to = toParts.length ? toParts : fromParts
  if (!from.length || !to.length) return []

  from.sort((a, b) => a.y - b.y || a.x - b.x)
  to.sort((a, b) => a.y - b.y || a.x - b.x)

  const n = Math.max(from.length, to.length)
  const particles = new Array(n)
  for (let i = 0; i < n; i += 1) {
    const a = from[Math.floor((i * from.length) / n)]
    const b = to[Math.floor((i * to.length) / n)]
    particles[i] = {
      x0: a.x,
      y0: a.y,
      x1: b.x,
      y1: b.y,
      r0: a.r,
      g0: a.g,
      b0: a.b,
      a0: a.a,
      r1: b.r,
      g1: b.g,
      b1: b.b,
      a1: b.a,
      s0: a.size,
      s1: b.size,
      delay: Math.random() * 0.08,
    }
  }
  return particles
}

function drawMorph(ctx, particles, t) {
  const w = ctx.canvas.width
  const h = ctx.canvas.height
  ctx.clearRect(0, 0, w, h)
  for (const p of particles) {
    const local = Math.min(1, Math.max(0, (t - p.delay) / (1 - p.delay)))
    const move = easeInOutCubic(local)
    /* Recolor toward the next image as soon as dust lifts. */
    const tint = easeOutCubic(Math.min(1, local * 1.35))
    const x = lerp(p.x0, p.x1, move)
    const y = lerp(p.y0, p.y1, move)
    const r = lerp(p.r0, p.r1, tint)
    const g = lerp(p.g0, p.g1, tint)
    const b = lerp(p.b0, p.b1, tint)
    const a = lerp(p.a0, p.a1, tint)
    const s = lerp(p.s0, p.s1, move)
    ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${a})`
    ctx.beginPath()
    ctx.arc(x, y, s, 0, Math.PI * 2)
    ctx.fill()
  }
}

function runTween(duration, onFrame, bag) {
  return new Promise((resolve) => {
    const start = performance.now()
    const tick = (now) => {
      if (bag.dead) {
        resolve()
        return
      }
      const t = Math.min(1, (now - start) / duration)
      onFrame(t)
      if (t < 1) bag.raf = requestAnimationFrame(tick)
      else resolve()
    }
    bag.raf = requestAnimationFrame(tick)
  })
}

export function useImageDisintegrate({
  hostRef,
  canvasRef,
  src,
  reducedMotion,
  onBusyChange,
  onCommit,
}) {
  const prevSrc = useRef(undefined)
  const lastBox = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return undefined

    const from = prevSrc.current
    const to = src

    if (from === undefined) {
      prevSrc.current = to
      requestAnimationFrame(() => {
        lastBox.current = measureDevice(host)
      })
      onCommit?.(to)
      return undefined
    }
    if (from === to) return undefined

    if (reducedMotion) {
      prevSrc.current = to
      onBusyChange?.(false)
      onCommit?.(to)
      return undefined
    }

    const bag = { dead: false, raf: 0 }

    const play = async () => {
      /* Hide the still image immediately so dust can take over while the next
       * component loads — don't wait for sampling to finish. */
      onBusyChange?.(true)

      const rect = host.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      const ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      let outBox = lastBox.current
      if (from && !outBox) {
        const prev = await loadImage(from)
        if (bag.dead) return
        outBox = containRect(
          prev.naturalWidth,
          prev.naturalHeight,
          rect.width,
          rect.height,
          maxFracFor(from),
        )
      }

      /* Sample the outgoing image first and paint dust at t=0 while the next
       * image loads + samples in parallel. */
      const fromPartsPromise = sampleParticles(from, outBox)
      const nextImgPromise = to ? loadImage(to) : Promise.resolve(null)

      const fromParts = await fromPartsPromise
      if (bag.dead) return

      if (fromParts.length) {
        drawMorph(ctx, pairParticles(fromParts, fromParts), 0)
      }

      const nextImg = await nextImgPromise
      if (bag.dead) return

      const inBox = nextImg
        ? containRect(
            nextImg.naturalWidth,
            nextImg.naturalHeight,
            rect.width,
            rect.height,
            maxFracFor(to),
          )
        : null

      const toParts = await sampleParticles(to, inBox)
      if (bag.dead) return

      const particles = pairParticles(fromParts, toParts)
      if (!particles.length) {
        prevSrc.current = to
        lastBox.current = inBox
        onCommit?.(to)
        onBusyChange?.(false)
        return
      }

      drawMorph(ctx, particles, 0)

      await runTween(
        MORPH_MS,
        (t) => {
          if (bag.dead) return
          drawMorph(ctx, particles, t)
        },
        bag,
      )

      if (bag.dead) return
      prevSrc.current = to
      lastBox.current = inBox
      onCommit?.(to)
      onBusyChange?.(false)
      requestAnimationFrame(() => {
        if (bag.dead) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        /* Lock outgoing morph to the real centered render box. */
        const measured = measureDevice(host)
        if (measured) lastBox.current = measured
      })
    }

    play().catch(() => {
      if (bag.dead) return
      prevSrc.current = to
      onCommit?.(to)
      onBusyChange?.(false)
    })

    return () => {
      bag.dead = true
      cancelAnimationFrame(bag.raf)
    }
  }, [src, reducedMotion, hostRef, canvasRef, onBusyChange, onCommit])
}
