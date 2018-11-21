import * as React from 'react';

import { EventOrValueHandler, WrappedFieldMetaProps, WrappedFieldProps } from 'redux-form';

import { shallow, ShallowWrapper } from 'enzyme';

import { MapInputToProps, MapMetaToProps, reduxFormComponent } from './redux-form-component';
import { mapInputKeys } from './redux-form-mapping';

interface ITestComponentMetaProps {
    isTouched: boolean;
}

interface ITestComponentInputProps {
    onChange: EventOrValueHandler<React.ChangeEvent<any>>;
}

interface ITestComponentOwnProps {
    ownProp: boolean;
}

type ITestComponentProps = ITestComponentInputProps &
    ITestComponentMetaProps &
    ITestComponentOwnProps;

const TestComponent: React.SFC<ITestComponentProps> = () => <></>;

describe('reduxFormComponent', () => {
    const mapMetaToProps: MapMetaToProps<ITestComponentMetaProps> = meta => ({
        isTouched: meta.touched,
    });

    const mapInputToProps: MapInputToProps<ITestComponentInputProps> = mapInputKeys<
        ITestComponentInputProps
    >('onChange');

    let ReduxFormComponent: React.ComponentType<
            WrappedFieldProps & ITestComponentOwnProps
        >,
        wrapper: ShallowWrapper<WrappedFieldProps>,
        props: WrappedFieldProps & ITestComponentOwnProps;

    beforeEach(() => {
        ReduxFormComponent = reduxFormComponent<
            ITestComponentMetaProps,
            ITestComponentInputProps,
            ITestComponentOwnProps
        >(mapMetaToProps, mapInputToProps)(TestComponent);

        props = {
            ownProp: true,
            input: {
                onChange: jest.fn(),
                onBlur: jest.fn(),
                onFocus: jest.fn(),
                onDragStart: jest.fn(),
                onDrop: jest.fn(),
                name: 'test props',
                value: 1,
            },
            meta: {
                autofilled: false,
                asyncValidating: false,
                touched: false,
                dirty: false,
                invalid: false,
                pristine: false,
                submitting: false,
                submitFailed: false,
                valid: false,
                visited: false,
            } as WrappedFieldMetaProps,
        };

        wrapper = shallow(<ReduxFormComponent {...props} />);
    });

    it('should render the underlying component', () => {
        expect(wrapper.is(TestComponent)).toBe(true);
    });

    it('should map the meta props correctly', () => {
        expect(wrapper.find(TestComponent).props().isTouched).toBe(props.meta.touched);
    });

    it('should map the input props correctly', () => {
        expect(wrapper.find(TestComponent).props().onChange).toBe(props.input.onChange);
    });

    it('should correctly pass the own props', () => {
        expect(wrapper.find(TestComponent).props().ownProp).toBe(props.ownProp);
    });

    describe('when not provided with a mapMetaToProps', () => {
        beforeEach(() => {
            ReduxFormComponent = reduxFormComponent<
                ITestComponentMetaProps,
                ITestComponentInputProps,
                ITestComponentOwnProps
            >(null, mapInputToProps)(TestComponent);

            wrapper = shallow(<ReduxFormComponent {...props} />);
        });

        it('should not receive any meta props', () => {
            expect(wrapper.find(TestComponent).props().isTouched).toBeUndefined();
        });
    });

    describe('when not provided with a mapInputToProps', () => {
        beforeEach(() => {
            ReduxFormComponent = reduxFormComponent<
                ITestComponentMetaProps,
                ITestComponentInputProps,
                ITestComponentOwnProps
            >(mapMetaToProps, null)(TestComponent);

            wrapper = shallow(<ReduxFormComponent {...props} />);
        });

        it('should not receive any input props', () => {
            expect(wrapper.find(TestComponent).props().onChange).toBeUndefined();
        });
    });
});
