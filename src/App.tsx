import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Workspace Route will be added in Phase 2 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
