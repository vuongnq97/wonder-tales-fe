'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getStoryBySlug } from '@/lib/api';
import type { StoryDetail } from '@/lib/types';
import StoryCard from '@/components/story-card';
import AiReader from '@/components/ai-reader';
import AiSummary from '@/components/ai-summary';
import AiQuiz from '@/components/ai-quiz';
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    Tag,
    Share2,
    ChevronUp,
    Wand2,
} from 'lucide-react';

export default function StoryDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [story, setStory] = useState<StoryDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [showAiPanel, setShowAiPanel] = useState(false);

    useEffect(() => {
        async function fetchStory() {
            try {
                const data = await getStoryBySlug(slug);
                setStory(data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchStory();
    }, [slug]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: story?.title,
                url: window.location.href,
            });
        } else {
            await navigator.clipboard.writeText(window.location.href);
            alert('Đã copy link truyện!');
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="animate-pulse space-y-6">
                    <div className="h-4 w-32 rounded shimmer" />
                    <div className="h-10 w-3/4 rounded-lg shimmer" />
                    <div className="h-4 w-48 rounded shimmer" />
                    <div className="space-y-3 mt-10">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-4 rounded shimmer"
                                style={{ width: `${75 + Math.random() * 25}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !story) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <BookOpen className="w-20 h-20 text-surface-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold font-serif text-dark-800">
                    Không tìm thấy truyện
                </h2>
                <p className="mt-3 text-dark-400">
                    Truyện bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại.
                </p>
                <Link
                    href="/stories"
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero header */}
            <div className="bg-gradient-to-b from-primary-50/50 via-surface-50 to-surface-50 border-b border-surface-200/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-dark-400 mb-6">
                        <Link
                            href="/"
                            className="hover:text-primary-600 transition-colors"
                        >
                            Trang chủ
                        </Link>
                        <span>/</span>
                        <Link
                            href="/stories"
                            className="hover:text-primary-600 transition-colors"
                        >
                            Truyện
                        </Link>
                        <span>/</span>
                        {story.category && (
                            <>
                                <Link
                                    href={`/stories?category=${story.category.slug}`}
                                    className="hover:text-primary-600 transition-colors"
                                >
                                    {story.category.name}
                                </Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="text-dark-600 truncate max-w-[200px]">
                            {story.title}
                        </span>
                    </div>

                    {/* Category badge */}
                    {story.category && (
                        <Link
                            href={`/stories?category=${story.category.slug}`}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors mb-4"
                        >
                            {story.category.name}
                        </Link>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-dark-900 leading-tight">
                        {story.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-dark-400">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(story.createdAt).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                        {story.tags.length > 0 && (
                            <span className="flex items-center gap-1.5">
                                <Tag className="w-4 h-4" />
                                {story.tags.slice(0, 3).join(', ')}
                            </span>
                        )}
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1.5 hover:text-primary-600 transition-colors ml-auto"
                        >
                            <Share2 className="w-4 h-4" />
                            Chia sẻ
                        </button>
                    </div>
                </div>
            </div>

            {/* Story Content */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <div
                    className="story-content"
                    dangerouslySetInnerHTML={{ __html: story.content }}
                />

                {/* AI Tools Panel */}
                <div className="mt-12 pt-8 border-t border-surface-200">
                    <button
                        onClick={() => setShowAiPanel(!showAiPanel)}
                        className="flex items-center gap-2 mb-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-primary-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                        <Wand2 className="w-4 h-4" />
                        {showAiPanel ? 'Ẩn công cụ AI' : '🪄 Công cụ AI'}
                    </button>

                    {showAiPanel && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <AiReader content={story.content} title={story.title} />
                            <AiSummary slug={slug} />
                            <AiQuiz slug={slug} />
                        </div>
                    )}
                </div>

                {/* Tags */}
                {story.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-surface-200">
                        <div className="flex flex-wrap items-center gap-2">
                            <Tag className="w-4 h-4 text-dark-400" />
                            {story.tags.map((tag) => (
                                <Link
                                    key={tag}
                                    href={`/stories?search=${encodeURIComponent(tag)}`}
                                    className="px-3 py-1.5 rounded-full text-sm bg-surface-100 text-dark-500 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-10 flex justify-between">
                    <Link
                        href="/stories"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-surface-200 bg-white text-sm font-medium text-dark-600 hover:bg-surface-50 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Danh sách truyện
                    </Link>
                </div>
            </article>

            {/* Related Stories */}
            {story.relatedStories && story.relatedStories.length > 0 && (
                <section className="bg-surface-100/50 py-14 sm:py-18">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-dark-800 mb-8">
                            Truyện liên quan
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {story.relatedStories.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/stories/${related.slug}`}
                                    className="group block"
                                >
                                    <div className="p-5 rounded-2xl bg-white border border-surface-200/80 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                                        <h3 className="font-serif text-lg font-semibold text-dark-800 group-hover:text-primary-700 transition-colors line-clamp-2">
                                            {related.title}
                                        </h3>
                                        {related.excerpt && (
                                            <p className="mt-2 text-sm text-dark-400 line-clamp-2">
                                                {related.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Scroll to top */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center z-40"
                >
                    <ChevronUp className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
