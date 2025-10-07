import { MetadataRoute } from 'next';

async function getPortfolioData() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:9002';
    const response = await fetch(`${baseUrl}/api/portfolio`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolio for manifest:', error);
    return null;
  }
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const portfolio = await getPortfolioData();
  
  // Use dynamic data from database, with fallbacks
  const name = portfolio?.personalInfo?.name || 'Aniruddha Patil';
  const title = portfolio?.personalInfo?.title || 'Full Stack Developer';
  const shortName = name.split(' ')[0]; // First name only for short_name
  
  return {
    name: `${name} - ${title}`,
    short_name: shortName,
    description: portfolio?.personalInfo?.bio || 'Portfolio website',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['portfolio', 'personal', 'developer'],
  };
}
