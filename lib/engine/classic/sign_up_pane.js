function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import EmailPane from '../../field/email/email_pane';
import PasswordPane from '../../field/password/password_pane';
import UsernamePane from '../../field/username/username_pane';
import CustomInput from '../../field/custom_input';
import { additionalSignUpFields, databaseConnectionRequiresUsername, passwordStrengthPolicy } from '../../connection/database/index';

var SignUpPane = function (_React$Component) {
  _inherits(SignUpPane, _React$Component);

  function SignUpPane() {
    _classCallCheck(this, SignUpPane);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  SignUpPane.prototype.render = function render() {
    var _props = this.props,
        emailInputPlaceholder = _props.emailInputPlaceholder,
        instructions = _props.instructions,
        i18n = _props.i18n,
        model = _props.model,
        onlyEmail = _props.onlyEmail,
        passwordInputPlaceholder = _props.passwordInputPlaceholder,
        passwordStrengthMessages = _props.passwordStrengthMessages,
        usernameInputPlaceholder = _props.usernameInputPlaceholder;


    var headerText = instructions || null;
    var header = headerText && React.createElement(
      'p',
      null,
      headerText
    );

    var usernamePane = !onlyEmail && databaseConnectionRequiresUsername(model) ? React.createElement(UsernamePane, {
      i18n: i18n,
      lock: model,
      placeholder: usernameInputPlaceholder,
      validateFormat: true
    }) : null;

    var fields = !onlyEmail && additionalSignUpFields(model).map(function (x) {
      return React.createElement(CustomInput, {
        iconUrl: x.get("icon"),
        key: x.get("name"),
        model: model,
        name: x.get("name"),
        options: x.get("options"),
        placeholder: x.get("placeholder"),
        type: x.get("type"),
        validator: x.get("validator")
      });
    });

    var passwordPane = !onlyEmail && React.createElement(PasswordPane, {
      i18n: i18n,
      lock: model,
      placeholder: passwordInputPlaceholder,
      policy: passwordStrengthPolicy(model),
      strengthMessages: passwordStrengthMessages
    });

    return React.createElement(
      'div',
      null,
      header,
      React.createElement(EmailPane, {
        i18n: i18n,
        lock: model,
        placeholder: emailInputPlaceholder
      }),
      usernamePane,
      passwordPane,
      fields
    );
  };

  return SignUpPane;
}(React.Component);

export default SignUpPane;
