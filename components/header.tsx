'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, Search, Menu, X, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/stories?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <header className="sticky top-0 z-50 glass-card border-b border-surface-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold font-serif text-dark-800">
                                Truyện Cổ Tích
                            </h1>
                            <p className="text-[10px] text-dark-400 -mt-1 tracking-wider uppercase">
                                Kho tàng truyện hay
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-sm font-medium text-dark-500 hover:text-primary-600 transition-colors"
                        >
                            Trang chủ
                        </Link>
                        <Link
                            href="/stories"
                            className="text-sm font-medium text-dark-500 hover:text-primary-600 transition-colors"
                        >
                            Tất cả truyện
                        </Link>
                        <Link
                            href="/stories?category=co-tich-viet-nam"
                            className="text-sm font-medium text-dark-500 hover:text-primary-600 transition-colors"
                        >
                            Việt Nam
                        </Link>
                        <Link
                            href="/stories?category=co-tich-the-gioi"
                            className="text-sm font-medium text-dark-500 hover:text-primary-600 transition-colors"
                        >
                            Thế giới
                        </Link>
                    </nav>

                    {/* Search + Mobile Menu */}
                    <div className="flex items-center gap-3">
                        <form onSubmit={handleSearch} className="hidden sm:flex items-center">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm truyện..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-48 lg:w-64 pl-9 pr-4 py-2 text-sm rounded-full bg-surface-100 border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all placeholder:text-dark-400"
                                />
                            </div>
                        </form>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="w-5 h-5 text-dark-600" />
                            ) : (
                                <Menu className="w-5 h-5 text-dark-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-surface-200/50 animate-in slide-in-from-top-2">
                        <form onSubmit={handleSearch} className="mb-4 sm:hidden">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm truyện..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-full bg-surface-100 border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all"
                                />
                            </div>
                        </form>
                        <nav className="flex flex-col gap-1">
                            {[
                                { href: '/', label: 'Trang chủ' },
                                { href: '/stories', label: 'Tất cả truyện' },
                                { href: '/stories?category=co-tich-viet-nam', label: 'Cổ tích Việt Nam' },
                                { href: '/stories?category=co-tich-the-gioi', label: 'Cổ tích Thế giới' },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-dark-600 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
