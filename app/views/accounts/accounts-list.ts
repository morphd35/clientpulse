import { NavigatedData, Page } from '@nativescript/core';
import { AccountsListViewModel } from './accounts-list-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    if (!page.bindingContext) {
        page.bindingContext = new AccountsListViewModel();
    }
}

export function onAddAccount(args) {
    const viewModel = args.object.bindingContext;
    viewModel.navigateToAccountForm();
}

export function onAccountTap(args) {
    const viewModel = args.object.bindingContext;
    const account = viewModel.accounts[args.index];
    viewModel.navigateToAccountForm(account);
}