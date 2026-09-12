import Hero from '../components/Hero.jsx'
import Partner from '../components/Partner.jsx'
import Shell from '../components/Shell.jsx'
import SectionSep from '../components/SectionSep.jsx'
import WhyItMatters from '../components/WhyItMatters.jsx'
import AlreadyHappened from '../components/AlreadyHappened.jsx'
import TheAnswer from '../components/TheAnswer.jsx'
import MeetFortKnox from '../components/MeetFortKnox.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Agents from '../components/Agents.jsx'
import Connectors from '../components/Connectors.jsx'
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
        <WhyItMatters />
        <SectionSep />
        <AlreadyHappened />
        <SectionSep />
        <TheAnswer />
        <SectionSep />
        <MeetFortKnox />
        <SectionSep />
        <HowItWorks />
        <SectionSep />
        <Agents />
        <SectionSep />
        <Connectors />
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
