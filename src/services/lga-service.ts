// LGA Service - handles all LGA-related data operations
import { supabase } from '@/lib/supabase';
import type { LGA, LGADetails, LGAImage, LGAFinancialSummary } from '@/types/lga';
import { sampleLGADetails } from '@/data/lgaDetails';

export class LGAService {
    /**
     * Get all LGAs with optional filtering
     */
    static async getAllLGAs(filters?: {
        state?: string;
        search?: string;
    }): Promise<LGA[]> {
        let query = supabase
            .from('lgas')
            .select('*')
            .order('state', { ascending: true })
            .order('name', { ascending: true });

        if (filters?.state && filters.state !== 'all') {
            query = query.eq('state', filters.state);
        }

        if (filters?.search) {
            query = query.or(`name.ilike.%${filters.search}%,state.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    }

    /**
     * Get detailed information for a specific LGA
     */
    static async getLGADetails(lgaName: string, stateName: string): Promise<LGADetails | null> {
        // Get base LGA info
        const { data: lga, error: lgaError } = await supabase
            .from('lgas')
            .select('*')
            .eq('name', lgaName)
            .eq('state', stateName)
            .single();

        if (lgaError || !lga) {
            console.error('Error fetching LGA:', lgaError);
            return null;
        }

        // Fallback to sample data for governance if not present in DB
        if (!lga.governance) {
            // Verify if sampleLGADetails is available (it's imported)
            const sample = sampleLGADetails[lga.name];
            if (sample && sample.governance) {
                lga.governance = sample.governance;
            }
        }

        // Get budget allocations
        const { data: budgetAllocations } = await supabase
            .from('budget_allocations')
            .select('*')
            .eq('lga_id', lga.id)
            .order('year', { ascending: false });

        // Get projects
        const { data: projects } = await supabase
            .from('lga_projects')
            .select('*')
            .eq('lga_id', lga.id)
            .order('created_at', { ascending: false });

        // Get politicians
        const { data: politicians } = await supabase
            .from('politicians')
            .select('*')
            .eq('lga_id', lga.id)
            .order('created_at', { ascending: false });

        // Get issues
        const { data: issues } = await supabase
            .from('issue_reports')
            .select('*')
            .eq('lga_id', lga.id)
            .order('created_at', { ascending: false })
            .limit(10);

        // Get gallery stats
        const { data: galleryStats } = await supabase
            .from('lga_gallery_stats')
            .select('*')
            .eq('lga_id', lga.id)
            .single();

        return {
            ...lga,
            budgetAllocations: budgetAllocations || [],
            projects: projects || [],
            politicians: politicians || [],
            issues: issues || [],
            gallery_stats: galleryStats || undefined,
            governance: lga.governance || undefined,
        } as LGADetails;
    }

    /**
     * Update LGA Governance data
     */
    static async updateLGAGovernance(lgaId: string, governanceData: any): Promise<void> {
        const { error } = await supabase
            .from('lgas')
            .update({ governance: governanceData })
            .eq('id', lgaId);

        if (error) throw error;
    }

    /**
     * Get LGA images for the gallery feed
     */
    static async getLGAImages(
        lgaId: string,
        options?: {
            limit?: number;
            offset?: number;
            category?: string;
            userId?: string;
        }
    ): Promise<{ images: LGAImage[]; total: number }> {
        const { limit = 20, offset = 0, category, userId } = options || {};

        // 1. Fetch from lga_images (Gallery Table)
        let galleryQuery = supabase
            .from('lga_images')
            .select('*, user:profiles!user_id(full_name, avatar_url)', { count: 'exact' })
            .eq('lga_id', lgaId)
            .eq('is_approved', true);

        if (category) {
            galleryQuery = galleryQuery.eq('category', category);
        }

        const { data: galleryData, error: galleryError, count: galleryCount } = await galleryQuery;
        if (galleryError) throw galleryError;

        // 2. Fetch from issue_reports (Issues Table)
        // We only want issues that have images
        let issueQuery = supabase
            .from('issue_reports')
            .select('*, user:profiles!user_id(full_name, avatar_url)', { count: 'exact' })
            .eq('lga_id', lgaId)
            // .neq('image_urls', null) // Filter where image_urls is not null
            // .not('image_urls', 'is', null) // Correct supabase syntax if needed, or filter in JS
            ;

        // Note: Filtering by category on issues might be tricky if categories don't match exactly.
        // For now, we'll fetch recent issues and filter/map in memory or simple DB filter.
        // Issue categories: waste, pollution, infrastructure, hazard
        // Gallery categories: infrastructure, events, nature, people, development, culture, other

        const { data: issueData, error: issueError } = await issueQuery;
        if (issueError) throw issueError;

        // 3. Process Issue Images
        const issueImages: LGAImage[] = [];
        if (issueData) {
            issueData.forEach((issue: any) => {
                // Check if issue has images
                if (issue.image_urls && Array.isArray(issue.image_urls) && issue.image_urls.length > 0) {
                    // Filter by category if requested
                    if (category && issue.category !== category) {
                        // Relaxed matching or skip? 
                        // Since categories differ, we might skip unless mapped. 
                        // For this implementation, we'll include them if no category filter 
                        // OR if we map them. 
                        // Let's just skip filtering issues by strict gallery category for now unless exact match.
                        if (category !== 'other' && issue.category !== category) return;
                    }

                    issue.image_urls.forEach((url: string, index: number) => {
                        issueImages.push({
                            id: `issue-${issue.id}-${index}`, // detailed ID
                            lga_id: issue.lga_id,
                            user_id: issue.user_id,
                            image_url: url,
                            caption: issue.title, // Use title as caption
                            category: issue.category as any, // Cast or map if needed
                            likes_count: 0, // Issues don't have separate like counts for images suitable for gallery yet
                            is_approved: true, // Auto-approve reported issues? Or should they be verified? Assuming yes for now.
                            is_featured: false,
                            created_at: issue.created_at,
                            user: issue.user,
                            issue_id: issue.id // Link back to issue
                        });
                    });
                }
            });
        }

        // 4. Merge and Sort
        let allImages = [...(galleryData || []) as LGAImage[], ...issueImages];

        // Sort by created_at desc
        allImages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // 5. Pagination (in memory for the merged list)
        const total = (galleryCount || 0) + issueImages.length; // Approximate total since we pulled all issues? 
        // Ideally we should pagination at DB level, but merging two tables suggests we might need a view or performant separate queries.
        // For now, assuming reasonable volume, in-memory slice is okay.

        const paginatedImages = allImages.slice(offset, offset + limit);

        let images = paginatedImages;

        // 6. Check User Likes
        if (userId) {
            // Only checks lga_images likes for now. 
            // Issue images don't have likes support in this schema yet.
            const galleryImageIds = images.filter(img => !img.issue_id).map(img => img.id);

            if (galleryImageIds.length > 0) {
                const { data: likes } = await supabase
                    .from('lga_image_likes')
                    .select('image_id')
                    .eq('user_id', userId)
                    .in('image_id', galleryImageIds);

                const likedIds = new Set(likes?.map(l => l.image_id) || []);
                images = images.map(img => ({
                    ...img,
                    is_liked_by_user: likedIds.has(img.id),
                }));
            }
        }

        return { images, total };
    }

    /**
     * Upload a new image to LGA gallery
     */
    static async uploadImage(
        lgaId: string,
        userId: string,
        imageFile: File,
        caption?: string,
        category?: string
    ): Promise<LGAImage> {
        // Upload image to Supabase Storage
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${lgaId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('lga-images')
            .upload(fileName, imageFile, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('lga-images')
            .getPublicUrl(fileName);

        // Create image record
        const { data, error } = await supabase
            .from('lga_images')
            .insert({
                lga_id: lgaId,
                user_id: userId,
                image_url: publicUrl,
                caption,
                category,
                is_approved: false, // Requires moderation
            })
            .select()
            .single();

        if (error) throw error;
        return data as LGAImage;
    }

    /**
     * Like an image
     */
    static async likeImage(imageId: string, userId: string): Promise<void> {
        const { error } = await supabase
            .from('lga_image_likes')
            .insert({ image_id: imageId, user_id: userId });

        if (error) throw error;
    }

    /**
     * Unlike an image
     */
    static async unlikeImage(imageId: string, userId: string): Promise<void> {
        const { error } = await supabase
            .from('lga_image_likes')
            .delete()
            .eq('image_id', imageId)
            .eq('user_id', userId);

        if (error) throw error;
    }

    /**
     * Get all unique states
     */
    static async getStates(): Promise<string[]> {
        const { data, error } = await supabase
            .from('lgas')
            .select('state')
            .order('state');

        if (error) throw error;

        const uniqueStates = [...new Set(data?.map(item => item.state) || [])];
        return uniqueStates;
    }
    /**
     * Get financial summary for an LGA (Allocations vs Spending)
     */
    static async getFinancialSummary(lgaId: string): Promise<LGAFinancialSummary | null> {
        const { data, error } = await supabase
            .rpc('get_lga_financial_summary', { p_lga_id: lgaId });

        if (error) {
            console.error('Error fetching financial summary:', error);
            return null;
        }

        return data as LGAFinancialSummary;
    }
    static async getRealtimeAllocations(lgaId: string) {
        const { data, error } = await supabase
            .from('lga_allocations')
            .select('*')
            .eq('lga_id', lgaId)
            .order('period', { ascending: false });

        if (error) {
            console.error('Error fetching realtime allocations:', error);
            return [];
        }
        return data;
    }
}
