import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";
import {
    Building2, FileBarChart, Search, MapPin,
    User, Briefcase, ChevronRight, Globe, Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { federalMinistries, stateData, lgaData } from "@/data/federalData";

const Ministries = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("federal");

    const filteredMinistries = federalMinistries.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.minister.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredStates = stateData.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.governor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredLGAs = lgaData.filter(l =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.chairman.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.state.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatBudget = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(amount);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-950">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                        National Governance Data
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-[700px]">
                        Federal Ministries, State Administrations, and Budget Allocations.
                    </p>
                </div>

                <div className="max-w-xl mx-auto mb-8 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={`Search ${activeTab === 'federal' ? 'ministries, ministers...' : activeTab === 'states' ? 'states, governors...' : 'LGAs, chairmen...'} `}
                        className="pl-10 h-11"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Tabs defaultValue="federal" onValueChange={setActiveTab} className="space-y-8">
                    <div className="flex justify-center">
                        <TabsList className="grid w-full max-w-xl grid-cols-3 h-11">
                            <TabsTrigger value="federal" className="text-xs sm:text-base">Federal</TabsTrigger>
                            <TabsTrigger value="states" className="text-xs sm:text-base">States</TabsTrigger>
                            <TabsTrigger value="lga" className="text-xs sm:text-base">Local</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="federal" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredMinistries.map((ministry, index) => {
                                const latestFin = ministry.financials[0];
                                const gap = latestFin.allocated - latestFin.spent;
                                const gapPercent = Math.round((gap / latestFin.allocated) * 100);
                                
                                return (
                                    <Card key={index} className="overflow-hidden hover:shadow-xl transition-all border-l-4 border-l-green-600 group relative">
                                        <Link 
                                            to={`/ministries/federal/${ministry.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="absolute inset-0 z-0"
                                        />
                                        <CardHeader className="p-4 md:p-6 pb-3 relative z-1">
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-2 md:gap-4">
                                                    <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/20 rounded-xl group-hover:scale-110 transition-transform">
                                                        <Building2 className="h-5 w-5 md:h-6 md:w-6 text-green-700 dark:text-green-400" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-lg md:text-xl group-hover:text-green-600 transition-colors">{ministry.name}</CardTitle>
                                                        <Badge variant="secondary" className="mt-1 text-[10px]">{ministry.sector}</Badge>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground font-semibold uppercase">2023 Gap Index</p>
                                                    <div className={cn(
                                                        "text-lg font-bold",
                                                        gapPercent > 20 ? "text-red-500" : gapPercent > 10 ? "text-orange-500" : "text-green-500"
                                                    )}>
                                                        {gapPercent}%
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 md:p-6 pt-0 space-y-6 relative z-1">
                                            <div className="grid grid-cols-3 gap-2 py-4 border-y bg-muted/10 rounded-lg px-2">
                                                <div className="text-center">
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Allocated</p>
                                                    <p className="font-bold text-sm">{formatBudget(latestFin.allocated)}</p>
                                                </div>
                                                <div className="text-center border-x">
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Released</p>
                                                    <p className="font-bold text-sm">{formatBudget(latestFin.released)}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Spent</p>
                                                    <p className="font-bold text-sm text-green-600">{formatBudget(latestFin.spent)}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-semibold">
                                                    <span>Spending Efficiency</span>
                                                    <span>{100 - gapPercent}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div 
                                                        className={cn(
                                                            "h-full transition-all duration-1000",
                                                            gapPercent > 20 ? "bg-red-500" : gapPercent > 10 ? "bg-orange-500" : "bg-green-500"
                                                        )}
                                                        style={{ width: `${100 - gapPercent}%` }}
                                                    />
                                                </div>
                                                <p className="text-[10px] text-muted-foreground">
                                                    *The gap of {formatBudget(gap)} represents unspent or unverified funds.
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 pt-4 border-t">
                                                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 overflow-hidden">
                                                    {ministry.minister.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold">{ministry.minister.name}</p>
                                                    <p className="text-xs text-muted-foreground">{ministry.minister.portfolio}</p>
                                                </div>
                                                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs hover:bg-green-600 hover:text-white relative z-10">
                                                    View Projects <ChevronRight className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    <TabsContent value="states" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredStates.map((state, index) => (
                                <Card key={index} className="overflow-hidden border-t-4 border-t-blue-600">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-2xl mb-1 flex items-center gap-2">
                                                    {state.name} State
                                                    {state.website && (
                                                        <a href={state.website} target="_blank" className="text-muted-foreground hover:text-primary relative z-10">
                                                            <Globe className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" /> Capital: {state.capital}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200">
                                                {state.governor.party}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-6">
                                        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600">
                                                {state.governor.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{state.governor.name}</p>
                                                <p className="text-xs text-muted-foreground">Executive Governor</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                <Building2 className="h-4 w-4" /> State Ministries & Spending
                                            </h4>
                                            <div className="space-y-3">
                                                {state.ministries.map((m, idx) => {
                                                    const latest = m.financials[0];
                                                    const efficiency = Math.round((latest.spent / latest.allocated) * 100);
                                                    return (
                                                        <Link 
                                                            key={idx} 
                                                            to={`/ministries/state/${state.name.toLowerCase()}/${m.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                            className="block p-4 rounded-xl border bg-background/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all hover:border-blue-200 group"
                                                        >
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div>
                                                                    <p className="font-bold text-sm group-hover:text-blue-600 transition-colors">{m.name}</p>
                                                                    <p className="text-xs text-muted-foreground">{m.commissioner.name}</p>
                                                                </div>
                                                                <Badge variant={efficiency > 80 ? "outline" : "destructive"} className="text-[10px]">
                                                                    {efficiency}% Efficiency
                                                                </Badge>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
                                                                <div className="flex justify-between">
                                                                    <span className="text-muted-foreground">Budget:</span>
                                                                    <span className="font-bold">{formatBudget(latest.allocated)}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-muted-foreground">Spent:</span>
                                                                    <span className="font-bold text-green-600">{formatBudget(latest.spent)}</span>
                                                                </div>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={cn(
                                                                        "h-full transition-all duration-1000",
                                                                        efficiency > 80 ? "bg-green-500" : efficiency > 60 ? "bg-orange-500" : "bg-red-500"
                                                                    )}
                                                                    style={{ width: `${efficiency}%` }}
                                                                />
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="lga" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredLGAs.map((lga, index) => (
                                <Card key={index} className="overflow-hidden border-t-4 border-t-indigo-600">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-2xl mb-1">{lga.name} LGA</CardTitle>
                                                <CardDescription className="flex items-center gap-1 font-medium text-indigo-600">
                                                    <MapPin className="h-3 w-3" /> {lga.state} State
                                                </CardDescription>
                                            </div>
                                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                                                <Users className="h-5 w-5 text-indigo-600" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center gap-4 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                                            <div className="h-10 w-10 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center font-bold text-indigo-700">
                                                {lga.chairman.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{lga.chairman}</p>
                                                <p className="text-xs text-muted-foreground">LGA Chairman</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">LGA Departments</h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                {lga.departments.map((dept, idx) => {
                                                    const latest = dept.financials[0];
                                                    return (
                                                        <Link 
                                                            key={idx} 
                                                            to={`/ministries/lga/${lga.name.toLowerCase().replace(/\s+/g, '-')}/${dept.name.toLowerCase()}`}
                                                            className="block p-3 rounded-lg border bg-background/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all hover:border-indigo-200 group"
                                                        >
                                                            <div className="flex justify-between items-center mb-2">
                                                                <p className="font-bold text-sm group-hover:text-indigo-600 transition-colors">{dept.name}</p>
                                                                <p className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-medium">HOD: {dept.hod}</p>
                                                            </div>
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span className="text-muted-foreground">Budget: {formatBudget(latest.allocated)}</span>
                                                                <span className="text-green-600 font-bold">Spent: {formatBudget(latest.spent)}</span>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full text-xs h-9 border-dashed">
                                            Report Local Project Mismanagement
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-16 bg-primary/5 rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl font-bold mb-4">Want to partner with us?</h2>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                        We are always looking to expand our network of government partners to drive greater impact.
                    </p>
                    <Link to="/contact">
                        <Button size="lg" className="rounded-full">
                            Contact Us
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Ministries;
