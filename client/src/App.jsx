import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Documents from './pages/Documents';
import Contact from './pages/Contact';
import DpoTeam from './pages/DpoTeam';
import SearchResults from './pages/SearchResults';
import Ropa from './pages/Ropa';
import Infographics from './pages/Infographics';
import Videos from './pages/Videos';
import Training from './pages/Training';
import TitleManager from './components/TitleManager';
import ReportForm from './pages/ReportForm';

function App() {
  return (
    <BrowserRouter>
      <TitleManager />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="/contact/report" element={<ReportForm />} />
          <Route path="about/dpo" element={<DpoTeam />} />
          <Route path="/about/documents" element={<Documents />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/about/ropa" element={<Ropa />} />
          <Route path="/services/infographics" element={<Infographics />} />
          <Route path="/services/videos" element={<Videos />} />
          <Route path="/services/training" element={<Training />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;