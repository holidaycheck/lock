function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import Screen from './screen';
import { pinLoadingPane, unpinLoadingPane } from './actions';
import * as l from './index';

var LoadingScreen = function (_Screen) {
  _inherits(LoadingScreen, _Screen);

  function LoadingScreen() {
    _classCallCheck(this, LoadingScreen);

    return _possibleConstructorReturn(this, _Screen.call(this, "loading"));
  }

  LoadingScreen.prototype.render = function render() {
    return LoadingPane;
  };

  return LoadingScreen;
}(Screen);

export default LoadingScreen;

var LoadingPane = function (_React$Component) {
  _inherits(LoadingPane, _React$Component);

  function LoadingPane() {
    _classCallCheck(this, LoadingPane);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  LoadingPane.prototype.componentDidMount = function componentDidMount() {
    var model = this.props.model;

    pinLoadingPane(l.id(model));
    setTimeout(function () {
      return unpinLoadingPane(l.id(model));
    }, 500);
  };

  LoadingPane.prototype.render = function render() {
    return React.createElement(
      'div',
      { className: 'auth0-loading-screen' },
      React.createElement(
        'div',
        { className: 'auth0-loading-container' },
        React.createElement('div', { className: 'auth0-loading' })
      )
    );
  };

  return LoadingPane;
}(React.Component);

LoadingPane.propTypes = {
  model: React.PropTypes.object.isRequired
};
