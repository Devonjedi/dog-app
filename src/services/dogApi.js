const API_KEY = import.meta.env.VITE_DOG_API_KEY;
const API_URL = 'https://api.thedogapi.com/v1';

export const fetchRandomDogs = async (limit = 6) => {
  try {
    const response = await fetch(`${API_URL}/images/search?has_breeds=1&limit=${limit}`, {
      headers: { 'x-api-key': API_KEY },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dog data');
    }

    const data = await response.json();

    return data.map((dog) => ({
      id: dog.id,
      imageUrl: dog.url,
      breed: dog.breeds[0]?.name || 'Unknown',
      temperament: dog.breeds[0]?.temperament || 'Unknown',
      origin: dog.breeds[0]?.origin || 'Unknown',
      weight: dog.breeds[0]?.weight?.metric || 'Unknown',
    }));
  } catch (error) {
    console.error('Error fetching dog data:', error);
    throw error;
  }
};
