# redux-form-field

[redux-form](https://github.com/erikras/redux-form) is wonderful form management library using a redux store for managing form state. However, redux-form implies that your base components should be designed to fit its prop style of using `props.input` and `props.meta`, but this couples them with redux-form and makes them difficult to use out of context of redux-form.

This was the aim of redux-form-field, to be able to decouple the basic/dumb visual component from our form library.

To achieve this there needs to be mapping between the 3 states of the redux-form Field

```
Basic React Component -> redux-form Component -> redux-form Field
```

Here the `Basic React Component` is the purely presentational component, built to look pretty, but pretty impractical in the eyes of redux-form

#### Component

Once we have this new shiny component that know not of the scary word of redux-form we need to convert it into a `redux-form Component`. This is a component that redux-form can use in the redux-form Field component prop.

Confused by the terminology yet? Yep? Does this help?

```jsx
import { Fields } from 'redux-form'

<Field name="field name" component={/* What goes here is a `redux-form Component` */} />
```

This is probably the most complex mapping, and once this is done, as shown above, can use the component to create Fields that redux-form can use in the context of a form.

You might say that as this is the most complex part why is the library not called `redux-form-component`, and to that I say do you hate alliteration? Fine, you can write the library next time!

This mapping is achieved through mapping functions for `prop.meta` and `props.input`, inspired by how you might map redux state and dispatch props.

#### Field

Finally we provide a little helper function to tie it all together called `reduxFormField`, that wraps the `redux-form Component` in a `Field` component. This gives a much cleaner final appearance in the [final form](https://knowyourmeme.com/memes/this-isnt-even-my-final-form) as you can create variants of field.

Suppose you have a text input `redux-form Component`, using `reduxFormField` you can turn it into a numeric field, a formatted field using redux-form [lifecycle](https://redux-form.com/7.1.2/docs/valuelifecycle.md/) events, just about any sort or variant.

## Typescript

The library works great with typescript, providing the dumb component prop interface all the way up at the top level, and mixing in the redux-form types as it goes.

This means it is 100% type safe, but has a couple caveats.

1. You MUST match the redux-form `props.input` types when using `mapInputKeys`
2. The final types can misleading in tool-tips, I suggest looking in the source code... if you dare :fearful:.

## React Native

redux-form-field was born in a react-native project and is maintained in one currently, it works great.

You do have to match event types though with using `mapInputKeys`

```typescript
import {
    NativeSyntheticEvent,
    TextInputChangeEventData,
    TextInputFocusEventData,
    TextInput,
} from 'react-native';

export interface ITextInputInputProps {
    onChange?: (event: NativeSyntheticEvent<TextInputChangeEventData>) => void;
    onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    onFocus?: (event: React.FocusEvent<TextInput>) => void;
    value?: any;
}
```

## Javascript Example

Coming... Sometime?

## Typescript Example

### Basic Component

```tsx
// TextInput.ts

import * as React from 'react';

// Props that will come from the field input prop
export interface ITextInputInputProps {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    value?: any;
}

// Props that will come from the field meta prop
export interface ITextInputMetaProps {
    error?: string;
}

// Gets all the input props, not including props used in ITextInputInputProps
type UnmappedInputKeys = Exclude<
    keyof React.InputHTMLAttributes<HTMLInputElement>,
    keyof ITextInputInputProps
>;

// Props that come from somewhere else... the ether?
// Contains all unmapped possible input props not in ITextInputInputProps
export interface ITextInputOwnProps extends UnmappedInputKeys {
    label: string;
}

export type ITextInputProps = ITextInputInputProps &
    ITextInputMetaProps &
    ITextInputOwnProps;

export class TextInput extends React.PureComponent<ITextInputProps> {
    render() {
        const { label, error, ...inputProps };
        return (
            <>
                <span>{label}: </span>
                <input {...inputProps} />
                {error && <span>{error}</span>}
            </>
        );
    }
}
```

### redux-form Component

```typescript
// TextInputFormComponent.ts

import {
    reduxFormComponent,
    mapInputKeys,
    ComponentProps,
    MapMetaToProps,
} from 'redux-form-field';

import TextInput, {
    ITextInputInputProps,
    ITextInputMetaProps,
    ITextInputOwnProps,
} from './TextInput';

export type ITextInputFormComponentProps = ComponentProps<ITextInputOwnProps>;

export const mapMetaToProps: MapMetaToProps<ITextInputMetaProps> = meta => ({
    error: meta.touched && meta.error,
});

export const mapInputToProps = mapInputKeys<ITextInputInputProps, ITextInputOwnProps>(
    'onChange',
    'onBlur',
    'onFocus',
    'value',
);

export const TextInputFormComponent = reduxFormComponent<
    ITextInputMetaProps,
    ITextInputInputProps,
    ITextInputOwnProps
>(mapMetaToProps, mapInputToProps)(TextInput);

export default TextInputFormComponent;
```

### redux-form Field

```typescript
// NumericFormField.ts

import { reduxFormField, FormFieldProps } from 'redux-form-field';

import { ITextInputOwnProps } from './TextInput';
import TextInputFormComponent from './TextInputFormComponent';

// Overriding keys, these will be stripped from the top level
export interface INumericInputFormFieldConfig {
    type: string;
}

export type ITextInputFormFieldProps = FormFieldProps<ITextInputOwnProps>;

export const NumericFormField = reduxFormField<
    ITextInputOwnProps,
    INumericInputFormFieldConfig
>({
    type: 'numeric',
})(TextInputFormComponent);

export default NumericFormField;
```

### Usage

Within the context of a redux-form form.

```typescript
import NumericFormField from './NumericFormField'

export const NumberForm: React.SFC = () => (
    <>
        <NumericFormField name="Numeric Field" label="Enter a number"
         {
             /*
             Here you can put any text input prop or any redux-form Field prop.
             The only exceptions are:
                > component (For Obvs. reason)
                > type (because its in our INumericInputFormFieldConfig as is set to 'numeric')
             */
         }
        />
    </>
);

export default reduxForm({ form: 'numeric' })(NumberForm)

```
