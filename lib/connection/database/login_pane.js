function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import EmailPane from '../../field/email/email_pane';
import UsernamePane from '../../field/username/username_pane';
import PasswordPane from '../../field/password/password_pane';
import { showResetPasswordActivity } from './actions';
import { hasScreen, forgotPasswordLink } from './index';
import * as l from '../../core/index';

var LoginPane = function (_React$Component) {
  _inherits(LoginPane, _React$Component);

  function LoginPane() {
    _classCallCheck(this, LoginPane);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  LoginPane.prototype.handleDontRememberPasswordClick = function handleDontRememberPasswordClick(e) {
    e.preventDefault();
    showResetPasswordActivity(l.id(this.props.lock));
  };

  LoginPane.prototype.render = function render() {
    var _props = this.props,
        emailInputPlaceholder = _props.emailInputPlaceholder,
        forgotPasswordAction = _props.forgotPasswordAction,
        i18n = _props.i18n,
        instructions = _props.instructions,
        lock = _props.lock,
        passwordInputPlaceholder = _props.passwordInputPlaceholder,
        showForgotPasswordLink = _props.showForgotPasswordLink,
        showPassword = _props.showPassword,
        usernameInputPlaceholder = _props.usernameInputPlaceholder,
        usernameStyle = _props.usernameStyle;


    var headerText = instructions || null;
    var header = headerText && React.createElement(
      'p',
      null,
      headerText
    );

    // Should never validate format on login because of custom db connection and import mode
    var fieldPane = usernameStyle === "email" ? React.createElement(EmailPane, {
      i18n: i18n,
      lock: lock,
      forceInvalidVisibility: !showPassword,
      placeholder: emailInputPlaceholder
    }) : React.createElement(UsernamePane, {
      i18n: i18n,
      lock: lock,
      placeholder: usernameInputPlaceholder,
      usernameStyle: usernameStyle,
      validateFormat: false
    });

    var passwordPane = showPassword ? React.createElement(PasswordPane, {
      i18n: i18n,
      lock: lock,
      placeholder: passwordInputPlaceholder
    }) : null;

    var dontRememberPassword = showForgotPasswordLink && hasScreen(lock, "forgotPassword") ? React.createElement(
      'p',
      { className: 'auth0-lock-alternative' },
      React.createElement(
        'a',
        {
          className: 'auth0-lock-alternative-link',
          href: forgotPasswordLink(lock, "#"),
          onClick: forgotPasswordLink(lock) ? undefined : this.handleDontRememberPasswordClick.bind(this)
        },
        forgotPasswordAction
      )
    ) : null;

    return React.createElement(
      'div',
      null,
      header,
      fieldPane,
      passwordPane,
      dontRememberPassword
    );
  };

  return LoginPane;
}(React.Component);

export default LoginPane;


LoginPane.propTypes = {
  emailInputPlaceholder: React.PropTypes.string.isRequired,
  forgotPasswordAction: React.PropTypes.string.isRequired,
  i18n: React.PropTypes.object.isRequired,
  instructions: React.PropTypes.any,
  lock: React.PropTypes.object.isRequired,
  passwordInputPlaceholder: React.PropTypes.string.isRequired,
  showForgotPasswordLink: React.PropTypes.bool.isRequired,
  showPassword: React.PropTypes.bool.isRequired,
  usernameInputPlaceholder: React.PropTypes.string.isRequired,
  usernameStyle: React.PropTypes.oneOf(["any", "email", "username"])
};
