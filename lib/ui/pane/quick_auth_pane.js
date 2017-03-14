import React from 'react';
import AuthButton from '../button/auth_button';

var QuickAuthPane = function QuickAuthPane(props) {
  var alternativeLabel = props.alternativeLabel,
      alternativeClickHandler = props.alternativeClickHandler,
      buttonLabel = props.buttonLabel,
      buttonClickHandler = props.buttonClickHandler,
      header = props.header,
      strategy = props.strategy,
      buttonIcon = props.buttonIcon,
      primaryColor = props.primaryColor,
      foregroundColor = props.foregroundColor;


  var alternative = alternativeLabel ? React.createElement(
    'p',
    { className: 'auth0-lock-alternative' },
    React.createElement(
      'a',
      {
        className: 'auth0-lock-alternative-link',
        href: '#',
        onClick: function onClick(e) {
          e.preventDefault();alternativeClickHandler(e);
        }
      },
      alternativeLabel
    )
  ) : null;

  return React.createElement(
    'div',
    { className: 'auth0-lock-last-login-pane' },
    header,
    React.createElement(AuthButton, {
      label: buttonLabel,
      onClick: function onClick(e) {
        e.preventDefault();buttonClickHandler(e);
      },
      strategy: strategy,
      primaryColor: primaryColor,
      foregroundColor: foregroundColor,
      icon: buttonIcon
    }),
    alternative,
    React.createElement(
      'div',
      { className: 'auth0-loading-container' },
      React.createElement('div', { className: 'auth0-loading' })
    )
  );
};

QuickAuthPane.propTypes = {
  alternativeLabel: React.PropTypes.string,
  alternativeClickHandler: function alternativeClickHandler(props, propName, component) {
    for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      rest[_key - 3] = arguments[_key];
    }

    if (props.alternativeLabel !== undefined) {
      var _React$PropTypes$func;

      return (_React$PropTypes$func = React.PropTypes.func).isRequired.apply(_React$PropTypes$func, [props, propName, component].concat(rest));
    }
  },
  buttonLabel: React.PropTypes.string.isRequired,
  buttonClickHandler: React.PropTypes.func.isRequired,
  header: React.PropTypes.element,
  strategy: React.PropTypes.string.isRequired
};

export default QuickAuthPane;
