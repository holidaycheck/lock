function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import Screen from '../screen';
import QuickAuthPane from '../../ui/pane/quick_auth_pane';
import { logIn, skipQuickAuth } from '../../quick-auth/actions';
import { lastUsedConnection, lastUsedUsername } from './index';
import * as l from '../index';
import { renderSignedInConfirmation } from '../signed_in_confirmation';
import { STRATEGIES as SOCIAL_STRATEGIES } from '../../connection/social/index';

// TODO: handle this from CSS
function icon(strategy) {
  if (SOCIAL_STRATEGIES[strategy]) return strategy;
  if (strategy === "google-apps") return strategy;
  if (~["adfs", "office365", "waad"].indexOf(strategy)) return "windows";
  return "auth0";
}

var Component = function Component(_ref) {
  var i18n = _ref.i18n,
      model = _ref.model;

  var headerText = i18n.html("lastLoginInstructions") || null;
  var header = headerText && React.createElement(
    'p',
    null,
    headerText
  );

  var buttonClickHandler = function buttonClickHandler() {
    logIn(l.id(model), lastUsedConnection(model), lastUsedUsername(model));
  };

  return React.createElement(QuickAuthPane, {
    alternativeLabel: i18n.str("notYourAccountAction"),
    alternativeClickHandler: function alternativeClickHandler() {
      return skipQuickAuth(l.id(model));
    },
    buttonLabel: lastUsedUsername(model),
    buttonClickHandler: buttonClickHandler,
    header: header,
    strategy: icon(lastUsedConnection(model).get("strategy"))
  });
};

var LastLoginScreen = function (_Screen) {
  _inherits(LastLoginScreen, _Screen);

  function LastLoginScreen() {
    _classCallCheck(this, LastLoginScreen);

    return _possibleConstructorReturn(this, _Screen.call(this, "lastLogin"));
  }

  LastLoginScreen.prototype.renderAuxiliaryPane = function renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  };

  LastLoginScreen.prototype.render = function render() {
    return Component;
  };

  return LastLoginScreen;
}(Screen);

export default LastLoginScreen;
