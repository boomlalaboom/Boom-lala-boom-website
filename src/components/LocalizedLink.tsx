import { Link as RouterLink, LinkProps, NavLink as RouterNavLink, NavLinkProps } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { STATIC_ROUTES } from '../lib/routes';

export function Link({ to, ...props }: LinkProps) {
    const { language } = useLanguage();

    const getLocalizedTo = (to: LinkProps['to']) => {
        if (typeof to !== 'string') return to;
        if (to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:')) return to;
        if (to.startsWith('#')) return to;

        let path = to.startsWith('/') ? to : `/${to}`;

        // Remove existing language prefix if present
        const segments = path.split('/').filter(Boolean);
        if (['fr', 'en', 'es'].includes(segments[0])) {
            path = '/' + segments.slice(1).join('/');
        }

        // Clean path for lookup
        const cleanPath = path.replace(/^\//, '');
        const baseRoute = cleanPath.split('/')[0]; // Handle nested paths like games/memory
        const rest = cleanPath.split('/').slice(1).join('/');

        if (STATIC_ROUTES[baseRoute]) {
            const localizedBase = STATIC_ROUTES[baseRoute][language];
            return `/${language}/${localizedBase}${rest ? `/${rest}` : ''}`;
        }

        return `/${language}${path}`;
    };

    return <RouterLink to={getLocalizedTo(to)} {...props} />;
}

export function NavLink({ to, ...props }: NavLinkProps) {
    const { language } = useLanguage();

    const getLocalizedTo = (to: NavLinkProps['to']) => {
        if (typeof to !== 'string') return to;
        if (to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:')) return to;
        if (to.startsWith('#')) return to;

        let path = to.startsWith('/') ? to : `/${to}`;

        // Remove existing language prefix if present
        const segments = path.split('/').filter(Boolean);
        if (['fr', 'en', 'es'].includes(segments[0])) {
            path = '/' + segments.slice(1).join('/');
        }

        // Clean path for lookup
        const cleanPath = path.replace(/^\//, '');
        const baseRoute = cleanPath.split('/')[0];
        const rest = cleanPath.split('/').slice(1).join('/');

        if (STATIC_ROUTES[baseRoute]) {
            const localizedBase = STATIC_ROUTES[baseRoute][language];
            return `/${language}/${localizedBase}${rest ? `/${rest}` : ''}`;
        }

        return `/${language}${path}`;
    };

    return <RouterNavLink to={getLocalizedTo(to)} {...props} />;
}
