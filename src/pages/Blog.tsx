import { useState } from "react";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogData";
import { GlassPanel } from "@/components/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, Clock, ArrowRight } from "lucide-react";
import type { BlogCategory } from "@/types/blog";

const Blog = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "All">("All");

    const categories: (BlogCategory | "All")[] = ["All", "Sustainability", "Productivity", "Technology", "Community", "Policy"];

    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-NG", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-background pb-20">
            {/* Hero Section */}
            <div className="relative pt-32 md:pt-40 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-top-left" />
                <div className="container relative z-10 px-4 md:px-6">
                    <div className="max-w-3xl">
                        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
                            Green Connect Articles
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                            Insights for a <span className="text-primary">Sustainable</span> Future
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Discover stories, research, and deep-dives into Nigeria's journey towards 
                            increased productivity and environmental stewardship.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container px-4 md:px-6 -mt-8 relative z-20">
                {/* Search and Filter Bar */}
                <GlassPanel className="p-4 mb-12 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search articles..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white/50 dark:bg-slate-900/50 border-none ring-1 ring-white/20"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(cat)}
                                className="whitespace-nowrap rounded-full px-4"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </GlassPanel>

                {/* Blog Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                                <GlassPanel className="h-full overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-none bg-white/40 dark:bg-slate-900/40">
                                    <div className="relative h-48 overflow-hidden">
                                        <img 
                                            src={post.cover_image} 
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-white/90 dark:bg-slate-900/90 text-primary border-none shadow-sm backdrop-blur-sm">
                                                {post.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> {formatDate(post.published_at)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {post.read_time}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                                            {post.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full overflow-hidden border border-primary/20">
                                                    <img src={post.author.avatar_url} alt={post.author.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="text-[10px]">
                                                    <p className="font-bold leading-none">{post.author.name}</p>
                                                    <p className="text-muted-foreground">{post.author.role}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        </div>
                                    </div>
                                </GlassPanel>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-primary/5 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="h-10 w-10 text-primary opacity-20" />
                        </div>
                        <h2 className="text-2xl font-bold">No articles found</h2>
                        <p className="text-muted-foreground mt-2">Try adjusting your search or category filters.</p>
                        <Button variant="outline" className="mt-6" onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}>
                            Clear all filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
