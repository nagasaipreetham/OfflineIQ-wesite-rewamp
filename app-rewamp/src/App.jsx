import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SiteLayout from './layouts/SiteLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import SupportPage from './pages/SupportPage.jsx'
import ConsultationPage from './pages/ConsultationPage.jsx'
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
          <Route path="legal" element={<EmptyPage title="Legal" />} />
          <Route path="healthcare" element={<EmptyPage title="Healthcare" />} />
          <Route path="insurance" element={<EmptyPage title="Insurance" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
