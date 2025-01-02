import { NavigatedData, Page } from '@nativescript/core';
import { AccountFormViewModel } from './account-form-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const context = args.context || {};
    page.bindingContext = new AccountFormViewModel(context.account);
}

export function onSaveAccount(args) {
    const viewModel = args.object.bindingContext;
    viewModel.saveAccount().then(() => {
        args.object.page.frame.goBack();
    });
}