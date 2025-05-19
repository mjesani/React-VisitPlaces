import { useEffect, useState } from 'react';
import Places from './Places.jsx';
import ErrorPage from './ErrorPage.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isLoading, setIsLoading] = useState(true);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   fetch('http://localhost:3000/places')
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setAvailablePlaces(data.places);
  //     });
  // }, []);

  useEffect(() => {
    async function fetchPlaces() {
      setIsLoading(true);

      try {
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
          setAvailablePlaces(sortedPlaces);
          setIsLoading(false);
        });
      } catch (error) {
        setError({ message: error.message || 'Could not fetch places.' });
        setIsLoading(false);
      }
    }

    fetchPlaces();
  }, []);

  if (error) {
    return (
      <ErrorPage title='An Error Occurred!' message={error.message} onConfirm={() => setError(null)} />
    );
  }

  return (
    <Places
      title="Available Places"
      isLoading={isLoading}
      loadingText="Fetching available places..."
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
