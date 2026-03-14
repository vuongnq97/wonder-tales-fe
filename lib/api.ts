import axios from 'axios';
import type { Story, StoryListResponse, StoryDetail, Category } from './types';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 10000,
});

export async function getStories(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
}): Promise<StoryListResponse> {
    const { data } = await api.get<StoryListResponse>('/api/stories', { params });
    return data;
}

export async function getStoryBySlug(slug: string): Promise<StoryDetail> {
    const { data } = await api.get<StoryDetail>(`/api/stories/${slug}`);
    return data;
}

export async function getCategories(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/api/categories');
    return data;
}

export async function getFeaturedStories(limit = 6): Promise<Story[]> {
    const { data } = await api.get<Story[]>('/api/featured', { params: { limit } });
    return data;
}

// ─── AI APIs ────────────────────────────────────────────

export interface AiSummaryResponse {
    summary: string;
    moral: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface AiQuizResponse {
    questions: QuizQuestion[];
}

export async function summarizeStory(slug: string): Promise<AiSummaryResponse> {
    const { data } = await api.post<AiSummaryResponse>('/api/ai/summarize', { storySlug: slug }, { timeout: 60000 });
    return data;
}

export async function getQuiz(slug: string): Promise<AiQuizResponse> {
    const { data } = await api.post<AiQuizResponse>('/api/ai/quiz', { storySlug: slug }, { timeout: 60000 });
    return data;
}
