# redux-form-field

-   [Motivation](#motivation)
-   [Typescript](#typescript)
-   [React Native](#react-native)
-   [Javascript Example](#js-example)
-   [Typescript Example](#ts-example)
-   [Advanced](#advanced)

## <a name="motivation" />Motivation

[redux-form](https://github.com/erikras/redux-form) is the wonderful form management library that uses a redux store under the hood for managing the forms state.

However, redux-form implies that your base components should be designed to fit the redux-form prop style of using `props.input` and `props.meta` to pass state information and callbacks to the component. But this ends up coupling the base component to redux-form and makes them difficult to use your beautiful components out of context of redux-form. Unless you're willing to go through some pain.

This was the aim of redux-form-field, to be able to decouple the basic/dumb visual component from our form library.

To achieve this there needs to be mapping between the 3 states of the redux-form Field

```
Basic React Component -> redux-form Component -> redux-form Field
```

Here the `Basic React Component` is the purely presentational component, built outside the context of redux-form to look pretty , but pretty impractical in the eyes of redux-form.

#### redux-form Component

Once we have this new shiny component that you are so proud of you'd tell yo mama about, that knows not of the scary word of redux-form, we need to convert it into a `redux-form Component`.

This is a component that redux-form can use in the redux-form Field component prop.

Confused by the terminology yet? Yep? Does this help?

```jsx
import { Fields } from 'redux-form'

<Field name="field name" component={/* What goes here is a `redux-form Component` */} />
```

This is probably the most complex mapping, and once this is done, as shown above, can use the component to create Fields that redux-form can use in the context of a form.

You might say that as this is the most complex part of the library, so why is the library not called `redux-form-component`, and to that I say do you hate alliteration? Fine, you can write the library next time!

This mapping is achieved through mapping functions for `prop.meta` and `props.input`, inspired by how you might map redux state and dispatch props.

#### redux-form Field

Finally we provide a little helper function to tie it all together called `reduxFormField`, that wraps the `redux-form Component` in a `Field` component. This gives a much cleaner final appearance in the [final form](https://knowyourmeme.com/memes/this-isnt-even-my-final-form) as you can create variants of field.

Suppose you have a text input `redux-form Component`, then using `reduxFormField` you can turn it into a numeric field, or perhaps a formatted field using redux-form [lifecycle](https://redux-form.com/7.1.2/docs/valuelifecycle.md/) events. Or really just about any sort or variant of the component using its props.

## <a name="typescript" />Typescript

The library works great with typescript, providing the dumb component prop interface all the way up at the top level, and mixing in the redux-form types as it goes.

This means it is 100% type safe, but has a couple caveats.

1. You **MUST** match the redux-form `props.input` types when using `mapInputKeys`
2. The final types can misleading in tool-tips, I suggest looking in the source code... if you dare :fearful:.

## <a name="react-native" />React Native

redux-form-field was born in a react-native project and is maintained in one currently, it works great.

You do have to match event types though when using `mapInputKeys`.
For example, with a text input:

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

## <a name="js-example" />Javascript Example

Coming... Sometime?

## <a name="ts-example" />Typescript Example

### Basic Component

Here we outline the basic creation of a completely dumb text input component. The props for the input itself do not conform to the `props.meta` and `props.input` convention set out by redux-form.

The complexity here is driven from the interfaces and the desire to enabled all text input props to be passed through our new component.

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

export interface ITextInputOwnProps {
    label: string;
    type?: string;
    autoCapitalize?: string;
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

To create the redux-form component that we can pass to the redux-form field component (Urghh, naming...), we now need to create the mapping function for the input & meta props.

#### mapMetaToProps

To map the meta object to our `ITextInputMetaProps` interface we use:

```typescript
const mapMetaToProps: MapMetaToProps<ITextInputMetaProps> = meta => ({
    error: meta.touched && meta.error,
});
```

This will only show errors once the field has been touched.

#### mapInputToProps

Similarly to `mapMetaToProps` we can map the input props:

```typescript
export const mapInputToProps: MapInputToProps<ITextInputInputProps> = input => ({
    onChange: input.onChange,
    onBlur: input.onBlur,
    onFocus: input.onFocus,
    value: input.value,
});
```

We do provide a helper method if the key names and types for each of those keys match called `mapInputKeys`.
As such the above is the same as using:

```typescript
export const mapInputToProps = mapInputKeys<ITextInputInputProps, ITextInputOwnProps>(
    'onChange',
    'onBlur',
    'onFocus',
    'value',
);
```

**NOTE:** Not only must the keys match, but the types must match as well, else you will get a compilation error.

#### Combining

Finally we can use these mapping functions to create the redux-form field component, mapping the `input` & `meta` props to out base dumb component.

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

Now we can create a redux-form form field component. Here we shall create a flavour of a text input using our redux-form field component, a numerical input.

Hope you're not getting confused by this example of a redux-form field mapping a component to a form field component that can be used in a form field, not a mouthful at all :rainbow:

```typescript
// NumericFormField.ts

import { reduxFormField, FormFieldProps } from 'redux-form-field';

import { ITextInputOwnProps } from './TextInput';
import TextInputFormComponent from './TextInputFormComponent';

// Overriding keys, these will be stripped from the top level interface
export interface INumericInputFormFieldConfig {
    type: string;
}

export type ITextInputFormFieldProps = FormFieldProps<ITextInputOwnProps>;

export const NumericFormField = reduxFormField<
    ITextInputOwnProps,
    INumericInputFormFieldConfig
>({ type: 'numeric' })(TextInputFormComponent);

export default NumericFormField;
```

### Usage

Within the context of a redux-form form, we can render the new component, without any extra props required. :tada:

The only required props here is the name of the field in the form, plus and required fields in the Basic Component own props.

```tsx
import NumericFormField from './NumericFormField'

export const NumberForm: React.SFC = () => (
    <>
        <NumericFormField name="Numeric Field" label="Enter a number"
         { /* Here you can put any text input own props that have not been mapped, like autoCapitalize. Or any redux-form Field props that have not been mapped either, such as normalize. */ }
        />
    </>
);

export default reduxForm({ form: 'numeric' })(NumberForm)

```

## <a name="advanced" />Advanced

### Passing Through all input props

It is possible to give access to all the of the underlying html input props at the top level, but requires the use of [typescript 2.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html) features.

To do this you need to extend the dumb components `OwnProps` with all props for the native/html input you are wrapping.
Minus the props provided through `InputProps` and `MetaProps`.

#### Eample

```typescript
// Get all the input prop keys excluding the ones from ITextInputInputProps
type UnmappedInputKeys = Exclude<
    keyof React.InputHTMLAttributes<HTMLInputElement>,
    keyof ITextInputInputProps
>;

// Picks the unmapped keys out of the text input props
type RemainingInputProps = Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    UnmappedInputKeys
>;

// Extends the remain keys with new own keys
export interface ITextInputOwnProps extends RemainingInputProps {
    label: string;
}
```
