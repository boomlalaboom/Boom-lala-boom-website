import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function LanguageRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem('boomlalaboom_language');
        if (saved && ['fr', 'en', 'es'].includes(saved)) {
            navigate(`/${saved}`, { replace: true });
            return;
        }

        const browserLang = navigator.language.split('-')[0];
        if (['fr', 'en', 'es'].includes(browserLang)) {
            navigate(`/${browserLang}`, { replace: true });
            return;
        }

        navigate('/fr', { replace: true });
    }, [navigate]);

    return null;
}
