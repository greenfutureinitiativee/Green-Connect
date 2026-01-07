import { Card } from '@/components/ui/card';
import type { UserBadge, Badge } from '@/types/gamification';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BadgeDisplayProps {
    badge: UserBadge | Badge;
    earned?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const BadgeDisplay = ({ badge, earned = true, size = 'md' }: BadgeDisplayProps) => {
    const sizeClasses = {
        sm: 'w-12 h-12 text-2xl',
        md: 'w-16 h-16 text-3xl',
        lg: 'w-20 h-20 text-4xl'
    };

    const badgeData = ('badge' in badge ? badge.badge : badge) as Badge;

    if (!badgeData) return null;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={`relative ${earned ? '' : 'opacity-30 grayscale'}`}>
                        <div className={`
                            ${sizeClasses[size]} 
                            rounded-full 
                            bg-gradient-to-br from-yellow-400 to-orange-500
                            dark:from-yellow-500 dark:to-orange-600
                            flex items-center justify-center
                            shadow-lg
                            border-4 border-white dark:border-gray-800
                            ${earned ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''}
                        `}>
                            <span className="filter drop-shadow-md">{badgeData.icon}</span>
                        </div>
                        {!earned && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl">🔒</span>
                            </div>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="text-center max-w-xs">
                        <div className="font-bold text-base mb-1">{badgeData.name}</div>
                        <div className="text-xs text-muted-foreground">{badgeData.description}</div>
                        {badgeData.points_awarded > 0 && (
                            <div className="text-xs text-green-500 mt-1">
                                +{badgeData.points_awarded} points
                            </div>
                        )}
                        {'earned_at' in badge && badge.earned_at && (
                            <div className="text-xs text-muted-foreground mt-1">
                                Earned: {new Date(badge.earned_at).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

interface BadgeShowcaseProps {
    earnedBadges: UserBadge[];
    allBadges?: any[];
    maxDisplay?: number;
}

export const BadgeShowcase = ({ earnedBadges, allBadges, maxDisplay = 6 }: BadgeShowcaseProps) => {
    const displayBadges = earnedBadges.slice(0, maxDisplay);
    const remainingCount = earnedBadges.length - maxDisplay;

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Badges</h3>
                <div className="text-sm text-muted-foreground">
                    {earnedBadges.length} earned
                </div>
            </div>

            {earnedBadges.length > 0 ? (
                <>
                    <div className="flex flex-wrap gap-4">
                        {displayBadges.map((badge) => (
                            <BadgeDisplay key={badge.id} badge={badge} earned={true} />
                        ))}
                    </div>
                    {remainingCount > 0 && (
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                            +{remainingCount} more {remainingCount === 1 ? 'badge' : 'badges'}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">🏆</div>
                    <div className="text-sm">No badges earned yet</div>
                    <div className="text-xs mt-1">Keep contributing to earn your first badge!</div>
                </div>
            )}

            {/* Show available badges to earn */}
            {allBadges && allBadges.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-semibold mb-3">Available Badges</h4>
                    <div className="flex flex-wrap gap-4">
                        {allBadges
                            .filter(b => !earnedBadges.find(eb => eb.badge_id === b.id))
                            .slice(0, 4)
                            .map((badge) => (
                                <BadgeDisplay
                                    key={badge.id}
                                    badge={{ ...badge, badge }}
                                    earned={false}
                                    size="sm"
                                />
                            ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

interface BadgeGridProps {
    badges: UserBadge[];
    columns?: number;
}

export const BadgeGrid = ({ badges, columns = 4 }: BadgeGridProps) => {
    return (
        <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-4`}>
            {badges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center text-center">
                    <BadgeDisplay badge={badge} earned={true} />
                    <div className="mt-2 text-sm font-medium">
                        {badge.badge?.name}
                    </div>
                </div>
            ))}
        </div>
    );
};
