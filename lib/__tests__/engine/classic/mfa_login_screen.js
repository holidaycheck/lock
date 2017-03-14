import React from 'react';
import { mount } from 'enzyme';

import { expectComponent, extractPropsFromWrapper, mockComponent } from 'testUtils';

jest.mock('connection/database/mfa_pane', function () {
  return mockComponent('mfa_pane');
});

//there's a circular dependency with this module, so we need to mock it
jest.mock('engine/classic');

var getComponent = function getComponent() {
  var MFALoginScreen = require('engine/classic/mfa_login_screen').default;
  var screen = new MFALoginScreen();
  return screen.render();
};

describe('MFALoginScreen', function () {
  beforeEach(function () {
    jest.resetModules();

    jest.mock('connection/database/index', function () {
      return {
        hasScreen: function hasScreen() {
          return false;
        }
      };
    });

    jest.mock('connection/database/actions', function () {
      return {
        cancelMFALogin: jest.fn(),
        logIn: jest.fn()
      };
    });

    jest.mock('core/signed_in_confirmation', function () {
      return {
        renderSignedInConfirmation: jest.fn()
      };
    });
  });
  var defaultProps = {
    i18n: {
      str: function str() {
        for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
          keys[_key] = arguments[_key];
        }

        return keys.join(',');
      }
    },
    model: 'model'
  };
  it('renders correctly', function () {
    var Component = getComponent();

    expectComponent(React.createElement(Component, defaultProps)).toMatchSnapshot();
  });
});
