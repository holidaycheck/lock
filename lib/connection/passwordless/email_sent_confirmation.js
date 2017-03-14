function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import SuccessPane from '../../ui/box/success_pane';
import { closeLock } from '../../core/actions';
import * as l from '../../core/index';
import * as c from '../../field/index';

import { resendEmail, restart } from './actions';
import * as m from './index';

import * as i18n from '../../i18n'; // TODO: can't we get this from pops?

var retrySvg = '<svg focusable="false" height="32px" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <path d="M27.877,19.662c0.385-1.23,0.607-2.531,0.607-3.884c0-7.222-5.83-13.101-13.029-13.194v4.238    c4.863,0.093,8.793,4.071,8.793,8.956c0,0.678-0.088,1.332-0.232,1.966l-3.963-1.966l2.76,8.199l8.197-2.762L27.877,19.662z"></path> <path d="M7.752,16.222c0-0.678,0.088-1.332,0.232-1.967l3.963,1.967l-2.76-8.199L0.99,10.785l3.133,1.553    c-0.384,1.23-0.607,2.531-0.607,3.885c0,7.223,5.83,13.1,13.03,13.194v-4.238C11.682,25.086,7.752,21.107,7.752,16.222z"></path> </svg>';

var ResendLink = function (_React$Component) {
  _inherits(ResendLink, _React$Component);

  function ResendLink() {
    _classCallCheck(this, ResendLink);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  ResendLink.prototype.render = function render() {
    var _props = this.props,
        label = _props.label,
        onClick = _props.onClick;

    return React.createElement(
      'a',
      { className: 'auth0-lock-resend-link', href: '#', onClick: onClick },
      label,
      ' ',
      React.createElement('span', { dangerouslySetInnerHTML: { __html: retrySvg } })
    );
  };

  return ResendLink;
}(React.Component);

var Resend = function (_React$Component2) {
  _inherits(Resend, _React$Component2);

  function Resend() {
    _classCallCheck(this, Resend);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  Resend.prototype.render = function render() {
    var _props2 = this.props,
        labels = _props2.labels,
        lock = _props2.lock;


    var resendLink = m.resendAvailable(lock) && React.createElement(ResendLink, { onClick: this.handleClick.bind(this),
      label: m.resendFailed(lock) ? labels.retry : labels.resend });

    var resendingLabel = m.resendOngoing(lock) && React.createElement(
      'a',
      { className: 'auth0-lock-resend-link' },
      labels.resending
    );

    var resendSuccessLabel = m.resendSuccess(lock) && React.createElement(
      'span',
      { className: 'auth0-lock-sent-label' },
      labels.sent
    );

    var resendFailedLabel = m.resendFailed(lock) && React.createElement(
      'span',
      { className: 'auth0-lock-sent-failed-label' },
      labels.failed
    );

    return React.createElement(
      'span',
      null,
      resendLink,
      resendingLabel,
      resendSuccessLabel,
      resendFailedLabel
    );
  };

  Resend.prototype.handleClick = function handleClick(e) {
    e.preventDefault();
    resendEmail(l.id(this.props.lock));
  };

  return Resend;
}(React.Component);

var EmailSentConfirmation = function (_React$Component3) {
  _inherits(EmailSentConfirmation, _React$Component3);

  function EmailSentConfirmation() {
    _classCallCheck(this, EmailSentConfirmation);

    return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
  }

  EmailSentConfirmation.prototype.render = function render() {
    var lock = this.props.lock;

    var closeHandler = l.ui.closable(lock) ? this.handleClose.bind(this) : undefined;
    var labels = {
      failed: i18n.str(lock, "failedLabel"),
      resend: i18n.str(lock, "resendLabel"),
      resending: i18n.str(lock, "resendingLabel"),
      retry: i18n.str(lock, "retryLabel"),
      sent: i18n.str(lock, "sentLabel")
    };

    return React.createElement(
      SuccessPane,
      { backHandler: this.handleBack.bind(this), closeHandler: closeHandler },
      React.createElement(
        'p',
        null,
        i18n.html(lock, ["success", "magicLink"], c.email(lock))
      ),
      React.createElement(Resend, { labels: labels, lock: lock })
    );
  };

  EmailSentConfirmation.prototype.handleBack = function handleBack() {
    restart(l.id(this.props.lock));
  };

  EmailSentConfirmation.prototype.handleClose = function handleClose() {
    closeLock(l.id(this.props.lock));
  };

  return EmailSentConfirmation;
}(React.Component);

export default EmailSentConfirmation;


export function renderEmailSentConfirmation(lock) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  props.key = "auxiliarypane";
  props.lock = lock;

  return m.passwordlessStarted(lock) ? React.createElement(EmailSentConfirmation, props) : null;
}
