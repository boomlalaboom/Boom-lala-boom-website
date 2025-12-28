import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { SeoHead } from './components/SeoHead';
import { AboutPage } from './pages/AboutPage';
import { SongsPage } from './pages/SongsPage';
import { GamesPage } from './pages/GamesPage';
import { CharactersPage } from './pages/CharactersPage';
import { CharacterDetailPage } from './pages/CharacterDetailPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { ColoringsPage } from './pages/ColoringsPage';
import { CuttingsPage } from './pages/CuttingsPage';
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
import { SharkRhythmGamePage } from './pages/SharkRhythmGamePage';
import { ScrollToTop } from './components/ScrollToTop';
import { LanguageRedirect } from './components/LanguageRedirect';
import { LegalNoticePage } from './pages/LegalNoticePage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiesPolicyPage } from './pages/CookiesPolicyPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <ScrollToTop />
          <SeoHead />
          <Layout>
            <Routes>
              <Route path="/" element={<LanguageRedirect />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/coloriages" element={<ColoringsPage />} />
              <Route path="/decoupages" element={<CuttingsPage />} />

              <Route path="/:lang" element={<Outlet />}>
                <Route index element={<HomePage />} />

                {/* About / Univers */}
                <Route path="about" element={<AboutPage />} />
                <Route path="univers" element={<AboutPage />} />
                <Route path="universo" element={<AboutPage />} />

                {/* Songs / Chansons */}
                <Route path="songs" element={<SongsPage />} />
                <Route path="chansons" element={<SongsPage />} />
                <Route path="canciones" element={<SongsPage />} />

                {/* Games / Jeux */}
                <Route path="games" element={<Outlet />}>
                  <Route index element={<GamesPage />} />
                  <Route path="lola-memory" element={<LolaMemoryPage />} />
                  <Route path="shark-rhythm" element={<SharkRhythmGamePage />} />
                </Route>
                <Route path="jeux" element={<Outlet />}>
                  <Route index element={<GamesPage />} />
                  <Route path="lola-memory" element={<LolaMemoryPage />} />
                  <Route path="rythme-requin" element={<SharkRhythmGamePage />} />
                </Route>
                <Route path="juegos" element={<Outlet />}>
                  <Route index element={<GamesPage />} />
                  <Route path="lola-memory" element={<LolaMemoryPage />} />
                  <Route path="ritmo-tiburon" element={<SharkRhythmGamePage />} />
                </Route>

                {/* Characters / Personnages */}
                <Route path="characters" element={<Outlet />}>
                  <Route index element={<CharactersPage />} />
                  <Route path=":slug" element={<CharacterDetailPage />} />
                </Route>
                <Route path="personnages" element={<Outlet />}>
                  <Route index element={<CharactersPage />} />
                  <Route path=":slug" element={<CharacterDetailPage />} />
                </Route>
                <Route path="personajes" element={<Outlet />}>
                  <Route index element={<CharactersPage />} />
                  <Route path=":slug" element={<CharacterDetailPage />} />
                </Route>

                {/* Activities */}
                {/* Activities */}
                <Route path="activities" element={<ActivitiesPage />} />
                <Route path="activites" element={<ActivitiesPage />} />
                <Route path="actividades" element={<ActivitiesPage />} />

                <Route path="activities/coloring-pages" element={<ColoringsPage />} />
                <Route path="activites/coloriages" element={<ColoringsPage />} />
                <Route path="actividades/paginas-para-colorear" element={<ColoringsPage />} />

                <Route path="activities/paper-crafts" element={<CuttingsPage />} />
                <Route path="activites/decoupages" element={<CuttingsPage />} />
                <Route path="actividades/manualidades" element={<CuttingsPage />} />

                {/* Learning */}
                <Route path="learning" element={<LearningPage />} />
                <Route path="apprendre" element={<LearningPage />} />
                <Route path="aprender" element={<LearningPage />} />

                {/* Resources */}
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="ressources" element={<ResourcesPage />} />
                <Route path="recursos" element={<ResourcesPage />} />

                {/* Parents */}
                <Route path="parents" element={<ParentsPage />} />
                <Route path="padres" element={<ParentsPage />} />

                {/* FAQ */}
                <Route path="faq" element={<FaqPage />} />

                {/* Contact */}
                <Route path="contact" element={<ContactPage />} />
                <Route path="contacto" element={<ContactPage />} />

                {/* Blog */}
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/:slug" element={<ArticlePage />} />

                {/* Legal Pages */}
                <Route path="legal" element={<LegalNoticePage />} />
                <Route path="mentions-legales" element={<LegalNoticePage />} />
                <Route path="legal-mentions" element={<LegalNoticePage />} />
                <Route path="avisos-legales" element={<LegalNoticePage />} />

                <Route path="privacy" element={<PrivacyPolicyPage />} />
                <Route path="politique-de-confidentialite" element={<PrivacyPolicyPage />} />
                <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="politica-de-privacidad" element={<PrivacyPolicyPage />} />

                <Route path="terms" element={<TermsPage />} />
                <Route path="conditions-generales" element={<TermsPage />} />
                <Route path="terms-of-service" element={<TermsPage />} />

                <Route path="cookies" element={<CookiesPolicyPage />} />
                <Route path="politique-des-cookies" element={<CookiesPolicyPage />} />
                <Route path="cookie-policy" element={<CookiesPolicyPage />} />
                <Route path="politica-de-cookies" element={<CookiesPolicyPage />} />
              </Route>
            </Routes>
          </Layout>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
