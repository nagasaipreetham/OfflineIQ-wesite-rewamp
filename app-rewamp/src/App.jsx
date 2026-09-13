import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SiteLayout from './layouts/SiteLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import SupportPage from './pages/SupportPage.jsx'
import ConsultationPage from './pages/ConsultationPage.jsx'
import HealthcarePage from './pages/HealthcarePage.jsx'
import FortKnoxPage from './pages/FortKnoxPage.jsx'
import PlatformPage from './pages/PlatformPage.jsx'
import EmptyPage from './pages/EmptyPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="consultation" element={<ConsultationPage />} />
          <Route path="content-journey" element={<EmptyPage title="Content journey" />} />
          <Route path="security" element={<EmptyPage title="Security" />} />
          <Route path="healthcare" element={<HealthcarePage />} />
          <Route path="fort-knox" element={<FortKnoxPage />} />
          <Route path="platform" element={<PlatformPage />} />
          <Route path="legal" element={<EmptyPage title="Legal" />} />
          <Route path="finance" element={<EmptyPage title="Finance" />} />
          <Route path="research" element={<EmptyPage title="Research" />} />
          <Route path="industries" element={<EmptyPage title="Other Industries" />} />
          <Route path="insurance" element={<EmptyPage title="Insurance" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
