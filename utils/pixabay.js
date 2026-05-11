import axios from "axios";

const PIXABAY_API_KEY = "53146596-8a18403aa90dca34e49a958da";
const PIXABAY_URL = "https://pixabay.com/api/";

/**
 * Fetch a high-quality food image from Pixabay
 * @param {string} query - The food name or keywords
 * @returns {Promise<string>} - Image URL
 */
export async function fetchPixabayImage(query) {
  const fallbacks = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=1200&auto=format&fit=crop"
  ];

  const trySearch = async (searchTerm) => {
    try {
      console.log(`=== Pixabay: Fetching image for "${searchTerm}" ===`);
      const res = await axios.get(PIXABAY_URL, {
        params: {
          key: PIXABAY_API_KEY,
          q: searchTerm.replace(/\s+/g, '+'),
          image_type: "photo",
          category: "food",
          pretty: true,
          safesearch: true,
          per_page: 20
        }
      });
      return res.data.hits || [];
    } catch (err) {
      console.error(`=== Pixabay API Error: ===`, err.message);
      return [];
    }
  };

  // 1. Try full query
  let hits = await trySearch(query);

  // 2. If no hits, simplify to main keywords
  if (hits.length === 0 && query.split(" ").length > 1) {
    const simpleQuery = query.split(" ").slice(0, 2).join(" ");
    hits = await trySearch(simpleQuery);
  }

  // 3. Last resort: just the first word
  if (hits.length === 0) {
    const genericQuery = query.split(" ")[0];
    hits = await trySearch(genericQuery);
  }

  if (hits.length > 0) {
    // Pick a random hit
    const randomIndex = Math.floor(Math.random() * Math.min(hits.length, 10));
    return hits[randomIndex].largeImageURL;
  }

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
