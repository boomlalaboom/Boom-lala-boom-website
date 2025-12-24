import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Edit2, Trash2, Save, X,
    Music, Gamepad2, Users, Scissors, BookOpen,
    LogOut, Loader2, AlertCircle, Sparkles, Settings, GripVertical
} from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { generateArticleWithAI, generateGameWithAI, generateCharacterWithAI } from '../services/aiService';

type Tab = 'characters' | 'songs' | 'games' | 'activities' | 'articles' | 'settings';

export function AdminPage() {
    const { user, isAdmin, loading: authLoading, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('characters');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatingAI, setGeneratingAI] = useState(false);
    const [aiProgress, setAiProgress] = useState('');

    // Character reordering
    const [reorderMode, setReorderMode] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [savingOrder, setSavingOrder] = useState(false);

    // AI Settings
    const [aiApiKey, setAiApiKey] = useState(localStorage.getItem('ai_api_key') || '');
    const [aiModel, setAiModel] = useState(localStorage.getItem('ai_model') || 'openai/gpt-4o-mini');
    const [settingsSaved, setSettingsSaved] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || !isAdmin)) {
            navigate('/login');
        }
    }, [user, isAdmin, authLoading, navigate]);

    useEffect(() => {
        if (user && isAdmin && activeTab !== 'settings') {
            fetchItems();
        }
    }, [activeTab, user, isAdmin]);

    const fetchItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const orderBy = activeTab === 'characters' ? 'order_position' : 'created_at';
            const { data, error } = await supabase
                .from(activeTab)
                .select('*')
                .order(orderBy, { ascending: activeTab === 'characters' ? true : false });

            if (error) throw error;
            setItems(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const saveAISettings = () => {
        localStorage.setItem('ai_api_key', aiApiKey);
        localStorage.setItem('ai_model', aiModel);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const data = { ...editingItem };
        delete data.id;
        delete data.created_at;
        delete data.updated_at;

        // Clean up fields that don't belong to articles
        if (activeTab === 'articles') {
            delete data.slug;
            delete data.name_fr;
            delete data.name_en;
            delete data.name_es;
            delete data.description_fr;
            delete data.description_en;
            delete data.description_es;
        }

        try {
            if (editingItem.id) {
                // Update
                const { error } = await supabase
                    .from(activeTab)
                    .update(data)
                    .eq('id', editingItem.id);
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from(activeTab)
                    .insert([data]);
                if (error) throw error;
            }
            setIsEditing(false);
            setEditingItem(null);
            fetchItems();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from(activeTab)
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchItems();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (item: any) => {
        setEditingItem(item);
        setIsEditing(true);
    };

    const startNew = () => {
        const emptyItem: any = {
            slug: '',
            name_fr: '', name_en: '', name_es: '',
            description_fr: '', description_en: '', description_es: '',
        };

        if (activeTab === 'characters') {
            emptyItem.image_url = '';
            emptyItem.coloring_url = '';
            emptyItem.universe_fr = '';
            emptyItem.universe_en = '';
            emptyItem.universe_es = '';
            emptyItem.video_id_fr = '';
            emptyItem.video_id_en = '';
            emptyItem.video_id_es = '';
            emptyItem.color_primary = '#FF6B6B';
            emptyItem.color_secondary = '#FFD93D';
            emptyItem.order_position = 1;
        } else if (activeTab === 'songs') {
            emptyItem.title_fr = ''; emptyItem.title_en = ''; emptyItem.title_es = '';
            emptyItem.youtube_id_fr = ''; emptyItem.youtube_id_en = ''; emptyItem.youtube_id_es = '';
            emptyItem.is_featured = false;
            emptyItem.age_min = 3; emptyItem.age_max = 8;
        } else if (activeTab === 'games') {
            emptyItem.game_type = 'rhythm';
            emptyItem.difficulty = 'easy';
            emptyItem.is_featured = false;
            emptyItem.age_min = 3; emptyItem.age_max = 8;
            emptyItem.instructions_fr = ''; emptyItem.instructions_en = ''; emptyItem.instructions_es = '';
        } else if (activeTab === 'activities') {
            emptyItem.activity_type = 'coloring';
            emptyItem.age_min = 3; emptyItem.age_max = 8;
        } else if (activeTab === 'articles') {
            emptyItem.slug_fr = ''; emptyItem.slug_en = ''; emptyItem.slug_es = '';
            emptyItem.title_fr = ''; emptyItem.title_en = ''; emptyItem.title_es = '';
            emptyItem.excerpt_fr = ''; emptyItem.excerpt_en = ''; emptyItem.excerpt_es = '';
            emptyItem.content_fr = ''; emptyItem.content_en = ''; emptyItem.content_es = '';
            emptyItem.meta_title_fr = ''; emptyItem.meta_title_en = ''; emptyItem.meta_title_es = '';
            emptyItem.meta_description_fr = ''; emptyItem.meta_description_en = ''; emptyItem.meta_description_es = '';
            emptyItem.author_name = 'BoomLaLaBoom Team';
            emptyItem.read_time_minutes = 5;
            emptyItem.is_featured = false;
            emptyItem.thumbnail_url = '';
            emptyItem.published_at = new Date().toISOString();
            delete emptyItem.slug;
            delete emptyItem.name_fr; delete emptyItem.name_en; delete emptyItem.name_es;
        }

        setEditingItem(emptyItem);
        setIsEditing(true);
    };

    const handleGenerateWithAI = async () => {
        if (!editingItem.title_fr && !editingItem.title_en && !editingItem.title_es) {
            setError('Veuillez entrer au moins un titre pour générer l\'article avec l\'IA');
            return;
        }

        const titleInput = editingItem.title_fr || editingItem.title_en || editingItem.title_es;

        setGeneratingAI(true);
        setError(null);
        setAiProgress('Démarrage de la génération...');

        try {
            const generated = await generateArticleWithAI(titleInput, 'parents et enfants de 2 à 8 ans', (message) => {
                setAiProgress(message);
            });

            setEditingItem({
                ...editingItem,
                title_fr: generated.title_fr,
                title_en: generated.title_en,
                title_es: generated.title_es,
                slug_fr: generated.slug_fr,
                slug_en: generated.slug_en,
                slug_es: generated.slug_es,
                excerpt_fr: generated.excerpt_fr,
                excerpt_en: generated.excerpt_en,
                excerpt_es: generated.excerpt_es,
                content_fr: generated.content_fr,
                content_en: generated.content_en,
                content_es: generated.content_es,
                meta_title_fr: generated.meta_title_fr,
                meta_title_en: generated.meta_title_en,
                meta_title_es: generated.meta_title_es,
                meta_description_fr: generated.meta_description_fr,
                meta_description_en: generated.meta_description_en,
                meta_description_es: generated.meta_description_es,
                read_time_minutes: generated.read_time_minutes,
            });
            setAiProgress('✅ Génération terminée !');
        } catch (err: any) {
            setError(`Erreur IA: ${err.message}`);
            setAiProgress('');
        } finally {
            setTimeout(() => {
                setGeneratingAI(false);
                setAiProgress('');
            }, 2000);
        }
    };

    const handleGenerateGameWithAI = async () => {
        if (!editingItem.name_fr && !editingItem.name_en && !editingItem.name_es) {
            setError('Veuillez entrer au moins un nom de jeu pour générer avec l\'IA');
            return;
        }

        const gameNameInput = editingItem.name_fr || editingItem.name_en || editingItem.name_es;

        setGeneratingAI(true);
        setError(null);
        setAiProgress('Démarrage de la génération...');

        try {
            const generated = await generateGameWithAI(gameNameInput, (message) => {
                setAiProgress(message);
            });

            setEditingItem({
                ...editingItem,
                name_fr: generated.name_fr,
                name_en: generated.name_en,
                name_es: generated.name_es,
                slug: generated.slug,
                description_fr: generated.description_fr,
                description_en: generated.description_en,
                description_es: generated.description_es,
                instructions_fr: generated.instructions_fr,
                instructions_en: generated.instructions_en,
                instructions_es: generated.instructions_es,
            });
            setAiProgress('✅ Génération terminée !');
        } catch (err: any) {
            setError(`Erreur IA: ${err.message}`);
            setAiProgress('');
        } finally {
            setTimeout(() => {
                setGeneratingAI(false);
                setAiProgress('');
            }, 2000);
        }
    };

    // Character reordering handlers
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newItems = [...items];
        const draggedItem = newItems[draggedIndex];
        newItems.splice(draggedIndex, 1);
        newItems.splice(index, 0, draggedItem);

        setItems(newItems);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const saveCharacterOrder = async () => {
        setSavingOrder(true);
        setError(null);
        try {
            const updates = items.map((item, index) => ({
                id: item.id,
                order_position: index + 1,
            }));

            for (const update of updates) {
                await supabase
                    .from('characters')
                    .update({ order_position: update.order_position })
                    .eq('id', update.id);
            }

            setReorderMode(false);
            await fetchItems();
        } catch (err: any) {
            setError(`Erreur lors de la sauvegarde: ${err.message}`);
        } finally {
            setSavingOrder(false);
        }
    };

    const cancelReorder = () => {
        setReorderMode(false);
        fetchItems();
    };

    const handleGenerateCharacterWithAI = async () => {
        if (!editingItem.name_fr && !editingItem.name_en && !editingItem.name_es) {
            setError('Veuillez entrer au moins un nom de personnage pour générer avec l\'IA');
            return;
        }

        const characterNameInput = editingItem.name_fr || editingItem.name_en || editingItem.name_es;

        setGeneratingAI(true);
        setError(null);
        setAiProgress('Démarrage de la génération...');

        try {
            const generated = await generateCharacterWithAI(characterNameInput, (message) => {
                setAiProgress(message);
            });

            setEditingItem({
                ...editingItem,
                name_fr: generated.name_fr,
                name_en: generated.name_en,
                name_es: generated.name_es,
                slug: generated.slug,
                description_fr: generated.description_fr,
                description_en: generated.description_en,
                description_es: generated.description_es,
                universe_fr: generated.universe_fr,
                universe_en: generated.universe_en,
                universe_es: generated.universe_es,
            });
            setAiProgress('✅ Génération terminée !');
        } catch (err: any) {
            setError(`Erreur IA: ${err.message}`);
            setAiProgress('');
        } finally {
            setTimeout(() => {
                setGeneratingAI(false);
                setAiProgress('');
            }, 2000);
        }
    };

    if (authLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--brand-pink)]" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-500">Manage all your content in one place</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                    >
                        View Site
                    </button>
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="flex overflow-x-auto pb-4 gap-4 mb-8 scrollbar-hide">
                {[
                    { id: 'characters', icon: Users, label: 'Characters' },
                    { id: 'songs', icon: Music, label: 'Songs' },
                    { id: 'games', icon: Gamepad2, label: 'Games' },
                    { id: 'activities', icon: Scissors, label: 'Activities' },
                    { id: 'articles', icon: BookOpen, label: 'Blog Articles' },
                    { id: 'settings', icon: Settings, label: 'AI Settings' },
                ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as Tab);
                                setIsEditing(false);
                            }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-[var(--brand-pink)] to-[var(--brand-orange)] text-white shadow-lg transform scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {error && activeTab !== 'settings' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-3 text-red-600">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {activeTab !== 'settings' && isEditing ? (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-800">
                            {editingItem?.id ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
                        </h2>
                        <div className="flex items-center gap-3">
                            {activeTab === 'articles' && (
                                <button
                                    type="button"
                                    onClick={handleGenerateWithAI}
                                    disabled={generatingAI || loading}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {generatingAI ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Génération IA...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            <span>Générer avec IA</span>
                                        </>
                                    )}
                                </button>
                            )}
                            {activeTab === 'games' && (
                                <button
                                    type="button"
                                    onClick={handleGenerateGameWithAI}
                                    disabled={generatingAI || loading}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {generatingAI ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Génération IA...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            <span>Générer avec IA</span>
                                        </>
                                    )}
                                </button>
                            )}
                            {activeTab === 'characters' && (
                                <button
                                    type="button"
                                    onClick={handleGenerateCharacterWithAI}
                                    disabled={generatingAI || loading}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {generatingAI ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Génération IA...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            <span>Générer avec IA</span>
                                        </>
                                    )}
                                </button>
                            )}
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {activeTab === 'articles' && (
                        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                            <p className="text-sm text-purple-700">
                                💡 <strong>Astuce:</strong> Entrez un titre dans n'importe quelle langue, puis cliquez sur "Générer avec IA" pour créer automatiquement un article complet en 3 langues avec l'IA.
                            </p>
                        </div>
                    )}

                    {activeTab === 'games' && (
                        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                            <p className="text-sm text-purple-700">
                                💡 <strong>Astuce:</strong> Entrez un nom de jeu dans n'importe quelle langue, puis cliquez sur "Générer avec IA" pour créer automatiquement le nom, la description et les instructions en 3 langues.
                            </p>
                        </div>
                    )}

                    {activeTab === 'characters' && (
                        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                            <p className="text-sm text-purple-700">
                                💡 <strong>Astuce:</strong> Entrez un nom de personnage dans n'importe quelle langue, puis cliquez sur "Générer avec IA" pour créer automatiquement le nom, la description et l'univers en 3 langues.
                            </p>
                        </div>
                    )}

                    {(activeTab === 'articles' || activeTab === 'games' || activeTab === 'characters') && generatingAI && aiProgress && (
                        <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                                    <div className="absolute inset-0 w-8 h-8 animate-ping bg-purple-400 rounded-full opacity-20"></div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-purple-900 mb-1">Génération en cours...</h3>
                                    <p className="text-sm text-purple-700 font-medium">{aiProgress}</p>
                                    <div className="mt-3 w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{
                                            width: aiProgress.includes('français') ? '33%' :
                                                   aiProgress.includes('anglais') ? '66%' :
                                                   aiProgress.includes('espagnol') ? '90%' :
                                                   aiProgress.includes('✅') ? '100%' : '10%',
                                            transition: 'width 0.5s ease-in-out'
                                        }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Common Fields */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Info</h3>

                                {/* Slugs for Articles (3 separate slugs) */}
                                {activeTab === 'articles' ? (
                                    <>
                                        {['fr', 'en', 'es'].map((lang) => (
                                            <div key={lang}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Slug ({lang.toUpperCase()})
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={editingItem[`slug_${lang}`] || ''}
                                                    onChange={(e) => setEditingItem({ ...editingItem, [`slug_${lang}`]: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[var(--brand-pink)] outline-none"
                                                    placeholder={lang === 'fr' ? 'mon-article' : lang === 'en' ? 'my-article' : 'mi-articulo'}
                                                />
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL identifier)</label>
                                        <input
                                            type="text"
                                            required
                                            value={editingItem.slug || ''}
                                            onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[var(--brand-pink)] outline-none"
                                            placeholder="lola-the-cow"
                                        />
                                    </div>
                                )}

                                {/* Character Colors + Order */}
                                {activeTab === 'characters' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur primaire</label>
                                            <input
                                                type="text"
                                                value={editingItem.color_primary || ''}
                                                onChange={(e) => setEditingItem({ ...editingItem, color_primary: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[var(--brand-pink)] outline-none"
                                                placeholder="#FF6B6B"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur secondaire</label>
                                            <input
                                                type="text"
                                                value={editingItem.color_secondary || ''}
                                                onChange={(e) => setEditingItem({ ...editingItem, color_secondary: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[var(--brand-pink)] outline-none"
                                                placeholder="#FFD93D"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d affichage</label>
                                            <input
                                                type="number"
                                                value={editingItem.order_position || 1}
                                                onChange={(e) => setEditingItem({ ...editingItem, order_position: parseInt(e.target.value, 10) || 1 })}
                                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[var(--brand-pink)] outline-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Multilingual Names/Titles */}
                                {['fr', 'en', 'es'].map((lang) => (
                                    <div key={lang}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {activeTab === 'songs' || activeTab === 'activities' || activeTab === 'articles' ? 'Title' : 'Name'} ({lang.toUpperCase()})
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={activeTab === 'songs' || activeTab === 'activities' || activeTab === 'articles' ? (editingItem[`title_${lang}`] || '') : (editingItem[`name_${lang}`] || '')}
                                            onChange={(e) => {
                                                const field = activeTab === 'songs' || activeTab === 'activities' || activeTab === 'articles' ? `title_${lang}` : `name_${lang}`;
                                                setEditingItem({ ...editingItem, [field]: e.target.value });
                                            }}
                                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[var(--brand-pink)] outline-none"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Specific Fields */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Properties</h3>

                                {activeTab === 'songs' && (
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase">YouTube Video IDs</h3>
                                        {['fr', 'en', 'es'].map((lang) => (
                                            <div key={lang}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    YouTube ID ({lang.toUpperCase()})
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={editingItem[`youtube_id_${lang}`] || ''}
                                                    onChange={(e) => setEditingItem({ ...editingItem, [`youtube_id_${lang}`]: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[var(--brand-pink)] outline-none"
                                                    placeholder="eL9SThZ0k6U"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'games' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Game Type</label>
                                            <select
                                                value={editingItem.game_type}
                                                onChange={(e) => setEditingItem({ ...editingItem, game_type: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-xl outline-none"
                                            >
                                                <option value="rhythm">Rhythm</option>
                                                <option value="memory">Memory</option>
                                                <option value="puzzle">Puzzle</option>
                                                <option value="platform">Platform</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                            <select
                                                value={editingItem.difficulty}
                                                onChange={(e) => setEditingItem({ ...editingItem, difficulty: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-xl outline-none"
                                            >
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'articles' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                                            <input
                                                type="text"
                                                value={editingItem.author_name || ''}
                                                onChange={(e) => setEditingItem({ ...editingItem, author_name: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[var(--brand-pink)] outline-none"
                                                placeholder="BoomLaLaBoom Team"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Read Time (minutes)</label>
                                            <input
                                                type="number"
                                                value={editingItem.read_time_minutes || 5}
                                                onChange={(e) => setEditingItem({ ...editingItem, read_time_minutes: parseInt(e.target.value) })}
                                                className="w-full px-4 py-2 border rounded-xl outline-none"
                                            />
                                        </div>
                                    </>
                                )}

                                {(activeTab === 'songs' || activeTab === 'games' || activeTab === 'activities') && (
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Age Min</label>
                                            <input
                                                type="number"
                                                value={editingItem.age_min || 3}
                                                onChange={(e) => setEditingItem({ ...editingItem, age_min: parseInt(e.target.value) })}
                                                className="w-full px-4 py-2 border rounded-xl outline-none"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Age Max</label>
                                            <input
                                                type="number"
                                                value={editingItem.age_max || 8}
                                                onChange={(e) => setEditingItem({ ...editingItem, age_max: parseInt(e.target.value) })}
                                                className="w-full px-4 py-2 border rounded-xl outline-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                {(activeTab === 'songs' || activeTab === 'games' || activeTab === 'articles') && (
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="is_featured"
                                            checked={editingItem.is_featured}
                                            onChange={(e) => setEditingItem({ ...editingItem, is_featured: e.target.checked })}
                                            className="w-5 h-5 accent-[var(--brand-pink)]"
                                        />
                                        <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Display on Homepage</label>
                                    </div>
                                )}

                                {/* Article Thumbnail Image */}
                                {activeTab === 'articles' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Article Thumbnail</label>
                                        <ImageUploader
                                            currentImageUrl={editingItem.thumbnail_url}
                                            onImageUploaded={(url) => setEditingItem({ ...editingItem, thumbnail_url: url })}
                                            articleSlug={editingItem.slug_fr || editingItem.slug_en || editingItem.slug_es}
                                            bucket="article-images"
                                            label="Image de l'article (JPEG/PNG → WebP)"
                                        />
                                    </div>
                                )}

                                {/* Character Images */}
                                {activeTab === 'characters' && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Image du personnage</label>
                                            <ImageUploader
                                                currentImageUrl={editingItem.image_url}
                                                onImageUploaded={(url) => setEditingItem({ ...editingItem, image_url: url })}
                                                articleSlug={editingItem.slug}
                                                bucket="personnage"
                                                pathPrefix="characters"
                                                fileSuffix="avatar"
                                                label="Image principale (JPEG/PNG → WebP)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Coloriage du personnage</label>
                                            <ImageUploader
                                                currentImageUrl={editingItem.coloring_url}
                                                onImageUploaded={(url) => setEditingItem({ ...editingItem, coloring_url: url })}
                                                articleSlug={editingItem.slug}
                                                bucket="personnage"
                                                pathPrefix="characters"
                                                fileSuffix="coloring"
                                                label="Coloriage (JPEG/PNG → WebP)"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Game Thumbnail Image */}
                                {activeTab === 'games' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Game Thumbnail</label>
                                        <ImageUploader
                                            currentImageUrl={editingItem.thumbnail_url}
                                            onImageUploaded={(url) => setEditingItem({ ...editingItem, thumbnail_url: url })}
                                            articleSlug={editingItem.slug}
                                            bucket="game-images"
                                            label="Image du jeu (JPEG/PNG → WebP)"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Descriptions */}
                            {activeTab !== 'articles' && (
                                <div className="md:col-span-2 space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Descriptions</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {['fr', 'en', 'es'].map((lang) => (
                                            <div key={lang}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Description ({lang.toUpperCase()})</label>
                                                <textarea
                                                    value={editingItem[`description_${lang}`] || ''}
                                                    onChange={(e) => setEditingItem({ ...editingItem, [`description_${lang}`]: e.target.value })}
                                                    rows={4}
                                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[var(--brand-pink)] outline-none resize-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Game Instructions */}
                            {activeTab === 'games' && (
                                <div className="md:col-span-2 space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Instructions</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {['fr', 'en', 'es'].map((lang) => (
                                            <div key={lang}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions ({lang.toUpperCase()})</label>
                                                <textarea
                                                    value={editingItem[`instructions_${lang}`] || ''}
                                                    onChange={(e) => setEditingItem({ ...editingItem, [`instructions_${lang}`]: e.target.value })}
                                                    rows={5}
                                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[var(--brand-pink)] outline-none resize-none"
                                                    placeholder={lang === 'fr' ? 'Comment jouer à ce jeu...' : lang === 'en' ? 'How to play this game...' : 'Cómo jugar este juego...'}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Characters Universe */}
                            {activeTab === 'characters' && (
                                <div className="md:col-span-2 space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Univers</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {['fr', 'en', 'es'].map((lang) => (
                                            <div key={lang}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Univers ({lang.toUpperCase()})</label>
                                                <textarea
                                                    value={editingItem[`universe_${lang}`] || ''}
                                                    onChange={(e) => setEditingItem({ ...editingItem, [`universe_${lang}`]: e.target.value })}
                                                    rows={3}
                                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[var(--brand-pink)] outline-none resize-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Characters Video IDs */}
                            {activeTab === 'characters' && (
                                <div className="md:col-span-2 space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Videos (YouTube ID)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {['fr', 'en', 'es'].map((lang) => (
                                            <div key={lang}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube ID ({lang.toUpperCase()})</label>
                                                <input
                                                    type="text"
                                                    value={editingItem[`video_id_${lang}`] || ''}
                                                    onChange={(e) => setEditingItem({ ...editingItem, [`video_id_${lang}`]: e.target.value })}
                                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[var(--brand-pink)] outline-none"
                                                    placeholder="XqZsoesa55w"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Article Excerpts and Content */}
                            {activeTab === 'articles' && (
                                <>
                                    <div className="md:col-span-2 space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Excerpts (Short Summary)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {['fr', 'en', 'es'].map((lang) => (
                                                <div key={lang}>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt ({lang.toUpperCase()})</label>
                                                    <textarea
                                                        value={editingItem[`excerpt_${lang}`] || ''}
                                                        onChange={(e) => setEditingItem({ ...editingItem, [`excerpt_${lang}`]: e.target.value })}
                                                        rows={3}
                                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[var(--brand-pink)] outline-none resize-none"
                                                        placeholder="Short summary for article cards..."
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Article Content (HTML supported)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {['fr', 'en', 'es'].map((lang) => (
                                                <div key={lang}>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content ({lang.toUpperCase()})</label>
                                                    <textarea
                                                        value={editingItem[`content_${lang}`] || ''}
                                                        onChange={(e) => setEditingItem({ ...editingItem, [`content_${lang}`]: e.target.value })}
                                                        rows={12}
                                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[var(--brand-pink)] outline-none resize-vertical font-mono text-sm"
                                                        placeholder="<h2>Title</h2><p>Content...</p>"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-end gap-4 border-t pt-8">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[var(--brand-pink)] to-[var(--brand-orange)] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            ) : activeTab !== 'settings' && (
                <>
                {activeTab === 'characters' && reorderMode ? (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-[var(--brand-blue)]">
                                Réorganiser les personnages
                            </h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelReorder}
                                    disabled={savingOrder}
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white font-bold rounded-xl hover:bg-gray-600 transition-all disabled:opacity-50"
                                >
                                    <X className="w-5 h-5" />
                                    Annuler
                                </button>
                                <button
                                    onClick={saveCharacterOrder}
                                    disabled={savingOrder}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all disabled:opacity-50"
                                >
                                    {savingOrder ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {savingOrder ? 'Sauvegarde...' : 'Sauvegarder'}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`bg-white rounded-xl p-4 shadow-md cursor-move transition-all border-2 ${
                                        draggedIndex === index ? 'opacity-50 border-[var(--brand-pink)]' : 'border-gray-200 hover:border-[var(--brand-blue)] hover:shadow-lg'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <GripVertical className="w-6 h-6 text-gray-400" />
                                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2" style={{ borderColor: item.color_primary }}>
                                            <img src={item.image_url} alt={item.name_fr} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg" style={{ color: item.color_primary }}>
                                                {item.name_fr}
                                            </h3>
                                            <p className="text-gray-600 text-sm truncate">{item.description_fr}</p>
                                        </div>
                                        <div className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                                            #{index + 1}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 capitalize">
                                {activeTab} List
                                <span className="text-sm font-normal text-gray-400 ml-2">({items.length} items)</span>
                            </h2>
                            <div className="flex items-center gap-3">
                                {activeTab === 'characters' && items.length > 0 && (
                                    <button
                                        onClick={() => setReorderMode(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-blue)] text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                    >
                                        <GripVertical className="w-5 h-5" />
                                        Réorganiser
                                    </button>
                                )}
                                <button
                                    onClick={startNew}
                                    className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-pink)] text-white font-bold rounded-xl hover:bg-[var(--brand-red)] transition-colors shadow-sm"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add New
                                </button>
                            </div>
                        </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                                    <th className="px-6 py-4">Title / Name</th>
                                    <th className="px-6 py-4">Slug</th>
                                    {activeTab === 'articles' && <th className="px-6 py-4">Published</th>}
                                    {activeTab === 'songs' && <th className="px-6 py-4 text-center">Featured</th>}
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {loading ? (
                                    <tr>
                                        <td colSpan={activeTab === 'articles' ? 5 : activeTab === 'songs' ? 4 : 3} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-pink)]" />
                                                <span className="text-gray-400 font-medium">Loading content...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : items.length === 0 ? (
                                    <tr>
                                        <td colSpan={activeTab === 'articles' ? 5 : activeTab === 'songs' ? 4 : 3} className="px-6 py-12 text-center text-gray-400 italic">
                                            No items found. Click "Add New" to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-800">
                                                    {activeTab === 'articles' ? item.title_fr :
                                                     activeTab === 'songs' || activeTab === 'activities' ? item.title_fr :
                                                     item.name_fr}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                    {activeTab === 'articles' ? item.excerpt_fr : item.description_fr}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium">
                                                    {activeTab === 'articles' ? item.slug_fr : item.slug}
                                                </span>
                                            </td>
                                            {activeTab === 'articles' && (
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600">
                                                        {new Date(item.published_at).toLocaleDateString('fr-FR', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {item.author_name}
                                                    </div>
                                                </td>
                                            )}
                                            {activeTab === 'songs' && (
                                                <td className="px-6 py-4 text-center">
                                                    {item.is_featured ? (
                                                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full shadow-sm shadow-green-200" title="Featured"></span>
                                                    ) : (
                                                        <span className="inline-block w-3 h-3 bg-gray-200 rounded-full" title="Not Featured"></span>
                                                    )}
                                                </td>
                                            )}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                )}
                </>
            )}

            {/* AI Settings Tab */}
            {activeTab === 'settings' && (
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <h2 className="text-2xl font-black text-gray-800 mb-6">Configuration IA pour la génération d'articles</h2>
                    <p className="text-gray-600 mb-8">
                        Configurez votre clé API OpenRouter et choisissez le modèle IA pour générer vos articles de blog.
                    </p>

                    <div className="space-y-6">
                        {/* API Key Input */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Clé API (OpenRouter ou OpenAI)
                            </label>
                            <input
                                type="password"
                                value={aiApiKey}
                                onChange={(e) => setAiApiKey(e.target.value)}
                                placeholder="sk-or-v1-... ou sk-proj-..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-[var(--brand-pink)]/20 outline-none transition-all font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                <strong>OpenRouter</strong> (gratuit) : <a href="https://openrouter.ai/settings/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Créer une clé</a> |
                                <strong> OpenAI</strong> (payant) : <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">Créer une clé</a>
                            </p>
                        </div>

                        {/* Model Selection */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Modèle IA
                            </label>
                            <select
                                value={aiModel}
                                onChange={(e) => setAiModel(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--brand-pink)] focus:ring-2 focus:ring-[var(--brand-pink)]/20 outline-none transition-all"
                            >
                                <optgroup label="💰 OpenAI Direct (Payant - Meilleure qualité)">
                                    <option value="gpt-4o-mini">GPT-4o Mini (~$0.15/1M tokens)</option>
                                    <option value="gpt-4o">GPT-4o (~$2.50/1M tokens)</option>
                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (~$0.50/1M tokens)</option>
                                </optgroup>
                                <optgroup label="🆓 OpenRouter Gratuit (Requiert paramètres privacy)">
                                    <option value="xiaomi/mimo-v2-flash:free">Xiaomi MiMo V2 Flash (Gratuit, Performant)</option>
                                    <option value="meta-llama/llama-3.2-3b-instruct:free">Meta Llama 3.2 3B (Gratuit)</option>
                                    <option value="mistralai/devstral-2512:free">Mistral Devstral 2512 (Gratuit)</option>
                                    <option value="allenai/olmo-3.1-32b-think:free">AllenAI Olmo 3.1 32B (Gratuit)</option>
                                </optgroup>
                                <optgroup label="💰 OpenRouter Payant">
                                    <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini via OpenRouter</option>
                                    <option value="openai/gpt-3.5-turbo">OpenAI GPT-3.5 Turbo via OpenRouter</option>
                                    <option value="anthropic/claude-3-haiku">Anthropic Claude 3 Haiku</option>
                                </optgroup>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                <strong>OpenAI direct</strong> : Utilisez votre clé OpenAI (sk-proj-...) |
                                <strong> OpenRouter</strong> : Utilisez votre clé OpenRouter (sk-or-v1-...)
                            </p>
                        </div>

                        {/* Save Button */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={saveAISettings}
                                className="px-6 py-3 bg-gradient-to-r from-[var(--brand-pink)] to-[var(--brand-orange)] text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
                            >
                                💾 Sauvegarder la configuration
                            </button>
                            {settingsSaved && (
                                <span className="text-green-600 font-semibold animate-pulse">
                                    ✓ Configuration sauvegardée !
                                </span>
                            )}
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mt-6">
                            <h3 className="font-bold text-blue-900 mb-2">📝 Comment ça marche ?</h3>
                            <ul className="text-sm text-blue-800 space-y-2">
                                <li>• Configurez votre clé API OpenRouter et choisissez un modèle</li>
                                <li>• Allez dans l'onglet "Blog Articles" et créez un nouvel article</li>
                                <li>• Cliquez sur "✨ Générer avec IA" pour générer automatiquement le contenu</li>
                                <li>• L'IA créera le titre, résumé et contenu en 3 langues (FR/EN/ES)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
