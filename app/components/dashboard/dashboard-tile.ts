import { NavigatedData, EventData, View } from '@nativescript/core';

export function onTileTap(args: EventData) {
    try {
        const tileElement = <View>args.object;
        const route = tileElement.get('route');
        const page = tileElement.page;
        
        if (route && page && page.frame) {
            page.frame.navigate({
                moduleName: route,
                animated: true,
                transition: {
                    name: 'slide',
                    duration: 200,
                    curve: 'easeInOut'
                }
            });
        }
    } catch (error) {
        console.error('Navigation error:', error);
    }
}