import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './features/landing/LandingPage';
import ApplicationWizard from './features/application/ApplicationWizard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<ApplicationWizard />} />
      </Routes>
    </Router>
  );
}

export default App;
