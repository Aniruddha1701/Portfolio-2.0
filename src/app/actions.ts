"use server"

import { getItNews } from "@/ai/flows/it-news-flow";

export async function handleGetItNews() {
    try {
        const news = await getItNews();
        return news;
    } catch (error) {
        console.error(error);
        return { error: "An unexpected error occurred while fetching the news." };
    }
}
