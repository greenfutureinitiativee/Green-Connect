import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingCard } from "@/components/FloatingCard";
import { GlassPanel } from "@/components/GlassPanel";
import {
    User, AlertCircle, TrendingUp,
    Users, BarChart3, Plus
} from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PointsService } from "@/services/points-service";
import { PointsProgressCard } from "@/components/PointsDisplay";
import type { PointHistory } from "@/types/gamification";

interface DashboardStats {
    myIssues: number;
    resolvedIssues: number;
    pendingIssues: number;
    lgaProjects: number;
    lgaEmploymentRate: number;
    lgaPopulation: number;
}

interface Issue {
    id: string;
    title: string;
    status: string;
    priority: string;
    created_at: string;
}

interface ProfileData {
    id: string;
    full_name?: string;
    email?: string;
    phone?: string;
    lga_id?: string;
    employment_status?: string;
    employer_name?: string;
    lgas?: {
        name: string;
        state: string;
    };
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [stats, setStats] = useState<DashboardStats>({
        myIssues: 0,
        resolvedIssues: 0,
        pendingIssues: 0,
        lgaProjects: 0,
        lgaEmploymentRate: 0,
        lgaPopulation: 0,
    });
    const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
    const [userPoints, setUserPoints] = useState<number>(0);
    const [pointHistory, setPointHistory] = useState<PointHistory[]>([]);

    const loadDashboard = useCallback(async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) {
                navigate("/signin");
                return;
            }

            // Load profile
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*, lgas(name, state)")
                .eq("id", authUser.id)
                .single();

            setProfile(profileData);

            // Load user's issues
            const { data: issuesData, count: issuesCount } = await supabase
                .from("issue_reports")
                .select("*", { count: "exact" })
                .eq("user_id", authUser.id)
                .order("created_at", { ascending: false })
                .limit(5);

            setRecentIssues(issuesData || []);

            // Load user points and history
            const pointsData = await PointsService.getUserPoints(authUser.id);
            setUserPoints(pointsData?.points || 0);

            const historyData = await PointsService.getPointHistory(authUser.id, 5);
            setPointHistory(historyData);

            const resolvedCount = issuesData?.filter(i => i.status === "resolved").length || 0;
            const pendingCount = (issuesCount || 0) - resolvedCount;

            // Load LGA stats if user has selected an LGA
            let lgaStats = {
                lgaProjects: 0,
                lgaEmploymentRate: 0,
                lgaPopulation: 0,
            };

            if (profileData?.lga_id) {
                const { count: projectsCount } = await supabase
                    .from("lga_projects")
                    .select("*", { count: "exact", head: true })
                    .eq("lga_id", profileData.lga_id);

                const { data: employmentData } = await supabase
                    .from("lga_employment_stats")
                    .select("employment_rate")
                    .eq("lga_id", profileData.lga_id)
                    .single();

                const { data: lgaData } = await supabase
                    .from("lgas")
                    .select("population")
                    .eq("id", profileData.lga_id)
                    .single();

                lgaStats = {
                    lgaProjects: projectsCount || 0,
                    lgaEmploymentRate: employmentData?.employment_rate || 0,
                    lgaPopulation: lgaData?.population || 0,
                };
            }

