import { useState, useCallback, useEffect } from 'react';
import { fetchRandomDogs } from '../services/dogApi';

const useDogApi = (banList = []) => {
  const [dogData, setDogData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const isAttributeBanned = useCallback(
    (data) => {
      const attributes = [data.breed, data.temperament, data.origin, data.weight];
      return attributes.some((attr) => banList.includes(attr));
    },
    [banList]
  );

  // Helper function to fetch a single valid dog
  const fetchSingleValidDog = useCallback(async (maxAttempts = 50) => {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const [dog] = await fetchRandomDogs(1);

        if (!isAttributeBanned(dog)) {
          return dog; // Return the valid dog directly
        }

        // Small delay to avoid rate limiting
        if (i < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        // Continue trying even if one request fails
      }
    }

    // Only show fallback after many attempts
    throw new Error(`Unable to find a dog without banned attributes after ${maxAttempts} attempts. Try removing some banned attributes.`);
  }, [isAttributeBanned]);

  const getRandomDogs = useCallback(async (limit = 1) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < 10000) {
      const remaining = Math.ceil((10000 - timeSinceLastRequest) / 1000);
      setTimeRemaining(remaining);
      setError(`Please wait ${remaining} seconds before requesting again.`);
      return;
    }

    setLoading(true);
    setError(null);
    setTimeRemaining(0);

    try {
      if (limit === 1) {
        // Use single dog fetcher
        const validDog = await fetchSingleValidDog();
        setDogData([validDog]);
        setError(null);
      } else {
        // Use the original logic for multiple dogs
        let attempts = 0;
        let validDogs = [];
        const maxAttempts = 20;

        while (validDogs.length === 0 && attempts < maxAttempts) {
          const dogs = await fetchRandomDogs(limit);
          validDogs = dogs.filter((dog) => !isAttributeBanned(dog));
          attempts++;

          if (validDogs.length === 0 && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }

        if (validDogs.length === 0) {
          throw new Error(`Unable to find dogs without banned attributes after ${maxAttempts} attempts. Try removing some banned attributes.`);
        } else {
          setDogData(validDogs);
          setError(null);
        }
      }

      setLastRequestTime(now);
    } catch (err) {
      console.error('Failed to fetch dog data:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch dog data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [isAttributeBanned, lastRequestTime, fetchSingleValidDog]);

  // Effect to update the timeRemaining state every second
  useEffect(() => {
    if (timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeRemaining]);

  return { dogData, loading, error, timeRemaining, getRandomDogs };
};

export default useDogApi;
