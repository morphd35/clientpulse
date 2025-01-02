import { getCurrentLocation, enableLocationRequest, Location } from '@nativescript/geolocation';

export class LocationService {
    private initialized: boolean = false;

    async initialize(): Promise<void> {
        if (!this.initialized) {
            try {
                const hasPermission = await enableLocationRequest();
                if (!hasPermission) {
                    throw new Error('Location permission denied');
                }
                this.initialized = true;
            } catch (error) {
                console.error('Error initializing location service:', error);
                throw error;
            }
        }
    }

    async getCurrentLocation(): Promise<Location> {
        try {
            if (!this.initialized) {
                await this.initialize();
            }
            
            return await getCurrentLocation({
                desiredAccuracy: 3,
                updateDistance: 10,
                maximumAge: 20000,
                timeout: 20000
            });
        } catch (error) {
            console.error('Error getting current location:', error);
            throw error;
        }
    }
}