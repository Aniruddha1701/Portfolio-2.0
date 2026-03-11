"use server"

import { getItNews } from "@/ai/flows/it-news-flow";
import { getStaticItNews } from "@/ai/flows/it-news-flow-static";

export async function handleGetItNews() {
    try {
        // Fetch top programming articles from the DEV API (live tech news)
        const response = await fetch('https://dev.to/api/articles?tag=programming&state=rising&per_page=3', {
            next: { revalidate: 3600 } // Revalidate cache every hour
        });
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        
        const articles = await response.json();
        
        const news = articles.map((article: any) => ({
            headline: article.title,
            summary: article.description || "Read the full technical breakdown and discussion on DEV Community.",
            url: article.url
        }));
        
        return { news };
    } catch (error) {
        console.error('Live news fetch error:', error);
        
        // Fallback to static if API is completely down
        const { getStaticItNews } = await import("@/ai/flows/it-news-flow-static");
        const staticNews = await getStaticItNews();
        
        return { 
           news: staticNews.news.map(n => ({ ...n, url: "#" }))
        };
    }
}
