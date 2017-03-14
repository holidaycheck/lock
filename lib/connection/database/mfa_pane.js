function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import MFACodePane from '../../field/mfa-code/mfa_code_pane';

var MFAPane = function (_React$Component) {
  _inherits(MFAPane, _React$Component);

  function MFAPane() {
    _classCallCheck(this, MFAPane);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  MFAPane.prototype.render = function render() {
    var _props = this.props,
        mfaInputPlaceholder = _props.mfaInputPlaceholder,
        i18n = _props.i18n,
        instructions = _props.instructions,
        lock = _props.lock,
        title = _props.title;


    var headerText = instructions || null;
    var header = headerText && React.createElement(
      'p',
      null,
      headerText
    );

    var pane = React.createElement(MFACodePane, {
      i18n: i18n,
      lock: lock,
      placeholder: mfaInputPlaceholder
    });

    var titleElement = title && React.createElement(
      'h2',
      null,
      title
    );

    return React.createElement(
      'div',
      null,
      titleElement,
      header,
      pane
    );
  };

  return MFAPane;
}(React.Component);

export default MFAPane;


MFAPane.propTypes = {
  mfaInputPlaceholder: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  i18n: React.PropTypes.object.isRequired,
  instructions: React.PropTypes.any,
  lock: React.PropTypes.object.isRequired
};
