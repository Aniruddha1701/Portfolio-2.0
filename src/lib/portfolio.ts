// Portfolio data fetching utility

export async function fetchPortfolioData() {
  try {
    const response = await fetch('/api/portfolio', {
      method: 'GET',
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('Failed to fetch portfolio data');
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
}

export async function fetchPortfolioDataServer() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:9002';
    const response = await fetch(`${baseUrl}/api/portfolio`, {
      method: 'GET',
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('Failed to fetch portfolio data from server');
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching portfolio from server:', error);
    return null;
  }
}
