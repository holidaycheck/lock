function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import Screen from './screen';
import * as l from './index';

var ErrorScreen = function (_Screen) {
  _inherits(ErrorScreen, _Screen);

  function ErrorScreen() {
    _classCallCheck(this, ErrorScreen);

    return _possibleConstructorReturn(this, _Screen.call(this, "error"));
  }

  ErrorScreen.prototype.render = function render() {
    return ErrorPane;
  };

  return ErrorScreen;
}(Screen);

export default ErrorScreen;


var ErrorPane = function ErrorPane(_ref) {
  var i18n = _ref.i18n;
  return React.createElement(
    'div',
    { className: 'auth0-lock-error-pane' },
    React.createElement(
      'p',
      null,
      i18n.html("unrecoverableError")
    )
  );
};

ErrorPane.propTypes = {
  i18n: React.PropTypes.object.isRequired
};
