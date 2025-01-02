import { Injectable } from '@nativescript/core';
import { getCurrentLocation } from '@nativescript/geolocation';
import { Account } from '../models/account.model';
import { Appointment } from '../models/appointment.model';

@Injectable()
export class RouteService {
  async optimizeRoute(appointments: Appointment[], accounts: Account[]) {
    const currentLocation = await getCurrentLocation({
      desiredAccuracy: 3,
      updateDistance: 10,
      maximumAge: 20000,
    });

    // Map appointments to account locations
    const stops = appointments.map(apt => {
      const account = accounts.find(acc => acc.id === apt.accountId);
      return {
        appointment: apt,
        location: {
          latitude: account.latitude,
          longitude: account.longitude
        }
      };
    });

    // Simple nearest neighbor algorithm
    const route = [];
    let currentPoint = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude
    };

    while (stops.length > 0) {
      const nearest = this.findNearest(currentPoint, stops);
      route.push(nearest);
      currentPoint = nearest.location;
      stops.splice(stops.indexOf(nearest), 1);
    }

    return route;
  }

  private findNearest(point: { latitude: number; longitude: number }, 
                     stops: any[]) {
    return stops.reduce((nearest, current) => {
      const currentDistance = this.calculateDistance(
        point,
        current.location
      );
      const nearestDistance = this.calculateDistance(
        point,
        nearest.location
      );
      return currentDistance < nearestDistance ? current : nearest;
    });
  }

  private calculateDistance(point1: { latitude: number; longitude: number },
                          point2: { latitude: number; longitude: number }) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(point2.latitude - point1.latitude);
    const dLon = this.toRad(point2.longitude - point1.longitude);
    const lat1 = this.toRad(point1.latitude);
    const lat2 = this.toRad(point2.latitude);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * 
              Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRad(value: number) {
    return value * Math.PI / 180;
  }
}