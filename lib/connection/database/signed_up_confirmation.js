function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import SuccessPane from '../../ui/box/success_pane';
import { closeLock } from '../../core/actions';
import * as l from '../../core/index';
import { shouldAutoLogin } from './index';
import * as i18n from '../../i18n'; // TODO: can't we get this from props?

var SignedUpConfirmation = function (_React$Component) {
  _inherits(SignedUpConfirmation, _React$Component);

  function SignedUpConfirmation() {
    _classCallCheck(this, SignedUpConfirmation);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  SignedUpConfirmation.prototype.handleClose = function handleClose() {
    var _props = this.props,
        closeHandler = _props.closeHandler,
        lock = _props.lock;

    closeHandler(l.id(lock));
  };

  SignedUpConfirmation.prototype.render = function render() {
    var lock = this.props.lock;

    var closeHandler = l.ui.closable(lock) ? this.handleClose.bind(this) : undefined;

    return React.createElement(
      SuccessPane,
      { closeHandler: closeHandler },
      React.createElement(
        'p',
        null,
        i18n.html(lock, ["success", "signUp"])
      )
    );
  };

  return SignedUpConfirmation;
}(React.Component);

export default SignedUpConfirmation;


SignedUpConfirmation.propTypes = {
  closeHandler: React.PropTypes.func.isRequired,
  lock: React.PropTypes.object.isRequired
};

export function renderSignedUpConfirmation(m) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  props.closeHandler = closeLock;
  props.key = "auxiliarypane";
  props.lock = m;

  return m.get("signedUp") && !shouldAutoLogin(m) ? React.createElement(SignedUpConfirmation, props) : null;
}
