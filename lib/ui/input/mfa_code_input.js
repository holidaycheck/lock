var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import InputWrap from './input_wrap';
import { icon } from './password_input';

var MFACodeInput = function (_React$Component) {
  _inherits(MFACodeInput, _React$Component);

  function MFACodeInput(props) {
    _classCallCheck(this, MFACodeInput);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {};
    return _this;
  }

  MFACodeInput.prototype.focus = function focus() {
    this.refs.input && this.refs.input.focus();
  };

  MFACodeInput.prototype.hasFocus = function hasFocus() {
    return this.state.focused;
  };

  MFACodeInput.prototype.render = function render() {
    var _props = this.props,
        invalidHint = _props.invalidHint,
        isValid = _props.isValid,
        onChange = _props.onChange,
        value = _props.value,
        props = _objectWithoutProperties(_props, ['invalidHint', 'isValid', 'onChange', 'value']);

    var focused = this.state.focused;


    return React.createElement(
      InputWrap,
      {
        focused: focused,
        invalidHint: invalidHint,
        isValid: isValid,
        name: 'mfa_code',
        icon: icon
      },
      React.createElement('input', _extends({
        ref: 'input',
        type: 'text',
        name: 'mfa_code',
        className: 'auth0-lock-input',
        autoComplete: 'off',
        autoCapitalize: 'off',
        onChange: this.handleOnChange.bind(this),
        onFocus: this.handleFocus.bind(this),
        onBlur: this.handleBlur.bind(this),
        value: value
      }, props))
    );
  };

  MFACodeInput.prototype.handleOnChange = function handleOnChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };

  MFACodeInput.prototype.handleFocus = function handleFocus() {
    this.setState({ focused: true });
  };

  MFACodeInput.prototype.handleBlur = function handleBlur() {
    this.setState({ focused: false });
  };

  return MFACodeInput;
}(React.Component);

MFACodeInput.propTypes = {
  invalidHint: React.PropTypes.string.isRequired,
  isValid: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func,
  placeholder: React.PropTypes.string,
  value: React.PropTypes.string.isRequired
};
export default MFACodeInput;
