import {config} from 'dotenv';
config();

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Make sure that the AI flows are imported so that they are registered with Genkit.
import '@/ai/flows/it-news-flow.js';
import '@/ai/flows/moderate-text-flow.js';

genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash-latest',
});
