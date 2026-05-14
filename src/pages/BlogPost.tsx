import { useParams, Link, useNavigate } from "react-router-dom";
import { blogPosts } from "@/data/blogData";
import { GlassPanel } from "@/components/GlassPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Clock, Share2, Bookmark, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
                    <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-NG", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-[#fafbfc] dark:bg-slate-950 pb-20">
            {/* Header / Cover Image */}
            <div className="relative h-[40vh] md:h-[60vh] w-full">
                <img 
                    src={post.cover_image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="container max-w-4xl">
                        <Link to="/blog">
                            <Button variant="ghost" className="text-white hover:bg-white/10 mb-6 -ml-4 gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Blog
                            </Button>
                        </Link>
                        <Badge className="mb-4 bg-primary text-white border-none">{post.category}</Badge>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-white/20">
                                    <User className="h-5 w-5 text-white/80" />
                                </div>
                                <div>
                                    <p className="font-bold text-white">{post.author.name}</p>
                                    <p className="text-xs">{post.author.role}</p>
                                </div>
                            </div>
                            <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> {formatDate(post.published_at)}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4" /> {post.read_time}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container max-w-4xl px-4 md:px-6 -mt-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px] gap-8">
                    <GlassPanel className="p-8 md:p-12 bg-white/90 dark:bg-slate-900/90 shadow-2xl border-none">
                        {/* Article Content */}
                        <div 
                            className="prose prose-lg dark:prose-invert max-w-none 
                            prose-headings:font-black prose-headings:tracking-tight
                            prose-h3:text-primary prose-a:text-primary prose-strong:text-foreground"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                        
                        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div className="flex gap-4">
                                <Button variant="outline" size="sm" className="gap-2 rounded-full" onClick={handleShare}>
                                    <Share2 className="h-4 w-4" /> Share
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2 rounded-full">
                                    <Bookmark className="h-4 w-4" /> Save
                                </Button>
                            </div>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <MessageSquare className="h-4 w-4" /> 12 Comments
                            </Button>
                        </div>
                    </GlassPanel>

                    {/* Sticky Side Actions */}
                    <div className="hidden lg:flex flex-col gap-4 sticky top-24 h-fit">
                        <Button variant="outline" size="icon" className="rounded-full h-12 w-12 bg-white dark:bg-slate-900 shadow-md" onClick={handleShare}>
                            <Share2 className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full h-12 w-12 bg-white dark:bg-slate-900 shadow-md">
                            <Bookmark className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full h-12 w-12 bg-white dark:bg-slate-900 shadow-md">
                            <MessageSquare className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Related Articles Suggestion */}
                <div className="mt-20">
                    <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {blogPosts.filter(p => p.id !== post.id).slice(0, 2).map(related => (
                            <Link key={related.id} to={`/blog/${related.slug}`} className="group">
                                <GlassPanel className="p-4 flex gap-4 items-center hover:bg-primary/5 transition-colors border-none overflow-hidden">
                                    <div className="h-20 w-24 flex-shrink-0 rounded-lg overflow-hidden">
                                        <img src={related.cover_image} alt={related.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div>
                                        <Badge variant="outline" className="text-[10px] mb-1">{related.category}</Badge>
                                        <h4 className="font-bold group-hover:text-primary transition-colors line-clamp-2">{related.title}</h4>
                                    </div>
                                </GlassPanel>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
