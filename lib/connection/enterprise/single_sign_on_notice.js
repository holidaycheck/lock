import React from 'react';
import { icon } from '../../ui/input/password_input';

export default (function (_ref) {
  var children = _ref.children;
  return React.createElement(
    'div',
    { className: 'auth0-sso-notice-container' },
    React.createElement('span', { dangerouslySetInnerHTML: { __html: icon } }),
    ' ',
    " ",
    React.createElement(
      'span',
      { className: 'auth0-sso-notice' },
      children
    )
  );
});
