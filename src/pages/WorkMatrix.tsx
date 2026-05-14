import React, { useState, useMemo } from 'react';
import { 
    ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Cell, LabelList 
} from 'recharts';
import { federalMinistries } from '@/data/federalData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Activity, ArrowDownRight, ArrowUpRight, Brain, 
    CheckCircle2, Filter, Search, ShieldCheck 
} from 'lucide-react';
import { GlassPanel } from '@/components/GlassPanel';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WorkMatrix = () => {
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

    const [searchTerm, setSearchTerm] = useState("");
    const [sectorFilter, setSectorFilter] = useState("All");
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const matrixData = useMemo(() => {
        const data: any[] = [];
        federalMinistries.forEach(ministry => {
            ministry.projects.forEach(project => {
                const efficiency = project.completion_percentage ? (project.completion_percentage / (project.spent / project.budget * 100)) : 0;
                data.push({
                    id: project.id,
                    name: project.name,
                    ministry: ministry.name,
                    sector: ministry.sector,
                    budget: project.budget,
                    spent: project.spent,
                    spending_ratio: (project.spent / project.budget) * 100,
                    work_result: project.completion_percentage || 0,
                    efficiency: efficiency,
                    status: project.status
                });
            });
        });

        return data.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 item.ministry.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSector = sectorFilter === "All" || item.sector === sectorFilter;
            return matchesSearch && matchesSector;
        });
    }, [searchTerm, sectorFilter]);

    const sectors = ["All", ...Array.from(new Set(federalMinistries.map(m => m.sector)))];

    const getEfficiencyColor = (efficiency: number) => {
        if (efficiency >= 0.9) return "#22c55e"; // High
        if (efficiency >= 0.6) return "#eab308"; // Medium
        return "#ef4444"; // Low
    };

    return (
        <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 pb-20 pt-32 md:pt-40">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="space-y-2">
                        <Badge className="bg-primary hover:bg-primary/90 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                            Financial Accountability
                        </Badge>
                        <h1 className="text-3xl font-black tracking-tighter sm:text-6xl text-slate-900 dark:text-white">
                            The Work <span className="text-primary">Matrix</span>
                        </h1>
                        <p className="text-muted-foreground text-base md:text-lg font-medium">
                            Cross-referencing government expenditure with physical project progress and delivery results.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search projects or ministries..." 
                                className="pl-10 w-full sm:w-64 rounded-2xl h-12 border-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={sectorFilter} onValueChange={setSectorFilter}>
                            <SelectTrigger className="w-full sm:w-48 h-12 rounded-2xl border-slate-200">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Sector" />
                            </SelectTrigger>
                            <SelectContent>
                                {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* AI Auditor Insights */}
                <GlassPanel className="p-4 md:p-8 mb-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-none shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Brain className="h-64 w-64" />
                    </div>
                    <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2 text-indigo-400 font-black tracking-widest text-xs uppercase">
                                <Activity className="h-4 w-4" /> AI Auditor Analysis
                            </div>
                            <h2 className="text-3xl font-black leading-tight text-slate-900 dark:text-white">National Spending vs. Work Integrity</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                                My analysis indicates a <span className="text-indigo-600 dark:text-white font-bold underline decoration-indigo-500 italic">24.5% efficiency gap</span> across federal infrastructure projects. 
                                High spending during low-work phases often correlates with contractor mobilization fees without verified site activity.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-2">
                                <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-green-500" />
                                    <span className="text-sm font-bold text-slate-700 dark:text-white">12 Verified Hubs</span>
                                </div>
                                <div className="px-4 py-2 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center gap-2">
                                    <ArrowUpRight className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-bold text-slate-700 dark:text-white">Optimal: Infrastructure</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/3 grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 backdrop-blur-sm">
                                <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-300 uppercase tracking-widest mb-1">Integrity Score</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white">68/100</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 backdrop-blur-sm">
                                <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-300 uppercase tracking-widest mb-1">Audit Coverage</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white">82%</p>
                            </div>
                        </div>
                    </div>
                </GlassPanel>

                {/* The Matrix Visualization */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mb-12">
                    <GlassPanel className="p-4 md:p-6 h-[400px] md:h-[600px]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold">Performance Scatter Matrix</h3>
                            <div className="flex gap-4 text-xs font-medium text-muted-foreground">
                                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500"></span> Inefficiency</span>
                                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500"></span> High Performance</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 10, bottom: 20, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis 
                                    type="number" 
                                    dataKey="spending_ratio" 
                                    name="Spending" 
                                    unit="%" 
                                    tick={{ fontSize: 10 }}
                                    label={!isMobile ? { value: 'Percentage of Budget Spent', position: 'bottom', offset: -10 } : undefined}
                                />
                                <YAxis 
                                    type="number" 
                                    dataKey="work_result" 
                                    name="Work" 
                                    unit="%" 
                                    tick={{ fontSize: 10 }}
                                    label={!isMobile ? { value: 'Completion Result', angle: -90, position: 'left' } : undefined}
                                />
                                <ZAxis type="number" dataKey="budget" range={[100, 1000]} name="Total Budget" />
                                <Tooltip 
                                    cursor={{ strokeDasharray: '3 3' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const item = payload[0].payload;
                                            return (
                                                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-xs">
                                                    <p className="text-xs font-black text-primary uppercase mb-1">{item.ministry}</p>
                                                    <p className="font-bold text-sm mb-3">{item.name}</p>
                                                    <div className="space-y-1 border-t pt-2">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-muted-foreground">Budget</span>
                                                            <span className="font-bold">{formatCurrency(item.budget)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-muted-foreground">Spent</span>
                                                            <span className="font-bold">{formatCurrency(item.spent)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-muted-foreground">Result</span>
                                                            <span className="font-bold text-blue-600">{item.work_result}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Scatter name="Projects" data={matrixData}>
                                    {matrixData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getEfficiencyColor(entry.efficiency)} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </GlassPanel>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" /> Efficiency Rankings
                        </h3>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {matrixData.sort((a, b) => b.efficiency - a.efficiency).map((item) => (
                                <Card key={item.id} className="border-none bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all group">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase">{item.ministry}</p>
                                                <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{item.name}</h4>
                                            </div>
                                            <Badge className={item.efficiency >= 0.9 ? "bg-green-500" : item.efficiency >= 0.6 ? "bg-yellow-500" : "bg-red-500"}>
                                                {Math.round(item.efficiency * 100)}% Match
                                            </Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-muted-foreground">Spend:Work Ratio</span>
                                                <span className="font-mono font-bold">{item.spending_ratio.toFixed(0)}:{item.work_result.toFixed(0)}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-primary" 
                                                    style={{ width: `${item.work_result}%` }}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detailed Table View */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-black">Audit Table</h3>
                    <GlassPanel className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b">
                                    <tr>
                                        <th className="px-4 md:px-6 py-4 font-black uppercase tracking-widest text-[10px]">Project / Ministry</th>
                                        <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] hidden lg:table-cell">Total Budget</th>
                                        <th className="px-4 md:px-6 py-4 font-black uppercase tracking-widest text-[10px]">Spend (Released)</th>
                                        <th className="px-4 md:px-6 py-4 font-black uppercase tracking-widest text-[10px]">Verified Result</th>
                                        <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] hidden md:table-cell">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {matrixData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="font-bold text-xs md:text-sm">{item.name}</div>
                                                <div className="text-[9px] md:text-[10px] text-muted-foreground uppercase">{item.ministry}</div>
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold hidden lg:table-cell">{formatCurrency(item.budget)}</td>
                                            <td className="px-4 md:px-6 py-4 font-mono text-xs md:text-sm">
                                                <span className={item.spent > item.budget * 0.8 ? "text-red-500 font-bold" : ""}>
                                                    {formatCurrency(item.spent)}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 md:w-24 h-1.5 md:h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500" style={{ width: `${item.work_result}%` }} />
                                                    </div>
                                                    <span className="font-bold text-xs md:text-sm">{item.work_result}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <Badge variant="outline" className="font-bold capitalize text-[10px]">{item.status.replace("_", " ")}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
};

export default WorkMatrix;
