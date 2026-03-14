'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStories, getCategories } from '@/lib/api';
import type { Story, Category } from '@/lib/types';
import StoryCard from '@/components/story-card';
import LoadingSkeleton from '@/components/loading-skeleton';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Star,
  Globe,
  BookMarked,
} from 'lucide-react';

export default function HomePage() {
  const [featuredStories, setFeaturedStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [storiesRes, cats] = await Promise.all([
          getStories({ limit: 6 }),
          getCategories(),
        ]);
        setFeaturedStories(storiesRes.data);
        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const categoryIcons: Record<string, React.ReactNode> = {
    'co-tich-viet-nam': <Star className="w-6 h-6" />,
    'co-tich-the-gioi': <Globe className="w-6 h-6" />,
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative gradient-bg overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-300/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-accent-300/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-200/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-sm font-medium text-primary-700 mb-6 shadow-sm">
              <Sparkles className="w-4 h-4" />
              Kho tàng truyện cổ tích
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-dark-900 leading-tight">
              Ngày xửa ngày xưa...
              <br />
              <span className="gradient-text">Những câu chuyện bất hủ</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-dark-500 leading-relaxed max-w-2xl mx-auto">
              Khám phá kho tàng truyện cổ tích Việt Nam và thế giới. Mỗi câu
              chuyện là một bài học quý giá được lưu truyền qua bao thế hệ.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/stories"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                <BookOpen className="w-5 h-5" />
                Đọc truyện ngay
              </Link>
              <Link
                href="/stories?category=co-tich-viet-nam"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/70 backdrop-blur-sm border border-surface-300 text-dark-700 font-semibold hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                Cổ tích Việt Nam
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="var(--color-surface-50)"
            />
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-dark-800">
              Danh mục truyện
            </h2>
            <p className="mt-3 text-dark-400">
              Chọn thể loại truyện bạn yêu thích
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/stories?category=${cat.slug}`}
                className="group relative p-6 rounded-2xl bg-white border border-surface-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-accent-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-primary-600 group-hover:from-primary-200 group-hover:to-primary-100 transition-colors">
                    {categoryIcons[cat.slug] || (
                      <BookMarked className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-dark-800 group-hover:text-primary-700 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-dark-400">
                      {cat._count?.stories || 0} truyện
                    </p>
                  </div>
                  <ArrowRight className="ml-auto w-5 h-5 text-dark-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-16 sm:py-20 bg-surface-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-dark-800">
                Truyện mới nhất
              </h2>
              <p className="mt-2 text-dark-400">
                Những câu chuyện vừa được thêm vào
              </p>
            </div>
            <Link
              href="/stories"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={6} />
          ) : featuredStories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-dark-600">
                Chưa có truyện nào
              </h3>
              <p className="mt-2 text-dark-400">
                Hãy chạy crawler để thu thập truyện từ nguồn.
              </p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-surface-300 text-sm font-semibold text-dark-700 shadow-sm hover:shadow-md transition-all"
            >
              Xem tất cả truyện
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/10 blur-2xl" />
            </div>
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                &ldquo;Mỗi câu chuyện là một viên ngọc quý&rdquo;
              </h2>
              <p className="mt-4 text-primary-100 text-lg max-w-xl mx-auto">
                Hãy cùng khám phá và truyền lại những câu chuyện cổ tích tuyệt
                vời cho thế hệ sau.
              </p>
              <Link
                href="/stories"
                className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-primary-700 font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <BookOpen className="w-5 h-5" />
                Bắt đầu đọc
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
