import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SleepProvider } from './contexts/SleepContext';
import { Home } from './screens/Home';
import { Onboarding } from './screens/Onboarding';
import { SleepTracking } from './screens/SleepTracking';
import { SleepHistory } from './screens/SleepHistory';
import { SleepDetails } from './screens/SleepDetails';

function App() {
  return (
    <BrowserRouter>
      <SleepProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/tracking" element={<SleepTracking />} />
          <Route path="/history" element={<SleepHistory />} />
          <Route path="/details/:id" element={<SleepDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SleepProvider>
    </BrowserRouter>
  );
}

export default App;
