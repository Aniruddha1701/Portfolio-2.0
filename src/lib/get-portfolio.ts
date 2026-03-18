import dbConnect from '@/lib/db/mongoose';
import Portfolio from '@/models/Portfolio';

export async function getPortfolioData() {
  try {
    await dbConnect();
    const portfolio = await Portfolio.findOne().lean();
    
    if (!portfolio) {
      return null;
    }
    
    // Convert MongoDB document to plain object
    return JSON.parse(JSON.stringify(portfolio));
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return null;
  }
}

export async function getPortfolioMetadata() {
  const portfolio = await getPortfolioData();
  
  if (!portfolio) {
    return {
      title: 'Portfolio',
      description: 'Professional Portfolio Website',
      name: 'Portfolio',
    };
  }
  
  const name = portfolio.personalInfo?.name || 'Portfolio';
  const title = portfolio.personalInfo?.title || 'Professional';
  const bio = portfolio.personalInfo?.bio || 'Professional Portfolio Website';
  
  return {
    title: `${name} | ${title}`,
    description: bio,
    name: name,
  };
}
