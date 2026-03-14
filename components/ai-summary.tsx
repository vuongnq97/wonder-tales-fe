'use client';

import { useState } from 'react';
import { Sparkles, Loader2, BookOpen, Lightbulb } from 'lucide-react';
import { summarizeStory, type AiSummaryResponse } from '@/lib/api';

interface AiSummaryProps {
    slug: string;
}

export default function AiSummary({ slug }: AiSummaryProps) {
    const [data, setData] = useState<AiSummaryResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSummarize = async () => {
        if (data) {
            setIsOpen(!isOpen);
            return;
        }

        setLoading(true);
        setError(false);
        setIsOpen(true);

        try {
            const result = await summarizeStory(slug);
            setData(result);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-2xl border border-accent-200/50 overflow-hidden shadow-sm">
            <button
                onClick={handleSummarize}
                disabled={loading}
                className="w-full flex items-center gap-3 p-5 bg-gradient-to-br from-accent-50 to-yellow-50 hover:from-accent-100 hover:to-yellow-100 transition-colors text-left"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 text-accent-600 animate-spin" />
                ) : (
                    <Sparkles className="w-5 h-5 text-accent-600" />
                )}
                <span className="font-semibold text-dark-800">
                    {loading ? 'Đang tóm tắt...' : '✨ Tóm tắt bằng AI'}
                </span>
            </button>

            {isOpen && (
                <div className="p-5 bg-white/80 border-t border-accent-100">
                    {loading && (
                        <div className="space-y-3">
                            {[80, 95, 60].map((w, i) => (
                                <div
                                    key={i}
                                    className="h-4 rounded shimmer"
                                    style={{ width: `${w}%` }}
                                />
                            ))}
                        </div>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm">
                            ❌ Không thể tóm tắt. Vui lòng thử lại sau.
                        </p>
                    )}

                    {data && (
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <BookOpen className="w-5 h-5 text-accent-600 mt-0.5 shrink-0" />
                                <p className="text-dark-700 leading-relaxed">
                                    {data.summary}
                                </p>
                            </div>

                            {data.moral && (
                                <div className="flex gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50">
                                    <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                                            Bài học
                                        </p>
                                        <p className="text-dark-700 text-sm leading-relaxed">
                                            {data.moral}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
