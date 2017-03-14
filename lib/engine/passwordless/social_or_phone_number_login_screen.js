function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import Screen from '../../core/screen';
import { sendSMS } from '../../connection/passwordless/actions';
import PhoneNumberPane from '../../field/phone-number/phone_number_pane';
import SocialButtonsPane from '../../field/social/social_buttons_pane';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import PaneSeparator from '../../core/pane_separator';
import { useBigButtons } from '../../connection/social/index';
import * as l from '../../core/index';

import { renderOptionSelection } from '../../field/index';

var useSocialBigButtons = function useSocialBigButtons(m) {
  var limit = l.connections(m, "passwordless", "sms").count() === 0 ? 5 : 3;
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

  var phoneNumberInstructionsI18nKey = social ? "passwordlessSMSAlternativeInstructions" : "passwordlessSMSInstructions";

  var phoneNumber = l.hasSomeConnections(model, "passwordless", "sms") ? React.createElement(PhoneNumberPane, {
    instructions: i18n.html(phoneNumberInstructionsI18nKey),
    lock: model,
    placeholder: i18n.str("phoneNumberInputPlaceholder")
  }) : null;

  var separator = social && phoneNumber ? React.createElement(PaneSeparator, null) : null;

  return React.createElement(
    'div',
    null,
    social,
    separator,
    phoneNumber
  );
};

var AskSocialNetworkOrPhoneNumber = function (_Screen) {
  _inherits(AskSocialNetworkOrPhoneNumber, _Screen);

  function AskSocialNetworkOrPhoneNumber() {
    _classCallCheck(this, AskSocialNetworkOrPhoneNumber);

    return _possibleConstructorReturn(this, _Screen.call(this, "socialOrPhoneNumber"));
  }

  AskSocialNetworkOrPhoneNumber.prototype.submitHandler = function submitHandler(m) {
    return l.hasSomeConnections(m, "passwordless", "sms") ? sendSMS : null;
  };

  AskSocialNetworkOrPhoneNumber.prototype.renderAuxiliaryPane = function renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock) || renderOptionSelection(lock);
  };

  AskSocialNetworkOrPhoneNumber.prototype.render = function render() {
    return Component;
  };

  return AskSocialNetworkOrPhoneNumber;
}(Screen);

export default AskSocialNetworkOrPhoneNumber;
