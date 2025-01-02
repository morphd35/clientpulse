import { Property, View } from '@nativescript/core';

export class AccountFormField extends View {
    static labelProperty = new Property<AccountFormField, string>({
        name: 'label',
        defaultValue: ''
    });

    static valueProperty = new Property<AccountFormField, string>({
        name: 'value',
        defaultValue: ''
    });

    static hintProperty = new Property<AccountFormField, string>({
        name: 'hint',
        defaultValue: ''
    });

    static errorProperty = new Property<AccountFormField, string>({
        name: 'error',
        defaultValue: ''
    });

    static keyboardTypeProperty = new Property<AccountFormField, string>({
        name: 'keyboardType',
        defaultValue: 'text'
    });

    static disabledProperty = new Property<AccountFormField, boolean>({
        name: 'disabled',
        defaultValue: false
    });
}

AccountFormField.labelProperty.register(AccountFormField);
AccountFormField.valueProperty.register(AccountFormField);
AccountFormField.hintProperty.register(AccountFormField);
AccountFormField.errorProperty.register(AccountFormField);
AccountFormField.keyboardTypeProperty.register(AccountFormField);
AccountFormField.disabledProperty.register(AccountFormField);