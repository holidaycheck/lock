function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import VcodeInput from '../../ui/input/vcode_input';
import * as l from '../../core/index';
import * as c from '../index';
import { isSmallScreen } from '../../utils/media_utils';
import { swap, updateEntity } from '../../store/index';
import { setVcode } from '../vcode';

var VcodePane = function (_React$Component) {
  _inherits(VcodePane, _React$Component);

  function VcodePane() {
    _classCallCheck(this, VcodePane);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  VcodePane.prototype.handleVcodeChange = function handleVcodeChange(e) {
    e.preventDefault();
    swap(updateEntity, "lock", l.id(this.props.lock), setVcode, e.target.value);
  };

  VcodePane.prototype.handleResendClick = function handleResendClick(e) {
    e.preventDefault();
    var _props = this.props,
        lock = _props.lock,
        onRestart = _props.onRestart;

    onRestart(l.id(lock));
  };

  VcodePane.prototype.render = function render() {
    var _props2 = this.props,
        instructions = _props2.instructions,
        lock = _props2.lock,
        placeholder = _props2.placeholder,
        resendLabel = _props2.resendLabel;

    var headerText = instructions || null;
    var header = headerText && React.createElement(
      'p',
      null,
      headerText
    );

    return React.createElement(
      'div',
      null,
      header,
      React.createElement(VcodeInput, { value: c.vcode(lock),
        isValid: !c.isFieldVisiblyInvalid(lock, "vcode") && !l.globalError(lock),
        onChange: this.handleVcodeChange.bind(this),
        autoFocus: !isSmallScreen(),
        placeholder: placeholder,
        disabled: l.submitting(lock)
      }),
      React.createElement(
        'p',
        { className: 'auth0-lock-alternative' },
        React.createElement(
          'a',
          {
            className: 'auth0-lock-alternative-link',
            href: '#',
            onClick: this.handleResendClick.bind(this)
          },
          resendLabel
        )
      )
    );
  };

  return VcodePane;
}(React.Component);

export default VcodePane;


VcodePane.propTypes = {
  instructions: React.PropTypes.element,
  lock: React.PropTypes.object.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  resendLabel: React.PropTypes.string.isRequired,
  onRestart: React.PropTypes.func.isRequired
};
