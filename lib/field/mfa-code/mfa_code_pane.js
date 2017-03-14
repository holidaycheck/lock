function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import MFACodeInput from '../../ui/input/mfa_code_input';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import * as l from '../../core/index';
import { setMFACode, getMFACodeValidation } from '../mfa_code';

var MFACodePane = function (_React$Component) {
  _inherits(MFACodePane, _React$Component);

  function MFACodePane() {
    _classCallCheck(this, MFACodePane);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  MFACodePane.prototype.handleChange = function handleChange(e) {
    var lock = this.props.lock;

    swap(updateEntity, "lock", l.id(lock), setMFACode, e.target.value);
  };

  MFACodePane.prototype.render = function render() {
    var _props = this.props,
        i18n = _props.i18n,
        lock = _props.lock,
        placeholder = _props.placeholder;


    return React.createElement(MFACodeInput, {
      value: c.getFieldValue(lock, "mfa_code"),
      invalidHint: i18n.str("mfaCodeErrorHint", getMFACodeValidation().length),
      isValid: !c.isFieldVisiblyInvalid(lock, "mfa_code"),
      onChange: this.handleChange.bind(this),
      placeholder: placeholder
    });
  };

  return MFACodePane;
}(React.Component);

export default MFACodePane;


MFACodePane.propTypes = {
  i18n: React.PropTypes.object.isRequired,
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired
};
