import { Injectable } from '@nativescript/core';
import { getCurrentLocation, enableLocationRequest } from '@nativescript/geolocation';

@Injectable()
export class LocationService {
  async requestPermissions(): Promise<boolean> {
    return await enableLocationRequest();
  }

  async getCurrentLocation() {
    return await getCurrentLocation({
      desiredAccuracy: 3,
      updateDistance: 10,
      maximumAge: 20000,
    });
  }
}