import { Injectable } from '@nativescript/core';
import { Account } from '../../models/account.model';
import { Appointment } from '../../models/appointment.model';
import { LocationService } from '../location/location.service';
import { RouteStop } from './route.types';
import { RouteOptimizer } from './route.optimizer';

@Injectable()
export class RouteService {
  private routeOptimizer: RouteOptimizer;
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
    this.routeOptimizer = new RouteOptimizer();
  }

  async optimizeRoute(appointments: Appointment[], accounts: Account[]): Promise<RouteStop[]> {
    const currentLocation = await this.locationService.getCurrentLocation();
    return this.routeOptimizer.optimize(currentLocation, appointments, accounts);
  }
}