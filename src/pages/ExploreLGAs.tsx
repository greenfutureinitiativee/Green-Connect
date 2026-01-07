import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { FloatingCard } from "@/components/FloatingCard";
import { LGAService } from "@/services/lga-service";
import type { LGA } from "@/types/lga";

const ExploreLGAs = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedState, setSelectedState] = useState<string>("all");
    const [allLGAs, setAllLGAs] = useState<LGA[]>([]);
    const [states, setStates] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Load LGAs and states on mount
    useEffect(() => {
        loadLGAs();
        loadStates();
    }, []);

    const loadLGAs = async () => {
        try {
            setLoading(true);
            const lgas = await LGAService.getAllLGAs();
            setAllLGAs(lgas);
        } catch (error) {
            console.error("Error loading LGAs:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadStates = async () => {
        try {
            const statesList = await LGAService.getStates();
            setStates(statesList);
        } catch (error) {
            console.error("Error loading states:", error);
        }
    };

    // Filter LGAs based on search and state
    const filteredLGAs = useMemo(() => {
        let filtered = allLGAs;

        if (selectedState !== "all") {
            filtered = filtered.filter((lga) => lga.state === selectedState);
        }

        if (searchQuery) {
            filtered = filtered.filter(
                (lga) =>
                    lga.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    lga.state.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    }, [allLGAs, searchQuery, selectedState]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-background">
            <div className="container py-12 px-4 md:px-6">
                {/* Header */}
                <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                        Explore Nigeria's 774 LGAs
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Browse all Local Government Areas across Nigeria's 36 states and FCT to view projects, reports, and statistics.
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-12 flex flex-col md:flex-row gap-4 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by LGA or state name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12 text-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
                        />
                    </div>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                        <SelectTrigger className="w-full md:w-[240px] h-12 text-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                            <SelectValue placeholder="Filter by state" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All States</SelectItem>
                            {states.map((state) => (
                                <SelectItem key={state} value={state}>
                                    {state}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Results Count */}
                <div className="mb-6 text-center animate-in fade-in duration-500 delay-300">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-semibold text-foreground">{filteredLGAs.length}</span> of{" "}
                        <span className="font-semibold text-foreground">{allLGAs.length}</span> LGAs
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-16">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading LGAs...</p>
                        </div>
                    </div>
                )}

                {/* LGA Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredLGAs.map((lga, index) => (
                            <FloatingCard
                                key={`${lga.state}-${lga.name}-${index}`}
                                className="h-full flex flex-col justify-between p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:border-primary/50 transition-colors"
                                depth="low"
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                                            {lga.state}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 line-clamp-1" title={lga.name}>{lga.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        View detailed statistics, projects, and reports for {lga.name}.
                                    </p>
                                </div>
                                <Link to={`/lga/${encodeURIComponent(lga.state)}/${encodeURIComponent(lga.name)}`} className="w-full">
                                    <Button variant="outline" className="w-full group hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                                        View Details
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </FloatingCard>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!loading && filteredLGAs.length === 0 && (
                    <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No LGAs found</h3>
                        <p className="text-muted-foreground mb-6">
                            We couldn't find any LGAs matching "{searchQuery}" in {selectedState === "all" ? "Nigeria" : selectedState}.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedState("all");
                            }}
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExploreLGAs;
