import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('ui/input/password_input', function () {
  return mockComponent('password_input');
});

var getComponent = function getComponent() {
  return require('field/password/password_pane').default;
};

describe('PasswordPane', function () {
  var defaultProps = {
    i18n: {
      str: function str() {
        for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
          keys[_key] = arguments[_key];
        }

        return keys.join(',');
      }
    },
    lock: {},
    placeholder: 'placeholder',
    policy: 'policy',
    strengthMessages: {}
  };

  beforeEach(function () {
    jest.resetModules();

    jest.mock('field/index', function () {
      return {
        getFieldValue: function getFieldValue() {
          return 'password';
        },
        isFieldVisiblyInvalid: function isFieldVisiblyInvalid() {
          return true;
        }
      };
    });

    jest.mock('field/password', function () {
      return {
        setPassword: 'setPassword'
      };
    });

    jest.mock('core/index', function () {
      return {
        id: function id() {
          return 1;
        },
        submitting: function submitting() {
          return false;
        },
        ui: {
          avatar: function avatar() {
            return false;
          }
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

  it('renders correctly', function () {
    var PasswordPane = getComponent();
    expectComponent(React.createElement(PasswordPane, defaultProps)).toMatchSnapshot();
  });
  it('disables input when submitting', function () {
    require('core/index').submitting = function () {
      return true;
    };
    var PasswordPane = getComponent();

    expectComponent(React.createElement(PasswordPane, defaultProps)).toMatchSnapshot();
  });
  it('sets isValid as true when `isFieldVisiblyInvalid` is false', function () {
    require('field/index').isFieldVisiblyInvalid = function () {
      return false;
    };
    var PasswordPane = getComponent();

    expectComponent(React.createElement(PasswordPane, defaultProps)).toMatchSnapshot();
  });
  it('calls `swap` onChange', function () {
    var PasswordPane = getComponent();

    var wrapper = mount(React.createElement(PasswordPane, defaultProps));
    var props = extractPropsFromWrapper(wrapper);
    props.onChange({ target: { value: 'newUser' } });

    var mock = require('store/index').swap.mock;

    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0]).toMatchSnapshot();
  });
});
