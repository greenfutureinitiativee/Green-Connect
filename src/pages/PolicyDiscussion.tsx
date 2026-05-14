import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    MessageSquare, 
    ArrowLeft, 
    ThumbsUp, 
    Reply, 
    MoreHorizontal,
    Share2,
    Users,
    TrendingUp,
    Gavel,
    ShieldCheck
} from "lucide-react";
import { GlassPanel } from "@/components/GlassPanel";
import { cn } from "@/lib/utils";

const mockPolicies = {
    drainage: {
        title: "Clean Drainage & No-Plastic Policy",
        constitution: "Section 20",
        volunteers: 4520
    },
    police: {
        title: "The 'New Face' Police Reform",
        constitution: "Section 14(2)(b)",
        volunteers: 3100
    },
    corruption: {
        title: "EFCC 2.0: Anti-Corruption Killer",
        constitution: "Section 15(5)",
        volunteers: 2840
    },
    welfare: {
        title: "Basic Life & Welfare Shield",
        constitution: "Section 17",
        volunteers: 1990
    }
};

const mockComments = [
    {
        id: 1,
        user: "Amaka O.",
        role: "Legal Volunteer",
        content: "This policy needs to specify the exact percentage of the budget that will go towards drainage maintenance. Without a clear number, LGAs can easily divert funds.",
        upvotes: 245,
        time: "2h ago",
        replies: [
            {
                id: 11,
                user: "Tunde K.",
                content: "Agreed. In Lagos alone, we saw huge allocations last year but zero work on the primary channels.",
                upvotes: 82,
                time: "1h ago"
            }
        ]
    },
    {
        id: 2,
        user: "Chidi N.",
        role: "Field Researcher",
        content: "I've mapped 12 blocked channels in Mushin. If we get enough volunteers, we can document the current state before the rainy season fully kicks in.",
        upvotes: 189,
        time: "4h ago",
        replies: []
    },
    {
        id: 3,
        user: "Suleiman B.",
        role: "Citizen",
        content: "What happens if a private company is caught dumping waste? The constitution says the State should protect the environment, but does it allow for corporate prosecution?",
        upvotes: 56,
        time: "5h ago",
        replies: [
            {
                id: 31,
                user: "Legal Team Bot",
                content: "According to current environmental laws linked to Section 20, corporate entities can be fined up to 5M Naira for systemic dumping.",
                upvotes: 120,
                time: "3h ago"
            }
        ]
    }
];

const PolicyDiscussion = () => {
    const { id } = useParams();
    const policy = mockPolicies[id as keyof typeof mockPolicies] || mockPolicies.drainage;
    const [commentInput, setCommentInput] = useState("");

    return (
        <div className="min-h-screen pt-32 md:pt-40 pb-12 bg-slate-50 dark:bg-slate-950">
            <div className="container px-4 md:px-6">
                {/* Header Context */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <Link to="/policies" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Policies
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">{policy.title}</h1>
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                <Gavel className="h-3 w-3 mr-1" /> {policy.constitution}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center">
                                <Users className="h-3 w-3 mr-1" /> {policy.volunteers.toLocaleString()} Participants
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border shadow-sm">
                        <div className="px-3 py-1 text-center border-r">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Live</p>
                            <div className="flex items-center gap-1.5 justify-center">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-bold">142</span>
                            </div>
                        </div>
                        <div className="px-3 py-1 text-center">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Trending</p>
                            <TrendingUp className="h-4 w-4 text-orange-500 mx-auto" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Discussion Thread */}
                    <div className="lg:col-span-2 space-y-6">
                        <GlassPanel className="p-4 mb-8">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                    ME
                                </div>
                                <div className="flex-1 space-y-3">
                                    <Input 
                                        placeholder="Add to the discussion... (Markdown supported)" 
                                        className="bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary h-12"
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                    />
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] text-muted-foreground font-medium">Be respectful and stay grounded in constitutional facts.</p>
                                        <Button size="sm" disabled={!commentInput.trim()}>Post Argument</Button>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>

                        <div className="space-y-6">
                            {mockComments.map((comment) => (
                                <div key={comment.id} className="space-y-4">
                                    <div className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border shadow-sm hover:shadow-md transition-shadow">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 flex-shrink-0">
                                            {comment.user.charAt(0)}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="font-bold text-sm mr-2">{comment.user}</span>
                                                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{comment.role}</Badge>
                                                    <span className="text-[10px] text-muted-foreground ml-2">{comment.time}</span>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                                {comment.content}
                                            </p>
                                            <div className="flex items-center gap-4 pt-2">
                                                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                                                    <ThumbsUp className="h-3.5 w-3.5" /> {comment.upvotes}
                                                </button>
                                                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                                                    <Reply className="h-3.5 w-3.5" /> Reply
                                                </button>
                                                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                                                    <Share2 className="h-3.5 w-3.5" /> Share
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Threaded Replies */}
                                    {comment.replies.map((reply) => (
                                        <div key={reply.id} className="flex gap-4 pl-12">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-xs flex-shrink-0">
                                                {reply.user.charAt(0)}
                                            </div>
                                            <div className="flex-1 p-3 rounded-xl bg-muted/30 border border-slate-100 dark:border-slate-800 space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-xs">{reply.user}</span>
                                                    <span className="text-[10px] text-muted-foreground">{reply.time}</span>
                                                </div>
                                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                                    {reply.content}
                                                </p>
                                                <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary pt-1">
                                                    <ThumbsUp className="h-2.5 w-2.5" /> {reply.upvotes}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Stats & Context */}
                    <div className="space-y-6">
                        <Card className="p-6 bg-slate-900 text-white border-none shadow-xl">
                            <h3 className="font-bold flex items-center gap-2 mb-4">
                                <ShieldCheck className="h-5 w-5 text-green-400" /> Goal Alignment
                            </h3>
                            <div className="space-y-4 text-sm text-slate-300">
                                <p>This discussion aims to refine the legislative draft before it is presented to the National Assembly committee.</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span>Consensus Level</span>
                                        <span>78%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[78%]" />
                                    </div>
                                </div>
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white border-none">
                                    Join Working Group
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6 border-slate-200 dark:border-slate-800">
                            <h3 className="font-bold text-sm mb-4">Trending in this Forum</h3>
                            <div className="space-y-3">
                                {[
                                    "Private-Public Partnership in Lagos",
                                    "Ban on Single-Use Plastics by 2025",
                                    "Community Policing vs Federal Police",
                                    "Minimum Wage & Inflation"
                                ].map((topic, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
                                        <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            #{i+1}
                                        </div>
                                        <span className="text-xs font-medium">{topic}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal components to keep it clean
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("rounded-2xl border bg-card text-card-foreground shadow-sm", className)}>
        {children}
    </div>
);

export default PolicyDiscussion;
