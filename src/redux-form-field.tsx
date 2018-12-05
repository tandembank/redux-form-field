import * as React from 'react';

import { Field } from 'redux-form';

import { ComponentProps, FieldProps } from './@types/redux-form';
import { Omit, OmitOverlap } from './@types/typescript';

// Removes all the 'used' types from the required field props
// i.e. all the keys of GivenProps & 'component' from BaseFieldProps<OwnProps> & OwnProps
export type FormFieldProps<OwnProps, GivenProps> = Omit<
    OmitOverlap<FieldProps<OwnProps>, GivenProps>,
    'component'
>;

/**
 * @param config Default component props passed to the redux-form field.
 * Config keys are removed from the returned component props interface
 *
 * @returns redux-form Field capable component
 */
export const reduxFormField = <OwnProps, GivenProps>(config: GivenProps) => (
    Component: React.ComponentType<ComponentProps<OwnProps>>,
) =>
    class ReduxFormField extends React.PureComponent<
        FormFieldProps<OwnProps, GivenProps>
    > {
        // redux-form requires a ComponentType, but does not play when combining with the generic OwnProps
        // This is a compromise as it does not effect the external type safety
        static readonly FormField = Field as any;

        render() {
            return (
                <ReduxFormField.FormField
                    component={Component}
                    {...config}
                    {...this.props}
                />
            );
        }
    };

export default reduxFormField;
