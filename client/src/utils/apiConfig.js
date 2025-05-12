// Central configuration for API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create a function to check if the API is available
export const checkApiStatus = async () => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Include credentials to ensure cookies are sent
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }
    
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error('API Status Check Failed:', error);
    return { success: false, error: error.message };
  }
};

export default API_URL;
