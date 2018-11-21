import * as React from 'react';

import { EventOrValueHandler, WrappedFieldInputProps } from 'redux-form';

import { mapInputKeys } from './redux-form-mapping';

describe('mapInputKeys', () => {
    interface IComponentInputProps {
        onChange: EventOrValueHandler<React.ChangeEvent<any>>;
        name: string;
        value: any;
        otherProp: string;
    }

    const input = {
        onChange: jest.fn(),
        onBlur: jest.fn(),
        onFocus: jest.fn(),
        onDragStart: jest.fn(),
        onDrop: jest.fn(),
        name: 'test props',
        value: 1,
    } as WrappedFieldInputProps;

    const mapKeys = ['onChange', 'name'];

    const mapInputToProps = mapInputKeys<IComponentInputProps>('onChange', 'name');
    const inputProps = mapInputToProps(input);

    it('should map the key to the input', () => {
        mapKeys.forEach(key => {
            expect(inputProps[key]).toBe(input[key]);
        });
    });

    it('should not include extraneous keys', () => {
        Object.keys(input).forEach(key => {
            if (!mapKeys.includes(key)) {
                expect(inputProps[key]).toBeUndefined();
            }
        });
    });
});
