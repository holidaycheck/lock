import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('ui/input/text_input', function () {
  return mockComponent('text_input');
});
jest.mock('ui/input/select_input', function () {
  return mockComponent('select_input');
});

var getComponent = function getComponent() {
  return require('field/custom_input').default;
};

describe('CustomInput', function () {
  var defaultProps = {
    iconUrl: 'iconUrl',
    placeholder: 'placeholder',
    name: 'custom_input',
    model: {},
    validator: 'validator'
  };

  beforeEach(function () {
    jest.resetModules();

    jest.mock('core/index', function () {
      return {
        id: function id() {
          return 1;
        }
      };
    });

    jest.mock('field/actions', function () {
      return {
        changeField: jest.fn(),
        startOptionSelection: jest.fn()
      };
    });

    jest.mock('field/index', function () {
      return {
        getFieldInvalidHint: function getFieldInvalidHint(model, name) {
          return 'invalid-hint-' + name;
        },
        getFieldLabel: jest.fn(),
        getFieldValue: function getFieldValue(model, name) {
          return 'field-value-' + name;
        },
        isFieldVisiblyInvalid: function isFieldVisiblyInvalid() {
          return true;
        }
      };
    });

    jest.mock('store/index', function () {
      return {
        swap: jest.fn(),
        updateEntity: 'updateEntity'
      };
    });
  });
  describe('when type === select', function () {
    beforeEach(function () {
      return defaultProps.type = 'select';
    });
    it('renders correctly as a SelectInput', function () {
      var CustomInput = getComponent();

      expectComponent(React.createElement(CustomInput, defaultProps)).toMatchSnapshot();
    });
    it('sets isValid as true when `isFieldVisiblyInvalid` is false', function () {
      require('field/index').isFieldVisiblyInvalid = function () {
        return false;
      };
      var CustomInput = getComponent();

      expectComponent(React.createElement(CustomInput, defaultProps)).toMatchSnapshot();
    });
    it('calls `startOptionSelection` when clicked', function () {
      var CustomInput = getComponent();

      var wrapper = mount(React.createElement(CustomInput, defaultProps));
      var props = extractPropsFromWrapper(wrapper);

      props.onClick();

      var mock = require('field/actions').startOptionSelection.mock;

      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
  });
  describe('when type == input', function () {
    beforeEach(function () {
      return defaultProps.type = 'input';
    });
    it('renders correctly as a TextInput', function () {
      var CustomInput = getComponent();

      expectComponent(React.createElement(CustomInput, defaultProps)).toMatchSnapshot();
    });
    it('sets isValid as true when `isFieldVisiblyInvalid` is false', function () {
      require('field/index').isFieldVisiblyInvalid = function () {
        return false;
      };
      var CustomInput = getComponent();

      expectComponent(React.createElement(CustomInput, defaultProps)).toMatchSnapshot();
    });
    it('calls `changeField` when changed', function () {
      var CustomInput = getComponent();

      var wrapper = mount(React.createElement(CustomInput, defaultProps));
      var props = extractPropsFromWrapper(wrapper);

      props.onChange({ target: { value: 'newUser' } });

      var mock = require('field/actions').changeField.mock;

      expect(mock.calls.length).toBe(1);
      expect(mock.calls[0]).toMatchSnapshot();
    });
  });
  describe('when type == checkbox', function () {
    beforeEach(function () {
      return defaultProps.type = 'checkbox';
    });
    it('renders correctly as a CheckBoxInput', function () {
      var CustomInput = getComponent();

      expectComponent(React.createElement(CustomInput, defaultProps)).toMatchSnapshot();
    });
  });
});
