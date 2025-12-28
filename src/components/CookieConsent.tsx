import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Cookie, X } from 'lucide-react';

export function CookieConsent() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('boomlalaboom_cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('boomlalaboom_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('boomlalaboom_cookie_consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[400px] z-[100] animate-slide-up">
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 relative overflow-hidden">
                {/* Background Accent */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--brand-yellow)] opacity-10 rounded-full blur-2xl" />

                <div className="flex items-start gap-4">
                    <div className="p-3 bg-yellow-100 rounded-2xl shrink-0">
                        <Cookie className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {t('cookie_title')}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-6">
                            {t('cookie_text')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                onClick={handleAccept}
                                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-sky)] text-white font-bold rounded-xl hover:shadow-lg transition-all active:scale-95 text-sm"
                            >
                                {t('cookie_accept')}
                            </button>
                            <button
                                onClick={handleDecline}
                                className="px-6 py-2.5 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all text-sm"
                            >
                                {t('cookie_decline')}
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
