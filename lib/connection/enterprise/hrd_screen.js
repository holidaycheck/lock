function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import Screen from '../../core/screen';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import HRDPane from './hrd_pane';
import { cancelHRD, logIn } from './actions';
import { enterpriseDomain, isSingleHRDConnection } from '../enterprise';
import * as i18n from '../../i18n';

var Component = function Component(_ref) {
  var i18n = _ref.i18n,
      model = _ref.model;

  var domain = enterpriseDomain(model);

  var headerText;

  if (domain != null) {
    headerText = i18n.html("enterpriseActiveLoginInstructions", domain);
  } else {
    headerText = i18n.html("enterpriseLoginIntructions");
  }

  headerText = headerText || null;

  var header = headerText && React.createElement(
    'p',
    null,
    headerText
  );

  return React.createElement(HRDPane, {
    header: header,
    i18n: i18n,
    model: model,
    passwordInputPlaceholder: i18n.str("passwordInputPlaceholder"),
    usernameInputPlaceholder: i18n.str("usernameInputPlaceholder")
  });
};

var HRDScreen = function (_Screen) {
  _inherits(HRDScreen, _Screen);

  function HRDScreen() {
    _classCallCheck(this, HRDScreen);

    return _possibleConstructorReturn(this, _Screen.call(this, "hrd"));
  }

  HRDScreen.prototype.backHandler = function backHandler(model) {
    return isSingleHRDConnection(model) ? null : cancelHRD;
  };

  HRDScreen.prototype.submitButtonLabel = function submitButtonLabel(m) {
    return i18n.str(m, ["loginSubmitLabel"]);
  };

  HRDScreen.prototype.submitHandler = function submitHandler(model) {
    return logIn;
  };

  HRDScreen.prototype.renderAuxiliaryPane = function renderAuxiliaryPane(model) {
    return renderSignedInConfirmation(model);
  };

  HRDScreen.prototype.render = function render() {
    return Component;
  };

  return HRDScreen;
}(Screen);

export default HRDScreen;
