import { Location } from '@nativescript/geolocation';
import { Account } from '../../models/account.model';
import { Appointment } from '../../models/appointment.model';
import { RouteStop } from './route.types';
import { calculateDistance } from '../../utils/distance.util';

export class RouteOptimizer {
  optimize(currentLocation: Location, appointments: Appointment[], accounts: Account[]): RouteStop[] {
    const stops = this.createStops(appointments, accounts);
    return this.optimizeStops(currentLocation, stops);
  }

  private createStops(appointments: Appointment[], accounts: Account[]): RouteStop[] {
    return appointments.map(appointment => {
      const account = accounts.find(acc => acc.id === appointment.accountId);
      return {
        appointment,
        location: {
          latitude: account.latitude,
          longitude: account.longitude
        }
      };
    });
  }

  private optimizeStops(currentLocation: Location, stops: RouteStop[]): RouteStop[] {
    const route: RouteStop[] = [];
    let currentPoint = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude
    };
    
    const unvisitedStops = [...stops];

    while (unvisitedStops.length > 0) {
      const nearest = this.findNearest(currentPoint, unvisitedStops);
      route.push(nearest);
      currentPoint = nearest.location;
      unvisitedStops.splice(unvisitedStops.indexOf(nearest), 1);
    }

    return route;
  }

  private findNearest(point: { latitude: number; longitude: number }, stops: RouteStop[]): RouteStop {
    return stops.reduce((nearest, current) => {
      const currentDistance = calculateDistance(point, current.location);
      const nearestDistance = calculateDistance(point, nearest.location);
      return currentDistance < nearestDistance ? current : nearest;
    });
  }
}