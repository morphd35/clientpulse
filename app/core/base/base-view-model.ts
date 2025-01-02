import { Observable } from '@nativescript/core';

export class BaseViewModel extends Observable {
    private _isLoading: boolean = false;
    private _error: string = '';

    constructor() {
        super();
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        if (this._isLoading !== value) {
            this._isLoading = value;
            this.notifyPropertyChange('isLoading', value);
        }
    }

    get error(): string {
        return this._error;
    }

    set error(value: string) {
        if (this._error !== value) {
            this._error = value;
            this.notifyPropertyChange('error', value);
        }
    }

    protected showError(error: any) {
        console.error(error);
        this.error = error?.message || 'An error occurred';
    }
}