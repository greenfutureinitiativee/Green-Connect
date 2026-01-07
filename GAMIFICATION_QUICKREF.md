# Referral & Gamification Quick Reference

## 🚀 Quick Start

1. **Run Migration**: Copy `supabase/migrations/010_add_referral_gamification.sql` to Supabase SQL Editor and run
2. **Import Services**: Use `PointsService` and `ReferralService` from `@/services/points-service`
3. **Use Components**: Import UI components from `@/components/`

---

## 📊 Award Points

```typescript
import { PointsService } from '@/services/points-service';

// Award predefined points
await PointsService.awardPoints(userId, 'REPORT_ISSUE'); // +20 pts

// Award custom points
await PointsService.awardCustomPoints(userId, 50, 'Custom achievement');

// Check for badge
await PointsService.checkAndAwardBadge(userId, 'Waste Warrior');
```

---

## 🎁 Point Actions

```typescript
'REFERRAL_SIGNUP'          // 100 pts - User signs up with code
'REFERRED_FIRST_REPORT'    // 50 pts  - Referred user's first report
'REFERRED_DONATE'          // 30 pts  - Referred user donates
'REFERRED_COMPLETE_PROFILE'// 20 pts  - Referred user completes profile
'REPORT_ISSUE'             // 20 pts  - Report issue
'UPLOAD_IMAGE'             // 10 pts  - Upload LGA image
'IMAGE_10_LIKES'           // 5 pts   - Image reaches 10 likes
'FOLLOW_USER'              // 2 pts   - Follow another user
'DAILY_LOGIN'              // 3 pts   - Daily login streak
'COMPLETE_PROFILE'         // 15 pts  - Complete profile
'DONATE_PLASTIC'           // 50 pts  - Donate plastic
'CREATE_CLEANUP'           // 150 pts - Create cleanup event
'ATTEND_EVENT'             // 200 pts - Attend verified event
```

---

## 🔗 Referral Tracking

```typescript
import { ReferralService } from '@/services/points-service';

// Track signup
await ReferralService.trackReferralSignup(referralCode, newUserId);

// Track milestone (triggers bonus for referrer)
await ReferralService.trackReferredMilestone(userId, 'first_report');
await ReferralService.trackReferredMilestone(userId, 'donate');
await ReferralService.trackReferredMilestone(userId, 'complete_profile');

// Get referral link
const link = ReferralService.generateReferralLink(code);
// Returns: "http://yourapp.com/signup?ref=ABC123"
```

---

## 🎨 UI Components

### Points Display
```typescript
import { PointsDisplay, PointsProgressCard } from '@/components/PointsDisplay';

<PointsDisplay currentPoints={500} showProgress={true} />
<PointsProgressCard currentPoints={500} recentActivity={history} />
```

### Badges
```typescript
import { BadgeDisplay, BadgeShowcase } from '@/components/BadgeDisplay';

<BadgeShowcase earnedBadges={badges} />
<BadgeDisplay badge={badge} earned={true} size="md" />
```

### Referral Card
```typescript
import { ReferralCard } from '@/components/ReferralCard';

<ReferralCard 
  referralCode="ABC123"
  totalReferrals={5}
  activeReferrals={3}
/>
```

---

## 🏆 Levels

```typescript
Bronze          // 0 pts
Silver          // 500 pts
Gold            // 1,500 pts
Ambassador      // 5,000 pts
Chief Volunteer // 15,000 pts
```

---

## 📋 Default Badges

```typescript
'Waste Warrior'      // Report 10 issues
'Street Guardian'    // Explore 5 LGAs
'Eco Influencer'     // Get 100 total likes
'Community Builder'  // Refer 3 users
'Change Maker'       // Upload 20 images
'Pioneer Volunteer'  // Early adopter
'Report Champion'    // Report 50 issues
'Super Connector'    // Refer 10 users
```

---

## 🔌 Integration Examples

### Signup Page
```typescript
// Get referral code from URL
const [searchParams] = useSearchParams();
const ref = searchParams.get('ref');

// After signup
if (ref && newUser) {
  await ReferralService.trackReferralSignup(ref, newUser.id);
}
```

### Report Issue
```typescript
// After successful report
await PointsService.awardPoints(user.id, 'REPORT_ISSUE');
await PointsService.checkAndAwardBadge(user.id, 'Waste Warrior');
```

### Image Upload
```typescript
// After upload
await PointsService.awardPoints(user.id, 'UPLOAD_IMAGE');
await PointsService.checkAndAwardBadge(user.id, 'Change Maker');
```

### Profile Update
```typescript
// Check if complete
const isComplete = profile.full_name && profile.phone && profile.lga_id && profile.bio;

if (isComplete) {
  await PointsService.awardPoints(user.id, 'COMPLETE_PROFILE');
  await ReferralService.trackReferredMilestone(user.id, 'complete_profile');
}
```

---

## 📊 Data Fetching

```typescript
// Get user points
const points = await PointsService.getUserPoints(userId);

// Get point history
const history = await PointsService.getPointHistory(userId, 20);

// Get user stats (complete)
const stats = await PointsService.getUserStats(userId);

// Get badges
const badges = await PointsService.getUserBadges(userId);

// Get leaderboard
const leaderboard = await PointsService.getLeaderboard(100);

// Get referral stats
const refStats = await ReferralService.getReferralStats(userId);
```

---

## 🗄️ Database Tables

```sql
referrals           -- Who invited whom
user_points         -- Point totals per user
point_history       -- Audit log
badges              -- Available badges
user_badges         -- Earned badges
```

---

## 🛡️ RLS Policies

- Users can view their own data
- Admins can view all data
- System (RPC) can update points
- Users cannot directly modify points

---

## ✅ Testing Checklist

- [ ] Migration runs successfully
- [ ] New user gets referral code
- [ ] Referral signup awards +100 pts
- [ ] Issue report awards +20 pts
- [ ] Badges auto-award at thresholds
- [ ] Profile shows points/badges
- [ ] Dashboard shows recent activity
- [ ] Admin sees leaderboard
- [ ] Referral link copies correctly
