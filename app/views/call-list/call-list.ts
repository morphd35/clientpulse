import { NavigatedData, Page } from '@nativescript/core';
import { CallListViewModel } from './call-list-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new CallListViewModel();
}

export function onItemTap(args) {
    const viewModel = args.object.bindingContext;
    viewModel.onCallItemTap(args);
}