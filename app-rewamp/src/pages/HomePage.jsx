import Hero from '../components/Hero.jsx'
import Partner from '../components/Partner.jsx'
import Shell from '../components/Shell.jsx'
import SectionSep from '../components/SectionSep.jsx'
import WhyItMatters from '../components/WhyItMatters.jsx'
import AlreadyHappened from '../components/AlreadyHappened.jsx'
import MeetFortKnox from '../components/MeetFortKnox.jsx'
import HowWorksHome from '../components/HowWorksHome.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import AgentsConnectors from '../components/AgentsConnectors.jsx'
import Workflow from '../components/Workflow.jsx'
import FindYourWorld from '../components/FindYourWorld.jsx'
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
      </Shell>

      <WhyItMatters />

      <Shell>
        <SectionSep />
        <AlreadyHappened />
        <SectionSep />
        <MeetFortKnox />
        <SectionSep />
        <HowWorksHome />
        <SectionSep />
        <HowItWorks />
        <SectionSep />
        <AgentsConnectors />
        <SectionSep />
        <Workflow />
        <SectionSep />
        <FindYourWorld />
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
