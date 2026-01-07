import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";
import {
    Building2, Users, FileBarChart, Search, MapPin,
    User, Briefcase, ChevronRight, Globe, ArrowRight
} from "lucide-react";
import { federalMinistries, stateData } from "@/data/federalData";

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
                        placeholder={`Search ${activeTab === 'federal' ? 'ministries, ministers...' : 'states, governors...'} `}
                        className="pl-10 h-11"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Tabs defaultValue="federal" onValueChange={setActiveTab} className="space-y-8">
                    <div className="flex justify-center">
                        <TabsList className="grid w-full max-w-md grid-cols-2 h-11">
                            <TabsTrigger value="federal" className="text-base">Federal Ministries</TabsTrigger>
                            <TabsTrigger value="states" className="text-base">State Budgets</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="federal" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMinistries.map((ministry, index) => (
                                <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-600" />
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                                <Building2 className="h-5 w-5 text-green-700 dark:text-green-400" />
                                            </div>
                                            {ministry.website && (
                                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                    <a href={ministry.website} target="_blank" rel="noopener noreferrer">
                                                        <Globe className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                        <CardTitle className="text-xl mt-2">{ministry.name}</CardTitle>
                                        <CardDescription className="line-clamp-2 min-h-[40px]">
                                            {ministry.mandate}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 bg-muted/20 pt-4 border-t">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
                                                {ministry.minister.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-none mb-1">{ministry.minister.name}</p>
                                                <p className="text-xs text-muted-foreground">{ministry.minister.portfolio}</p>
                                                {ministry.minister.state_of_origin && (
                                                    <Badge variant="outline" className="mt-1 text-[10px] h-5 px-1.5">
                                                        {ministry.minister.state_of_origin} State
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        {ministry.minister_of_state && (
                                            <div className="flex items-center gap-3 pl-4 border-l-2 ml-4">
                                                <div>
                                                    <p className="text-sm font-medium leading-none mb-1">{ministry.minister_of_state.name}</p>
                                                    <p className="text-xs text-muted-foreground">{ministry.minister_of_state.portfolio}</p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="states" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredStates.map((state, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-2xl mb-1 flex items-center gap-2">
                                                    {state.name} State
                                                    {state.website && (
                                                        <a href={state.website} target="_blank" className="text-muted-foreground hover:text-primary">
                                                            <Globe className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" /> Capital: {state.capital}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="outline" className="text-lg px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200">
                                                2024 Budget
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-6">
                                        {/* Governor & Budget Overview */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
                                                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                                                    <User className="h-4 w-4" />
                                                    <span className="text-xs font-semibold uppercase tracking-wider">Governor</span>
                                                </div>
                                                <p className="font-bold text-lg leading-tight">{state.governor.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className={state.governor.party === 'APC' ? 'bg-cyan-600' : 'bg-red-600'}>
                                                        {state.governor.party}
                                                    </Badge>
                                                    {state.governor.deputy && (
                                                        <span className="text-xs text-muted-foreground">Dep: {state.governor.deputy.split(' ')[0]}...</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                                                <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
                                                    <FileBarChart className="h-4 w-4" />
                                                    <span className="text-xs font-semibold uppercase tracking-wider">Total Allocation</span>
                                                </div>
                                                {state.budget.length > 0 ? (
                                                    <>
                                                        <p className="font-bold text-xl leading-tight">
                                                            {formatBudget(state.budget[0].total_budget)}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Status: {state.budget[0].status}
                                                        </p>
                                                    </>
                                                ) : <p className="text-sm">Data pending</p>}
                                            </div>
                                        </div>

                                        {/* Budget Breakdown */}
                                        {state.budget.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Capital Expenditure</span>
                                                    <span className="font-semibold">{formatBudget(state.budget[0].capital_expenditure)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Recurrent Expenditure</span>
                                                    <span className="font-semibold">{formatBudget(state.budget[0].recurrent_expenditure)}</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                                    <div
                                                        className="h-full bg-indigo-500"
                                                        style={{ width: `${(state.budget[0].capital_expenditure / state.budget[0].total_budget) * 100}%` }}
                                                    />
                                                    <div className="h-full bg-slate-300" style={{ flex: 1 }} />
                                                </div>
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>Capex ({Math.round((state.budget[0].capital_expenditure / state.budget[0].total_budget) * 100)}%)</span>
                                                    <span>Recurrent</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Commissioners */}
                                        <div>
                                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                                <Briefcase className="h-4 w-4 text-primary" /> Key Commissioners
                                            </h4>
                                            <div className="h-[120px] rounded-md border p-2 bg-background overflow-y-auto">
                                                <div className="space-y-2">
                                                    {state.commissioners.map((comm, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm p-2 rounded hover:bg-muted/50">
                                                            <div>
                                                                <p className="font-medium">{comm.name}</p>
                                                                <p className="text-xs text-muted-foreground">{comm.portfolio}</p>
                                                            </div>
                                                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                                        </div>
                                                    ))}
                                                    {state.commissioners.length === 0 && (
                                                        <p className="text-sm text-center text-muted-foreground py-4">Commissioner list updating...</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
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
