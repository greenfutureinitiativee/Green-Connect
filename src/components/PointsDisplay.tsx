import { LEVEL_REQUIREMENTS } from '@/types/gamification';
import type { UserLevel } from '@/types/gamification';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface PointsDisplayProps {
    currentPoints: number;
    showProgress?: boolean;
    className?: string;
}

export const PointsDisplay = ({ currentPoints, showProgress = true, className = '' }: PointsDisplayProps) => {
    // Find current level
    const currentLevelIndex = LEVEL_REQUIREMENTS.findIndex((level, index) => {
        const nextLevel = LEVEL_REQUIREMENTS[index + 1];
        return currentPoints >= level.minPoints && (!nextLevel || currentPoints < nextLevel.minPoints);
    });

    const currentLevel = LEVEL_REQUIREMENTS[currentLevelIndex];
    const nextLevel = LEVEL_REQUIREMENTS[currentLevelIndex + 1];

    // Calculate progress to next level
    const progressPercentage = nextLevel
        ? ((currentPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
        : 100;

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Current Points & Level */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-3xl">{currentLevel.icon}</span>
                    <div>
                        <div className={`text-lg font-bold ${currentLevel.color}`}>
                            {currentLevel.level}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {currentPoints.toLocaleString()} points
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {showProgress && nextLevel && (
                <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{currentLevel.level}</span>
                        <span>{nextLevel.level}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="text-xs text-center text-muted-foreground">
                        {nextLevel.minPoints - currentPoints} points to {nextLevel.level}
                    </div>
                </div>
            )}

            {/* Max Level Achieved */}
            {!nextLevel && (
                <div className="text-center text-sm font-medium text-green-600 dark:text-green-400">
                    🎉 Maximum Level Achieved!
                </div>
            )}
        </div>
    );
};

interface LevelBadgeProps {
    level: UserLevel;
    size?: 'sm' | 'md' | 'lg';
}

export const LevelBadge = ({ level, size = 'md' }: LevelBadgeProps) => {
    const levelData = LEVEL_REQUIREMENTS.find(l => l.level === level) || LEVEL_REQUIREMENTS[0];

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    return (
        <div className={`inline-flex items-center gap-1 rounded-full bg-accent ${sizeClasses[size]} font-semibold ${levelData.color}`}>
            <span>{levelData.icon}</span>
            <span>{level}</span>
        </div>
    );
};

interface PointsProgressCardProps {
    currentPoints: number;
    recentActivity?: { points: number; reason: string; created_at: string }[];
}

export const PointsProgressCard = ({ currentPoints, recentActivity }: PointsProgressCardProps) => {
    return (
        <Card className="p-6 space-y-4">
            <h3 className="text-xl font-bold">Your Progress</h3>

            <PointsDisplay currentPoints={currentPoints} />

            {/* Recent Activity */}
            {recentActivity && recentActivity.length > 0 && (
                <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-3">Recent Points Earned</h4>
                    <div className="space-y-2">
                        {recentActivity.slice(0, 5).map((activity, index) => (
                            <div key={index} className="flex justify-between items-start text-sm">
                                <span className="text-muted-foreground flex-1">{activity.reason}</span>
                                <span className="font-semibold text-green-600 ml-2">+{activity.points}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};
