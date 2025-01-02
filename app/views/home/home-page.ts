import { NavigatedData, Page } from '@nativescript/core';
import { HomeViewModel } from './home-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new HomeViewModel();
}

export function onTileNavigation(args) {
    const button = args.object;
    const route = button.get('route');
    const viewModel = button.page.bindingContext;
    
    if (route) {
        viewModel.navigateToRoute(route);
    }
}