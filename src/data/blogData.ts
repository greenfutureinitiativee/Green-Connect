import type { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
    {
        id: "blog-1",
        title: "The Future of Solar Energy in Northern Nigeria",
        slug: "future-solar-energy-northern-nigeria",
        excerpt: "Exploring the untapped potential of solar farms in the Sahel region and how it can revolutionize local industries.",
        content: `
            <p>Nigeria stands at a pivotal moment in its energy journey. While fossil fuels have long been the backbone of our economy, the shifting global climate and the falling cost of renewable technology present an unprecedented opportunity.</p>
            <h3>The Solar Advantage</h3>
            <p>Northern Nigeria, with its high solar irradiance, is particularly well-suited for large-scale solar projects. Recent initiatives in Kano and Kaduna have already shown that localized solar grids can provide more reliable power than the national grid for small and medium enterprises (SMEs).</p>
            <p>By investing in solar energy, we are not just cleaning our environment; we are building a more productive future for every Nigerian.</p>
        `,
        author: {
            name: "Dr. Amara Okoro",
            role: "Energy Specialist",
            avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop"
        },
        category: "Sustainability",
        cover_image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&h=600&auto=format&fit=crop",
        published_at: "2024-04-20T10:00:00Z",
        read_time: "5 min read"
    },
    {
        id: "blog-2",
        title: "Maximizing Digital Productivity in Lagos",
        slug: "maximizing-digital-productivity-lagos",
        excerpt: "How remote work and digital tools are reshaping the professional landscape of Africa's largest tech hub.",
        content: `
            <p>Lagos has always been known for its hustle. But in recent years, that hustle has moved from the traffic jams of Third Mainland Bridge to the cloud. The rise of high-speed internet and the proliferation of tech talent have made Lagos a global contender in the digital economy.</p>
            <h3>Tools for the Modern Hustle</h3>
            <p>From project management software like Trello and Asana to the growing fintech ecosystem, Lagosians are using technology to bypass traditional barriers to entry. This shift is not just about convenience; it's about exponential growth.</p>
        `,
        author: {
            name: "Tobi Adeyemi",
            role: "Tech Analyst",
            avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop"
        },
        category: "Productivity",
        cover_image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&h=600&auto=format&fit=crop",
        published_at: "2024-04-18T14:30:00Z",
        read_time: "4 min read"
    }
];
