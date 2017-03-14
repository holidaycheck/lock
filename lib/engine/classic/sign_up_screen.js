function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import Screen from '../../core/screen';

import { hasScreen, mustAcceptTerms, termsAccepted } from '../../connection/database/index';
import { signUp, toggleTermsAcceptance } from '../../connection/database/actions';
import { hasOnlyClassicConnections, isSSOEnabled, useBigSocialButtons } from '../classic';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import { renderSignedUpConfirmation } from '../../connection/database/signed_up_confirmation';
import { renderOptionSelection } from '../../field/index';
import { logIn as enterpriseLogIn } from '../../connection/enterprise/actions';
import * as l from '../../core/index';
import * as i18n from '../../i18n';

import SignUpPane from './sign_up_pane';
import PaneSeparator from '../../core/pane_separator';
import SignUpTerms from '../../connection/database/sign_up_terms';
import SocialButtonsPane from '../../field/social/social_buttons_pane';
import LoginSignUpTabs from '../../connection/database/login_sign_up_tabs';
import SingleSignOnNotice from '../../connection/enterprise/single_sign_on_notice';

var Component = function Component(_ref) {
  var i18n = _ref.i18n,
      model = _ref.model;

  var sso = isSSOEnabled(model) && hasScreen(model, "login");
  var ssoNotice = sso && React.createElement(
    SingleSignOnNotice,
    null,
    i18n.str("ssoEnabled")
  );

  var tabs = !sso && hasScreen(model, "login") && React.createElement(LoginSignUpTabs, {
    key: 'loginsignup',
    lock: model,
    loginLabel: i18n.str("loginLabel"),
    signUpLabel: i18n.str("signUpLabel")
  });

  var social = l.hasSomeConnections(model, "social") && React.createElement(SocialButtonsPane, {
    bigButtons: useBigSocialButtons(model),
    instructions: i18n.html("socialSignUpInstructions"),
    labelFn: i18n.str,
    lock: model,
    signUp: true
  });

  var signUpInstructionsKey = social ? "databaseAlternativeSignUpInstructions" : "databaseSignUpInstructions";

  var db = (l.hasSomeConnections(model, "database") || l.hasSomeConnections(model, "enterprise")) && React.createElement(SignUpPane, {
    emailInputPlaceholder: i18n.str("emailInputPlaceholder"),
    i18n: i18n,
    instructions: i18n.html(signUpInstructionsKey),
    model: model,
    onlyEmail: sso,
    passwordInputPlaceholder: i18n.str("passwordInputPlaceholder"),
    passwordStrengthMessages: i18n.group("passwordStrength"),
    usernameInputPlaceholder: i18n.str("usernameInputPlaceholder")
  });

  var separator = social && db && React.createElement(PaneSeparator, null);

  return React.createElement(
    'div',
    null,
    ssoNotice,
    tabs,
    social,
    separator,
    db
  );
};

var SignUp = function (_Screen) {
  _inherits(SignUp, _Screen);

  function SignUp() {
    _classCallCheck(this, SignUp);

    return _possibleConstructorReturn(this, _Screen.call(this, "main.signUp"));
  }

  SignUp.prototype.submitButtonLabel = function submitButtonLabel(m) {
    return i18n.str(m, ["signUpSubmitLabel"]);
  };

  SignUp.prototype.submitHandler = function submitHandler(m) {
    if (hasOnlyClassicConnections(m, "social")) return null;
    if (isSSOEnabled(m)) return enterpriseLogIn;
    return signUp;
  };

  SignUp.prototype.isSubmitDisabled = function isSubmitDisabled(m) {
    return !termsAccepted(m);
  };

  SignUp.prototype.renderAuxiliaryPane = function renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock) || renderSignedUpConfirmation(lock) || renderOptionSelection(lock);
  };

  SignUp.prototype.renderTabs = function renderTabs() {
    return true;
  };

  SignUp.prototype.getScreenTitle = function getScreenTitle(m) {
    return i18n.str(m, "signupTitle");
  };

  SignUp.prototype.renderTerms = function renderTerms(m, terms) {
    var checkHandler = mustAcceptTerms(m) ? function () {
      return toggleTermsAcceptance(l.id(m));
    } : undefined;
    return terms || mustAcceptTerms(m) ? React.createElement(
      SignUpTerms,
      { checkHandler: checkHandler, checked: termsAccepted(m) },
      terms
    ) : null;
  };

  SignUp.prototype.render = function render() {
    return Component;
  };

  return SignUp;
}(Screen);

export default SignUp;
