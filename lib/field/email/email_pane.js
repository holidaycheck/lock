function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import EmailInput from '../../ui/input/email_input';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import * as l from '../../core/index';
import { setEmail } from '../email';
import { debouncedRequestAvatar, requestAvatar } from '../../avatar';

var EmailPane = function (_React$Component) {
  _inherits(EmailPane, _React$Component);

  function EmailPane() {
    _classCallCheck(this, EmailPane);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  EmailPane.prototype.componentDidMount = function componentDidMount() {
    var lock = this.props.lock;

    if (l.ui.avatar(lock) && c.email(lock)) {
      requestAvatar(l.id(lock), c.email(lock));
    }
  };

  EmailPane.prototype.handleChange = function handleChange(e) {
    var lock = this.props.lock;

    if (l.ui.avatar(lock)) {
      debouncedRequestAvatar(l.id(lock), e.target.value);
    }

    swap(updateEntity, "lock", l.id(lock), setEmail, e.target.value);
  };

  EmailPane.prototype.render = function render() {
    var _props = this.props,
        i18n = _props.i18n,
        lock = _props.lock,
        placeholder = _props.placeholder,
        _props$forceInvalidVi = _props.forceInvalidVisibility,
        forceInvalidVisibility = _props$forceInvalidVi === undefined ? false : _props$forceInvalidVi;


    var field = c.getField(lock, "email");
    var value = field.get('value', "");
    var valid = field.get('valid', true);
    var invalidHint = field.get('invalidHint', i18n.str(value ? "invalidErrorHint" : "blankErrorHint"));

    var isValid = (!forceInvalidVisibility || valid) && !c.isFieldVisiblyInvalid(lock, "email");

    return React.createElement(EmailInput, {
      value: value,
      invalidHint: invalidHint,
      isValid: isValid,
      onChange: this.handleChange.bind(this),
      placeholder: placeholder
    });
  };

  return EmailPane;
}(React.Component);

export default EmailPane;


EmailPane.propTypes = {
  i18n: React.PropTypes.object.isRequired,
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired
};
