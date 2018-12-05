import * as React from 'react';

import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form';

import { ComponentProps } from './@types/redux-form';

export interface MapInputToProps<InputProps, OwnProps = {}> {
    (input: WrappedFieldInputProps, props?: OwnProps): InputProps;
}

export interface MapMetaToProps<MetaProps, OwnProps = {}> {
    (meta: WrappedFieldMetaProps, props?: OwnProps): MetaProps;
}

export interface ReduxFormFieldComponent<MetaProps, InputProps, OwnProps = {}> {
    (
        WrappedComponent: React.ComponentType<OwnProps & MetaProps & InputProps>,
    ): React.ComponentType<ComponentProps<OwnProps>>;
}

/**
 * @description Wrapper for mapping dumb components into redux-form components
 * Maps redux-form meta and input props to component props
 *
 * @param mapMetaToProps Mapping function that takes redux-form field input props and maps it to partial component props
 * @param mapInputToProps Mapping function that takes redux-form field meta props and maps it to partial component props
 *
 * @returns Higher order function that can take a dumb react component and map the redux-form input and meta props to the component
 */
export function reduxFormComponent<MetaProps, InputProps, OwnProps>(
    mapMetaToProps: MapMetaToProps<MetaProps, OwnProps>,
    mapInputToProps: MapInputToProps<InputProps, OwnProps>,
): ReduxFormFieldComponent<MetaProps, InputProps, OwnProps> {
    return FieldComponent =>
        class extends React.PureComponent<ComponentProps<OwnProps>> {
            render() {
                const { children, meta, input, ...rest } = this.props;

                // FIXME: typeof rest === OwnProps.
                // But TS cannot resolve through key exclusions of ComponentProps<OwnProps>
                const ownProps = (rest as any) as OwnProps;

                const metaProps: MetaProps =
                    mapMetaToProps && mapMetaToProps(meta, ownProps);

                const inputProps: InputProps =
                    mapInputToProps && mapInputToProps(input, ownProps);

                return (
                    <FieldComponent {...metaProps} {...inputProps} {...ownProps}>
                        {children}
                    </FieldComponent>
                );
            }
        };
}

export default reduxFormComponent;
