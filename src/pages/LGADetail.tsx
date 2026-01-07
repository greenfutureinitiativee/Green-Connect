import { useState, useEffect } from "react";

import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
    MapPin, DollarSign, Users, AlertCircle, Phone, Mail, ArrowLeft,
    Building2, Briefcase, Clock, Globe, Flag, Eye
} from "lucide-react";
import { FloatingCard } from "@/components/FloatingCard";
import { GlassPanel } from "@/components/GlassPanel";
import { LGAImageFeed } from "@/components/LGAImageFeed";
import { LGAService } from "@/services/lga-service";

import type { LGADetails } from "@/types/lga";

const LGADetail = () => {
    const { lgaName, stateName } = useParams<{ lgaName: string; stateName: string }>();
    const navigate = useNavigate();

    const [lgaDetails, setLgaDetails] = useState<LGADetails | null>(null);
    const [loading, setLoading] = useState(true);

    const [realtimeAllocations, setRealtimeAllocations] = useState<any[]>([]);
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState("budget");



    useEffect(() => {
        if (lgaName && stateName) {
            loadLGADetails();
        }
    }, [lgaName, stateName]);

    // Handle tab from URL or issueId deep link
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        const issueId = searchParams.get('issueId');

        if (issueId) {
            setActiveTab('issues');
            // Wait for issues to load then scroll
            setTimeout(() => {
                const element = document.getElementById(`issue-${issueId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                    setTimeout(() => element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'), 3000);
                }
            }, 1000); // Small delay to ensure render
        } else if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [searchParams, lgaDetails]);

    const loadLGADetails = async () => {
        try {
            setLoading(true);
            const details = await LGAService.getLGADetails(
                decodeURIComponent(lgaName!),
                decodeURIComponent(stateName!)
            );
            setLgaDetails(details);

            if (details) {
                const allocations = await LGAService.getRealtimeAllocations(details.id);
                setRealtimeAllocations(allocations);
            }
        } catch (error) {
            console.error("Error loading LGA details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!lgaName || !stateName) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-background">
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <h2 className="text-2xl font-bold mb-2">LGA Not Found</h2>
                    <Button onClick={() => navigate("/explore")} variant="outline">
                        Return to Explore
                    </Button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading LGA details...</p>
                </div>
            </div>
        );
    }

    if (!lgaDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-background">
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <h2 className="text-2xl font-bold mb-2">LGA Details Not Available</h2>
                    <p className="text-muted-foreground mb-4">
                        We couldn't find detailed information for this LGA.
                    </p>
                    <Button onClick={() => navigate("/explore")} variant="outline">
                        Return to Explore
                    </Button>
                </div>
            </div>
        );
    }

    const formatCurrency = (amount?: number) => {
        if (!amount) return "N/A";
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        const normalizedStatus = status.toLowerCase().replace('_', ' ');
        const colors: Record<string, string> = {
            planning: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
            "in progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
            completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
            cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
            reported: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800",
            verified: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
            resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
            rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
        };
        return colors[normalizedStatus] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    const getPriorityColor = (priority: string) => {
        const normalizedPriority = priority.toLowerCase();
        const colors: Record<string, string> = {
            low: "bg-gray-100 text-gray-800 border-gray-200",
            medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
            high: "bg-orange-100 text-orange-800 border-orange-200",
            urgent: "bg-red-100 text-red-800 border-red-200",
        };
        return colors[normalizedPriority] || "bg-gray-100 text-gray-800 border-gray-200";
    };


    const calculateBudgetPercentage = (allocated: number, spent: number) => {
        if (!allocated) return 0;
        return Math.round((spent / allocated) * 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-background pb-12">
            {/* Hero Section */}
            <div className="relative bg-primary/5 dark:bg-primary/10 pb-12 pt-8">
                <div className="container px-4 md:px-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/explore")}
                        className="mb-6 hover:bg-background/50"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
                                <MapPin className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight mb-1">{lgaDetails.name}</h1>
                                <div className="flex flex-wrap items-center gap-2 text-xl text-muted-foreground">
                                    <span>{lgaDetails.state} State</span>
                                    {lgaDetails.geopolitical_zone && (
                                        <>
                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                                            <span>{lgaDetails.geopolitical_zone}</span>
                                        </>
                                    )}
                                </div>
                                {lgaDetails.last_data_update && (
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Updated {new Date(lgaDetails.last_data_update).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {lgaDetails.contact_email && (
                                <Button variant="outline" className="gap-2" asChild>
                                    <a href={`mailto:${lgaDetails.contact_email}`}>
                                        <Mail className="w-4 h-4" /> Contact
                                    </a>
                                </Button>
                            )}
                            {lgaDetails.website_url && (
                                <Button variant="outline" className="gap-2" asChild>
                                    <a href={lgaDetails.website_url} target="_blank" rel="noopener noreferrer">
                                        <Globe className="w-4 h-4" /> Website
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container px-4 md:px-6 -mt-8">
                {/* Key Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <FloatingCard
                        depth="low"
                        className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm animate-in fade-in zoom-in duration-500 delay-100"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">Leadership</span>
                        </div>
                        <div className="text-lg font-bold mb-1 truncate" title={lgaDetails.governance?.executive.chairman.name || lgaDetails.chairman || "N/A"}>
                            {lgaDetails.governance?.executive.chairman.name || lgaDetails.chairman || "Not specified"}
                        </div>
                        <p className="text-xs text-muted-foreground">Current Chairman</p>
                    </FloatingCard>

                    <FloatingCard
                        depth="low"
                        className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm animate-in fade-in zoom-in duration-500 delay-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">Demographics</span>
                        </div>
                        <div className="text-2xl font-bold mb-1">
                            {lgaDetails.population ? `${(lgaDetails.population / 1000).toFixed(1)}K` : "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">Estimated Population</p>
                    </FloatingCard>

                    <FloatingCard
                        depth="low"
                        className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm animate-in fade-in zoom-in duration-500 delay-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">Finance</span>
                        </div>
                        <div className="text-2xl font-bold mb-1">
                            {lgaDetails.annual_budget
                                ? `₦${(lgaDetails.annual_budget / 1000000).toFixed(1)}M`
                                : "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">Annual Budget</p>
                    </FloatingCard>

                    <FloatingCard
                        depth="low"
                        className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm animate-in fade-in zoom-in duration-500 delay-400"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <Briefcase className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">Development</span>
                        </div>
                        <div className="text-2xl font-bold mb-1">{lgaDetails.projects.length}</div>
                        <p className="text-xs text-muted-foreground">Active Projects</p>
                    </FloatingCard>
                </div>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500"
                >
                    <TabsList className="bg-muted/50 p-1 rounded-xl w-full md:w-auto grid grid-cols-2 md:flex h-auto">
                        <TabsTrigger
                            value="budget"
                            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                            Budget
                        </TabsTrigger>
                        <TabsTrigger
                            value="projects"
                            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                            Projects
                        </TabsTrigger>
                        <TabsTrigger
                            value="gallery"
                            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                            Gallery
                            {lgaDetails.gallery_stats && lgaDetails.gallery_stats.approved_images > 0 && (
                                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                                    {lgaDetails.gallery_stats.approved_images}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="issues"
                            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                            Issues ({lgaDetails.issues.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="governance"
                            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                            Governance
                        </TabsTrigger>
                    </TabsList>

                    {/* Budget Tab */}
                    <TabsContent value="budget">
                        <GlassPanel className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <DollarSign className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Budget Allocation</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Breakdown of annual budget allocation and spending
                                    </p>
                                </div>
                            </div>

                            {lgaDetails.budgetAllocations.length > 0 ? (
                                <div className="grid gap-6">
                                    {lgaDetails.budgetAllocations.map((allocation, index) => {
                                        const percentage = calculateBudgetPercentage(
                                            allocation.allocated_amount,
                                            allocation.spent_amount
                                        );
                                        return (
                                            <div key={index} className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium capitalize">{allocation.category}</span>
                                                    <span className="text-sm font-medium text-primary">
                                                        {percentage}% utilized
                                                    </span>
                                                </div>
                                                <Progress value={percentage} className="h-2.5" />
                                                <div className="flex justify-between text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                                    <span>Allocated: {formatCurrency(allocation.allocated_amount)}</span>
                                                    <span>Spent: {formatCurrency(allocation.spent_amount)}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No budget data available yet
                                </div>
                            )}

                            {realtimeAllocations.length > 0 && (
                                <div className="mt-8">
                                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-primary" />
                                        Latest Realtime Allocations (Web Scraped)
                                    </h4>
                                    <div className="space-y-3">
                                        {realtimeAllocations.map((alloc, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                                                <div>
                                                    <p className="font-medium">{alloc.period}</p>
                                                    <p className="text-xs text-muted-foreground">Source: Allocation</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-green-700 dark:text-green-400">
                                                        ₦{(alloc.amount / 1000000).toFixed(2)}M
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </GlassPanel>
                    </TabsContent>

                    {/* Projects Tab */}
                    <TabsContent value="projects">
                        <div className="grid gap-4">
                            {lgaDetails.projects.length > 0 ? (
                                lgaDetails.projects.map((project, idx) => (
                                    <FloatingCard
                                        key={project.id}
                                        depth="low"
                                        className="p-6 bg-white dark:bg-slate-900"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                                    <h3 className="font-bold text-lg">{project.name}</h3>
                                                </div>
                                                <p className="text-muted-foreground">{project.description}</p>
                                            </div>
                                            <Badge variant="outline" className={getStatusColor(project.status)}>
                                                {project.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Budget</p>
                                                <p className="font-semibold text-sm">
                                                    {formatCurrency(project.budget_allocated)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                                                <p className="font-semibold text-sm">
                                                    {project.start_date
                                                        ? new Date(project.start_date).toLocaleDateString()
                                                        : "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Jobs Created</p>
                                                <p className="font-semibold text-sm">{project.jobs_created || 0}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Beneficiaries</p>
                                                <p className="font-semibold text-sm">
                                                    {project.beneficiaries_count?.toLocaleString() || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </FloatingCard>
                                ))
                            ) : (
                                <GlassPanel className="py-12 text-center text-muted-foreground">
                                    No projects data available yet
                                </GlassPanel>
                            )}
                        </div>
                    </TabsContent>

                    {/* Gallery Tab - NEW */}
                    <TabsContent value="gallery">
                        <GlassPanel className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Community Gallery</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Photos and moments from {lgaDetails.name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <LGAImageFeed
                                lgaId={lgaDetails.id}
                                lgaName={lgaDetails.name}
                            />
                        </GlassPanel>
                    </TabsContent>

                    {/* Issues Tab */}
                    <TabsContent value="issues">
                        <div className="grid gap-4">
                            {lgaDetails.issues.length > 0 ? (
                                lgaDetails.issues.map((issue, idx) => (
                                    <FloatingCard
                                        key={issue.id}
                                        id={`issue-${issue.id}`}
                                        depth="low"
                                        className="p-6 bg-white dark:bg-slate-900 border-l-4 border-l-primary"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <AlertCircle className="h-5 w-5 text-primary" />
                                                    <h3 className="font-bold text-lg">{issue.title}</h3>
                                                </div>
                                                <p className="text-muted-foreground mb-3">{issue.description}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>Reported on {new Date(issue.created_at).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>ID: {issue.id.substring(0, 8)}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 items-end">
                                                <Badge variant="outline" className={getStatusColor(issue.status)}>
                                                    {issue.status}
                                                </Badge>
                                                <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                                                    {issue.priority} Priority
                                                </Badge>
                                            </div>
                                        </div>
                                    </FloatingCard>
                                ))
                            ) : (
                                <GlassPanel className="py-16 text-center flex flex-col items-center justify-center border-dashed border-2">
                                    <div className="p-4 bg-muted rounded-full mb-4">
                                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">No issues reported yet</h3>
                                    <p className="text-muted-foreground mb-6 max-w-sm">
                                        Be the first to report an environmental issue in this LGA.
                                    </p>
                                    <Button variant="default" onClick={() => navigate("/report-issue")}>
                                        Report Issue
                                    </Button>
                                </GlassPanel>
                            )}
                        </div>
                    </TabsContent>

                    {/* Governance Tab (Replaced Officials) */}
                    <TabsContent value="governance">
                        {lgaDetails.governance ? (
                            <div className="space-y-6">
                                {/* Executive Arm */}
                                <GlassPanel className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">Executive Council</h3>
                                            <p className="text-muted-foreground text-sm">
                                                The Executive Arm (Chairman, Vice & Supervisors)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                                        <div className="flex items-center gap-4 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800">
                                            <div className="h-16 w-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm text-2xl font-bold text-blue-600">
                                                {(lgaDetails.governance.executive?.chairman?.name || 'N').charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{lgaDetails.governance.executive?.chairman?.title || 'Executive Chairman'}</p>
                                                <h4 className="text-2xl font-bold mb-1">{lgaDetails.governance.executive?.chairman?.name || 'Not Listed'}</h4>
                                                <Badge variant="secondary">{lgaDetails.governance.executive?.chairman?.party || 'N/A'}</Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-6 rounded-xl bg-muted/30 border">
                                            <div className="h-14 w-14 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                                                <Users className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{lgaDetails.governance.executive?.vice_chairman?.title || 'Vice Chairman'}</p>
                                                <h4 className="text-xl font-bold mb-1">{lgaDetails.governance.executive?.vice_chairman?.name || 'Not Listed'}</h4>
                                                <Badge variant="outline">{lgaDetails.governance.executive?.vice_chairman?.party || 'N/A'}</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <div className="p-4 rounded-lg bg-muted/20 border">
                                            <p className="text-xs text-muted-foreground mb-1">Secretary to LG</p>
                                            <p className="font-semibold">{lgaDetails.governance.executive?.secretary?.name || 'Not Listed'}</p>
                                        </div>
                                        {(lgaDetails.governance.executive?.supervisors || []).map((supervisor, idx) => (
                                            <div key={idx} className="p-4 rounded-lg bg-muted/20 border">
                                                <p className="text-xs text-muted-foreground mb-1">Supervisor - {supervisor.portfolio}</p>
                                                <p className="font-semibold">{supervisor.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </GlassPanel>

                                {/* Legislative Arm */}
                                <GlassPanel className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                                            <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">Legislative Council</h3>
                                            <p className="text-muted-foreground text-sm">
                                                The Lawmakers (Councillors) representing the Wards
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-green-800 dark:text-green-300 font-medium">Leader of the Council</p>
                                            <p className="text-lg font-bold text-green-900 dark:text-green-100">
                                                {typeof lgaDetails.governance.legislative?.council_leader === 'string'
                                                    ? lgaDetails.governance.legislative.council_leader
                                                    : (lgaDetails.governance.legislative?.council_leader?.name || 'Not Listed')}
                                            </p>
                                        </div>
                                        <Badge className="bg-green-600">Speaker</Badge>
                                    </div>

                                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                        {(lgaDetails.governance.legislative?.councillors || []).map((councillor, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                                                <div>
                                                    <p className="font-medium text-sm">{councillor.name}</p>
                                                    <p className="text-xs text-muted-foreground">{councillor.ward}</p>
                                                </div>
                                                <Badge variant="outline" className="text-[10px] h-5">{councillor.party}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </GlassPanel>

                                {/* Traditional & Parties Grid */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Traditional */}
                                    <GlassPanel className="p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">Traditional Rulers</h3>
                                                <p className="text-muted-foreground text-sm">Royal Fathers & Chiefs</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {(lgaDetails.governance.traditional || []).map((ruler, idx) => (
                                                <div key={idx} className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800">
                                                    <p className="text-purple-600 dark:text-purple-300 font-medium text-sm uppercase tracking-wider mb-1">{ruler.title}</p>
                                                    <h4 className="text-lg font-serif font-bold">{ruler.name}</h4>
                                                </div>
                                            ))}
                                        </div>
                                    </GlassPanel>

                                    {/* Parties & Oversight */}
                                    <div className="space-y-6">
                                        <GlassPanel className="p-6">
                                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                                <Flag className="w-5 h-5" /> Political Parties
                                            </h3>
                                            <div className="space-y-3">
                                                {(lgaDetails.governance.parties || []).map((party, idx) => (
                                                    <div key={idx} className="flex justify-between items-center p-2 rounded bg-muted/30">
                                                        <span className="font-medium">{party.name}</span>
                                                        <Badge variant={party.status === 'Ruling' ? 'default' : 'secondary'}>
                                                            {party.status}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </GlassPanel>

                                        <GlassPanel className="p-6">
                                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                                <Briefcase className="w-5 h-5" /> Secretariat
                                            </h3>
                                            <div className="space-y-4 text-sm">
                                                {lgaDetails.office_address && (
                                                    <div className="flex gap-3 items-start">
                                                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="font-medium">Office Address</p>
                                                            <p className="text-muted-foreground">{lgaDetails.office_address}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {lgaDetails.contact_phone && (
                                                    <div className="flex gap-3 items-start">
                                                        <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="font-medium">Phone</p>
                                                            <p className="text-muted-foreground">{lgaDetails.contact_phone}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {lgaDetails.contact_email && (
                                                    <div className="flex gap-3 items-start">
                                                        <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="font-medium">Email</p>
                                                            <p className="text-muted-foreground">{lgaDetails.contact_email}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </GlassPanel>

                                        {lgaDetails.governance.oversight && (
                                            <GlassPanel className="p-6">
                                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                                    <Eye className="w-5 h-5" /> Oversight
                                                </h3>
                                                <div className="text-sm space-y-3">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Supervising Ministry</p>
                                                        <p className="font-medium">{lgaDetails.governance.oversight.state_ministry}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Electoral Body (SIEC)</p>
                                                        <p className="font-medium">{lgaDetails.governance.oversight.siec}</p>
                                                    </div>
                                                </div>
                                            </GlassPanel>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <GlassPanel className="p-12 text-center">
                                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-xl font-bold mb-2">Governance Data Not Available</h3>
                                <p className="text-muted-foreground mb-6">
                                    Detailed governance information for {lgaDetails.name} is not yet available.
                                </p>
                                {/* Fallback to basic officials list if available */}
                                {lgaDetails.chairman && (
                                    <div className="inline-block text-left bg-muted p-4 rounded-lg">
                                        <p className="font-bold">Known Official:</p>
                                        <p>Chairman: {lgaDetails.chairman}</p>
                                    </div>
                                )}
                            </GlassPanel>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

        </div >
    );
};

export default LGADetail;
