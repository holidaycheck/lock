function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import Screen from '../../core/screen';
import EmailPane from '../../field/email/email_pane';
import SocialButtonsPane from '../../field/social/social_buttons_pane';
import PaneSeparator from '../../core/pane_separator';
import { requestPasswordlessEmail } from '../../connection/passwordless/actions';
import { renderEmailSentConfirmation } from '../../connection/passwordless/email_sent_confirmation';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import { useBigButtons } from '../../connection/social/index';
import * as l from '../../core/index';

var useSocialBigButtons = function useSocialBigButtons(m) {
  var limit = l.connections(m, "passwordless", "email").count() === 0 ? 5 : 3;
  return useBigButtons(m, limit);
};

var Component = function Component(_ref) {
  var i18n = _ref.i18n,
      model = _ref.model;

  var social = l.hasSomeConnections(model, "social") ? React.createElement(SocialButtonsPane, {
    bigButtons: useSocialBigButtons(model),
    instructions: i18n.html("socialLoginInstructions"),
    labelFn: i18n.str,
    lock: model,
    signUp: false
  }) : null;

  var email = l.hasSomeConnections(model, "passwordless", "email") ? React.createElement(EmailPane, {
    i18n: i18n,
    lock: model,
    placeholder: i18n.str("emailInputPlaceholder")
  }) : null;

  // TODO: instructions can't be on EmailPane beacuse it breaks the CSS,
  // all input fields needs to share a parent so the last one doesn't have
  // a bottom margin.
  //
  // Maybe we can make new PasswordlessEmailPane component.
  var emailInstructionsI18nKey = social ? "passwordlessEmailAlternativeInstructions" : "passwordlessEmailInstructions";

  var headerText = i18n.html(emailInstructionsI18nKey) || null;
  var header = email && headerText && React.createElement(
    'p',
    null,
    headerText
  );

  var separator = social && email ? React.createElement(PaneSeparator, null) : null;

  return React.createElement(
    'div',
    null,
    social,
    separator,
    header,
    email
  );
};

var SocialOrEmailLoginScreen = function (_Screen) {
  _inherits(SocialOrEmailLoginScreen, _Screen);

  function SocialOrEmailLoginScreen() {
    _classCallCheck(this, SocialOrEmailLoginScreen);

    return _possibleConstructorReturn(this, _Screen.call(this, "socialOrEmail"));
  }

  SocialOrEmailLoginScreen.prototype.submitHandler = function submitHandler(m) {
    return l.hasSomeConnections(m, "passwordless", "email") ? requestPasswordlessEmail : null;
  };

  SocialOrEmailLoginScreen.prototype.renderAuxiliaryPane = function renderAuxiliaryPane(lock) {
    return renderEmailSentConfirmation(lock) || renderSignedInConfirmation(lock);
  };

  SocialOrEmailLoginScreen.prototype.render = function render() {
    return Component;
  };

  return SocialOrEmailLoginScreen;
}(Screen);

export default SocialOrEmailLoginScreen;
