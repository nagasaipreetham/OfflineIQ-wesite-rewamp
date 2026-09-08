import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import '../App.css'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const go = () => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView()
        else window.scrollTo(0, 0)
      }
      requestAnimationFrame(go)
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function SiteLayout() {
  return (
    <div className="page">
      <ScrollManager />
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
