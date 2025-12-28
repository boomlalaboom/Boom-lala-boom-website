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
        const [pathname, search] = path.split('?');

        // Remove existing language prefix if present
        const segments = pathname.split('/').filter(Boolean);
        let canonicalPath = pathname;
        if (['fr', 'en', 'es'].includes(segments[0])) {
            canonicalPath = '/' + segments.slice(1).join('/');
        }

        // 1. Try exact match of the cleaned full path
        const lookupPath = canonicalPath.replace(/^\/|\/$/g, '');
        if (STATIC_ROUTES[lookupPath]) {
            return `/${language}/${STATIC_ROUTES[lookupPath][language]}${search ? `?${search}` : ''}`;
        }

        // 2. Try matching the base route (existing logic)
        const baseRoute = lookupPath.split('/')[0];
        const rest = lookupPath.split('/').slice(1).join('/');

        if (STATIC_ROUTES[baseRoute]) {
            const localizedBase = STATIC_ROUTES[baseRoute][language];
            return `/${language}/${localizedBase}${rest ? `/${rest}` : ''}${search ? `?${search}` : ''}`;
        }

        return `/${language}${canonicalPath}${search ? `?${search}` : ''}`;
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
        const [pathname, search] = path.split('?');

        // Remove existing language prefix if present
        const segments = pathname.split('/').filter(Boolean);
        let canonicalPath = pathname;
        if (['fr', 'en', 'es'].includes(segments[0])) {
            canonicalPath = '/' + segments.slice(1).join('/');
        }

        // 1. Try exact match of the cleaned full path
        const lookupPath = canonicalPath.replace(/^\/|\/$/g, '');
        if (STATIC_ROUTES[lookupPath]) {
            return `/${language}/${STATIC_ROUTES[lookupPath][language]}${search ? `?${search}` : ''}`;
        }

        // 2. Try matching the base route (existing logic)
        const baseRoute = lookupPath.split('/')[0];
        const rest = lookupPath.split('/').slice(1).join('/');

        if (STATIC_ROUTES[baseRoute]) {
            const localizedBase = STATIC_ROUTES[baseRoute][language];
            return `/${language}/${localizedBase}${rest ? `/${rest}` : ''}${search ? `?${search}` : ''}`;
        }

        return `/${language}${canonicalPath}${search ? `?${search}` : ''}`;
    };

    return <RouterNavLink to={getLocalizedTo(to)} {...props} />;
}
