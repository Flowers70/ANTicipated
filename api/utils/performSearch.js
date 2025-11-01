// api/search.js - This file runs securely on the Vercel server

export const performSearch = async (query) => {
  const API_KEY = process.env.GOOGLE_API_KEY;
  const CX_ID = process.env.CUSTOM_SEARCH_CX; // Required for Custom Search

  if (!API_KEY || !CX_ID || !query) {
    throw new Error("Missing API keys or search query in performSearch utility.");
  }

  // 2. Define API Endpoints
  console.log("SEARCHING:", query);
  const encodedQuery = encodeURIComponent(query);
  
  // Endpoint for Google Custom Search (requires both key and cx)
  const customSearchUrl = 
    `https://www.googleapis.com/customsearch/v1?q=${encodedQuery}&cx=${CX_ID}&key=${API_KEY}`;

  // Endpoint for YouTube Data API (requires key)
  const youtubeUrl = 
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodedQuery}&type=video&videoDuration=long&key=${API_KEY}`;

  // 3. Execute Both Searches Concurrently (for speed)
  try {
    const [customSearchResponse, youtubeResponse] = await Promise.all([
      fetch(customSearchUrl),
      fetch(youtubeUrl)
    ]);

    // Check for API errors (e.g., key expired, quota exceeded)
    if (!customSearchResponse.ok || !youtubeResponse.ok) {
        // Log the error details (server-side only)
        const customError = !customSearchResponse.ok ? await customSearchResponse.text() : 'N/A';
        const youtubeError = !youtubeResponse.ok ? await youtubeResponse.text() : 'N/A';
        console.error("API Fetch Error - Custom Search:", customError);
        console.error("API Fetch Error - YouTube:", youtubeError);

        throw new Error("One or more external APIs failed to respond.");
    }

    const customSearchData = await customSearchResponse.json();
    const youtubeData = await youtubeResponse.json();

    return{
      webResults: customSearchData.items || [], // Use .items for web results
      videoResults: youtubeData.items || [],   // Use .items for video results
    }

  } catch (error) {
    console.error('Combined Search Failed:', error);
    throw error;
  }
}