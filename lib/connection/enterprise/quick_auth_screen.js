function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import Screen from '../../core/screen';
import QuickAuthPane from '../../ui/pane/quick_auth_pane';
import { logIn } from '../../quick-auth/actions';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import * as l from '../../core/index';
import { quickAuthConnection } from '../enterprise';
import { authButtonsTheme } from '../../connection/social/index';

// TODO: handle this from CSS
function icon(strategy) {
  if (strategy === "google-apps") return strategy;
  if (~["adfs", "office365", "waad"].indexOf(strategy)) return "windows";
  return "auth0";
}

var Component = function Component(_ref) {
  var i18n = _ref.i18n,
      model = _ref.model;

  var headerText = i18n.html("enterpriseLoginIntructions") || null;
  var header = headerText && React.createElement(
    'p',
    null,
    headerText
  );

  var theme = authButtonsTheme(model);

  var connection = quickAuthConnection(model);
  var connectionName = connection.getIn(["name"]);
  var connectionDomain = connection.getIn(["domains", 0]);

  var buttonTheme = theme.get(connection.get("name"));

  var buttonLabel = buttonTheme && buttonTheme.get("displayName") || connectionDomain && i18n.str("loginAtLabel", connectionDomain) || i18n.str("loginAtLabel", connectionName);

  var primaryColor = buttonTheme && buttonTheme.get("primaryColor");
  var foregroundColor = buttonTheme && buttonTheme.get("foregroundColor");
  var buttonIcon = buttonTheme && buttonTheme.get("icon");

  return React.createElement(QuickAuthPane, {
    buttonLabel: buttonLabel,
    buttonClickHandler: function buttonClickHandler(e) {
      return logIn(l.id(model), quickAuthConnection(model));
    },
    header: header,
    buttonIcon: buttonIcon,
    primaryColor: primaryColor,
    foregroundColor: foregroundColor,
    strategy: icon(quickAuthConnection(model).get("strategy"))
  });
};

var QuickAuthScreen = function (_Screen) {
  _inherits(QuickAuthScreen, _Screen);

  function QuickAuthScreen() {
    _classCallCheck(this, QuickAuthScreen);

    return _possibleConstructorReturn(this, _Screen.call(this, "enterpriseQuickAuth"));
  }

  QuickAuthScreen.prototype.renderAuxiliaryPane = function renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  };

  QuickAuthScreen.prototype.render = function render() {
    return Component;
  };

  return QuickAuthScreen;
}(Screen);

export default QuickAuthScreen;
