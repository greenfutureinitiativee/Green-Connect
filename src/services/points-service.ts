// Points & Referral Service
import { supabase } from '@/lib/supabase';
import type {
    UserPoints,
    PointHistory,
    Referral,
    UserGamificationStats,
    LeaderboardEntry,
    UserBadge,
    Badge,
    PointAction,
} from '@/types/gamification';
import { POINT_ACTIONS } from '@/types/gamification';

export class PointsService {
    /**
     * Award points to a user
     */
    static async awardPoints(
        userId: string,
        action: PointAction
    ): Promise<void> {
        const { points, reason } = POINT_ACTIONS[action];

        const { error } = await supabase.rpc('increment_points', {
            userid: userId,
            add_points: points,
            reason: reason,
        });

        if (error) {
            console.error('Error awarding points:', error);
            throw error;
        }
    }

    /**
     * Award custom points with custom reason
     */
    static async awardCustomPoints(
        userId: string,
        points: number,
        reason: string
    ): Promise<void> {
        const { error } = await supabase.rpc('increment_points', {
            userid: userId,
            add_points: points,
            reason: reason,
        });

        if (error) throw error;
    }

    /**
     * Get user's current points
     */
    static async getUserPoints(userId: string): Promise<UserPoints | null> {
        const { data, error } = await supabase
            .from('user_points')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching user points:', error);
            return null;
        }

        return data as UserPoints | null;
    }

    /**
     * Get user's point history
     */
    static async getPointHistory(
        userId: string,
        limit: number = 20
    ): Promise<PointHistory[]> {
        const { data, error } = await supabase
            .from('point_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching point history:', error);
            return [];
        }

        return data as PointHistory[];
    }

    /**
     * Get user's complete gamification stats
     */
    static async getUserStats(userId: string): Promise<UserGamificationStats | null> {
        const { data, error } = await supabase
            .from('user_gamification_stats')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error('Error fetching user stats:', error);
            return null;
        }

        return data as UserGamificationStats;
    }

    /**
     * Get leaderboard
     */
    static async getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .limit(limit);

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }

        return data as LeaderboardEntry[];
    }

    /**
     * Check and award badge to user
     */
    static async checkAndAwardBadge(
        userId: string,
        badgeName: string
    ): Promise<void> {
        const { error } = await supabase.rpc('check_and_award_badge', {
            userid: userId,
            badge_name: badgeName,
        });

        if (error) {
            console.error('Error checking badge:', error);
        }
    }

    /**
     * Get user's badges
     */
    static async getUserBadges(userId: string): Promise<UserBadge[]> {
        const { data, error } = await supabase
            .from('user_badges')
            .select('*, badge:badges(*)')
            .eq('user_id', userId)
            .order('earned_at', { ascending: false });

        if (error) {
            console.error('Error fetching user badges:', error);
            return [];
        }

        return data as UserBadge[];
    }

    /**
     * Get all available badges
     */
    static async getAllBadges(): Promise<Badge[]> {
        const { data, error } = await supabase
            .from('badges')
            .select('*')
            .order('requirement_count', { ascending: true });

        if (error) {
            console.error('Error fetching badges:', error);
            return [];
        }

        return data as Badge[];
    }
}

export class ReferralService {
    /**
     * Generate unique referral code
     */
    static async generateReferralCode(): Promise<string> {
        const { data, error } = await supabase.rpc('generate_referral_code');

        if (error) throw error;
        return data as string;
    }

    /**
     * Get user's referral code
     */
    static async getReferralCode(userId: string): Promise<string | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('referral_code')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching referral code:', error);
            return null;
        }

        return data?.referral_code || null;
    }

    /**
     * Track referral signup
     */
    static async trackReferralSignup(
        referralCode: string,
        newUserId: string
    ): Promise<void> {
        // Find the referrer by code
        const { data: referrer, error: referrerError } = await supabase
            .from('profiles')
            .select('id')
            .eq('referral_code', referralCode)
            .single();

        if (referrerError || !referrer) {
            console.log('Referral code not found:', referralCode);
            return;
        }

        // Create referral record
        const { error: insertError } = await supabase
            .from('referrals')
            .insert({
                referrer_id: referrer.id,
                referred_id: newUserId,
                referral_code: referralCode,
            });

        if (insertError) {
            console.error('Error creating referral:', insertError);
            return;
        }

        // Award points to referrer
        await PointsService.awardPoints(referrer.id, 'REFERRAL_SIGNUP');
    }

    /**
     * Get user's referrals
     */
    static async getUserReferrals(userId: string): Promise<Referral[]> {
        const { data, error } = await supabase
            .from('referrals')
            .select('*, referred:profiles!referred_id(full_name, avatar_url, created_at)')
            .eq('referrer_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching referrals:', error);
            return [];
        }

        return data as Referral[];
    }

    /**
     * Get referral stats
     */
    static async getReferralStats(userId: string): Promise<{
        total: number;
        activeUsers: number; // Users who have reported at least one issue
    }> {
        const { data, error } = await supabase
            .from('referrals')
            .select(`
                id,
                referred:profiles!referred_id(
                    id,
                    issue_reports(count)
                )
            `)
            .eq('referrer_id', userId);

        if (error) {
            console.error('Error fetching referral stats:', error);
            return { total: 0, activeUsers: 0 };
        }

        const total = data?.length || 0;
        const activeUsers = data?.filter((r: any) =>
            r.referred?.issue_reports?.[0]?.count > 0
        ).length || 0;

        return { total, activeUsers };
    }

    /**
     * Generate shareable referral link
     */
    static generateReferralLink(referralCode: string): string {
        const baseUrl = window.location.origin;
        return `${baseUrl}/signup?ref=${referralCode}`;
    }

    /**
     * Track referred user milestone (first report, donation, etc.)
     */
    static async trackReferredMilestone(
        referredUserId: string,
        milestone: 'first_report' | 'donate' | 'complete_profile'
    ): Promise<void> {
        // Find the referral record
        const { data: referral, error } = await supabase
            .from('referrals')
            .select('referrer_id')
            .eq('referred_id', referredUserId)
            .single();

        if (error || !referral) {
            return; // No referral found
        }

        // Award bonus points to referrer
        const actionMap = {
            first_report: 'REFERRED_FIRST_REPORT',
            donate: 'REFERRED_DONATE',
            complete_profile: 'REFERRED_COMPLETE_PROFILE',
        } as const;

        await PointsService.awardPoints(
            referral.referrer_id,
            actionMap[milestone]
        );
    }
}
