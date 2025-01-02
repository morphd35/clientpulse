import { useEffect, useState } from 'react';
import { PlacesService } from '../services/places/places.service';

export default function PlacesServiceInit() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initPlaces = async () => {
      try {
        const placesService = PlacesService.getInstance();
        await placesService.initialize();
        if (mounted) {
          setInitialized(true);
        }
      } catch (err) {
        console.error('Places service initialization error:', err);
        // Service will gracefully degrade - no need to show error to user
      }
    };

    if (!initialized) {
      initPlaces();
    }

    return () => {
      mounted = false;
    };
  }, [initialized]);

  // Component doesn't render anything
  return null;
}