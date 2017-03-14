var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import { mount } from 'enzyme';

import { expectComponent } from 'testUtils';

import AuthButton from 'ui/button/auth_button';

describe('AuthButton', function () {
  var defaultProps = {
    label: 'label',
    onClick: jest.fn(),
    strategy: 'strategy'
  };
  it('renders correctly', function () {
    expectComponent(React.createElement(AuthButton, defaultProps)).toMatchSnapshot();
  });
  it('renders with style customizations', function () {
    expectComponent(React.createElement(AuthButton, _extends({}, defaultProps, {
      icon: 'test',
      primaryColor: 'primaryColor',
      foregroundColor: 'foregroundColor'
    }))).toMatchSnapshot();
  });
  it('renders when `big` is false', function () {
    expectComponent(React.createElement(AuthButton, _extends({}, defaultProps, {
      isBig: false
    }))).toMatchSnapshot();
  });
  it('should trigger onClick when clicked', function () {
    var wrapper = mount(React.createElement(AuthButton, defaultProps));
    wrapper.find('button').simulate('click');
    expect(defaultProps.onClick.mock.calls.length).toBe(1);
  });
});
