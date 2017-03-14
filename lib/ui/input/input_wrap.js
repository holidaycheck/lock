function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

var InputWrap = function (_React$Component) {
  _inherits(InputWrap, _React$Component);

  function InputWrap() {
    _classCallCheck(this, InputWrap);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  InputWrap.prototype.render = function render() {
    var _props = this.props,
        before = _props.before,
        focused = _props.focused,
        invalidHint = _props.invalidHint,
        isValid = _props.isValid,
        name = _props.name,
        icon = _props.icon;

    var blockClassName = "auth0-lock-input-block auth0-lock-input-" + name;
    if (!isValid) {
      blockClassName += " auth0-lock-error";
    }

    var wrapClassName = "auth0-lock-input-wrap";
    if (focused && isValid) {
      wrapClassName += " auth0-lock-focused";
    }

    // NOTE: Ugly hack until we upgrade to React 15 which has better
    // support for SVG.
    var iconElement = null;

    if (typeof icon === "string") {
      iconElement = React.createElement("span", { dangerouslySetInnerHTML: { __html: icon } });
    } else if (icon) {
      iconElement = icon;
    }

    if (iconElement) {
      wrapClassName += " auth0-lock-input-wrap-with-icon";
    }

    var errorTooltip = !isValid && invalidHint ? React.createElement(
      "div",
      { className: "auth0-lock-error-msg" },
      React.createElement(
        "span",
        null,
        invalidHint
      )
    ) : null;

    return React.createElement(
      "div",
      { className: blockClassName },
      before,
      React.createElement(
        "div",
        { className: wrapClassName },
        iconElement,
        this.props.children
      ),
      errorTooltip
    );
  };

  return InputWrap;
}(React.Component);

export default InputWrap;


InputWrap.propTypes = {
  before: React.PropTypes.element,
  children: React.PropTypes.oneOfType([React.PropTypes.element.isRequired, React.PropTypes.arrayOf(React.PropTypes.element).isRequired]),
  focused: React.PropTypes.bool,
  invalidHint: React.PropTypes.string,
  isValid: React.PropTypes.bool.isRequired,
  name: React.PropTypes.string.isRequired,
  svg: React.PropTypes.string
};
