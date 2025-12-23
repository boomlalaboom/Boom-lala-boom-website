import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Edit2, Trash2, Save, X,
    Music, Gamepad2, Users, Scissors, BookOpen,
    LogOut, Loader2, AlertCircle, Sparkles
} from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { generateArticleWithAI } from '../services/aiService';

type Tab = 'characters' | 'songs' | 'games' | 'activities' | 'articles';

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

    useEffect(() => {
        if (!authLoading && (!user || !isAdmin)) {
            navigate('/login');
        }
    }, [user, isAdmin, authLoading, navigate]);

    useEffect(() => {
        if (user && isAdmin) {
            fetchItems();
        }
    }, [activeTab, user, isAdmin]);

    const fetchItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from(activeTab)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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

        if (activeTab === 'songs') {
            emptyItem.title_fr = ''; emptyItem.title_en = ''; emptyItem.title_es = '';
            emptyItem.youtube_id_fr = ''; emptyItem.youtube_id_en = ''; emptyItem.youtube_id_es = '';
            emptyItem.is_featured = false;
            emptyItem.age_min = 3; emptyItem.age_max = 8;
        } else if (activeTab === 'games') {
            emptyItem.game_type = 'rhythm';
            emptyItem.difficulty = 'easy';
            emptyItem.is_featured = false;
            emptyItem.age_min = 3; emptyItem.age_max = 8;
        } else if (activeTab === 'activities') {
            emptyItem.activity_type = 'coloring';
            emptyItem.age_min = 3; emptyItem.age_max = 8;
        } else if (activeTab === 'articles') {
            emptyItem.slug_fr = ''; emptyItem.slug_en = ''; emptyItem.slug_es = '';
            emptyItem.title_fr = ''; emptyItem.title_en = ''; emptyItem.title_es = '';
            emptyItem.excerpt_fr = ''; emptyItem.excerpt_en = ''; emptyItem.excerpt_es = '';
            emptyItem.content_fr = ''; emptyItem.content_en = ''; emptyItem.content_es = '';
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

        try {
            const generated = await generateArticleWithAI(titleInput);

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
                read_time_minutes: generated.read_time_minutes,
            });
        } catch (err: any) {
            setError(`Erreur IA: ${err.message}`);
        } finally {
            setGeneratingAI(false);
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

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-3 text-red-600">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {isEditing ? (
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

                                    <div className="md:col-span-2">
                                        <ImageUploader
                                            currentImageUrl={editingItem.thumbnail_url}
                                            onImageUploaded={(url) => setEditingItem({ ...editingItem, thumbnail_url: url })}
                                            articleSlug={editingItem.slug_fr || editingItem.slug_en || editingItem.slug_es}
                                        />
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
            ) : (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 capitalize">
                            {activeTab} List
                            <span className="text-sm font-normal text-gray-400 ml-2">({items.length} items)</span>
                        </h2>
                        <button
                            onClick={startNew}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-pink)] text-white font-bold rounded-xl hover:bg-[var(--brand-red)] transition-colors shadow-sm"
                        >
                            <Plus className="w-5 h-5" />
                            Add New
                        </button>
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
        </div>
    );
}
