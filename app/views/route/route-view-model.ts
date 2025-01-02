import { Observable } from '@nativescript/core';
import { RouteService } from '../../services/route.service';
import { DatabaseService } from '../../services/database.service';
import { LocationService } from '../../services/location.service';
import { calculateDistance } from '../../utils/distance.util';

export class RouteViewModel extends Observable {
  private routeService: RouteService;
  private databaseService: DatabaseService;
  private locationService: LocationService;
  private _routeStops: any[] = [];

  constructor() {
    super();
    this.routeService = new RouteService();
    this.databaseService = new DatabaseService();
    this.locationService = new LocationService();
  }

  async loadRoute() {
    await this.databaseService.init();
    const appointments = await this.databaseService.getAppointments();
    const accounts = await this.databaseService.getAccounts();
    
    await this.locationService.requestPermissions();
    const currentLocation = await this.locationService.getCurrentLocation();
    
    this._routeStops = await this.routeService.optimizeRoute(appointments, accounts);
    
    // Calculate distances
    let prevLocation = currentLocation;
    this._routeStops = this._routeStops.map((stop, index) => {
      const distance = calculateDistance(prevLocation, stop.location);
      prevLocation = stop.location;
      return { ...stop, index, distance };
    });
    
    this.notifyPropertyChange('routeStops', this._routeStops);
  }

  get routeStops(): any[] {
    return this._routeStops;
  }
}