import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { SeoHead } from './components/SeoHead';
import { AboutPage } from './pages/AboutPage';
import { SongsPage } from './pages/SongsPage';
import { GamesPage } from './pages/GamesPage';
import { CharactersPage } from './pages/CharactersPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { LearningPage } from './pages/LearningPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ParentsPage } from './pages/ParentsPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { BlogPage } from './pages/BlogPage';
import { ArticlePage } from './pages/ArticlePage';
import { AuthProvider } from './contexts/AuthContext';
import { LolaMemoryPage } from './pages/LolaMemoryPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <SeoHead />
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/songs" element={<SongsPage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/games/lola-memory" element={<LolaMemoryPage />} />
              <Route path="/characters" element={<CharactersPage />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/learning" element={<LearningPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/parents" element={<ParentsPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<ArticlePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Layout>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
