import { BaseViewModel } from '../../core/base/base-view-model';
import { NavigationService } from '../../core/navigation/navigation.service';

export class HomeViewModel extends BaseViewModel {
    constructor() {
        super();
    }

    navigateToRoute(route: string) {
        try {
            NavigationService.navigate(route);
        } catch (error) {
            this.showError(error);
        }
    }
}