export interface Category {
    id: string;
    name: string;
    slug: string;
    _count?: {
        stories: number;
    };
}

export interface Story {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    thumbnail: string | null;
    tags: string[];
    sourceUrl: string;
    categoryId: string;
    category: Pick<Category, 'id' | 'name' | 'slug'>;
    createdAt: string;
    updatedAt: string;
}

export interface StoryListResponse {
    data: Story[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface StoryDetail extends Story {
    relatedStories: Pick<Story, 'id' | 'title' | 'slug' | 'excerpt' | 'thumbnail'>[];
}
