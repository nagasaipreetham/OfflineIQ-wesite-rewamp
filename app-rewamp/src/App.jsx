import './App.css'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Partner from './components/Partner.jsx'
import Shell from './components/Shell.jsx'
import SectionSep from './components/SectionSep.jsx'
import HowItWorks from './components/HowItWorks.jsx'

function App() {
  return (
    <div className="page">
      <Header />
      <main>
        <Hero />
        <Partner />

        <Shell>
          <SectionSep />
          <HowItWorks />
        </Shell>
      </main>
    </div>
  )
}

export default App
