function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import Screen from '../../core/screen';
import VcodePane from '../../field/vcode/vcode_pane';
import { isEmail } from './index';
import { restart, logIn } from './actions';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import { getFieldValue } from '../../field/index';
import { humanPhoneNumberWithDiallingCode } from '../../field/phone_number';

var Component = function Component(_ref) {
  var i18n = _ref.i18n,
      model = _ref.model;

  var instructions = isEmail(model) ? i18n.html("passwordlessEmailCodeInstructions", getFieldValue(model, "email")) : i18n.html("passwordlessSMSCodeInstructions", humanPhoneNumberWithDiallingCode(model));

  return React.createElement(VcodePane, {
    instructions: instructions,
    lock: model,
    placeholder: i18n.str("codeInputPlaceholder"),
    resendLabel: i18n.str("resendCodeAction"),
    onRestart: restart
  });
};

var VcodeScreen = function (_Screen) {
  _inherits(VcodeScreen, _Screen);

  function VcodeScreen() {
    _classCallCheck(this, VcodeScreen);

    return _possibleConstructorReturn(this, _Screen.call(this, "vcode"));
  }

  VcodeScreen.prototype.backHandler = function backHandler() {
    return restart;
  };

  VcodeScreen.prototype.submitHandler = function submitHandler() {
    return logIn;
  };

  VcodeScreen.prototype.renderAuxiliaryPane = function renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  };

  VcodeScreen.prototype.render = function render() {
    return Component;
  };

  return VcodeScreen;
}(Screen);

export default VcodeScreen;
