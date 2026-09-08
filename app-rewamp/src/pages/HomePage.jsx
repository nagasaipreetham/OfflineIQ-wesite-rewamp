import Hero from '../components/Hero.jsx'
import Partner from '../components/Partner.jsx'
import Shell from '../components/Shell.jsx'
import SectionSep from '../components/SectionSep.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import IqBox from '../components/IqBox.jsx'
import Models from '../components/Models.jsx'
import WhyOffline from '../components/WhyOffline.jsx'
import BuiltFor from '../components/BuiltFor.jsx'
import Contact from '../components/Contact.jsx'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Partner />

      <Shell>
        <SectionSep />
        <HowItWorks />
        <SectionSep />
        <IqBox />
        <SectionSep />
        <Models />
        <SectionSep />
        <WhyOffline />
        <SectionSep />
      </Shell>

      <BuiltFor />

      <Shell>
        <SectionSep />
        <Contact />
      </Shell>
    </main>
  )
}
