var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, mockComponent } from 'testUtils';

jest.mock('field/email/email_pane', function () {
  return mockComponent('email_pane');
});
jest.mock('field/username/username_pane', function () {
  return mockComponent('username_pane');
});
jest.mock('field/password/password_pane', function () {
  return mockComponent('password_pane');
});

jest.mock('connection/database/index');
jest.mock('connection/database/actions');

var mockId = 1;
jest.mock('core/index', function () {
  return {
    id: function id() {
      return mockId;
    }
  };
});

import LoginPane from 'connection/database/login_pane';

describe('LoginPane', function () {
  var defaultProps = {
    emailInputPlaceholder: 'emailInputPlaceholder',
    forgotPasswordAction: 'forgotPasswordAction',
    i18n: {},
    lock: {},
    passwordInputPlaceholder: 'passwordInputPlaceholder',
    showForgotPasswordLink: true,
    showPassword: true,
    usernameInputPlaceholder: 'usernameInputPlaceholder'
  };
  var databaseIndexMock = require('connection/database/index');

  beforeEach(function () {
    databaseIndexMock.hasScreen.mockImplementation(function () {
      return true;
    });
    databaseIndexMock.forgotPasswordLink.mockImplementation(function () {
      return 'forgotPasswordLink';
    });
  });

  it('renders correctly', function () {
    expectComponent(React.createElement(LoginPane, defaultProps)).toMatchSnapshot();
  });
  it('shows header when instructions is not empty', function () {
    expectComponent(React.createElement(LoginPane, _extends({}, defaultProps, {
      instructions: 'instructions'
    }))).toMatchSnapshot();
  });
  it('shows email pane when user usernameStyle === email', function () {
    expectComponent(React.createElement(LoginPane, _extends({}, defaultProps, {
      usernameStyle: 'email'
    }))).toMatchSnapshot();
  });
  it('shows username pane when user usernameStyle !== email', function () {
    expectComponent(React.createElement(LoginPane, _extends({}, defaultProps, {
      usernameStyle: 'any'
    }))).toMatchSnapshot();
    expectComponent(React.createElement(LoginPane, _extends({}, defaultProps, {
      usernameStyle: 'username'
    }))).toMatchSnapshot();
  });
  it('hides password pane when showPassword===false', function () {
    expectComponent(React.createElement(LoginPane, _extends({}, defaultProps, {
      showPassword: false
    }))).toMatchSnapshot();
  });
  describe('hides password link', function () {
    it('when showForgotPasswordLink === false', function () {
      expectComponent(React.createElement(LoginPane, _extends({}, defaultProps, {
        showForgotPasswordLink: false
      }))).toMatchSnapshot();
    });
    it('when lock does not have the screen `forgotPassword`', function () {
      databaseIndexMock.hasScreen.mockImplementation(function (l, screenName) {
        return screenName === 'forgotPassword' ? false : true;
      });
      expectComponent(React.createElement(LoginPane, defaultProps)).toMatchSnapshot();
    });
  });
  it('clicking password forgot link calls showResetPasswordActivity() when forgotPasswordLink() is undefined', function () {
    databaseIndexMock.forgotPasswordLink.mockImplementation(function () {
      return undefined;
    });
    var wrapper = mount(React.createElement(LoginPane, defaultProps));
    wrapper.find('a.auth0-lock-alternative-link').simulate('click');

    var actions = require('connection/database/actions');
    var calls = actions.showResetPasswordActivity.mock.calls;

    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(mockId);
  });
});
