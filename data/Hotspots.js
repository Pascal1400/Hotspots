import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useHotspots() {
  const [spots, setSpots] = useState([]);
  const [localPhotos, setLocalPhotos] = useState({});
  const [localFavorites, setLocalFavorites] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const lat = 51.9225;
        const lon = 4.47917;
        const radius = 2000;

        const geoRes = await fetch(
            `https://nl.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lon}&gsradius=${radius}&gslimit=25&format=json&origin=*`
        );
        if (!geoRes.ok) {
          const text = await geoRes.text();
          console.error('Wikipedia geo API fout:', geoRes.status, text);
          throw new Error('Wikipedia geo API request failed');
        }
        const geoData = await geoRes.json();
        const list = geoData.query?.geosearch || [];
        if (list.length === 0) {
          setSpots([]);
          return;
        }

        const ids = list.map(l => l.pageid).join('|');
        if (!ids) {
          setSpots([]);
          return;
        }

        const infoRes = await fetch(
            `https://nl.wikipedia.org/w/api.php?action=query&pageids=${ids}&prop=extracts|pageimages&exintro=1&piprop=original&pithumbsize=300&format=json&origin=*`
        );
        if (!infoRes.ok) {
          const text = await infoRes.text();
          console.error('Wikipedia info API fout:', infoRes.status, text);
          throw new Error('Wikipedia info API request failed');
        }

        const infoData = await infoRes.json();

        const wikiSpots = list.map(l => {
          const pg = infoData.query.pages[l.pageid];
          return {
            id: `wiki-${l.pageid}`,
            title: pg.title,
            latitude: l.lat,
            longitude: l.lon,
            description: (pg.extract || '').replace(/(<([^>]+)>)/gi, ''),
            image: pg.original?.source || pg.thumbnail?.source || null,
          };
        });

        const combined = [...wikiSpots];
        const unique = Object.values(
            combined.reduce((acc, spot) => {
              acc[spot.title] = acc[spot.title] || spot;
              return acc;
            }, {})
        );
        const combinedSpots = unique.filter(spot => spot.image);

        const storedLocalPhotos = await AsyncStorage.getItem('localSpotPhotos');
        const localPhotos = storedLocalPhotos ? JSON.parse(storedLocalPhotos) : {};

        const storedLocalFavorites = await AsyncStorage.getItem('localSpotFavorites');
        const localFavorites = storedLocalFavorites ? JSON.parse(storedLocalFavorites) : {};

        setSpots(combinedSpots);
        setLocalPhotos(localPhotos);
        setLocalFavorites(localFavorites);
      } catch (e) {
        console.error('Error loading hotspots', e);
        setSpots([]);
        setLocalPhotos({});
        setLocalFavorites({});
      } finally {
        setLoading(false);
      }
    };

    fetchHotspots();
  }, []);

  const updateLocalPhoto = async (spotId, newUri) => {
    const updated = { ...localPhotos, [spotId]: newUri };
    setLocalPhotos(updated);
    await AsyncStorage.setItem('localSpotPhotos', JSON.stringify(updated));
  };

  const updateLocalFavorite = async (spotId, Favorite) => {
    const updated = { ...localFavorites, [spotId]: Favorite };
    setLocalFavorites(updated);
    await AsyncStorage.setItem('localSpotFavorites', JSON.stringify(updated));
  };

  return {
    spots,
    localPhotos,
    localFavorites,
    updateLocalPhoto,
    updateLocalFavorite,
    loading,
    ready: !loading,
  };
}
