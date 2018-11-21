import { WrappedFieldInputProps } from 'redux-form';

import { SharedTypedKeys, TypeOverlap } from './@types/typescript';
import { MapInputToProps } from './redux-form-component';

/**
 * @param keys Keys of redux-form input props that are to be mapped to component props
 *
 * @returns Higher order that will take redux form input props, and map the scoped keys to a new object.
 */
export const mapInputKeys = <InputProps = {}, OwnProps = {}>(
    ...keys: SharedTypedKeys<InputProps, WrappedFieldInputProps>[]
): MapInputToProps<TypeOverlap<InputProps, WrappedFieldInputProps>, OwnProps> => input =>
    keys.reduce(
        (acc, key) => {
            acc[key] = input[key];

            return acc;
        },
        {} as TypeOverlap<InputProps, WrappedFieldInputProps>,
    );
