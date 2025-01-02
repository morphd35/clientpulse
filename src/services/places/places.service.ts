import { GoogleMapsService } from '../google-maps/google-maps.service';
import { Address } from '../../types/address';

export class PlacesService {
  private static instance: PlacesService;
  private googleMapsService: GoogleMapsService;
  private initialized: boolean = false;
  private useManualInput: boolean = false;

  private constructor() {
    this.googleMapsService = GoogleMapsService.getInstance();
  }

  public static getInstance(): PlacesService {
    if (!PlacesService.instance) {
      PlacesService.instance = new PlacesService();
    }
    return PlacesService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized || this.useManualInput) return;

    try {
      await this.googleMapsService.loadGoogleMaps();
      this.initialized = true;
      this.useManualInput = false;
    } catch (error) {
      console.warn('Places service initialization failed, falling back to manual input:', error);
      this.useManualInput = true;
      // Don't throw error - let the UI handle fallback gracefully
    }
  }

  isManualInputRequired(): boolean {
    return this.useManualInput;
  }

  async validateAddress(address: Partial<Address>): Promise<boolean> {
    if (this.useManualInput) {
      // Basic validation for manual input
      return !!(
        address.street_address?.trim() &&
        address.city?.trim() &&
        address.state?.trim() &&
        address.zip_code?.trim()
      );
    }

    try {
      if (!this.initialized) {
        throw new Error('Places service not initialized');
      }

      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        address: this.formatAddressForGeocoding(address)
      });

      return response.results.length > 0;
    } catch (error) {
      console.warn('Address validation failed:', error);
      // If geocoding fails, fall back to basic validation
      return !!(
        address.street_address?.trim() &&
        address.city?.trim() &&
        address.state?.trim() &&
        address.zip_code?.trim()
      );
    }
  }

  private formatAddressForGeocoding(address: Partial<Address>): string {
    const parts = [
      address.street_address,
      address.city,
      address.state,
      address.zip_code
    ].filter(Boolean);
    
    return parts.join(', ');
  }
}