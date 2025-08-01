"use server"

import { getItNews } from "@/ai/flows/it-news-flow";
import { moderateText } from "@/ai/flows/moderate-text-flow";
import { promises as fs } from 'fs';
import path from 'path';
import type { GuestbookEntry } from './types';


// Define the path to the JSON file
const guestbookPath = path.resolve(process.cwd(), 'src/data/guestbook-entries.json');

export async function handleGetItNews() {
    try {
        const news = await getItNews();
        return news;
    } catch (error) {
        console.error(error);
        return { error: "An unexpected error occurred while fetching the news." };
    }
}

async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  try {
    const data = await fs.readFile(guestbookPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function saveGuestbookEntry(entry: GuestbookEntry): Promise<void> {
  const entries = await getGuestbookEntries();
  entries.unshift(entry); // Add new entry to the beginning
  await fs.writeFile(guestbookPath, JSON.stringify(entries, null, 2), 'utf-8');
}

export async function addGuestbookEntry(formData: {name: string, message: string}) {
    const { name, message } = formData;

    if (!name || !message) {
        return { error: "Name and message are required." };
    }

    try {
        // Step 1: Moderate the content
        const moderationResult = await moderateText({ text: message });

        if (!moderationResult.isAppropriate) {
            return { error: `Message not posted. Reason: ${moderationResult.reason || 'Content is inappropriate.'}` };
        }

        // Step 2: Save the entry if it's appropriate
        const newEntry: GuestbookEntry = {
            name,
            message,
            timestamp: new Date().toISOString(),
        };

        await saveGuestbookEntry(newEntry);

        return { success: true, entry: newEntry };

    } catch (error) {
        console.error(error);
        return { error: "An unexpected error occurred." };
    }
}

export async function getEntries() {
    try {
        const entries = await getGuestbookEntries();
        return { entries };
    } catch (error) {
        console.error(error);
        return { error: "Failed to load guestbook entries." };
    }
}
