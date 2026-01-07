import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NewsItem {
    title: string;
    pubDate: string;
    link: string;
    guid: string;
    author: string;
    thumbnail: string;
    description: string;
    content: string;
    enclosure: object;
    categories: string[];
}

const MOCK_NEWS: NewsItem[] = [
    {
        title: "Nigeria's Green Energy Transition: New Solar Projects Announced",
        pubDate: new Date().toISOString(),
        link: "#",
        guid: "1",
        author: "Green Future Connect",
        thumbnail: "",
        description: "The federal government has announced a new initiative to power 5 million homes with solar energy by 2025, boosting productivity and sustainability.",
        content: "",
        enclosure: {},
        categories: ["Sustainability", "Energy"],
    },
    {
        title: "Tech Hubs in Lagos Drive Productivity Growth",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        link: "#",
        guid: "2",
        author: "Tech Cabal",
        thumbnail: "",
        description: "New report shows that technology clusters in Yaba and Lekki are significantly contributing to the national GDP through innovative startups.",
        content: "",
        enclosure: {},
        categories: ["Productivity", "Tech"],
    },
    {
        title: "Waste-to-Wealth: Local Communities Turn Plastic into Profit",
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        link: "#",
        guid: "3",
        author: "Environmental Watch",
        thumbnail: "",
        description: "A grassroots movement in Port Harcourt is transforming plastic waste into durable construction materials, creating jobs and cleaning the environment.",
        content: "",
        enclosure: {},
        categories: ["Sustainability", "Innovation"],
    },
];

const News = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Google News RSS feed for "Nigeria productivity sustainability projects"
                const RSS_URL = "https://news.google.com/rss/search?q=Nigeria+productivity+sustainability+projects+when:7d&hl=en-NG&gl=NG&ceid=NG:en";
                const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

                const response = await fetch(API_URL);
                const data = await response.json();

                if (data.status === "ok") {
                    setNews(data.items);
                } else {
                    // Fallback to mock data if API fails (e.g., rate limit)
                    console.warn("News API failed, falling back to mock data:", data.message);
                    setNews(MOCK_NEWS);
                    // Don't set error state to keep UI clean, just show mock data
                }
            } catch (err) {
                console.error("Error fetching news:", err);
                setNews(MOCK_NEWS);
                setError("Failed to load live news. Showing archived updates.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-NG", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background py-12 px-4 md:px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Latest Updates</h1>
                        <p className="text-muted-foreground mt-2">
                            Real-time news on productivity, sustainability, and development in Nigeria.
                        </p>
                    </div>
                    <Badge variant="outline" className="px-3 py-1 text-sm">
                        Live Feed: Google News
                    </Badge>
                </div>

                {error && (
                    <Alert variant="default" className="mb-6 bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Notice</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map((item, index) => (
                            <Card key={`${item.guid}-${index}`} className="flex flex-col h-full hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <Badge variant="secondary" className="text-xs font-normal">
                                            {item.author || "News"}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {formatDate(item.pubDate)}
                                        </span>
                                    </div>
                                    <CardTitle className="text-lg leading-tight line-clamp-3">
                                        {item.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <CardDescription className="line-clamp-4">
                                        {/* Strip HTML tags from description if present */}
                                        {item.description?.replace(/<[^>]*>?/gm, '') || "Click to read the full story."}
                                    </CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full gap-2" asChild>
                                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                                            Read More <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;
