import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    ShieldCheck, 
    Droplets, 
    HeartPulse, 
    ArrowRight,
    Scale,
    Gavel,
    Search,
    Globe,
    Users,
    Loader2
} from "lucide-react";
import { GlassPanel } from "@/components/GlassPanel";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const policies = [
    {
        id: "drainage",
        title: "Clean Drainage & No-Plastic Policy",
        category: "Environment",
        icon: Droplets,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        constitution: "Section 20: The State shall protect and improve the environment and safeguard the water, air and land.",
        description: "Enforcing strict penalties for plastic littering and mandatory monthly drainage clearing across all 774 LGAs.",
        impact: "Reduces flash flooding by 70% and eradicates breeding grounds for malaria-carrying mosquitoes."
    },
    {
        id: "police",
        title: "The 'New Face' Police Reform",
        category: "Security",
        icon: ShieldCheck,
        color: "text-green-600",
        bg: "bg-green-50 dark:bg-green-900/20",
        constitution: "Section 14(2)(b): The security and welfare of the people shall be the primary purpose of government.",
        description: "Reforming the police with competitive pay, mandatory human rights training, and digital body-cam oversight.",
        impact: "Restores trust between citizens and law enforcement; reduces extra-judicial misconduct."
    },
    {
        id: "corruption",
        title: "EFCC 2.0: Anti-Corruption Killer",
        category: "Governance",
        icon: Scale,
        color: "text-red-600",
        bg: "bg-red-50 dark:bg-red-900/20",
        constitution: "Section 15(5): The State shall abolish all corrupt practices and abuse of power.",
        description: "Fully independent financial monitoring with blockchain-tracked federal allocations and automated audit triggers.",
        impact: "Ensures billions of Naira reach intended community projects instead of private pockets."
    },
    {
        id: "welfare",
        title: "Basic Life & Welfare Shield",
        category: "Welfare",
        icon: HeartPulse,
        color: "text-rose-500",
        bg: "bg-rose-50 dark:bg-rose-900/20",
        constitution: "Section 17: Social order is founded on ideals of Freedom, Equality and Justice.",
        description: "Universal basic healthcare access and structured support to reduce homelessness and street begging in urban centers.",
        impact: "Ensures dignity for the most vulnerable; improves national health index and air quality."
    }
];

