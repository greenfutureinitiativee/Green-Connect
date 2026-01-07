import { useState, useEffect } from "react";
import { LGAService } from "@/services/lga-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { GovernanceStructure, ExecutiveRole, LGA } from "@/types/lga";
import React from 'react';

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("LGAGovernanceForm Component Crashed:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 dark:bg-red-900/10 border border-red-200 rounded-lg">
                    <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">Something went wrong.</h2>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-4">{this.state.error?.message}</p>
                    <Button onClick={() => this.setState({ hasError: false })} variant="outline">Try Again</Button>
                </div>
            );
        }
        return this.props.children;
    }
}

const LGAGovernanceForm = () => {
    const [states, setStates] = useState<string[]>([]);
    const [selectedState, setSelectedState] = useState<string>('');
    const [lgas, setLgas] = useState<LGA[]>([]);
    const [selectedLgaId, setSelectedLgaId] = useState<string>('');
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingLgas, setLoadingLgas] = useState(false);
    const [, setLoadingData] = useState(false);
    const [saving, setSaving] = useState(false);

    // Initial empty governance structure
    const emptyGovernance: GovernanceStructure = {
        executive: {
            chairman: { name: '', party: '', title: 'Executive Chairman' },
            vice_chairman: { name: '', party: '', title: 'Vice Chairman' },
            secretary: { name: '', title: 'SLG' },
            supervisors: []
        },
        legislative: {
            council_leader: { name: '', ward: '' },
            councillors: []
        },
        traditional: [],
        parties: []
    };

    const [governance, setGovernance] = useState<GovernanceStructure>(emptyGovernance);

    // Fetch States
    useEffect(() => {
        const fetchStates = async () => {
            setLoadingStates(true);
            try {
                const data = await LGAService.getStates();
                setStates(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load states");
            } finally {
                setLoadingStates(false);
            }
        };
        fetchStates();
    }, []);

    // Fetch LGAs
    useEffect(() => {
        if (!selectedState) return;
        const fetchLgas = async () => {
            setLoadingLgas(true);
            try {
                const data = await LGAService.getAllLGAs({ state: selectedState });
                setLgas(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load LGAs");
            } finally {
                setLoadingLgas(false);
            }
        };
        fetchLgas();
    }, [selectedState]);

    // Fetch Governance Data
    useEffect(() => {
        if (!selectedLgaId) {
            setGovernance(emptyGovernance);
            return;
        }
        const fetchData = async () => {
            setLoadingData(true);
            try {
                // Find name from ID
                const lga = lgas.find(l => l.id === selectedLgaId);
                if (lga) {
                    const details = await LGAService.getLGADetails(lga.name, selectedState);
                    if (details && details.governance) {
                        const g = details.governance;

                        // Deep Sanitization
                        const sanitized: GovernanceStructure = {
                            executive: {
                                chairman: {
                                    name: g.executive?.chairman?.name || '',
                                    party: g.executive?.chairman?.party || '',
                                    title: g.executive?.chairman?.title || 'Executive Chairman'
                                },
                                vice_chairman: {
                                    name: g.executive?.vice_chairman?.name || '',
                                    party: g.executive?.vice_chairman?.party || '',
                                    title: g.executive?.vice_chairman?.title || 'Vice Chairman'
                                },
                                secretary: {
                                    name: g.executive?.secretary?.name || '',
                                    title: g.executive?.secretary?.title || 'SLG'
                                },
                                supervisors: Array.isArray(g.executive?.supervisors) ? g.executive.supervisors : []
                            },
                            legislative: {
                                // Handle council_leader as object or string (normalize to object)
                                council_leader: typeof g.legislative?.council_leader === 'string'
                                    ? { name: g.legislative.council_leader, ward: '' }
                                    : (g.legislative?.council_leader || { name: '', ward: '' }),
                                councillors: Array.isArray(g.legislative?.councillors) ? g.legislative.councillors : []
                            },
                            traditional: Array.isArray(g.traditional) ? g.traditional : [],
                            parties: Array.isArray(g.parties) ? g.parties : [],
                            cdas: Array.isArray(g.cdas) ? g.cdas : [],
                            oversight: g.oversight
                        };
                        setGovernance(sanitized);
                    } else {
                        setGovernance(emptyGovernance);
                        toast.info("No existing governance data found", { description: "Starting fresh." });
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load governance data");
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, [selectedLgaId]);

    const handleSave = async () => {
        if (!selectedLgaId) return;
        setSaving(true);
        try {
            await LGAService.updateLGAGovernance(selectedLgaId, governance);
            toast.success("Governance data updated successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save data");
        } finally {
            setSaving(false);
        }
    };

    const updateExecutive = (field: keyof ExecutiveRole, value: any) => {
        setGovernance(prev => ({
            ...prev,
            executive: { ...prev.executive, [field]: value }
        }));
    };

    /*
    const updateLegislative = (field: keyof LegislativeRole, value: any) => {
        setGovernance(prev => ({
            ...prev,
            legislative: { ...prev.legislative, [field]: value }
        }));
    };
    */

    return (
        <ErrorBoundary>
            <div className="container py-8 max-w-5xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">LGA Governance Manager</h1>
                        <p className="text-muted-foreground">Update officials and administrative structure</p>
                    </div>
                    <Button onClick={handleSave} disabled={saving || !selectedLgaId}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Select LGA</CardTitle>
                        <CardDescription>Choose the Local Govt Area to manage</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <div className="w-1/3">
                            <Label>State</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                disabled={loadingStates}
                            >
                                <option value="">Select State</option>
                                {states.map(state => <option key={state} value={state}>{state}</option>)}
                            </select>
                        </div>
                        <div className="w-1/3">
                            <Label>LGA</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={selectedLgaId}
                                onChange={(e) => setSelectedLgaId(e.target.value)}
                                disabled={!selectedState || loadingLgas}
                            >
                                <option value="">Select LGA</option>
                                {lgas.map(lga => <option key={lga.id} value={lga.id}>{lga.name}</option>)}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {selectedLgaId && (
                    <Tabs defaultValue="executive" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="executive">Executive</TabsTrigger>
                            <TabsTrigger value="legislative">Legislative</TabsTrigger>
                            <TabsTrigger value="traditional">Traditional</TabsTrigger>
                            <TabsTrigger value="parties">Parties</TabsTrigger>
                        </TabsList>

                        <TabsContent value="executive">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Executive Council</CardTitle>
                                    <CardDescription>Chairman, Vice Chairman, and Supervisors</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Chairman Name</Label>
                                            <Input
                                                value={governance.executive.chairman.name || ''}
                                                onChange={(e) => updateExecutive('chairman', { ...governance.executive.chairman, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Party</Label>
                                            <Input
                                                value={governance.executive.chairman.party || ''}
                                                onChange={(e) => updateExecutive('chairman', { ...governance.executive.chairman, party: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Vice Chairman Name</Label>
                                            <Input
                                                value={governance.executive.vice_chairman.name || ''}
                                                onChange={(e) => updateExecutive('vice_chairman', { ...governance.executive.vice_chairman, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Secretary (SLG)</Label>
                                            <Input
                                                value={governance.executive.secretary.name || ''}
                                                onChange={(e) => updateExecutive('secretary', { ...governance.executive.secretary, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="legislative">
                            <div className="p-4">Legislative Content Placeholder</div>
                        </TabsContent>
                        <TabsContent value="traditional">
                            <div className="p-4">Traditional Content Placeholder</div>
                        </TabsContent>
                        <TabsContent value="parties">
                            <div className="p-4">Parties Content Placeholder</div>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default LGAGovernanceForm;
