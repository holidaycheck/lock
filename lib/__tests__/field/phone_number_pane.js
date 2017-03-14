var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('ui/input/phone_number_input', function () {
  return mockComponent('phone_number_input');
});
jest.mock('ui/input/select_input', function () {
  return mockComponent('select_input');
});

var getComponent = function getComponent() {
  return require('field/phone-number/phone_number_pane').default;
};

describe('PhoneNumberPane', function () {
  var defaultProps = {
    lock: {},
    placeholder: 'placeholder'
  };
  beforeEach(function () {
    jest.resetModules();

    jest.mock('field/index', function () {
      return {
        phoneNumber: function phoneNumber() {
          return 'phoneNumber';
        },
        isFieldVisiblyInvalid: function isFieldVisiblyInvalid() {
          return true;
        }
      };
    });

    jest.mock('field/phone_number', function () {
      return {
        humanLocation: function humanLocation() {
          return 'humanLocation';
        },
        setPhoneNumber: 'setPhoneNumber'
      };
    });

    jest.mock('core/index', function () {
      return {
        id: function id() {
          return 1;
        },
        submitting: function submitting() {
          return false;
        }
      };
    });

    jest.mock('field/actions', function () {
      return {
        startOptionSelection: jest.fn()
      };
    });

    jest.mock('store/index', function () {
      return {
        swap: jest.fn(),
        updateEntity: 'updateEntity'
      };
    });
  });

  it('renders correctly', function () {
    var PhoneNumberPane = getComponent();
    expectComponent(React.createElement(PhoneNumberPane, defaultProps)).toMatchSnapshot();
  });
  it('shows header when instructions are available', function () {
    var PhoneNumberPane = getComponent();
    expectComponent(React.createElement(PhoneNumberPane, _extends({}, defaultProps, {
      instructions: React.createElement(
        'span',
        null,
        'instructions'
      )
    }))).toMatchSnapshot();
  });
  it('disables input when submitting', function () {
    require('core/index').submitting = function () {
      return true;
    };
    var PhoneNumberPane = getComponent();

    expectComponent(React.createElement(PhoneNumberPane, defaultProps)).toMatchSnapshot();
  });
  it('sets isValid as true when `isFieldVisiblyInvalid` is false', function () {
    require('field/index').isFieldVisiblyInvalid = function () {
      return false;
    };
    var PhoneNumberPane = getComponent();

    expectComponent(React.createElement(PhoneNumberPane, defaultProps)).toMatchSnapshot();
  });
  it('calls `startOptionSelection` when SelectInput is clicked', function () {
    var PhoneNumberPane = getComponent();

    var wrapper = mount(React.createElement(PhoneNumberPane, defaultProps));
    var props = extractPropsFromWrapper(wrapper, 1);

    props.onClick();

    var mock = require('field/actions').startOptionSelection.mock;

    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
  it('calls `swap` when PhoneNumberInput changes', function () {
    var PhoneNumberPane = getComponent();

    var wrapper = mount(React.createElement(PhoneNumberPane, defaultProps));
    var props = extractPropsFromWrapper(wrapper, 2);

    props.onChange({ target: { value: 'newPhoneNumber' } });

    var mock = require('store/index').swap.mock;

    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
});
