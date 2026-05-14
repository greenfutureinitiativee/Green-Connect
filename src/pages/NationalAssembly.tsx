import React, { useState, useMemo } from 'react';
import { sampleRepresentatives, nationalAssemblyStats } from '@/data/nationalAssemblyData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Search, 
    Filter, 
    User, 
    MapPin, 
    Twitter, 
    ArrowLeft, 
    Users, 
    Building2,
    ChevronRight,
    Gavel
} from 'lucide-react';
import { GlassPanel } from '@/components/GlassPanel';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NationalAssembly = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [chamberFilter, setChamberFilter] = useState("All");
    const [partyFilter, setPartyFilter] = useState("All");

    const filteredReps = useMemo(() => {
        return sampleRepresentatives.filter(rep => {
            const matchesSearch = rep.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 rep.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 rep.constituency.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesChamber = chamberFilter === "All" || rep.chamber === chamberFilter;
            const matchesParty = partyFilter === "All" || rep.party === partyFilter;
            return matchesSearch && matchesChamber && matchesParty;
        });
    }, [searchTerm, chamberFilter, partyFilter]);

    const parties = ["All", ...Array.from(new Set(sampleRepresentatives.map(r => r.party)))];

    return (
        <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 pb-20 pt-32 md:pt-40">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="space-y-2">
                        <Button variant="ghost" className="pl-0 hover:bg-transparent" onClick={() => navigate('/chambers')}>
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Chambers
                        </Button>
                        <h1 className="text-4xl font-black tracking-tighter sm:text-6xl text-slate-900 dark:text-white">
                            National <span className="text-primary">Assembly</span>
                        </h1>
                        <p className="text-muted-foreground text-lg font-medium">
                            The Directory of {nationalAssemblyStats.total_seats} Elected Representatives in Nigeria's {nationalAssemblyStats.current_session}.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-full border-none font-bold">
                            <Building2 className="h-4 w-4 mr-2" /> {nationalAssemblyStats.senate_seats} Senators
                        </Badge>
                        <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-full border-none font-bold">
                            <Gavel className="h-4 w-4 mr-2" /> {nationalAssemblyStats.house_seats} House Members
                        </Badge>
                    </div>
                </div>

                {/* Filters */}
                <GlassPanel className="p-4 mb-12 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by name, state, or constituency..." 
                            className="pl-10 h-12 bg-white/50 dark:bg-slate-900/50 border-none ring-1 ring-slate-200 dark:ring-slate-800 focus-visible:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <Select value={chamberFilter} onValueChange={setChamberFilter}>
                            <SelectTrigger className="w-full md:w-48 h-12 bg-white/50 dark:bg-slate-900/50 border-none ring-1 ring-slate-200 dark:ring-slate-800">
                                <SelectValue placeholder="Chamber" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Chambers</SelectItem>
                                <SelectItem value="Senate">Senate</SelectItem>
                                <SelectItem value="House of Representatives">House of Reps</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Select value={partyFilter} onValueChange={setPartyFilter}>
                            <SelectTrigger className="w-full md:w-32 h-12 bg-white/50 dark:bg-slate-900/50 border-none ring-1 ring-slate-200 dark:ring-slate-800">
                                <SelectValue placeholder="Party" />
                            </SelectTrigger>
                            <SelectContent>
                                {parties.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </GlassPanel>

                {/* Representatives Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredReps.length > 0 ? (
                        filteredReps.map((rep) => (
                            <GlassPanel key={rep.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/40 dark:bg-slate-900/40">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform duration-500">
                                            <User className="h-8 w-8 text-primary" />
                                        </div>
                                        <Badge className={`font-bold ${rep.party === 'APC' ? 'bg-blue-500' : rep.party === 'PDP' ? 'bg-red-500' : 'bg-green-500'}`}>
                                            {rep.party}
                                        </Badge>
                                    </div>
                                    
                                    <div className="space-y-1 mb-6">
                                        <h3 className="text-xl font-black group-hover:text-primary transition-colors">{rep.name}</h3>
                                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{rep.role || rep.chamber}</p>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4 mr-3 text-primary" />
                                            <span className="font-medium">{rep.state} State</span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Building2 className="h-4 w-4 mr-3 text-primary" />
                                            <span className="font-medium">{rep.constituency}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex gap-3">
                                        <Button variant="outline" className="flex-1 rounded-full border-slate-200 hover:border-primary hover:text-primary group/btn">
                                            View Track Record <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                        {rep.twitter && (
                                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-400">
                                                <Twitter className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </GlassPanel>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-6">
                                <Search className="h-10 w-10 text-muted-foreground opacity-20" />
                            </div>
                            <h2 className="text-2xl font-bold">No representatives found</h2>
                            <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
                        </div>
                    )}
                </div>

                {/* Info Card */}
                <div className="mt-16 p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Users className="h-64 w-64" />
                    </div>
                    <div className="relative z-10 max-w-3xl">
                        <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                            <ShieldCheck className="h-6 w-6 text-primary" /> Accountability Note
                        </h3>
                        <p className="text-slate-400 leading-relaxed font-medium">
                            The National Assembly is the highest legislative body in Nigeria. Your representatives are responsible for making laws, 
                            approving the federal budget, and overseeing the executive arm. Use this directory to identify your representative and 
                            monitor their voting records and proposed bills.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple icon for shield since I missed it in imports
const ShieldCheck = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export default NationalAssembly;
