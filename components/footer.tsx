import Link from 'next/link';
import { BookOpen, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-dark-900 text-dark-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold font-serif text-white">
                                Truyện Cổ Tích
                            </span>
                        </div>
                        <p className="text-sm text-dark-400 leading-relaxed">
                            Kho tàng truyện cổ tích Việt Nam và thế giới. Nơi lưu giữ những
                            câu chuyện hay nhất cho mọi lứa tuổi.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Danh mục
                        </h3>
                        <ul className="space-y-2">
                            {[
                                { href: '/stories?category=co-tich-viet-nam', label: 'Cổ tích Việt Nam' },
                                { href: '/stories?category=co-tich-the-gioi', label: 'Cổ tích Thế giới' },
                                { href: '/stories', label: 'Tất cả truyện' },
                            ].map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-dark-400 hover:text-primary-400 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Về chúng tôi
                        </h3>
                        <p className="text-sm text-dark-400 leading-relaxed">
                            Truyện được sưu tầm từ kho tàng văn học dân gian Việt Nam và thế
                            giới, phục vụ mục đích giáo dục và giải trí.
                        </p>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-dark-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-dark-500">
                        © 2026 Truyện Cổ Tích. Sưu tầm & thiết kế lại.
                    </p>
                    <p className="text-xs text-dark-500 flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-accent-400 fill-accent-400" /> for Vietnamese culture
                    </p>
                </div>
            </div>
        </footer>
    );
}
