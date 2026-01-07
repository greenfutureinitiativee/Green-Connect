import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { ReferralService } from '@/services/points-service';

interface ReferralCardProps {
    referralCode: string;
    totalReferrals: number;
    activeReferrals: number;
}

export const ReferralCard = ({ referralCode, totalReferrals, activeReferrals }: ReferralCardProps) => {
    const [copied, setCopied] = useState(false);
    const referralLink = ReferralService.generateReferralLink(referralCode);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast.success('Referral link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join Green Future Connect',
                    text: 'Join me in making Nigeria greener! Use my referral code to get started.',
                    url: referralLink,
                });
            } catch (error) {
                console.log('Share cancelled or failed');
            }
        } else {
            handleCopy();
        }
    };

    return (
        <Card className="p-6 space-y-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Invite Friends</h3>
                <div className="text-3xl">🤝</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{totalReferrals}</div>
                    <div className="text-xs text-muted-foreground">Total Referrals</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{activeReferrals}</div>
                    <div className="text-xs text-muted-foreground">Active Users</div>
                </div>
            </div>

            {/* Referral Code */}
            <div>
                <label className="text-sm font-medium mb-2 block">Your Referral Code</label>
                <div className="flex gap-2">
                    <Input
                        value={referralCode}
                        readOnly
                        className="font-mono text-lg text-center bg-white dark:bg-gray-800"
                    />
                    <Button onClick={handleCopy} variant="outline" size="icon">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Referral Link */}
            <div>
                <label className="text-sm font-medium mb-2 block">Referral Link</label>
                <div className="flex gap-2">
                    <Input
                        value={referralLink}
                        readOnly
                        className="text-sm bg-white dark:bg-gray-800"
                    />
                    <Button onClick={handleCopy} variant="outline" size="icon">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Share Button */}
            <Button onClick={handleShare} className="w-full" variant="default">
                <Share2 className="h-4 w-4 mr-2" />
                Share Referral Link
            </Button>

            {/* Rewards Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
                <div className="font-semibold mb-2">🎁 Referral Rewards</div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Friend signs up</span>
                    <span className="font-semibold text-green-600">+100 pts</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">First report submitted</span>
                    <span className="font-semibold text-green-600">+50 pts</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Plastic donated</span>
                    <span className="font-semibold text-green-600">+30 pts</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Profile completed</span>
                    <span className="font-semibold text-green-600">+20 pts</span>
                </div>
            </div>
        </Card>
    );
};
