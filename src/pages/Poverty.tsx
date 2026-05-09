import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    LineChart, Line, AreaChart, Area 
} from 'recharts';
import { povertyData, nationalPovertyTrend } from '@/data/povertyData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, Users, Info, ArrowUpRight, Search } from 'lucide-react';
import { GlassPanel } from '@/components/GlassPanel';
import { Input } from '@/components/ui/input';

const Poverty = () => {
    return (
        <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 pb-20 pt-24">
            <div className="container px-4 md:px-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div className="space-y-2">
                        <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 border-red-200 font-bold uppercase tracking-widest text-[10px]">
                            Social Impact Monitor
                        </Badge>
                        <h1 className="text-4xl font-black tracking-tighter sm:text-6xl text-slate-900 dark:text-white">
                            Poverty <span className="text-red-600">Discrepancy</span> Index
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl font-medium">
                            Comparing official government poverty claims against independent research and global standard metrics.
                        </p>
                    </div>
                    <GlassPanel className="p-2 flex gap-2">
                        <Search className="h-4 w-4 text-muted-foreground mt-2 ml-2" />
                        <Input placeholder="Search state or region..." className="border-none bg-transparent shadow-none focus-visible:ring-0 w-64" />
                    </GlassPanel>
                </div>

                {/* Key Insights Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="border-none shadow-xl shadow-red-500/5 bg-gradient-to-br from-white to-red-50/30 dark:from-slate-900 dark:to-red-900/10">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">National Gap</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-red-600">21.0%</span>
                                <Badge variant="secondary" className="bg-red-100 text-red-700"><ArrowUpRight className="h-3 w-3 mr-1" /> Underscored</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">The difference between official figures (46.2%) and research-backed data (67.2%).</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-blue-500/5 bg-white dark:bg-slate-900">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Impacted Population</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-900 dark:text-white">133M+</span>
                                <Users className="h-5 w-5 text-blue-500" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">Nigerians living below the poverty line according to verified multi-dimensional poverty metrics.</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-indigo-500/5 bg-slate-900 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-indigo-400">Inflation Adjusted</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-indigo-400">7.2%</span>
                                <TrendingUp className="h-5 w-5 text-indigo-400" />
                            </div>
                            <p className="text-xs text-slate-400 mt-2 font-medium">Annualized increase in poverty due to current food and fuel inflation rates.</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Region Comparison */}
                    <GlassPanel className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Regional Discrepancy</h3>
                            <Badge variant="outline">By Geo-Political Zone</Badge>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={povertyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} unit="%" />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="official_claim" name="Official Claim" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="verified_data" name="Verified Data" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassPanel>

                    {/* Historical Trend */}
                    <GlassPanel className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Poverty Trend (2018-2024)</h3>
                            <Badge variant="outline">Multi-year View</Badge>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={nationalPovertyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorOfficial" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} unit="%" />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Area type="monotone" dataKey="official" name="Official" stroke="#94a3b8" fillOpacity={1} fill="url(#colorOfficial)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="verified" name="Verified" stroke="#ef4444" fillOpacity={1} fill="url(#colorVerified)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassPanel>
                </div>

                {/* Data Table / Detailed List */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-black">Detailed Regional Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {povertyData.map((stat) => (
                            <Card key={stat.region} className="group hover:shadow-2xl transition-all border-slate-100 dark:border-slate-800">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg font-black">{stat.region}</CardTitle>
                                        <Badge className="bg-red-50 text-red-600 border-red-100">
                                            +{stat.verified_data - stat.official_claim}% Gap
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Pop. Count</p>
                                            <p className="text-lg font-black">{stat.population_count}M</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
                                            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Verified %</p>
                                            <p className="text-lg font-black text-red-700 dark:text-red-400">{stat.verified_data}%</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-muted-foreground">Unemployment Rate</span>
                                            <span className="font-bold">{stat.unemployment_rate}%</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-muted-foreground">Inflation Impact Score</span>
                                            <span className="font-bold text-red-600">{stat.inflation_impact}/10</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Info Alert */}
                <div className="mt-12 p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-4">
                    <Info className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-blue-900 dark:text-blue-300">Methodology Note</h4>
                        <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                            Official figures are sourced from national statistical reports. Verified data is compiled from multi-dimensional poverty indices, World Bank estimates, and independent economic research papers focusing on Nigeria's informal economy and rural vulnerability.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Poverty;
