'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Square, Volume2, Rewind, FastForward } from 'lucide-react';

interface AiReaderProps {
    content: string;
    title: string;
}

export default function AiReader({ content, title }: AiReaderProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [progress, setProgress] = useState(0);
    const [supported, setSupported] = useState(true);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const textRef = useRef('');

    useEffect(() => {
        if (!('speechSynthesis' in window)) {
            setSupported(false);
        }
        return () => {
            window.speechSynthesis?.cancel();
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const stripHtml = (html: string) =>
        html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    const handlePlay = () => {
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsPlaying(true);
            startProgressTracking();
            return;
        }

        window.speechSynthesis.cancel();
        const text = stripHtml(content);
        textRef.current = text;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = speed;

        // Try to find Vietnamese voice
        const voices = window.speechSynthesis.getVoices();
        const viVoice = voices.find(
            (v) => v.lang.startsWith('vi') || v.name.includes('Vietnam'),
        );
        if (viVoice) utterance.voice = viVoice;

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setProgress(100);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };

        utterance.onerror = () => {
            setIsPlaying(false);
            setIsPaused(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        setProgress(0);
        startProgressTracking();
    };

    const startProgressTracking = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        const totalChars = textRef.current.length;
        const estimatedDuration = (totalChars / 5) / speed; // ~5 chars/sec
        const startTime = Date.now();

        intervalRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            const pct = Math.min((elapsed / estimatedDuration) * 100, 99);
            setProgress(pct);
        }, 200);
    };

    const handlePause = () => {
        window.speechSynthesis.pause();
        setIsPaused(true);
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
        if (isPlaying || isPaused) {
            handleStop();
        }
    };

    if (!supported) {
        return (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                ⚠️ Trình duyệt không hỗ trợ đọc truyện bằng giọng nói.
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl border border-primary-200/50 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Volume2 className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-dark-800">Đọc truyện</h3>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 mb-4">
                {!isPlaying ? (
                    <button
                        onClick={handlePlay}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 transition-colors shadow-sm"
                    >
                        <Play className="w-4 h-4" />
                        {isPaused ? 'Tiếp tục' : 'Nghe đọc'}
                    </button>
                ) : (
                    <button
                        onClick={handlePause}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white font-medium text-sm hover:bg-amber-600 transition-colors shadow-sm"
                    >
                        <Pause className="w-4 h-4" />
                        Tạm dừng
                    </button>
                )}

                {(isPlaying || isPaused) && (
                    <button
                        onClick={handleStop}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-200 text-dark-600 font-medium text-sm hover:bg-dark-300 transition-colors"
                    >
                        <Square className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Speed */}
            <div className="flex items-center gap-2 mb-3">
                <Rewind className="w-3.5 h-3.5 text-dark-400" />
                <div className="flex gap-1">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                        <button
                            key={s}
                            onClick={() => handleSpeedChange(s)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${speed === s
                                    ? 'bg-primary-600 text-white shadow-sm'
                                    : 'bg-white/80 text-dark-500 hover:bg-white'
                                }`}
                        >
                            {s}x
                        </button>
                    ))}
                </div>
                <FastForward className="w-3.5 h-3.5 text-dark-400" />
            </div>

            {/* Progress */}
            {(isPlaying || isPaused || progress > 0) && (
                <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
