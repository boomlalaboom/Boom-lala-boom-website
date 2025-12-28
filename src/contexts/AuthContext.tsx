import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isAdmin: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                checkAdminStatus(session.user.id, session.user.email);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setLoading(true); // Ensure loading is true while we verify the new session
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await checkAdminStatus(session.user.id, session.user.email);
            } else {
                setIsAdmin(false);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function checkAdminStatus(userId: string, userEmail?: string | null) {
        setLoading(true);
        try {
            const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
                .split(',')
                .map((email: string) => email.trim().toLowerCase())
                .filter(Boolean);

            if (adminEmails.length && userEmail && adminEmails.includes(userEmail.toLowerCase())) {
                setIsAdmin(true);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setIsAdmin(data?.role === 'admin');
        } catch (err) {
            console.error('Error checking admin status:', err);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, session, isAdmin, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
