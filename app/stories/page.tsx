'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getStories, getCategories } from '@/lib/api';
import type { Story, Category, StoryListResponse } from '@/lib/types';
import StoryCard from '@/components/story-card';
import LoadingSkeleton from '@/components/loading-skeleton';
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    X,
} from 'lucide-react';

function StoriesPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const currentSearch = searchParams.get('search') || '';
    const currentCategory = searchParams.get('category') || '';

    const [stories, setStories] = useState<Story[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [meta, setMeta] = useState<StoryListResponse['meta'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(currentSearch);

    const fetchStories = useCallback(async () => {
        setLoading(true);
        try {
            const [res, cats] = await Promise.all([
                getStories({
                    page: currentPage,
                    limit: 12,
                    search: currentSearch || undefined,
                    category: currentCategory || undefined,
                }),
                getCategories(),
            ]);
            setStories(res.data);
            setMeta(res.meta);
            setCategories(cats);
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, currentSearch, currentCategory]);

    useEffect(() => {
        fetchStories();
    }, [fetchStories]);

    const updateParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        // Reset to page 1 when filters change
        if (!updates.page) {
            params.delete('page');
        }
        router.push(`/stories?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams({ search: searchInput || null });
    };

    const clearFilter = (key: string) => {
        if (key === 'search') setSearchInput('');
        updateParams({ [key]: null });
    };

    return (
        <div className="min-h-screen">
            {/* Page Header */}
            <div className="bg-gradient-to-b from-surface-100 to-surface-50 border-b border-surface-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                    <h1 className="text-3xl sm:text-4xl font-bold font-serif text-dark-800">
                        {currentCategory
                            ? categories.find((c) => c.slug === currentCategory)?.name ||
                            'Truyện cổ tích'
                            : currentSearch
                                ? `Kết quả: "${currentSearch}"`
                                : 'Tất cả truyện cổ tích'}
                    </h1>
                    <p className="mt-2 text-dark-400">
                        {meta
                            ? `${meta.total} truyện • Trang ${meta.page}/${meta.totalPages}`
                            : 'Đang tải...'}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm truyện..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all text-sm"
                            />
                        </div>
                    </form>

                    {/* Category Filter */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <Filter className="hidden sm:block w-4 h-4 text-dark-400 shrink-0" />
                        <button
                            onClick={() => clearFilter('category')}
                            className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${!currentCategory
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-white border border-surface-200 text-dark-600 hover:bg-surface-50'
                                }`}
                        >
                            Tất cả
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() =>
                                    updateParams({
                                        category:
                                            currentCategory === cat.slug ? null : cat.slug,
                                    })
                                }
                                className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${currentCategory === cat.slug
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-white border border-surface-200 text-dark-600 hover:bg-surface-50'
                                    }`}
                            >
                                {cat.name}
                                {cat._count && (
                                    <span className="ml-1.5 opacity-70">
                                        ({cat._count.stories})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active Filters */}
                {(currentSearch || currentCategory) && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {currentSearch && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
                                Tìm: &ldquo;{currentSearch}&rdquo;
                                <button
                                    onClick={() => clearFilter('search')}
                                    className="hover:bg-primary-100 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        )}
                        {currentCategory && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-50 text-accent-700 text-sm font-medium">
                                {categories.find((c) => c.slug === currentCategory)?.name}
                                <button
                                    onClick={() => clearFilter('category')}
                                    className="hover:bg-accent-100 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        )}
                    </div>
                )}

                {/* Stories Grid */}
                {loading ? (
                    <LoadingSkeleton count={12} />
                ) : stories.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stories.map((story) => (
                                <StoryCard key={story.id} story={story} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {meta && meta.totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-2">
                                <button
                                    onClick={() =>
                                        updateParams({ page: String(currentPage - 1) })
                                    }
                                    disabled={currentPage <= 1}
                                    className="p-2.5 rounded-xl border border-surface-200 bg-white text-dark-500 hover:bg-surface-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                                    .filter(
                                        (p) =>
                                            p === 1 ||
                                            p === meta.totalPages ||
                                            Math.abs(p - currentPage) <= 2,
                                    )
                                    .map((p, idx, arr) => {
                                        const prev = arr[idx - 1];
                                        const showEllipsis = prev !== undefined && p - prev > 1;
                                        return (
                                            <span key={p} className="flex items-center gap-2">
                                                {showEllipsis && (
                                                    <span className="px-2 text-dark-400">...</span>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        updateParams({ page: String(p) })
                                                    }
                                                    className={`min-w-[40px] h-10 rounded-xl text-sm font-medium transition-all ${p === currentPage
                                                            ? 'bg-primary-600 text-white shadow-md'
                                                            : 'border border-surface-200 bg-white text-dark-600 hover:bg-surface-50'
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            </span>
                                        );
                                    })}

                                <button
                                    onClick={() =>
                                        updateParams({ page: String(currentPage + 1) })
                                    }
                                    disabled={currentPage >= (meta.totalPages || 1)}
                                    className="p-2.5 rounded-xl border border-surface-200 bg-white text-dark-500 hover:bg-surface-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-dark-600">
                            Không tìm thấy truyện nào
                        </h3>
                        <p className="mt-2 text-dark-400 max-w-md mx-auto">
                            {currentSearch
                                ? `Không có kết quả cho "${currentSearch}". Hãy thử từ khóa khác.`
                                : 'Hãy chạy crawler để thu thập truyện từ nguồn.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function StoriesPage() {
    return (
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-10"><LoadingSkeleton count={12} /></div>}>
            <StoriesPageContent />
        </Suspense>
    );
}
