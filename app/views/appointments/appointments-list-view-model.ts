import { Observable } from '@nativescript/core';
import { Appointment } from '../../models/appointment.model';
import { DatabaseService } from '../../services/database.service';

export class AppointmentsListViewModel extends Observable {
  private _appointments: Appointment[] = [];
  private _selectedFilterIndex: number = 0;
  private databaseService: DatabaseService;

  constructor() {
    super();
    this.databaseService = new DatabaseService();
    this.filterOptions = [
      { title: 'All' },
      { title: 'Today' },
      { title: 'Upcoming' }
    ];
  }

  async loadAppointments() {
    await this.databaseService.init();
    this._appointments = await this.databaseService.getAppointments();
    this.notifyPropertyChange('appointments', this.filteredAppointments);
  }

  get appointments(): Appointment[] {
    return this.filteredAppointments;
  }

  get selectedFilterIndex(): number {
    return this._selectedFilterIndex;
  }

  set selectedFilterIndex(value: number) {
    if (this._selectedFilterIndex !== value) {
      this._selectedFilterIndex = value;
      this.notifyPropertyChange('appointments', this.filteredAppointments);
    }
  }

  private get filteredAppointments(): Appointment[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (this._selectedFilterIndex) {
      case 1: // Today
        return this._appointments.filter(apt => 
          apt.date.toDateString() === today.toDateString()
        );
      case 2: // Upcoming
        return this._appointments.filter(apt => apt.date > today);
      default: // All
        return this._appointments;
    }
  }
}