import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, MapPin, Briefcase, Phone, Mail, Award } from "lucide-react";
import { ReferralCard } from "@/components/ReferralCard";
import { BadgeShowcase } from "@/components/BadgeDisplay";
import { ReferralService, PointsService } from "@/services/points-service";
import type { UserBadge, Badge } from "@/types/gamification";

interface LGA {
    id: string;
    name: string;
    state: string;
}

interface Profile {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    bio: string;
    lga_id: string;
    ward: string;
    employment_status: string;
    employer_name: string;
    employment_sector: string;
    is_lga_employed: boolean;
}

const Profile = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lgas, setLgas] = useState<LGA[]>([]);
    const [profile, setProfile] = useState<Partial<Profile>>({
        full_name: "",
        email: "",
        phone: "",
        bio: "",
        lga_id: "",
        ward: "",
        employment_status: "unemployed",
        employer_name: "",
        employment_sector: "",
        is_lga_employed: false,
    });

    // Gamification state
    const [referralCode, setReferralCode] = useState<string>("");
    const [referralStats, setReferralStats] = useState({ total: 0, activeUsers: 0 });
    const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
    const [allBadges, setAllBadges] = useState<Badge[]>([]);

    const loadProfile = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate("/signin");
                return;
            }

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error && error.code !== "PGRST116") {
                throw error;
            }

            if (data) {
                setProfile(data);
            } else {
                // Create initial profile
                setProfile((prev) => ({ ...prev, email: user.email || "" }));
            }

            // Load gamification data
            const code = await ReferralService.getReferralCode(user.id);
            if (code) {
                setReferralCode(code);
                const stats = await ReferralService.getReferralStats(user.id);
                setReferralStats(stats);
            } else {
                // Generate code if not exists (should be done on signup, but fallback here)
                try {
                    await ReferralService.generateReferralCode();
                    // We can't save it here easily without updating profile, but the user can save profile to generate it?
                    // Actually better to just show nothing or a "Generate" button if we implemented that.
                    // For now, let's assume it exists or will be created by trigger.
                    // If trigger failed, we might need to handle it.
                } catch (e) {
                    console.error("Failed to generate referral code", e);
                }
            }

            const badges = await PointsService.getUserBadges(user.id);
            setUserBadges(badges);

            const availableBadges = await PointsService.getAllBadges();
            setAllBadges(availableBadges);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to load profile",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [navigate, toast]);

    const loadLGAs = useCallback(async () => {

        const { data, error } = await supabase
            .from("lgas")
            .select("id, name, state")
            .order("state")
            .order("name");

        if (error) {
            console.error("Error loading LGAs:", error);
        } else {
            setLgas(data || []);
        }
    }, []);

    useEffect(() => {
        loadProfile();
        loadLGAs();
    }, [loadProfile, loadLGAs]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate("/signin");
                return;
            }

            // Explicitly select and sanitize fields to update
            const updates = {
                id: user.id,
                full_name: profile.full_name,
                bio: profile.bio,
                phone: profile.phone,
                // Convert empty string to null for UUID fields
                lga_id: profile.lga_id || null,
                ward: profile.ward,
                employment_status: profile.employment_status,
                employer_name: profile.employer_name,
                employment_sector: profile.employment_sector,
                is_lga_employed: profile.is_lga_employed,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from("profiles")
                .upsert(updates);

            if (error) {
                console.error("Profile save error details:", error);
                throw error;
            }

            toast({
                title: "Success",
                description: "Profile updated successfully!",
            });
        } catch (error) {
            console.error("Profile save exception:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save profile",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-background">
            <div className="container py-8 px-4 md:px-6 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">My Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information and employment status</p>
                </div>

                <div className="space-y-6">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>Your basic profile details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Full Name</Label>
                                    <Input
                                        id="full_name"
                                        value={profile.full_name || ""}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profile.email || ""}
                                            disabled
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        value={profile.phone || ""}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        placeholder="+234 XXX XXX XXXX"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={profile.bio || ""}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    placeholder="Tell us about yourself..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Location
                            </CardTitle>
                            <CardDescription>Your LGA and ward information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="lga">Local Government Area</Label>
                                <Select
                                    value={profile.lga_id || ""}
                                    onValueChange={(value) => setProfile({ ...profile, lga_id: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your LGA" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lgas.map((lga) => (
                                            <SelectItem key={lga.id} value={lga.id}>
                                                {lga.name}, {lga.state}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ward">Ward</Label>
                                <Input
                                    id="ward"
                                    value={profile.ward || ""}
                                    onChange={(e) => setProfile({ ...profile, ward: e.target.value })}
                                    placeholder="Enter your ward"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Employment Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Employment Status
                            </CardTitle>
                            <CardDescription>Your current employment information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="employment_status">Employment Status</Label>
                                <Select
                                    value={profile.employment_status || "unemployed"}
                                    onValueChange={(value) => setProfile({ ...profile, employment_status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="employed">Employed</SelectItem>
                                        <SelectItem value="unemployed">Unemployed</SelectItem>
                                        <SelectItem value="self-employed">Self-Employed</SelectItem>
                                        <SelectItem value="student">Student</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {(profile.employment_status === "employed" || profile.employment_status === "self-employed") && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="employer_name">Employer/Business Name</Label>
                                        <Input
                                            id="employer_name"
                                            value={profile.employer_name || ""}
                                            onChange={(e) => setProfile({ ...profile, employer_name: e.target.value })}
                                            placeholder="Enter employer or business name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="employment_sector">Sector</Label>
                                        <Input
                                            id="employment_sector"
                                            value={profile.employment_sector || ""}
                                            onChange={(e) => setProfile({ ...profile, employment_sector: e.target.value })}
                                            placeholder="e.g., Technology, Healthcare, Agriculture"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="is_lga_employed"
                                            checked={profile.is_lga_employed || false}
                                            onChange={(e) => setProfile({ ...profile, is_lga_employed: e.target.checked })}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <Label htmlFor="is_lga_employed" className="font-normal">
                                            I am employed by my Local Government
                                        </Label>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Gamification Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Rewards & Referrals
                            </CardTitle>
                            <CardDescription>View your badges and invite friends</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {referralCode && (
                                <ReferralCard
                                    referralCode={referralCode}
                                    totalReferrals={referralStats.total}
                                    activeReferrals={referralStats.activeUsers}
                                />
                            )}

                            <BadgeShowcase
                                earnedBadges={userBadges}
                                allBadges={allBadges}
                            />
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => navigate("/dashboard")}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Profile"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
