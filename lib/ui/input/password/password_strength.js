var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import createPolicy from 'password-sheriff';
import util from 'util';

var PasswordStrength = function (_React$Component) {
  _inherits(PasswordStrength, _React$Component);

  function PasswordStrength() {
    _classCallCheck(this, PasswordStrength);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  PasswordStrength.prototype.render = function render() {
    var _props = this.props,
        password = _props.password,
        policy = _props.policy,
        messages = _props.messages;

    var analysis = createPolicy(policy).missing(password);
    // TODO: add a component for fadeIn / fadeOut animations?
    var className = "auth0-lock-password-strength animated " + (!analysis.verified ? "fadeIn" : "fadeOut");

    var prepareMessage = function prepareMessage(items) {
      items && items.forEach(function (o) {
        if (messages[o.code]) {
          o.message = messages[o.code];
        }

        o.message = util.format.apply(util, [o.message].concat(o.format || []));

        if (o.items) {
          prepareMessage(o.items);
        }
      });
    };

    prepareMessage(analysis.rules);

    return React.createElement(
      'div',
      { className: className },
      React.createElement(List, { items: analysis.rules })
    );
  };

  return PasswordStrength;
}(React.Component);

export default PasswordStrength;


PasswordStrength.propTypes = {
  messages: React.PropTypes.object.isRequired,
  password: React.PropTypes.string.isRequired,
  policy: React.PropTypes.oneOf(["none", "low", "fair", "good", "excellent"]).isRequired
};

PasswordStrength.defaultProps = {
  messages: {}
};

var List = function (_React$Component2) {
  _inherits(List, _React$Component2);

  function List() {
    _classCallCheck(this, List);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  List.prototype.render = function render() {
    var items = this.props.items;


    return items && items.length ? React.createElement(
      'ul',
      null,
      items.map(function (x, i) {
        return React.createElement(Item, _extends({}, x, { key: i }));
      })
    ) : null;
  };

  return List;
}(React.Component);

List.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.object)
};

var Item = function (_React$Component3) {
  _inherits(Item, _React$Component3);

  function Item() {
    _classCallCheck(this, Item);

    return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
  }

  Item.prototype.render = function render() {
    var _props2 = this.props,
        items = _props2.items,
        message = _props2.message,
        verified = _props2.verified;

    var className = verified ? "auth0-lock-checked" : "";

    return React.createElement(
      'li',
      { className: className },
      React.createElement(
        'span',
        null,
        message
      ),
      React.createElement(List, { items: items })
    );
  };

  return Item;
}(React.Component);

Item.propTypes = {
  items: React.PropTypes.array,
  message: React.PropTypes.string.isRequired,
  verified: React.PropTypes.bool.isRequired
};
