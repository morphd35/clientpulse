
interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  _googleMapsCallback?: () => void;
}

export class GoogleMapsService {
  private static instance: GoogleMapsService;
  private scriptLoaded = false;
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

  public async loadGoogleMaps(): Promise<void> {
    // Return immediately if the script is already loaded
    if (this.scriptLoaded) {
      return;
    }

    // Return the existing promise if the script is in the process of loading
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      const callbackName = '_googleMapsCallback';

      // Define the global callback function
      window[callbackName] = () => {
        this.scriptLoaded = true;
        resolve();
        delete window[callbackName];
      };

      // Create the script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places&callback=${callbackName}`;
      script.async = true;
      script.defer = true;

      script.onerror = () => {
        delete window[callbackName];
        reject(new Error('Failed to load Google Maps script'));
      };

      // Append the script to the document head
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  public isLoaded(): boolean {
    return this.scriptLoaded;
  }

  public hasValidKey(): boolean {
    return Boolean(this.apiKey);
  }
}
