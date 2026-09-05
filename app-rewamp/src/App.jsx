import './App.css'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Partner from './components/Partner.jsx'

function App() {
  return (
    <div className="page">
      <Header />
      <main>
        <Hero />
        <Partner />
      </main>
    </div>
  )
}

export default App
