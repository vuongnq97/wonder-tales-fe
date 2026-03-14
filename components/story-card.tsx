import Link from 'next/link';
import type { Story } from '@/lib/types';
import { BookOpen, ArrowRight } from 'lucide-react';

interface StoryCardProps {
    story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
    return (
        <Link href={`/stories/${story.slug}`} className="group block">
            <article className="h-full rounded-2xl bg-white border border-surface-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Thumbnail or decorative header */}
                <div className="relative h-44 bg-gradient-to-br from-primary-100 via-accent-50 to-primary-50 overflow-hidden">
                    {story.thumbnail ? (
                        <img
                            src={story.thumbnail}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full scale-150" />
                                <BookOpen className="relative w-12 h-12 text-primary-400 group-hover:text-primary-500 transition-colors" />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary-200/40" />
                            <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-accent-200/30" />
                            <div className="absolute top-8 right-10 w-5 h-5 rounded-full bg-primary-300/30" />
                        </div>
                    )}

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-primary-700 shadow-sm backdrop-blur-sm">
                            {story.category?.name || 'Cổ tích'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="font-serif text-lg font-semibold text-dark-800 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
                        {story.title}
                    </h3>

                    {story.excerpt && (
                        <p className="mt-2.5 text-sm text-dark-400 line-clamp-3 leading-relaxed">
                            {story.excerpt}
                        </p>
                    )}

                    <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Đọc truyện</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </article>
        </Link>
    );
}
