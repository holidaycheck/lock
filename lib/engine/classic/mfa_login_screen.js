function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import Screen from '../../core/screen';
import MFAPane from '../../connection/database/mfa_pane';
import * as i18n from '../../i18n';
import { cancelMFALogin, logIn } from '../../connection/database/actions';
import { hasScreen } from '../../connection/database/index';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';

var Component = function Component(_ref) {
  var i18n = _ref.i18n,
      model = _ref.model;


  return React.createElement(MFAPane, {
    mfaInputPlaceholder: i18n.str("mfaInputPlaceholder"),
    i18n: i18n,
    instructions: i18n.str("mfaLoginInstructions"),
    lock: model,
    title: i18n.str("mfaLoginTitle")
  });
};

var MFALoginScreen = function (_Screen) {
  _inherits(MFALoginScreen, _Screen);

  function MFALoginScreen() {
    _classCallCheck(this, MFALoginScreen);

    return _possibleConstructorReturn(this, _Screen.call(this, "mfa.mfaCode"));
  }

  MFALoginScreen.prototype.renderAuxiliaryPane = function renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  };

  MFALoginScreen.prototype.submitButtonLabel = function submitButtonLabel(m) {
    return i18n.str(m, ["mfaSubmitLabel"]);
  };

  MFALoginScreen.prototype.submitHandler = function submitHandler(m) {
    return function (id) {
      return logIn(id, true);
    };
  };

  MFALoginScreen.prototype.render = function render() {
    return Component;
  };

  MFALoginScreen.prototype.backHandler = function backHandler(m) {
    return hasScreen(m, "login") ? cancelMFALogin : undefined;
  };

  return MFALoginScreen;
}(Screen);

export default MFALoginScreen;
