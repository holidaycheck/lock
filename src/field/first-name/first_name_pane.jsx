import React from 'react';
import TextInput from '../../ui/input/text_input';
import * as c from '../index';

export default class FirstNamePane extends React.Component {
    render() {
        const { lock, placeholder } = this.props;

        const field = c.getField(lock, "firstName");
        const value = field.get('value', "");
        const valid = field.get('valid', true);

        return (
            <TextInput
                value={value}
                invalidHint='Wrong first name'
                isValid={true}
                onChange={::this.handleChange}
                placeholder={placeholder}
                name='firstName'
            />
        );
    }

}

FirstNamePane.propTypes = {
    lock: React.PropTypes.object.isRequired,
    placeholder: React.PropTypes.string.isRequired
};
