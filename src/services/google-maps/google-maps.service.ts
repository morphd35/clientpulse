import { loadScript } from '../../utils/script-loader';

export class GoogleMapsService {
  private static instance: GoogleMapsService;
  private scriptLoaded: boolean = false;
  private loadPromise: Promise<void> | null = null;
  private apiKey: string;

  private constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!this.apiKey) {
      throw new Error('Google Maps API key is not configured');
    }
  }

  public static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService();
    }
    return GoogleMapsService.instance;
  }

  async loadGoogleMaps(): Promise<void> {
    if (this.scriptLoaded) {
      return;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      // Add callback to window object
      const callbackName = '_googleMapsCallback';
      window[callbackName] = () => {
        this.scriptLoaded = true;
        resolve();
        delete window[callbackName];
      };

      // Load the script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        delete window[callbackName];
        reject(new Error('Failed to load Google Maps script'));
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  isLoaded(): boolean {
    return this.scriptLoaded;
  }

  hasValidKey(): boolean {
    return Boolean(this.apiKey);
  }
}