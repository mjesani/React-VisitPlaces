import Places from './Places.jsx';
import ErrorPage from './ErrorPage.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';
import { useFetch } from '../hooks/useFetch.js';

async function getAvailablePlaces() {
  const places = await fetchAvailablePlaces();

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
          resolve(sortedPlaces);
        });
  });
}

export default function AvailablePlaces({ onSelectPlace }) {

  // useEffect(() => {
  //   fetch('http://localhost:3000/places')
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setAvailablePlaces(data.places);
  //     });
  // }, []);

  const { isLoading, data: availablePlaces, error } = useFetch(getAvailablePlaces, []);

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
