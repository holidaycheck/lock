import React from 'react';

var SignUpTerms = function SignUpTerms(_ref) {
  var checkHandler = _ref.checkHandler,
      checked = _ref.checked,
      children = _ref.children;

  return checkHandler ? React.createElement(
    "span",
    { className: "auth0-lock-sign-up-terms-agreement" },
    React.createElement(
      "label",
      null,
      React.createElement("input", { type: "checkbox", onChange: checkHandler, checked: checked }),
      children
    )
  ) : children;
};

export default SignUpTerms;
