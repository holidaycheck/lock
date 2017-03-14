function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import UsernameInput from '../../ui/input/username_input';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import * as l from '../../core/index';
import { setUsername, usernameLooksLikeEmail, getUsernameValidation } from '../username';
import { debouncedRequestAvatar, requestAvatar } from '../../avatar';

var UsernamePane = function (_React$Component) {
  _inherits(UsernamePane, _React$Component);

  function UsernamePane() {
    _classCallCheck(this, UsernamePane);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  UsernamePane.prototype.componentDidMount = function componentDidMount() {
    var lock = this.props.lock;

    if (l.ui.avatar(lock) && c.username(lock)) {
      requestAvatar(l.id(lock), c.username(lock));
    }
  };

  UsernamePane.prototype.handleChange = function handleChange(e) {
    var _props = this.props,
        lock = _props.lock,
        validateFormat = _props.validateFormat,
        usernameStyle = _props.usernameStyle;

    if (l.ui.avatar(lock)) {
      debouncedRequestAvatar(l.id(lock), e.target.value);
    }

    swap(updateEntity, "lock", l.id(lock), setUsername, e.target.value, usernameStyle, validateFormat);
  };

  UsernamePane.prototype.render = function render() {
    var _props2 = this.props,
        i18n = _props2.i18n,
        lock = _props2.lock,
        placeholder = _props2.placeholder,
        validateFormat = _props2.validateFormat;

    var value = c.getFieldValue(lock, "username");
    var usernameValidation = validateFormat ? getUsernameValidation(lock) : {};

    var invalidHintKey = function invalidHintKey(str) {
      if (!str) return "blankErrorHint";
      if (usernameLooksLikeEmail(str) || !validateFormat) return "invalidErrorHint";
      return "usernameFormatErrorHint";
    };

    var invalidHint = function invalidHint(str) {
      var hintKey = invalidHintKey(str);

      // only show format info in the error if it should validate the format and 
      // if there is any format restrictions for the connection
      if ("usernameFormatErrorHint" === hintKey && validateFormat && usernameValidation != null) {
        return i18n.str(hintKey, usernameValidation.min, usernameValidation.max);
      }

      return i18n.str(hintKey);
    };

    return React.createElement(UsernameInput, {
      value: value,
      invalidHint: invalidHint(value),
      isValid: !c.isFieldVisiblyInvalid(lock, "username"),
      onChange: this.handleChange.bind(this),
      placeholder: placeholder
    });
  };

  return UsernamePane;
}(React.Component);

export default UsernamePane;


UsernamePane.propTypes = {
  i18n: React.PropTypes.object.isRequired,
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  validateFormat: React.PropTypes.bool.isRequired,
  usernameStyle: React.PropTypes.oneOf(["any", "email", "username"])
};

UsernamePane.defaultProps = {
  validateFormat: false,
  usernameStyle: "username"
};
