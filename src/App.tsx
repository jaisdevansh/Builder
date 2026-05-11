import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Workspace from './pages/Workspace';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/workspace" element={<Workspace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
