import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';

function App() {
  return (
    <LanguageProvider>
      <Layout>
        <HomePage />
      </Layout>
    </LanguageProvider>
  );
}

export default App;
