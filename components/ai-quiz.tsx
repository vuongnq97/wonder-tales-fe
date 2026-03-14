'use client';

import { useState } from 'react';
import {
    Brain,
    Loader2,
    CheckCircle2,
    XCircle,
    RotateCcw,
    Trophy,
} from 'lucide-react';
import { getQuiz, type QuizQuestion } from '@/lib/api';

interface AiQuizProps {
    slug: string;
}

export default function AiQuiz({ slug }: AiQuizProps) {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);

    const handleStart = async () => {
        if (questions.length > 0 && !submitted) {
            setIsOpen(!isOpen);
            return;
        }

        setLoading(true);
        setError(false);
        setIsOpen(true);
        setAnswers({});
        setSubmitted(false);

        try {
            const result = await getQuiz(slug);
            setQuestions(result.questions);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (questionIdx: number, optionIdx: number) => {
        if (submitted) return;
        setAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const handleRetry = () => {
        setQuestions([]);
        setAnswers({});
        setSubmitted(false);
        handleStart();
    };

    const score = submitted
        ? questions.filter((q, i) => answers[i] === q.correctAnswer).length
        : 0;

    const getScoreEmoji = () => {
        if (score === questions.length) return '🏆';
        if (score >= questions.length * 0.8) return '🌟';
        if (score >= questions.length * 0.6) return '👍';
        if (score >= questions.length * 0.4) return '💪';
        return '📚';
    };

    const optionLabels = ['A', 'B', 'C', 'D'];

    return (
        <div className="rounded-2xl border border-violet-200/50 overflow-hidden shadow-sm">
            <button
                onClick={handleStart}
                disabled={loading}
                className="w-full flex items-center gap-3 p-5 bg-gradient-to-br from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 transition-colors text-left"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 text-violet-600 animate-spin" />
                ) : (
                    <Brain className="w-5 h-5 text-violet-600" />
                )}
                <span className="font-semibold text-dark-800">
                    {loading ? 'Đang tạo câu hỏi...' : '🧠 Kiểm tra hiểu biết'}
                </span>
            </button>

            {isOpen && (
                <div className="p-5 bg-white/80 border-t border-violet-100">
                    {loading && (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div
                                        className="h-4 rounded shimmer"
                                        style={{ width: `${60 + i * 10}%` }}
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        {[1, 2, 3, 4].map((j) => (
                                            <div
                                                key={j}
                                                className="h-10 rounded-lg shimmer"
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm">
                            ❌ Không thể tạo câu hỏi. Vui lòng thử lại.
                        </p>
                    )}

                    {questions.length > 0 && (
                        <div className="space-y-6">
                            {/* Score banner */}
                            {submitted && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200/50">
                                    <Trophy className="w-6 h-6 text-violet-600" />
                                    <div>
                                        <p className="font-bold text-violet-900 text-lg">
                                            {getScoreEmoji()} {score}/{questions.length} câu đúng
                                        </p>
                                        <p className="text-violet-700 text-sm">
                                            {score === questions.length
                                                ? 'Xuất sắc! Bạn hiểu rõ câu chuyện!'
                                                : score >= 3
                                                    ? 'Tốt lắm! Hãy đọc lại để hiểu thêm nhé!'
                                                    : 'Hãy đọc lại truyện và thử lại nhé!'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {questions.map((q, qi) => (
                                <div key={qi} className="space-y-3">
                                    <p className="font-medium text-dark-800">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold mr-2">
                                            {qi + 1}
                                        </span>
                                        {q.question}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {q.options.map((opt, oi) => {
                                            const isSelected = answers[qi] === oi;
                                            const isCorrect = q.correctAnswer === oi;
                                            let className =
                                                'flex items-center gap-2 p-3 rounded-xl border text-sm text-left transition-all cursor-pointer ';

                                            if (submitted) {
                                                if (isCorrect) {
                                                    className +=
                                                        'border-green-300 bg-green-50 text-green-800';
                                                } else if (isSelected && !isCorrect) {
                                                    className +=
                                                        'border-red-300 bg-red-50 text-red-800';
                                                } else {
                                                    className +=
                                                        'border-surface-200 bg-surface-50 text-dark-400';
                                                }
                                            } else if (isSelected) {
                                                className +=
                                                    'border-violet-400 bg-violet-50 text-violet-800 ring-2 ring-violet-200';
                                            } else {
                                                className +=
                                                    'border-surface-200 bg-white text-dark-600 hover:border-violet-300 hover:bg-violet-50/50';
                                            }

                                            return (
                                                <button
                                                    key={oi}
                                                    onClick={() => handleAnswer(qi, oi)}
                                                    disabled={submitted}
                                                    className={className}
                                                >
                                                    <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0">
                                                        {submitted && isCorrect ? (
                                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                        ) : submitted &&
                                                            isSelected &&
                                                            !isCorrect ? (
                                                            <XCircle className="w-5 h-5 text-red-500" />
                                                        ) : (
                                                            optionLabels[oi]
                                                        )}
                                                    </span>
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                {!submitted ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={
                                            Object.keys(answers).length < questions.length
                                        }
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-medium text-sm hover:bg-violet-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Nộp bài ({Object.keys(answers).length}/
                                        {questions.length})
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleRetry}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-medium text-sm hover:bg-violet-700 transition-colors shadow-sm"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Thử lại
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
