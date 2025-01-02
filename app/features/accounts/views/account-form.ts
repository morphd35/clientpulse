import { NavigatedData, Page } from '@nativescript/core';
import { AccountFormViewModel } from '../view-models/account-form.view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const context = args.context || {};
    page.bindingContext = new AccountFormViewModel(context.account);
}

export async function onSaveAccount(args) {
    const viewModel = args.object.bindingContext;
    try {
        await viewModel.saveAccount();
        args.object.page.frame.goBack();
    } catch (error) {
        console.error('Error saving account:', error);
        viewModel.error = 'Failed to save account. Please try again.';
    }
}