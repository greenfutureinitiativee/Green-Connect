import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, BarChart3, Users, Leaf, Globe } from "lucide-react";
import { FloatingCard } from "@/components/FloatingCard";
import { GlassPanel } from "@/components/GlassPanel";

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-background pt-20 md:pt-0">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-green-300/20 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float-delayed" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-green-200/30 to-emerald-200/30 rounded-full blur-3xl dark:from-green-900/20 dark:to-emerald-900/20" />
                </div>

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
                        <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Now covering all 774 LGAs
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            Empowering Citizens, <br />
                            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-400">
                                Building Sustainable Communities
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-[48rem] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            Report environmental issues, track local government spending, and connect with your community to build a greener Nigeria.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <Link to="/report">
                                <Button size="lg" variant="shine" className="w-full sm:w-auto gap-2 text-lg h-14 px-8 rounded-full shadow-lg shadow-green-500/20">
                                    Report an Issue <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/explore">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-2 hover:bg-accent/50 backdrop-blur-sm">
                                    Explore LGAs
                                </Button>
                            </Link>
                        </div>

                        {/* 3D Floating Elements */}
                        <div className="relative w-full h-64 md:h-80 mt-12 perspective-1000 hidden md:block animate-in fade-in zoom-in duration-1000 delay-500">
                            <GlassPanel className="absolute left-1/2 top-0 -translate-x-1/2 w-64 h-40 flex flex-col items-center justify-center gap-2 rotate-x-12 hover:rotate-x-0 transition-transform duration-500 z-20 shadow-2xl border-white/40">
                                <Leaf className="w-12 h-12 text-green-500" />
                                <div className="font-bold text-lg">Eco-Friendly</div>
                                <div className="text-xs text-muted-foreground">Sustainable Solutions</div>
                            </GlassPanel>

                            <GlassPanel className="absolute left-[20%] top-10 w-56 h-36 flex flex-col items-center justify-center gap-2 -rotate-z-6 hover:rotate-z-0 transition-transform duration-500 z-10 bg-white/60 dark:bg-black/60">
                                <MapPin className="w-10 h-10 text-blue-500" />
                                <div className="font-bold">Local Impact</div>
                            </GlassPanel>

                            <GlassPanel className="absolute right-[20%] top-10 w-56 h-36 flex flex-col items-center justify-center gap-2 rotate-z-6 hover:rotate-z-0 transition-transform duration-500 z-10 bg-white/60 dark:bg-black/60">
                                <Globe className="w-10 h-10 text-orange-500" />
                                <div className="font-bold">Nationwide</div>
                            </GlassPanel>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

                <div className="container px-4 md:px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Green Future Connect?</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            We provide the tools you need to make a real difference in your community through technology and transparency.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FloatingCard className="p-8 flex flex-col items-center text-center h-full bg-background/80 backdrop-blur-sm">
                            <div className="h-16 w-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mb-6 dark:bg-green-900/30 dark:text-green-400 shadow-inner">
                                <MapPin className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Report Issues</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Spot an environmental hazard? Snap a photo, tag the location, and report it directly to your LGA with our intuitive reporting tool.
                            </p>
                        </FloatingCard>

                        <FloatingCard className="p-8 flex flex-col items-center text-center h-full bg-background/80 backdrop-blur-sm" depth="high">
                            <div className="h-16 w-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 dark:bg-blue-900/30 dark:text-blue-400 shadow-inner">
                                <BarChart3 className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Track Progress</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Monitor local government spending, project status, and employment statistics in your area with real-time data visualization.
                            </p>
                        </FloatingCard>

                        <FloatingCard className="p-8 flex flex-col items-center text-center h-full bg-background/80 backdrop-blur-sm">
                            <div className="h-16 w-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 dark:bg-orange-900/30 dark:text-orange-400 shadow-inner">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Community Action</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Join volunteer groups, participate in clean-up drives, and donate plastic waste for recycling to earn rewards.
                            </p>
                        </FloatingCard>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
