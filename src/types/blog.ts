export type BlogCategory = 'Sustainability' | 'Productivity' | 'Technology' | 'Community' | 'Policy';

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: {
        name: string;
        role: string;
        avatar_url?: string;
    };
    category: BlogCategory;
    cover_image: string;
    published_at: string;
    read_time: string;
}
