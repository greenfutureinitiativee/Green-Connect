import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogPosts as initialPosts } from "@/data/blogData";
import { GlassPanel } from "@/components/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
    Plus, 
    Trash2, 
    Edit3, 
    FileText, 
    Image as ImageIcon, 
    Save, 
    ArrowLeft,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import type { BlogCategory } from "@/types/blog";

const BlogEditor = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState(initialPosts);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<any>({
        title: "",
        excerpt: "",
        content: "",
        category: "Sustainability",
        cover_image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200&h=600&auto=format&fit=crop",
    });

    const handleSave = () => {
        if (!currentPost.title || !currentPost.content) {
            toast.error("Please fill in the title and content");
            return;
        }

        const newPost = {
            ...currentPost,
            id: currentPost.id || `blog-${Date.now()}`,
            slug: currentPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
            author: {
                name: "Admin User",
                role: "Editorial Team",
                avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop"
            },
            published_at: new Date().toISOString(),
            read_time: `${Math.ceil(currentPost.content.length / 500)} min read`
        };

        if (currentPost.id) {
            setPosts(posts.map(p => p.id === currentPost.id ? newPost : p));
            toast.success("Article updated successfully!");
        } else {
            setPosts([newPost, ...posts]);
            toast.success("Article published successfully!");
        }

        setIsEditing(false);
        setCurrentPost({
            title: "",
            excerpt: "",
            content: "",
            category: "Sustainability",
            cover_image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200&h=600&auto=format&fit=crop",
        });
    };

    const handleDelete = (id: string) => {
        setPosts(posts.filter(p => p.id !== id));
        toast.success("Article deleted");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <div className="container py-8 px-4 md:px-6">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black">Article Management</h1>
                        <p className="text-muted-foreground">Draft, edit, and publish your insights</p>
                    </div>
                </div>

                {isEditing ? (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                        <div className="space-y-6">
                            <GlassPanel className="p-6 space-y-4 border-none shadow-xl">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Article Title</label>
                                    <Input 
                                        value={currentPost.title} 
                                        onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                                        placeholder="Enter a compelling title..."
                                        className="text-xl font-bold py-6"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Excerpt</label>
                                    <Textarea 
                                        value={currentPost.excerpt} 
                                        onChange={(e) => setCurrentPost({...currentPost, excerpt: e.target.value})}
                                        placeholder="A brief summary for the card view..."
                                        className="h-24 resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Content (HTML Supported)</label>
                                    <Textarea 
                                        value={currentPost.content} 
                                        onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})}
                                        placeholder="Write your article here. You can use <p>, <h3>, <strong> etc."
                                        className="min-h-[400px] font-mono text-sm"
                                    />
                                </div>
                            </GlassPanel>
                        </div>

                        <div className="space-y-6">
                            <GlassPanel className="p-6 space-y-6 border-none shadow-xl sticky top-8">
                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <Save className="h-4 w-4 text-primary" /> Publishing Settings
                                    </h3>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase">Category</label>
                                        <div className="flex flex-wrap gap-2">
                                            {["Sustainability", "Productivity", "Technology", "Community", "Policy"].map((cat) => (
                                                <Badge 
                                                    key={cat} 
                                                    variant={currentPost.category === cat ? "default" : "outline"}
                                                    className="cursor-pointer"
                                                    onClick={() => setCurrentPost({...currentPost, category: cat})}
                                                >
                                                    {cat}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase">Cover Image URL</label>
                                        <div className="relative">
                                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                value={currentPost.cover_image}
                                                onChange={(e) => setCurrentPost({...currentPost, cover_image: e.target.value})}
                                                className="pl-10 text-xs"
                                            />
                                        </div>
                                        <div className="mt-2 rounded-lg overflow-hidden border aspect-video">
                                            <img src={currentPost.cover_image} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                    <Button className="w-full gap-2 py-6" onClick={handleSave}>
                                        <CheckCircle2 className="h-5 w-5" /> Save & Publish
                                    </Button>
                                    <Button variant="ghost" className="w-full" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </GlassPanel>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" /> Published Articles
                            </h2>
                            <Button className="gap-2 rounded-full" onClick={() => setIsEditing(true)}>
                                <Plus className="h-4 w-4" /> Write New Article
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <GlassPanel key={post.id} className="p-4 border-none shadow-md hover:shadow-xl transition-all duration-300">
                                    <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                                        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 left-2">
                                            <Badge className="bg-white/90 dark:bg-slate-900/90 text-primary border-none">{post.category}</Badge>
                                        </div>
                                    </div>
                                    <h3 className="font-bold line-clamp-2 mb-2">{post.title}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <span className="text-[10px] text-muted-foreground">
                                            {new Date(post.published_at).toLocaleDateString()}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => {setCurrentPost(post); setIsEditing(true);}}>
                                                <Edit3 className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleDelete(post.id)}>
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </div>
                                </GlassPanel>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogEditor;