const Policies = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [skillArea, setSkillArea] = useState("");
    const [hours, setHours] = useState("5");

    const handleVolunteerClick = (policy: any) => {
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "Please sign in to volunteer for policy campaigns.",
                variant: "destructive",
            });
            navigate("/signin");
            return;
        }
        setSelectedPolicy(policy);
        setIsVolunteerModalOpen(true);
    };

    const submitVolunteer = async () => {
        if (!skillArea) {
            toast({
                title: "Skill Area Required",
                description: "Please select your primary skill area.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('policy_volunteers')
                .insert({
                    user_id: user?.id,
                    policy_id: selectedPolicy.id,
                    skill_area: skillArea,
                    committed_hours: parseInt(hours)
                });

            if (error) {
                if (error.code === '23505') {
                    toast({
                        title: "Already Volunteered",
                        description: `You are already a volunteer for the ${selectedPolicy.title}.`,
                    });
                } else {
                    throw error;
                }
            } else {
                toast({
                    title: "Volunteer Successful!",
                    description: `Thank you for joining the ${selectedPolicy.title} campaign!`,
                });
            }
            setIsVolunteerModalOpen(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to submit volunteer form.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 md:pt-40 pb-12 bg-slate-50 dark:bg-slate-950">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-primary/10 text-primary mb-2">
                        <Gavel className="w-4 h-4 mr-2" />
                        Constitutional Advocacy
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl">
                        The People's <span className="text-green-600">Policy Forum</span>
                    </h1>
                    <p className="text-muted-foreground text-xl max-w-[800px]">
                        We don't just complain; we demand reform backed by the Supreme Law of the land. 
                        Join the campaigns that matter to you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    {policies.map((policy, index) => (
                        <GlassPanel key={index} className="overflow-hidden flex flex-col border-t-4 border-t-primary/20">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={cn("p-4 rounded-2xl shadow-inner", policy.bg)}>
                                        <policy.icon className={cn("h-8 w-8", policy.color)} />
                                    </div>
                                    <Badge variant="outline" className="text-xs font-bold uppercase tracking-widest px-3 py-1">
                                        {policy.category}
                                    </Badge>
                                </div>
                                <CardTitle className="text-2xl font-bold mb-2">{policy.title}</CardTitle>
                                <div className="p-3 bg-muted/50 rounded-lg text-sm border-l-4 border-l-primary font-medium italic">
                                    "{policy.constitution}"
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <p className="text-muted-foreground leading-relaxed">
                                    {policy.description}
                                </p>
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                    <p className="text-xs font-bold uppercase text-primary mb-1">Expected Impact</p>
                                    <p className="text-sm font-medium">{policy.impact}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-6 border-t flex gap-4">
                                <Button 
                                    className="flex-1 gap-2 font-bold" 
                                    variant="shine"
                                    onClick={() => handleVolunteerClick(policy)}
                                >
                                    Volunteer Now <ShieldCheck className="h-4 w-4" />
                                </Button>
                                <Link to={`/policies/discussion/${policy.id}`} className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        View Discussion
                                    </Button>
                                </Link>
                            </CardFooter>
                        </GlassPanel>
                    ))}
                </div>

                {/* Volunteer Dialog */}
                <Dialog open={isVolunteerModalOpen} onOpenChange={setIsVolunteerModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Volunteer for Reform</DialogTitle>
                            <DialogDescription>
                                Join the <strong>{selectedPolicy?.title}</strong>. Your skills can help drive real change.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="skill">Your Primary Skill Area</Label>
                                <Select onValueChange={setSkillArea}>
                                    <SelectTrigger id="skill">
                                        <SelectValue placeholder="Select a skill area" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="legal">Legal Advocacy</SelectItem>
                                        <SelectItem value="research">Field Research</SelectItem>
                                        <SelectItem value="media">Media & Communications</SelectItem>
                                        <SelectItem value="organizing">Community Organizing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hours">Weekly Commitment (Hours)</Label>
                                <Input 
                                    id="hours" 
                                    type="number" 
                                    min="1" 
                                    max="40" 
                                    value={hours}
                                    onChange={(e) => setHours(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsVolunteerModalOpen(false)}>Cancel</Button>
                            <Button 
                                onClick={submitVolunteer} 
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Volunteer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="mb-24">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Policy Volunteers</h2>
                            <p className="text-muted-foreground">The hands and feet of our reform movement.</p>
                        </div>
                        <Badge className="bg-green-600 text-lg px-4 py-1">12,450 Total Volunteers</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Legal Advocates", count: "1,204", icon: Scale },
                            { label: "Field Researchers", count: "3,560", icon: Search },
                            { label: "Media Strategists", count: "2,100", icon: Globe },
                            { label: "Community Organizers", count: "5,586", icon: Users }
                        ].map((stat, i) => (
                            <Card key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
                                <CardContent className="p-6 text-center">
                                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                        <stat.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <p className="text-3xl font-bold mb-1">{stat.count}</p>
                                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 text-white rounded-3xl p-12 relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl font-bold mb-6">Charge the Government</h2>
                        <p className="text-slate-300 text-lg mb-8">
                            Are you witnessing a direct violation of constitutional duties in your area? 
                            Document the wrongdoing, and our system will help you draft a formal legal notice 
                            based on Section 46 of the Constitution.
                        </p>
                        <Button size="lg" variant="destructive" className="h-14 px-8 text-lg font-bold">
                            File Misconduct Report
                        </Button>
                    </div>
                    {/* Abstract background element */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-500/20 to-transparent skew-x-12 translate-x-1/4" />
                </div>
            </div>
        </div>
    );
};

export default Policies;
