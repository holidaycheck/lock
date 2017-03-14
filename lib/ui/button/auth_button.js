import React from 'react';

var AuthButton = function AuthButton(props) {
  var disabled = props.disabled,
      isBig = props.isBig,
      label = props.label,
      onClick = props.onClick,
      strategy = props.strategy,
      icon = props.icon,
      primaryColor = props.primaryColor,
      foregroundColor = props.foregroundColor;


  var className = "auth0-lock-social-button";
  if (isBig) className += " auth0-lock-social-big-button";

  var backgroundStyle = primaryColor ? { backgroundColor: primaryColor } : {};
  var foregroundStyle = foregroundColor ? { color: foregroundColor } : {};
  var iconStyle = icon ? { backgroundImage: "url('" + icon + "')" } : {};

  return React.createElement(
    "button",
    {
      className: className,
      "data-provider": strategy,
      disabled: disabled,
      onClick: onClick,
      style: backgroundStyle,
      type: "button"
    },
    React.createElement("div", { className: "auth0-lock-social-button-icon", style: iconStyle }),
    React.createElement(
      "div",
      { className: "auth0-lock-social-button-text", style: foregroundStyle },
      label
    )
  );
};

AuthButton.propTypes = {
  disabled: React.PropTypes.bool.isRequired,
  isBig: React.PropTypes.bool.isRequired,
  label: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  strategy: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string,
  primaryColor: React.PropTypes.string,
  foregroundColor: React.PropTypes.string
};

AuthButton.defaultProps = {
  disabled: false,
  isBig: true
};

export default AuthButton;