            setStats({
                myIssues: issuesCount || 0,
                resolvedIssues: resolvedCount,
                pendingIssues: pendingCount,
                ...lgaStats,
            });
        } catch (error) {
            console.error("Error loading dashboard:", error instanceof Error ? error.message : error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            "reported": "text-gray-600 bg-gray-100 dark:bg-gray-800",
            "verified": "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
            "in_progress": "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
            "resolved": "text-green-600 bg-green-50 dark:bg-green-900/20",
            "rejected": "text-red-600 bg-red-50 dark:bg-red-900/20",
        };
        return colors[status] || "text-gray-600 bg-gray-100";
    };

    const getPriorityBadge = (priority: string) => {
        const badges: Record<string, string> = {
            "low": "bg-gray-100 text-gray-800 border-gray-200",
            "medium": "bg-yellow-50 text-yellow-800 border-yellow-200",
            "high": "bg-orange-50 text-orange-800 border-orange-200",
            "urgent": "bg-red-50 text-red-800 border-red-200",
        };
        return badges[priority] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-background">
                <LoadingSpinner size="lg" text="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-background pt-24 pb-12">
            <div className="container py-8 px-4 md:px-6">
                {/* Header */}
                <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h1 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600">
                        Welcome back, {profile?.full_name?.split(' ')[0] || "User"}!
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {profile?.lgas ? `${profile.lgas.name}, ${profile.lgas.state}` : "Complete your profile to get started"}
                    </p>
                </div>

                {/* Profile Completion Alert */}
                {!profile?.lga_id && (
                    <GlassPanel className="mb-8 border-l-4 border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10 p-6 animate-in zoom-in duration-500">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                                <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-yellow-900 dark:text-yellow-100">Complete Your Profile</h3>
                                <p className="text-yellow-800 dark:text-yellow-200 mt-1 mb-4">
                                    Add your LGA and employment information to unlock personalized insights and features.
                                </p>
                                <Button
                                    variant="shine"
                                    onClick={() => navigate("/profile")}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                >
                                    Complete Profile
                                </Button>
                            </div>
                        </div>
                    </GlassPanel>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <FloatingCard depth="low" className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm animate-in fade-in zoom-in duration-500 delay-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">Issues</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.myIssues}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.resolvedIssues} resolved, {stats.pendingIssues} pending
                        </p>
                    </FloatingCard>

                    <FloatingCard depth="low" className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm animate-in fade-in zoom-in duration-500 delay-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">Projects</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.lgaProjects}</div>
                        <p className="text-xs text-muted-foreground">Active in your LGA</p>
                    </FloatingCard>

                    <FloatingCard depth="low" className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm animate-in fade-in zoom-in duration-500 delay-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">Employment</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.lgaEmploymentRate}%</div>
                        <Progress value={stats.lgaEmploymentRate} className="h-1.5 mt-2" />
                    </FloatingCard>

                    <FloatingCard depth="low" className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm animate-in fade-in zoom-in duration-500 delay-400">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">Population</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">
                            {stats.lgaPopulation > 0 ? (stats.lgaPopulation / 1000).toFixed(0) + "K" : "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">Estimated residents</p>
                    </FloatingCard>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="issues" className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                    <TabsList className="bg-muted/50 p-1 rounded-xl">
                        <TabsTrigger value="issues" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">My Issues</TabsTrigger>
                        <TabsTrigger value="rewards" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Rewards & Progress</TabsTrigger>
                        <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Profile</TabsTrigger>
                    </TabsList>

                    {/* Rewards Tab */}
                    <TabsContent value="rewards" className="space-y-4">
                        <PointsProgressCard
                            currentPoints={userPoints}
                            recentActivity={pointHistory.map(h => ({
                                points: h.points,
                                reason: h.reason,
                                created_at: h.created_at
                            }))}
                        />
                    </TabsContent>

                    {/* My Issues Tab */}
                    <TabsContent value="issues" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Recent Issues</h2>
                            <Button onClick={() => navigate("/report")} variant="shine" className="gap-2">
                                <Plus className="w-4 h-4" /> Report New Issue
                            </Button>
                        </div>

                        {recentIssues.length > 0 ? (
                            <div className="grid gap-4">
                                {recentIssues.map((issue, idx) => (
                                    <FloatingCard
                                        key={issue.id}
                                        depth="low"
                                        className="p-5 flex items-center justify-between bg-white dark:bg-slate-900 border-l-4 border-l-primary"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div>
                                            <h3 className="font-semibold text-lg">{issue.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Reported on {new Date(issue.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2 items-end">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusColor(issue.status)}`}>
                                                {issue.status.replace("_", " ").toUpperCase()}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded border ${getPriorityBadge(issue.priority)}`}>
                                                {issue.priority} Priority
                                            </span>
                                        </div>
                                    </FloatingCard>
                                ))}
                            </div>
                        ) : (
                            <GlassPanel className="py-16 text-center flex flex-col items-center justify-center border-dashed border-2">
                                <div className="p-4 bg-muted rounded-full mb-4">
                                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">No issues reported yet</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm">
                                    Be the first to report an environmental issue in your community and help make a difference.
                                </p>
                                <Button onClick={() => navigate("/report")} variant="default">
                                    Report Your First Issue
                                </Button>
                            </GlassPanel>
                        )}
                    </TabsContent>

                    {/* Profile Tab */}
                    <TabsContent value="profile">
                        <GlassPanel className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Profile Information</h2>
                                        <p className="text-muted-foreground">Manage your personal details</p>
                                    </div>
                                </div>
                                <Button onClick={() => navigate("/profile")} variant="outline">
                                    Edit Profile
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                        <p className="text-lg font-medium mt-1">{profile?.full_name || "Not set"}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                        <p className="text-lg font-medium mt-1">{profile?.email || "Not set"}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                                        <p className="text-lg font-medium mt-1">{profile?.phone || "Not set"}</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Local Government Area</label>
                                        <p className="text-lg font-medium mt-1">
                                            {profile?.lgas ? `${profile.lgas.name}, ${profile.lgas.state}` : "Not set"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Employment Status</label>
                                        <p className="text-lg font-medium mt-1 capitalize">
                                            {profile?.employment_status?.replace("_", " ") || "Not set"}
                                        </p>
                                    </div>
                                    {profile?.employer_name && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Employer</label>
                                            <p className="text-lg font-medium mt-1">{profile.employer_name}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </GlassPanel>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Dashboard;
