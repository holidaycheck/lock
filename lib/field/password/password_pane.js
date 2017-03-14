function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PasswordInput from '../../ui/input/password_input';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import * as l from '../../core/index';
import { setPassword } from '../password';

var PasswordPane = function (_React$Component) {
  _inherits(PasswordPane, _React$Component);

  function PasswordPane() {
    _classCallCheck(this, PasswordPane);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  PasswordPane.prototype.handleChange = function handleChange(e) {
    var _props = this.props,
        lock = _props.lock,
        policy = _props.policy;

    swap(updateEntity, "lock", l.id(lock), setPassword, e.target.value, policy);
  };

  PasswordPane.prototype.render = function render() {
    var _props2 = this.props,
        i18n = _props2.i18n,
        lock = _props2.lock,
        placeholder = _props2.placeholder,
        policy = _props2.policy,
        strengthMessages = _props2.strengthMessages;


    return React.createElement(PasswordInput, {
      value: c.getFieldValue(lock, "password"),
      invalidHint: i18n.str("blankErrorHint"),
      isValid: !c.isFieldVisiblyInvalid(lock, "password"),
      onChange: this.handleChange.bind(this),
      placeholder: placeholder,
      strengthMessages: strengthMessages,
      disabled: l.submitting(lock),
      policy: policy
    });
  };

  return PasswordPane;
}(React.Component);

export default PasswordPane;


PasswordPane.propTypes = {
  i18n: React.PropTypes.object.isRequired,
  lock: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func,
  placeholder: React.PropTypes.string.isRequired,
  policy: React.PropTypes.string,
  strengthMessages: React.PropTypes.object
};
