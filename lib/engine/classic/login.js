function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import Screen from '../../core/screen';
import SocialButtonsPane from '../../field/social/social_buttons_pane';
import LoginPane from '../../connection/database/login_pane';
import PaneSeparator from '../../core/pane_separator';
import { databaseConnection, databaseUsernameStyle, databaseUsernameValue, defaultDatabaseConnection, hasInitialScreen, hasScreen, signUpLink } from '../../connection/database/index';
import { logIn as databaseLogIn } from '../../connection/database/actions';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import LoginSignUpTabs from '../../connection/database/login_sign_up_tabs';
import * as l from '../../core/index';
import { logIn as enterpriseLogIn, startHRD } from '../../connection/enterprise/actions';
import { defaultEnterpriseConnection, findADConnectionWithoutDomain, isHRDDomain } from '../../connection/enterprise';
import SingleSignOnNotice from '../../connection/enterprise/single_sign_on_notice';
import { hasOnlyClassicConnections, isSSOEnabled, useBigSocialButtons } from '../classic';
import * as i18n from '../../i18n';

function shouldRenderTabs(m) {
  if (isSSOEnabled(m)) return false;
  if (l.hasSomeConnections(m, "database")) return hasScreen(m, "signUp");
  if (l.hasSomeConnections(m, "social") && hasInitialScreen(m, "signUp")) return hasScreen(m, "signUp");
}

var Component = function Component(_ref) {
  var i18n = _ref.i18n,
      model = _ref.model;

  var sso = isSSOEnabled(model);
  var onlySocial = hasOnlyClassicConnections(model, "social");

  var tabs = shouldRenderTabs(model) && React.createElement(LoginSignUpTabs, {
    key: 'loginsignup',
    lock: model,
    loginLabel: i18n.str("loginLabel"),
    signUpLink: signUpLink(model),
    signUpLabel: i18n.str("signUpLabel")
  });

  var social = l.hasSomeConnections(model, "social") && React.createElement(SocialButtonsPane, {
    bigButtons: useBigSocialButtons(model),
    instructions: i18n.html("socialLoginInstructions"),
    labelFn: i18n.str,
    lock: model,
    showLoading: onlySocial,
    signUp: false
  });

  var showPassword = !sso && (l.hasSomeConnections(model, "database") || !!findADConnectionWithoutDomain(model));

  var showForgotPasswordLink = showPassword && l.hasSomeConnections(model, "database");

  var loginInstructionsKey = social ? "databaseEnterpriseAlternativeLoginInstructions" : "databaseEnterpriseLoginInstructions";

  var usernameInputPlaceholderKey = databaseUsernameStyle(model) === "any" || l.countConnections(model, "enterprise") > 1 ? "usernameOrEmailInputPlaceholder" : "usernameInputPlaceholder";

  var usernameStyle = databaseUsernameStyle(model);

  var login = (sso || l.hasSomeConnections(model, "database") || l.hasSomeConnections(model, "enterprise")) && React.createElement(LoginPane, {
    emailInputPlaceholder: i18n.str("emailInputPlaceholder"),
    forgotPasswordAction: i18n.str("forgotPasswordAction"),
    i18n: i18n,
    instructions: i18n.html(loginInstructionsKey),
    lock: model,
    passwordInputPlaceholder: i18n.str("passwordInputPlaceholder"),
    showForgotPasswordLink: showForgotPasswordLink,
    showPassword: showPassword,
    usernameInputPlaceholder: i18n.str(usernameInputPlaceholderKey),
    usernameStyle: usernameStyle
  });

  var ssoNotice = sso && React.createElement(
    SingleSignOnNotice,
    null,
    i18n.str("ssoEnabled")
  );

  var separator = social && login && React.createElement(PaneSeparator, null);

  return React.createElement(
    'div',
    null,
    ssoNotice,
    tabs,
    social,
    separator,
    login
  );
};

var Login = function (_Screen) {
  _inherits(Login, _Screen);

  function Login() {
    _classCallCheck(this, Login);

    return _possibleConstructorReturn(this, _Screen.call(this, "main.login"));
  }

  Login.prototype.renderAuxiliaryPane = function renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  };

  Login.prototype.renderTabs = function renderTabs(model) {
    return shouldRenderTabs(model);
  };

  Login.prototype.submitButtonLabel = function submitButtonLabel(m) {
    return i18n.str(m, ["loginSubmitLabel"]);
  };

  Login.prototype.isSubmitDisabled = function isSubmitDisabled(m) {
    // it should disable the submit button if there is any connection that
    // requires username/password and there is no enterprise with domain
    // that matches with the email domain entered for HRD
    return !l.hasSomeConnections(m, "database") // no database connection
    && !findADConnectionWithoutDomain(m) // no enterprise without domain
    && !isSSOEnabled(m); // no matching domain
  };

  Login.prototype.submitHandler = function submitHandler(model) {
    if (hasOnlyClassicConnections(model, "social")) {
      return null;
    }

    if (isHRDDomain(model, databaseUsernameValue(model))) {
      return function (id) {
        return startHRD(id, databaseUsernameValue(model));
      };
    }

    var useDatabaseConnection = !isSSOEnabled(model) && databaseConnection(model) && (defaultDatabaseConnection(model) || !defaultEnterpriseConnection(model));

    return useDatabaseConnection ? databaseLogIn : enterpriseLogIn;
  };

  Login.prototype.render = function render() {
    return Component;
  };

  return Login;
}(Screen);

export default Login;
