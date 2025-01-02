import { Frame } from '@nativescript/core';

export class NavigationService {
    static navigate(route: string, context?: any) {
        Frame.topmost().navigate({
            moduleName: route,
            context,
            animated: true,
            transition: {
                name: 'slide',
                duration: 200,
                curve: 'easeInOut'
            }
        });
    }

    static goBack() {
        Frame.topmost().goBack();
    }
}