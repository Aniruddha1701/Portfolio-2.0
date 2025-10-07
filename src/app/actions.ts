"use server"

import { getItNews } from "@/ai/flows/it-news-flow";
import { getStaticItNews } from "@/ai/flows/it-news-flow-static";

export async function handleGetItNews() {
    try {
        // Check if Google API key is properly configured
        const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
        
        if (!apiKey || apiKey === 'your_google_api_key_here' || apiKey === 'your_gemini_api_key_here') {
            // Use static news if API key is not configured
            console.log('Using static news data (Google API key not configured)');
            const staticNews = await getStaticItNews();
            return staticNews;
        }
        
        // Try to get news from AI if API key is available
        try {
            const news = await getItNews();
            return news;
        } catch (aiError) {
            // Fallback to static news if AI fails
            console.error('AI news fetch failed, using static data:', aiError);
            const staticNews = await getStaticItNews();
            return staticNews;
        }
    } catch (error) {
        console.error('News fetch error:', error);
        return { error: "Using cached news data. For live updates, configure Google API key in .env.local" };
    }
}
