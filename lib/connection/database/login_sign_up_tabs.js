function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { showLoginActivity, showSignUpActivity } from './actions';
import * as l from '../../core/index';
import { getScreen } from './index';
import { closeLock } from '../../core/actions';

var LoginSignUpTabs = function (_React$Component) {
  _inherits(LoginSignUpTabs, _React$Component);

  function LoginSignUpTabs() {
    _classCallCheck(this, LoginSignUpTabs);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  LoginSignUpTabs.prototype.render = function render() {
    var _props = this.props,
        lock = _props.lock,
        loginLabel = _props.loginLabel,
        signUpLink = _props.signUpLink,
        signUpLabel = _props.signUpLabel;

    var isLogin = getScreen(lock) === "login";

    return React.createElement(
      'div',
      { className: 'auth0-lock-tabs-container' },
      React.createElement(
        'ul',
        { className: 'auth0-lock-tabs' },
        React.createElement(LoginSignUpTab, {
          label: loginLabel,
          current: isLogin,
          clickHandler: this.handleLoginClick.bind(this)
        }),
        React.createElement(LoginSignUpTab, {
          label: signUpLabel,
          current: !isLogin,
          clickHandler: this.handleSignUpClick.bind(this),
          clickWithHrefHandler: this.handleSignUpWithHrefClick.bind(this),
          href: signUpLink
        })
      )
    );
  };

  LoginSignUpTabs.prototype.handleLoginClick = function handleLoginClick() {
    showLoginActivity(l.id(this.props.lock));
  };

  LoginSignUpTabs.prototype.handleSignUpClick = function handleSignUpClick() {
    if (this.props.signUpLink) {
      closeLock(l.id(this.props.lock), true);
    }
    showSignUpActivity(l.id(this.props.lock));
  };

  LoginSignUpTabs.prototype.handleSignUpWithHrefClick = function handleSignUpWithHrefClick() {
    closeLock(l.id(this.props.lock), true);
  };

  return LoginSignUpTabs;
}(React.Component);

export default LoginSignUpTabs;


LoginSignUpTabs.propTypes = {
  lock: React.PropTypes.object.isRequired,
  loginLabel: React.PropTypes.string.isRequired,
  signUpLabel: React.PropTypes.string.isRequired,
  signUpLink: React.PropTypes.string
};

var LoginSignUpTab = function (_React$Component2) {
  _inherits(LoginSignUpTab, _React$Component2);

  function LoginSignUpTab() {
    _classCallCheck(this, LoginSignUpTab);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  LoginSignUpTab.prototype.handleClick = function handleClick(e) {
    if (this.props.href) {
      this.props.clickWithHrefHandler();
    } else {
      e.preventDefault();
      this.props.clickHandler();
    }
  };

  LoginSignUpTab.prototype.render = function render() {
    var _props2 = this.props,
        current = _props2.current,
        href = _props2.href,
        label = _props2.label;

    var className = current ? "auth0-lock-tabs-current" : "";

    return React.createElement(
      'li',
      { className: className },
      React.createElement(
        'a',
        {
          href: href || "#",
          onClick: this.handleClick.bind(this)
        },
        label
      )
    );
  };

  return LoginSignUpTab;
}(React.Component);
