function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import ReactDOM from 'react-dom';

var GlobalMessage = function (_React$Component) {
  _inherits(GlobalMessage, _React$Component);

  function GlobalMessage() {
    _classCallCheck(this, GlobalMessage);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  GlobalMessage.prototype.render = function render() {
    var _props = this.props,
        message = _props.message,
        type = _props.type;

    var className = 'auth0-global-message auth0-global-message-' + type;

    return React.createElement(
      'div',
      { className: className },
      React.createElement(
        'span',
        { className: 'animated fadeInUp' },
        message
      )
    );
  };

  return GlobalMessage;
}(React.Component);

export default GlobalMessage;


GlobalMessage.propTypes = {
  message: React.PropTypes.string.isRequired,
  type: React.PropTypes.oneOf(['error', 'success']).isRequired
};
