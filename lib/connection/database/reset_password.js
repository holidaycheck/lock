function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import Screen from '../../core/screen';
import ResetPasswordPane from './reset_password_pane';
import { authWithUsername, hasScreen } from './index';
import { cancelResetPassword, resetPassword } from './actions';
import { renderPasswordResetConfirmation } from './password_reset_confirmation';
import * as i18n from '../../i18n';

var Component = function Component(_ref) {
  var i18n = _ref.i18n,
      model = _ref.model;

  var headerText = i18n.html("forgotPasswordInstructions") || null;
  var header = headerText && React.createElement(
    'p',
    null,
    headerText
  );

  return React.createElement(ResetPasswordPane, {
    emailInputPlaceholder: i18n.str("emailInputPlaceholder"),
    header: header,
    i18n: i18n,
    lock: model
  });
};

var ResetPassword = function (_Screen) {
  _inherits(ResetPassword, _Screen);

  function ResetPassword() {
    _classCallCheck(this, ResetPassword);

    return _possibleConstructorReturn(this, _Screen.call(this, "forgotPassword"));
  }

  ResetPassword.prototype.backHandler = function backHandler(m) {
    return hasScreen(m, "login") ? cancelResetPassword : undefined;
  };

  ResetPassword.prototype.submitButtonLabel = function submitButtonLabel(m) {
    return i18n.str(m, ["forgotPasswordSubmitLabel"]);
  };

  ResetPassword.prototype.getScreenTitle = function getScreenTitle(m) {
    return i18n.str(m, "forgotPasswordTitle");
  };

  ResetPassword.prototype.submitHandler = function submitHandler() {
    return resetPassword;
  };

  ResetPassword.prototype.renderAuxiliaryPane = function renderAuxiliaryPane(m) {
    return renderPasswordResetConfirmation(m);
  };

  ResetPassword.prototype.render = function render() {
    return Component;
  };

  return ResetPassword;
}(Screen);

export default ResetPassword;
