import React from 'react';
import { BackButton, CloseButton } from './button';

var ConfirmationPane = function ConfirmationPane(_ref) {
  var backHandler = _ref.backHandler,
      children = _ref.children,
      closeHandler = _ref.closeHandler,
      svg = _ref.svg;
  return React.createElement(
    'div',
    { className: 'auth0-lock-confirmation' },
    closeHandler && React.createElement(CloseButton, { onClick: closeHandler }),
    backHandler && React.createElement(BackButton, { onClick: backHandler }),
    React.createElement(
      'div',
      { className: 'auth0-lock-confirmation-content' },
      React.createElement('span', { dangerouslySetInnerHTML: { __html: svg } }),
      children
    )
  );
};

ConfirmationPane.propTypes = {
  backHandler: React.PropTypes.func,
  closeHandler: React.PropTypes.func,
  children: React.PropTypes.oneOfType([React.PropTypes.element.isRequired, React.PropTypes.arrayOf(React.PropTypes.element).isRequired]),
  svg: React.PropTypes.string.isRequired
};

export default ConfirmationPane;
