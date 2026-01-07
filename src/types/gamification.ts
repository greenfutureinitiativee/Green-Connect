// Referral & Gamification Types

export interface Referral {
    id: string;
    referrer_id: string;
    referred_id: string;
    referral_code: string;
    created_at: string;
}

export interface UserPoints {
    id: string;
    user_id: string;
    points: number;
    last_updated: string;
}

export interface PointHistory {
    id: string;
    user_id: string;
    points: number;
    reason: string;
    created_at: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    requirement_type: string;
    requirement_count: number;
    points_awarded: number;
    created_at: string;
}

export interface UserBadge {
    id: string;
    user_id: string;
    badge_id: string;
    earned_at: string;
    badge?: Badge; // Joined badge data
}

export interface LeaderboardEntry {
    id: string;
    full_name: string;
    avatar_url?: string;
    points: number;
    level: UserLevel;
    badge_count: number;
    referral_count: number;
}

export interface UserGamificationStats {
    user_id: string;
    full_name: string;
    referral_code: string;
    total_points: number;
    current_level: UserLevel;
    badges_earned: number;
    total_referrals: number;
    issues_reported: number;
    images_uploaded: number;
    total_likes_received: number;
}

export type UserLevel = 'Bronze' | 'Silver' | 'Gold' | 'Ambassador' | 'Chief Volunteer';

export interface LevelRequirement {
    level: UserLevel;
    minPoints: number;
    color: string;
    icon: string;
}

export const LEVEL_REQUIREMENTS: LevelRequirement[] = [
    { level: 'Bronze', minPoints: 0, color: 'text-orange-700', icon: '🥉' },
    { level: 'Silver', minPoints: 500, color: 'text-gray-400', icon: '🥈' },
    { level: 'Gold', minPoints: 1500, color: 'text-yellow-500', icon: '🥇' },
    { level: 'Ambassador', minPoints: 5000, color: 'text-purple-500', icon: '👑' },
    { level: 'Chief Volunteer', minPoints: 15000, color: 'text-green-600', icon: '🌟' },
];

// Point Categories
export const POINT_ACTIONS = {
    // Referral Points
    REFERRAL_SIGNUP: { points: 100, reason: 'User signed up with your referral code' },
    REFERRED_FIRST_REPORT: { points: 50, reason: 'Referred user submitted first report' },
    REFERRED_DONATE: { points: 30, reason: 'Referred user donated plastic' },
    REFERRED_COMPLETE_PROFILE: { points: 20, reason: 'Referred user completed profile' },

    // Activity Points
    REPORT_ISSUE: { points: 20, reason: 'Reported an environmental issue' },
    UPLOAD_IMAGE: { points: 10, reason: 'Uploaded LGA image' },
    IMAGE_10_LIKES: { points: 5, reason: 'Image reached 10 likes' },
    FOLLOW_USER: { points: 2, reason: 'Followed another user' },
    DAILY_LOGIN: { points: 3, reason: 'Daily login streak' },
    COMPLETE_PROFILE: { points: 15, reason: 'Completed full profile' },
    DONATE_PLASTIC: { points: 50, reason: 'Donated plastic waste' },
    CREATE_CLEANUP: { points: 150, reason: 'Created/led community cleanup' },
    ATTEND_EVENT: { points: 200, reason: 'Attended verified event' },
} as const;

export type PointAction = keyof typeof POINT_ACTIONS;
