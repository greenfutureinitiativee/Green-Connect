import { useState, useEffect } from 'react';
import { LGAService } from '@/services/lga-service';
import type { LGA, LGAFinancialSummary } from '@/types/lga';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const LGADashboard = () => {
    const [states, setStates] = useState<string[]>([]);
    const [selectedState, setSelectedState] = useState<string>('');
    const [lgas, setLgas] = useState<LGA[]>([]);
    const [selectedLgaId, setSelectedLgaId] = useState<string>('');
    const [summary, setSummary] = useState<LGAFinancialSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingLgas, setLoadingLgas] = useState(false);

    // Fetch States on Mount
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const data = await LGAService.getStates();
                setStates(data);
            } catch (error) {
                console.error('Failed to fetch states', error);
            }
        };
        fetchStates();
    }, []);

    // Fetch LGAs when State changes
    useEffect(() => {
        if (!selectedState) return;
        const fetchLgas = async () => {
            setLoadingLgas(true);
            try {
                const data = await LGAService.getAllLGAs({ state: selectedState });
                setLgas(data);
            } catch (error) {
                console.error('Failed to fetch LGAs', error);
            } finally {
                setLoadingLgas(false);
            }
        };
        fetchLgas();
    }, [selectedState]);

    // Fetch Summary when LGA changes
    useEffect(() => {
        if (!selectedLgaId) return;
        const fetchSummary = async () => {
            setLoading(true);
            try {
                const data = await LGAService.getFinancialSummary(selectedLgaId);
                setSummary(data);
            } catch (error) {
                console.error('Failed to fetch summary', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [selectedLgaId]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    };

    // Prepare chart data
    const chartData = summary?.allocations.map(a => ({
        period: new Date(a.period).toLocaleDateString('en-NG', { month: 'short', year: '2-digit' }),
        allocation: a.amount,
        spending: 0 // Placeholder until we match spending dates
    })).reverse() || [];

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">LGA Financial Dashboard</h1>
                    <p className="text-muted-foreground">Monitor allocations, spending, and projects across Nigeria.</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <Select onValueChange={setSelectedState} value={selectedState}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                            {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={setSelectedLgaId} value={selectedLgaId} disabled={!selectedState || loadingLgas}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder={loadingLgas ? "Loading..." : "Select LGA"} />
                        </SelectTrigger>
                        <SelectContent>
                            {lgas.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {!selectedLgaId && (
                <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg bg-muted/50">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">Select a State and LGA to view data</p>
                </div>
            )}

            {loading && (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            {summary && !loading && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Allocations (Last 12 Mo)</CardTitle>
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(summary.allocations.reduce((sum, a) => sum + a.amount, 0))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    From FAAC & State Sources
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Spending (Recorded)</CardTitle>
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(summary.spendings.reduce((sum, s) => sum + s.amount, 0))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Based on available treasury data
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tracked Projects</CardTitle>
                                <AlertCircle className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.projects.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    Ongoing & Completed
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Allocation Trends</CardTitle>
                                <CardDescription>Monthly FAAC allocations over time</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                            <XAxis dataKey="period" className="text-xs" />
                                            <YAxis className="text-xs" tickFormatter={(value) => `₦${(value / 1000000).toFixed(0)}M`} />
                                            <Tooltip
                                                formatter={(value: number) => formatCurrency(value)}
                                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                            />
                                            <Legend />
                                            <Bar dataKey="allocation" fill="hsl(var(--primary))" name="Allocation" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Allocations Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Allocations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Period</TableHead>
                                        <TableHead>Source</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {summary.allocations.slice(0, 5).map((allocation) => (
                                        <TableRow key={allocation.id}>
                                            <TableCell>{new Date(allocation.period).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}</TableCell>
                                            <TableCell>FAAC / State</TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(allocation.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default LGADashboard;
