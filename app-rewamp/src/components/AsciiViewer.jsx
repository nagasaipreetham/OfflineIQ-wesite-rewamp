import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { AsciiEffect } from 'three-stdlib'
import './AsciiViewer.css'

/**
 * ASCII 3D viewer. Loads the model once (optionally after page idle), paints a
 * first frame, then only runs the render loop while `active` is true.
 */
export default function AsciiViewer({
  modelPath,
  resolution = 0.2,
  scale = 3.2,
  className = '',
  color = '#fff',
  backgroundColor = 'transparent',
  enableControls = true,
  active = true,
}) {
  const containerRef = useRef(null)
  const activeRef = useRef(active)
  const loopApiRef = useRef({ start: () => {}, stop: () => {}, paint: () => {} })

  activeRef.current = active

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    let renderer
    let effect
    let controls
    let model = null
    let animationId = 0
    let disposed = false

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.set(0, 0.15, 4.6)
    camera.lookAt(0, 0, 0)

    scene.add(new THREE.AmbientLight(0xffffff, 0.45))

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.1)
    keyLight.position.set(4, 6, 5)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.7)
    fillLight.position.set(-5, 1, -2)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.1)
    rimLight.position.set(0, -2, -4)
    scene.add(rimLight)

    const clock = new THREE.Clock()

    const setup = (width, height) => {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        preserveDrawingBuffer: true,
      })
      renderer.setPixelRatio(1)
      renderer.setSize(width, height)
      renderer.setClearColor(0x000000, 1)
      renderer.outputColorSpace = THREE.SRGBColorSpace

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      effect = new AsciiEffect(renderer, ' .:-=+*#%@', {
        invert: true,
        resolution,
      })
      effect.setSize(width, height)
      effect.domElement.className = 'ascii-viewer__stage'
      effect.domElement.style.color = color
      effect.domElement.style.backgroundColor = backgroundColor

      while (container.firstChild) container.removeChild(container.firstChild)
      container.appendChild(effect.domElement)

      controls = new OrbitControls(camera, effect.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.06
      controls.enableZoom = enableControls
      controls.enableRotate = enableControls
      controls.enablePan = false
      controls.target.set(0, 0, 0)
      controls.minDistance = 2.4
      controls.maxDistance = 10
      controls.update()
    }

    const ensureRenderer = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (width < 8 || height < 8) return false
      if (!renderer) setup(width, height)
      return true
    }

    const paint = () => {
      if (disposed || !effect) return
      controls?.update()
      effect.render(scene, camera)
    }

    const tick = () => {
      if (disposed) return
      if (!activeRef.current) {
        animationId = 0
        return
      }
      animationId = requestAnimationFrame(tick)
      const elapsed = clock.getElapsedTime()

      if (model) {
        model.rotation.y = elapsed * 0.32
        model.rotation.x = Math.sin(elapsed * 0.18) * 0.12
      }

      paint()
    }

    const startLoop = () => {
      if (disposed || animationId || !activeRef.current) return
      if (!ensureRenderer()) return
      clock.getDelta()
      animationId = requestAnimationFrame(tick)
    }

    const stopLoop = () => {
      cancelAnimationFrame(animationId)
      animationId = 0
    }

    loopApiRef.current = { start: startLoop, stop: stopLoop, paint }

    const onModel = (gltf) => {
      if (disposed) return
      model = gltf.scene

      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z) || 1
      const s = scale / maxDim
      model.scale.setScalar(s)
      model.position.copy(center).multiplyScalar(-s)

      model.traverse((child) => {
        if (!child.isMesh) return
        child.material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.42,
          metalness: 0.08,
          flatShading: false,
        })
      })

      scene.add(model)

      if (ensureRenderer()) {
        /* First frame ready; animate only when footer is in view. */
        paint()
        if (activeRef.current) startLoop()
      }
    }

    const loadModel = () => {
      if (disposed) return
      ensureRenderer()
      const loader = new GLTFLoader()
      loader.load(
        modelPath,
        onModel,
        undefined,
        (err) => {
          console.error('ASCII viewer failed to load model', modelPath, err)
        },
      )
    }

    loadModel()

    const resizeObserver = new ResizeObserver(() => {
      if (disposed) return
      if (!ensureRenderer()) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      effect.setSize(w, h)
      paint()
      if (activeRef.current) startLoop()
    })
    resizeObserver.observe(container)

    return () => {
      disposed = true
      resizeObserver.disconnect()
      stopLoop()
      controls?.dispose()
      renderer?.dispose()
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose?.()
        if (obj.material) obj.material.dispose?.()
      })
      while (container.firstChild) container.removeChild(container.firstChild)
    }
  }, [modelPath, resolution, scale, color, backgroundColor, enableControls])

  useEffect(() => {
    activeRef.current = active
    if (active) loopApiRef.current.start()
    else loopApiRef.current.stop()
  }, [active])

  return <div className={`ascii-viewer ${className}`.trim()} ref={containerRef} />
}
