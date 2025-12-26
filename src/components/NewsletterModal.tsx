import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useLanguage } from '../contexts/LanguageContext';

interface NewsletterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
    const { language } = useLanguage();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            // Note: Replace these with your actual EmailJS credentials in .env or directly
            // I will put placeholders for now
            const result = await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
                {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    to_email: 'wfy.boomlalaboom@gmail.com',
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
            );

            if (result.status === 200) {
                setStatus('success');
                setFormData({ firstName: '', lastName: '', email: '' });
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                }, 3000);
            } else {
                throw new Error('Failed to send');
            }
        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus('error');
        }
    };

    const content = {
        fr: {
            title: 'Rejoindre l\'aventure !',
            subtitle: 'Inscrivez-vous pour recevoir nos nouvelles chansons, activités et coloriages.',
            firstName: 'Prénom',
            lastName: 'Nom',
            email: 'Email',
            submit: 'S\'abonner',
            sending: 'Envoi en cours...',
            success: 'Merci ! Vous êtes bien inscrit.',
            error: 'Oups, une erreur est survenue. Veuillez réessayer.',
            close: 'Fermer',
        },
        en: {
            title: 'Join the adventure!',
            subtitle: 'Subscribe to receive our new songs, activities and coloring pages.',
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            submit: 'Subscribe',
            sending: 'Sending...',
            success: 'Thank you! You are now subscribed.',
            error: 'Oops, something went wrong. Please try again.',
            close: 'Close',
        },
        es: {
            title: '¡Únete a la aventura!',
            subtitle: 'Suscríbete para recibir nuestras nuevas canciones, actividades y dibujos.',
            firstName: 'Nombre',
            lastName: 'Apellido',
            email: 'Email',
            submit: 'Suscribirse',
            sending: 'Enviando...',
            success: '¡Gracias! Te has suscrito correctamente.',
            error: 'Vaya, algo salió mal. Por favor, inténtalo de nuevo.',
            close: 'Cerrar',
        }
    }[language] || {
        title: 'Rejoindre l\'aventure !',
        subtitle: 'Inscrivez-vous pour recevoir nos nouvelles chansons, activités et coloriages.',
        firstName: 'Prénom',
        lastName: 'Nom',
        email: 'Email',
        submit: 'S\'abonner',
        sending: 'Envoi en cours...',
        success: 'Merci ! Vous êtes bien inscrit.',
        error: 'Oups, une erreur est survenue. Veuillez réessayer.',
        close: 'Fermer',
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-scale-up">
                {/* Decorative Header */}
                <div className="h-32 bg-gradient-to-r from-[var(--brand-blue)] via-[var(--brand-pink)] to-[var(--brand-orange)] flex items-center justify-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Mail className="w-10 h-10 text-[var(--brand-pink)]" />
                    </div>
                </div>

                <div className="p-8 text-center">
                    <h3 className="text-2xl font-black text-gray-800 mb-2">
                        {content.title}
                    </h3>
                    <p className="text-gray-600 mb-8">
                        {content.subtitle}
                    </p>

                    {status === 'success' ? (
                        <div className="py-8 flex flex-col items-center gap-4 animate-fade-in">
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                            <p className="text-lg font-bold text-green-600">{content.success}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-left">
                                    <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">{content.firstName}</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[var(--brand-blue)] rounded-2xl outline-none transition-all"
                                        placeholder="..."
                                    />
                                </div>
                                <div className="text-left">
                                    <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">{content.lastName}</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[var(--brand-blue)] rounded-2xl outline-none transition-all"
                                        placeholder="..."
                                    />
                                </div>
                            </div>
                            <div className="text-left">
                                <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">{content.email}</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[var(--brand-blue)] rounded-2xl outline-none transition-all"
                                    placeholder="exemple@mail.com"
                                />
                            </div>

                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl animate-shake">
                                    <AlertCircle className="w-5 h-5" />
                                    <p className="text-sm font-medium">{content.error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full py-4 bg-gradient-to-r from-[var(--brand-blue)] via-[var(--brand-pink)] to-[var(--brand-orange)] text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                            >
                                {status === 'sending' ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>{content.sending}</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        <span>{content.submit}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-6">
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
                        >
                            {content.close}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Mail } from 'lucide-react';
