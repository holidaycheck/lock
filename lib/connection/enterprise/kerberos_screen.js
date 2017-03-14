function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import Screen from '../../core/screen';
import QuickAuthPane from '../../ui/pane/quick_auth_pane';
import { logIn, skipQuickAuth } from '../../quick-auth/actions';
import { renderSignedInConfirmation } from '../../core/signed_in_confirmation';
import * as l from '../../core/index';
import { corpNetworkConnection } from '../enterprise';

var Component = function Component(_ref) {
  var i18n = _ref.i18n,
      model = _ref.model;

  var headerText = i18n.html("windowsAuthInstructions") || null;
  var header = headerText && React.createElement(
    'p',
    null,
    headerText
  );

  return React.createElement(QuickAuthPane, {
    alternativeLabel: i18n.str("notYourAccountAction"),
    alternativeClickHandler: function alternativeClickHandler() {
      return skipQuickAuth(l.id(model));
    },
    buttonLabel: i18n.str("windowsAuthLabel"),
    buttonClickHandler: function buttonClickHandler(e) {
      return logIn(l.id(model), corpNetworkConnection(model));
    },
    header: header,
    strategy: 'windows'
  });
};

var KerberosScreen = function (_Screen) {
  _inherits(KerberosScreen, _Screen);

  function KerberosScreen() {
    _classCallCheck(this, KerberosScreen);

    return _possibleConstructorReturn(this, _Screen.call(this, "kerberos"));
  }

  KerberosScreen.prototype.renderAuxiliaryPane = function renderAuxiliaryPane(lock) {
    return renderSignedInConfirmation(lock);
  };

  KerberosScreen.prototype.render = function render() {
    return Component;
  };

  return KerberosScreen;
}(Screen);

export default KerberosScreen;
