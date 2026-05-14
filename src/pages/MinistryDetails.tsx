import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ArrowLeft, Building2, User, MapPin, 
    Calendar, CheckCircle2, Clock, AlertTriangle, 
    FileText, Briefcase, TrendingUp, AlertCircle,
    ChevronRight, Wallet, Activity
} from 'lucide-react';
import { 
    Card, CardContent, CardDescription, 
    CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { federalMinistries, stateData, lgaData } from "@/data/federalData";
import { cn } from "@/lib/utils";

const MinistryDetails = () => {
    const { level, id, subid } = useParams();

    const data = useMemo(() => {
        if (level === 'federal') {
            return federalMinistries.find(m => m.name.toLowerCase().replace(/\s+/g, '-') === id);
        } else if (level === 'state') {
            const state = stateData.find(s => s.name.toLowerCase() === id);
            if (state) {
                return state.ministries.find(m => m.name.toLowerCase().replace(/\s+/g, '-') === subid);
            }
        } else if (level === 'lga') {
            const lga = lgaData.find(l => l.name.toLowerCase().replace(/\s+/g, '-') === id);
            if (lga) {
                return lga.departments.find(d => d.name.toLowerCase() === subid);
            }
        }
        return null;
    }, [level, id, subid]);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                    <h1 className="text-2xl font-bold">Ministry Data Not Found</h1>
                    <p className="text-muted-foreground">The ministry or department you are looking for does not exist or has no public data yet.</p>
                    <Link to="/ministries">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Back to Governance
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const latestFin = data.financials[0];
    const efficiency = Math.round((latestFin.spent / latestFin.allocated) * 100);
    const gap = latestFin.allocated - latestFin.spent;

    const formatCurrency = (amount: number) => {
        if (amount >= 1e9) {
            return `₦${(amount / 1e9).toFixed(2)}B`;
        }
        if (amount >= 1e6) {
            return `₦${(amount / 1e6).toFixed(2)}M`;
        }
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/10 text-green-600 border-green-200';
            case 'In Progress': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            case 'Stalled': return 'bg-orange-500/10 text-orange-600 border-orange-200';
            case 'Planned': return 'bg-slate-500/10 text-slate-600 border-slate-200';
            case 'Under Investigation': return 'bg-red-500/10 text-red-600 border-red-200';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 className="h-3 w-3" />;
            case 'In Progress': return <Clock className="h-3 w-3 animate-pulse" />;
            case 'Stalled': return <AlertTriangle className="h-3 w-3" />;
            case 'Under Investigation': return <Activity className="h-3 w-3" />;
            default: return <Calendar className="h-3 w-3" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 pb-20 pt-32 md:pt-40">
            {/* Navigation Header */}
            <div className="bg-white dark:bg-slate-900 border-b sticky top-[64px] md:top-[80px] z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/ministries">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                {level} Governance transparency
                            </p>
                            <h1 className="text-sm font-bold truncate max-w-[200px] md:max-w-none">
                                {data.name}
                            </h1>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                        <FileText className="h-4 w-4" /> Download Report
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
                {/* Hero Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 overflow-hidden border-none shadow-xl shadow-blue-500/5 bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-900/10">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200">
                                        {level === 'federal' ? 'Federal Ministry' : level === 'state' ? `${id} State Ministry` : `${id} LGA Department`}
                                    </Badge>
                                    <CardTitle className="text-3xl md:text-4xl font-black tracking-tight">{data.name}</CardTitle>
                                    <CardDescription className="text-base max-w-xl py-2">
                                        {'mandate' in data ? data.mandate : `Providing essential ${data.name.toLowerCase()} services to the community.`}
                                    </CardDescription>
                                </div>
                                <div className="hidden md:block p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-900/30">
                                    <Building2 className="h-8 w-8 text-blue-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 mt-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-white dark:border-slate-800 shadow-sm backdrop-blur-sm">
                                <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black">
                                    {('minister' in data ? data.minister.name : 'commissioner' in data ? data.commissioner.name : data.hod).charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                        {'minister' in data ? 'Hon. Minister' : 'commissioner' in data ? 'Hon. Commissioner' : 'Head of Department'}
                                    </p>
                                    <p className="text-xl font-black">
                                        {'minister' in data ? data.minister.name : 'commissioner' in data ? data.commissioner.name : data.hod}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-indigo-500/5 bg-slate-900 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Activity className="h-5 w-5 text-indigo-400" />
                                Efficiency Index
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center space-y-2">
                                <p className="text-5xl font-black text-indigo-400">{efficiency}%</p>
                                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Budget Performance</p>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-slate-800">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Total Spent</span>
                                    <span className="font-bold text-green-400">{formatCurrency(latestFin.spent)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Spending Gap</span>
                                    <span className="font-bold text-red-400">{formatCurrency(gap)}</span>
                                </div>
                                <Progress value={efficiency} className="h-2 bg-slate-800" indicatorClassName="bg-indigo-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="projects" className="space-y-6">
                    <TabsList className="bg-muted/50 p-1 rounded-xl w-full justify-start overflow-x-auto custom-scrollbar">
                        <TabsTrigger value="projects" className="rounded-lg gap-2">
                            <Briefcase className="h-4 w-4" /> Projects Tracking
                        </TabsTrigger>
                        <TabsTrigger value="financials" className="rounded-lg gap-2">
                            <TrendingUp className="h-4 w-4" /> Financial History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="projects" className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-black">Active Projects</h2>
                                <p className="text-muted-foreground">Monitor the progress and spending of ongoing initiatives.</p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="px-3 py-1">{data.projects.length} Total Projects</Badge>
                                <Badge variant="secondary" className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-none">
                                    {data.projects.filter(p => p.status === 'Completed').length} Completed
                                </Badge>
                            </div>
                        </div>

                        {data.projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.projects.map((project) => (
                                    <Card key={project.id} className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border-slate-200 dark:border-slate-800 overflow-hidden">
                                        <CardHeader className="pb-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge className={cn("flex items-center gap-1 font-bold", getStatusColor(project.status))}>
                                                    {getStatusIcon(project.status)} {project.status}
                                                </Badge>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">ID: {project.id}</span>
                                            </div>
                                            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{project.name}</CardTitle>
                                            <CardDescription className="line-clamp-2 mt-2">{project.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="p-3 rounded-xl bg-muted/30 border border-muted-foreground/5">
                                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                                                        <Wallet className="h-3 w-3" /> Budget
                                                    </p>
                                                    <p className="font-bold text-sm">{formatCurrency(project.budget)}</p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-muted/30 border border-muted-foreground/5">
                                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                                                        <Activity className="h-3 w-3" /> Spent
                                                    </p>
                                                    <p className="font-bold text-sm text-green-600">{formatCurrency(project.spent)}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-muted-foreground">Progress</span>
                                                    <span>{Math.round((project.spent / project.budget) * 100)}%</span>
                                                </div>
                                                <Progress value={(project.spent / project.budget) * 100} className="h-1.5" />
                                            </div>

                                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" /> {project.location}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> Started: {project.startDate}
                                                </div>
                                            </div>

                                            <Button variant="outline" className="w-full text-xs h-9 gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                Report Mismanagement <ChevronRight className="h-3 w-3" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                <h3 className="text-lg font-bold">No projects listed yet</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">This ministry hasn't updated its public project tracking data for the current fiscal year.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="financials" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Financial History</CardTitle>
                                <CardDescription>Tracking budget allocation and spending over the years.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {data.financials.map((fin, idx) => {
                                        const finEfficiency = Math.round((fin.spent / fin.allocated) * 100);
                                        return (
                                            <div key={idx} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <Badge className="text-lg font-black px-4 py-1">{fin.year}</Badge>
                                                    <div className="text-right">
                                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Efficiency</p>
                                                        <p className={cn("text-xl font-black", finEfficiency > 80 ? "text-green-500" : "text-orange-500")}>
                                                            {finEfficiency}%
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-muted-foreground font-bold">ALLOCATED</p>
                                                        <p className="text-lg font-bold">{formatCurrency(fin.allocated)}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-muted-foreground font-bold">RELEASED</p>
                                                        <p className="text-lg font-bold">{formatCurrency(fin.released)}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs text-muted-foreground font-bold">ACTUALLY SPENT</p>
                                                        <p className="text-lg font-bold text-green-600">{formatCurrency(fin.spent)}</p>
                                                    </div>
                                                </div>
                                                <Progress value={finEfficiency} className="h-1" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default MinistryDetails;
