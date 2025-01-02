import { NavigatedData, Page } from '@nativescript/core';
import { AccountListViewModel } from '../view-models/account-list.view-model';

export function onNavigatingTo(args: NavigatedData) {
    try {
        const page = <Page>args.object;
        if (!page.bindingContext) {
            page.bindingContext = new AccountListViewModel();
        }
        console.log('Account list page initialized');
    } catch (error) {
        console.error('Error initializing account list:', error);
    }
}

export function onAddAccount(args) {
    try {
        const page = args.object.page;
        page.frame.navigate({
            moduleName: 'features/accounts/views/account-form',
            animated: true,
            transition: {
                name: 'slide',
                duration: 200,
                curve: 'easeInOut'
            }
        });
    } catch (error) {
        console.error('Error navigating to account form:', error);
    }
}

export function onAccountTap(args) {
    try {
        const page = args.object.page;
        const viewModel = page.bindingContext;
        const account = viewModel.accounts[args.index];
        
        page.frame.navigate({
            moduleName: 'features/accounts/views/account-form',
            context: { account },
            animated: true,
            transition: {
                name: 'slide',
                duration: 200,
                curve: 'easeInOut'
            }
        });
    } catch (error) {
        console.error('Error navigating to account details:', error);
    }
}