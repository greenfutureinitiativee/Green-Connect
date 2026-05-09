import React, { useState } from 'react';
import { 
    Building2, Gavel, Users, Info, 
    ChevronRight, Search, MapPin, 
    Clock, CheckCircle2, XCircle, 
    FileText, User, MessageSquare, 
    ArrowRight, Activity, Landmark
} from 'lucide-react';
import { 
    Card, CardContent, CardDescription, 
    CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
    federalChamber, lagosChamber, ikejaChamber 
} from "@/data/chambersData";
import type { PolicyStatus } from "@/types/chambers";
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';

const Chambers = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const getStatusStep = (status: PolicyStatus) => {
        const steps: PolicyStatus[] = ['Proposed', 'First Reading', 'Second Reading', 'Committee', 'Third Reading', 'Passed', 'Assented'];
        return steps.indexOf(status);
    };

    const getStatusColor = (status: PolicyStatus) => {
        switch (status) {
            case 'Passed': 
            case 'Assented': return 'bg-green-500/10 text-green-600 border-green-200';
            case 'Rejected': return 'bg-red-500/10 text-red-600 border-red-200';
            case 'Committee': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            default: return 'bg-slate-500/10 text-slate-600 border-slate-200';
        }
    };

    const ChamberTier = ({ chamber }: { chamber: typeof federalChamber }) => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-xl shadow-blue-500/5 bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-900/10">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-700 dark:bg-blue-900/20 border-blue-200 uppercase tracking-widest text-[10px] font-black">
                                    {chamber.level} Legislative Arm
                                </Badge>
                                <CardTitle className="text-3xl font-black tracking-tight">{chamber.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1 text-sm font-medium">
                                    <MapPin className="h-3 w-3" /> {chamber.location}
                                </CardDescription>
                            </div>
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-900/30">
                                <Gavel className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white dark:border-slate-800">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Executive Head</p>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                    {chamber.executive_head.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold">{chamber.executive_head.name}</p>
                                    <p className="text-xs text-muted-foreground">{chamber.executive_head.title} ({chamber.executive_head.party})</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white dark:border-slate-800">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Legislative Body</p>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold">{chamber.legislative_body}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-muted-foreground">{chamber.member_count} Elected Representatives</p>
                                        {chamber.level === 'Federal' && (
                                            <Button 
                                                variant="link" 
                                                className="h-auto p-0 text-[10px] font-black uppercase text-primary hover:no-underline"
                                                onClick={() => navigate('/national-assembly')}
                                            >
                                                View Directory
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl shadow-indigo-500/5 bg-slate-900 text-white">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="h-5 w-5 text-indigo-400" />
                            Session Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/50 border border-slate-800">
                            <span className="text-slate-400 text-sm">Active Bills</span>
                            <span className="text-2xl font-black text-indigo-400">{chamber.current_policies.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/50 border border-slate-800">
                            <span className="text-slate-400 text-sm">Passed this Month</span>
                            <span className="text-2xl font-black text-green-400">2</span>
                        </div>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 mt-2">
                            Watch Live Session <ChevronRight className="h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Policy Pipeline Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">Policy Pipeline</h3>
                        <p className="text-muted-foreground">Track bills from proposal to presidential assent.</p>
                    </div>
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-bold gap-2">
                        View All Bills <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chamber.current_policies.map((policy) => (
                        <Card key={policy.id} className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start mb-3">
                                    <Badge className={cn("font-bold text-[10px] uppercase", getStatusColor(policy.status))}>
                                        {policy.status}
                                    </Badge>
                                    <span className="text-[10px] font-bold text-muted-foreground">ID: {policy.id}</span>
                                </div>
                                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors leading-tight">{policy.title}</CardTitle>
                                <CardDescription className="line-clamp-2 mt-2 text-xs">{policy.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        <span>Pipeline Progress</span>
                                        <span>{Math.round((getStatusStep(policy.status) / 6) * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full flex gap-1 p-0.5">
                                        {[...Array(7)].map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={cn(
                                                    "flex-1 rounded-full transition-all duration-500",
                                                    i <= getStatusStep(policy.status) 
                                                        ? (policy.status === 'Rejected' ? "bg-red-500" : "bg-blue-600") 
                                                        : "bg-slate-200 dark:bg-slate-700"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/30 border border-muted-foreground/5 space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Proposer</span>
                                        <span className="font-bold">{policy.proposer}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Introduced</span>
                                        <span className="font-bold">{policy.date_introduced}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0 pb-4 px-4">
                                <Button variant="outline" className="w-full text-xs h-9 gap-2 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                                    <FileText className="h-3 w-3" /> Read Full Bill Text
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Representatives Section */}
            <div className="space-y-4">
                <h3 className="text-2xl font-black tracking-tight">Your Representatives</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {chamber.representatives.map((rep) => (
                        <Card key={rep.id} className="border-slate-100 dark:border-slate-800 hover:border-blue-200 transition-all overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row">
                                    <div className="sm:w-32 bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-6">
                                        <div className="h-20 w-20 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-blue-600 shadow-sm border-2 border-white">
                                            <User className="h-10 w-10" />
                                        </div>
                                    </div>
                                    <div className="flex-1 p-6 space-y-4">
                                        <div>
                                            <Badge variant="secondary" className="mb-1 text-[10px] font-bold tracking-tighter uppercase">{rep.role}</Badge>
                                            <h4 className="text-xl font-black">{rep.name}</h4>
                                            <p className="text-sm text-muted-foreground font-medium">{rep.constituency} ({rep.party})</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 flex-1 font-bold">
                                                <MessageSquare className="h-3 w-3" /> Message Rep
                                            </Button>
                                            <Button size="sm" variant="outline" className="font-bold">
                                                Profile
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#fafbfc] dark:bg-slate-950">
            <div className="container px-4 md:px-6 max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-2">
                        Legislative Oversight
                    </Badge>
                    <h1 className="text-4xl font-black tracking-tighter sm:text-6xl text-slate-900 dark:text-white">
                        The Chambers
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-[700px] font-medium">
                        Monitor where policies are discussed, proposed, and approved across the three tiers of Nigerian government.
                    </p>
                </div>

                {/* Navigation & Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-3xl mx-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Find your representative by constituency or area..." 
                            className="pl-10 h-12 rounded-2xl border-slate-200 shadow-sm focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-500/20">
                        Search Database
                    </Button>
                </div>

                <Tabs defaultValue="federal" className="space-y-8">
                    <div className="flex justify-center">
                        <TabsList className="bg-white dark:bg-slate-900 border shadow-xl shadow-slate-200/50 dark:shadow-none p-1.5 h-16 rounded-3xl w-full max-w-2xl grid grid-cols-3">
                            <TabsTrigger value="federal" className="rounded-2xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-black text-sm uppercase tracking-wider transition-all gap-2">
                                <Landmark className="h-4 w-4" /> Federal
                            </TabsTrigger>
                            <TabsTrigger value="state" className="rounded-2xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-black text-sm uppercase tracking-wider transition-all gap-2">
                                <Building2 className="h-4 w-4" /> State
                            </TabsTrigger>
                            <TabsTrigger value="local" className="rounded-2xl data-[state=active]:bg-blue-600 data-[state=active]:text-white font-black text-sm uppercase tracking-wider transition-all gap-2">
                                <MapPin className="h-4 w-4" /> Local
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="federal">
                        <ChamberTier chamber={federalChamber} />
                    </TabsContent>

                    <TabsContent value="state">
                        <ChamberTier chamber={lagosChamber} />
                    </TabsContent>

                    <TabsContent value="local">
                        <ChamberTier chamber={ikejaChamber} />
                    </TabsContent>
                </Tabs>

                {/* Legend Section */}
                <div className="mt-20 p-8 rounded-[40px] bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Info className="h-48 w-48 text-indigo-400" />
                    </div>
                    <div className="relative z-1 space-y-6">
                        <h3 className="text-2xl font-black tracking-tight">Understanding the Legislative Process</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700">1</div>
                                <h4 className="font-bold text-sm">Proposal</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">A bill is drafted by a representative or executive and formally introduced for first reading.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700">2</div>
                                <h4 className="font-bold text-sm">Debate & Committee</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">Bill undergoes second reading, debate, and detailed review by specialized legislative committees.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700">3</div>
                                <h4 className="font-bold text-sm">Third Reading & Vote</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">Final version is presented. Representatives vote to pass or reject the legislation.</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700">4</div>
                                <h4 className="font-bold text-sm">Assent</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">President, Governor, or Chairman signs the passed bill into law. Assent marks final approval.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chambers;
