function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import UsernamePane from '../../field/username/username_pane';
import PasswordPane from '../../field/password/password_pane';
import * as l from '../../core/index';

var HRDPane = function (_React$Component) {
  _inherits(HRDPane, _React$Component);

  function HRDPane() {
    _classCallCheck(this, HRDPane);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  HRDPane.prototype.render = function render() {
    var _props = this.props,
        header = _props.header,
        i18n = _props.i18n,
        model = _props.model,
        passwordInputPlaceholder = _props.passwordInputPlaceholder,
        usernameInputPlaceholder = _props.usernameInputPlaceholder;


    return React.createElement(
      'div',
      null,
      header,
      React.createElement(UsernamePane, {
        i18n: i18n,
        lock: model,
        placeholder: usernameInputPlaceholder,
        validateFormat: false
      }),
      React.createElement(PasswordPane, {
        i18n: i18n,
        lock: model,
        placeholder: passwordInputPlaceholder
      })
    );
  };

  return HRDPane;
}(React.Component);

export default HRDPane;


HRDPane.propTypes = {
  header: React.PropTypes.element,
  i18n: React.PropTypes.object.isRequired,
  model: React.PropTypes.object.isRequired,
  passwordInputPlaceholder: React.PropTypes.string.isRequired,
  usernameInputPlaceholder: React.PropTypes.string.isRequired
};
