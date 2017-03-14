var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import InputWrap from './input_wrap';

var TextInput = function (_React$Component) {
  _inherits(TextInput, _React$Component);

  function TextInput(props) {
    _classCallCheck(this, TextInput);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {};
    return _this;
  }

  TextInput.prototype.hasFocus = function hasFocus() {
    return this.state.focused;
  };

  TextInput.prototype.render = function render() {
    var _props = this.props,
        iconUrl = _props.iconUrl,
        invalidHint = _props.invalidHint,
        isValid = _props.isValid,
        name = _props.name,
        onChange = _props.onChange,
        value = _props.value,
        props = _objectWithoutProperties(_props, ['iconUrl', 'invalidHint', 'isValid', 'name', 'onChange', 'value']);

    var icon = this.props.icon;
    var focused = this.state.focused;


    if (!icon && typeof iconUrl === "string" && iconUrl) {
      icon = React.createElement('img', { className: 'auth0-lock-custom-icon', src: iconUrl });
    }

    return React.createElement(
      InputWrap,
      {
        focused: focused,
        invalidHint: invalidHint,
        isValid: isValid,
        name: name,
        icon: icon
      },
      React.createElement('input', _extends({
        ref: 'input',
        type: 'text',
        name: name,
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

  TextInput.prototype.handleOnChange = function handleOnChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };

  TextInput.prototype.handleFocus = function handleFocus() {
    this.setState({ focused: true });
  };

  TextInput.prototype.handleBlur = function handleBlur() {
    this.setState({ focused: false });
  };

  return TextInput;
}(React.Component);

export default TextInput;
