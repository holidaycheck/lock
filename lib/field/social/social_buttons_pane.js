function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import AuthButton from '../../ui/button/auth_button';
import * as l from '../../core/index';
import { logIn } from '../../quick-auth/actions';
import { displayName, socialConnections, authButtonsTheme } from '../../connection/social/index';

var SocialButtonsPane = function (_React$Component) {
  _inherits(SocialButtonsPane, _React$Component);

  function SocialButtonsPane() {
    _classCallCheck(this, SocialButtonsPane);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  SocialButtonsPane.prototype.render = function render() {
    // TODO: i don't like that it receives the instructions tanslated
    // but it also takes the t fn
    var _props = this.props,
        bigButtons = _props.bigButtons,
        instructions = _props.instructions,
        labelFn = _props.labelFn,
        lock = _props.lock,
        showLoading = _props.showLoading,
        signUp = _props.signUp;


    var headerText = instructions || null;
    var header = headerText && React.createElement(
      'p',
      null,
      headerText
    );

    var themes = authButtonsTheme(lock);

    var buttons = socialConnections(lock).map(function (x) {
      var buttonTheme = themes.get(x.get("name"));
      var connectionName = buttonTheme && buttonTheme.get("displayName");
      var primaryColor = buttonTheme && buttonTheme.get("primaryColor");
      var foregroundColor = buttonTheme && buttonTheme.get("foregroundColor");
      var icon = buttonTheme && buttonTheme.get("icon");

      return React.createElement(AuthButton, {
        isBig: bigButtons,
        key: x.get("name"),
        label: labelFn(signUp ? "signUpWithLabel" : "loginWithLabel", connectionName || displayName(x)),
        onClick: function onClick() {
          return logIn(l.id(lock), x);
        },
        strategy: x.get("strategy"),
        primaryColor: primaryColor,
        foregroundColor: foregroundColor,
        icon: icon
      });
    });

    var loading = showLoading && React.createElement(
      'div',
      { className: 'auth0-loading-container' },
      React.createElement('div', { className: 'auth0-loading' })
    );

    return React.createElement(
      'div',
      { className: 'auth-lock-social-buttons-pane' },
      header,
      React.createElement(
        'div',
        { className: 'auth0-lock-social-buttons-container' },
        buttons
      ),
      loading
    );
  };

  return SocialButtonsPane;
}(React.Component);

export default SocialButtonsPane;


SocialButtonsPane.propTypes = {
  bigButtons: React.PropTypes.bool.isRequired,
  instructions: React.PropTypes.any,
  labelFn: React.PropTypes.func.isRequired,
  lock: React.PropTypes.object.isRequired,
  showLoading: React.PropTypes.bool.isRequired,
  signUp: React.PropTypes.bool.isRequired
};

SocialButtonsPane.defaultProps = {
  showLoading: false
};
