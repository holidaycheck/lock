var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react'; // eslint-disable-line
import renderer from 'react-test-renderer';

export var expectComponent = function expectComponent(children) {
  var component = renderer.create(children);
  return expect(component);
};

var addDataToProps = function addDataToProps(props) {
  var returnedProps = {};
  Object.keys(props).forEach(function (k) {
    return returnedProps['data-' + k] = props[k];
  });
  return returnedProps;
};

var removeDataFromProps = function removeDataFromProps(props) {
  var returnedProps = {};
  Object.keys(props).forEach(function (k) {
    return returnedProps[k.replace('data-', '')] = props[k];
  });
  return returnedProps;
};

export var mockComponent = function mockComponent(type) {
  var domElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'div';
  return function (props) {
    return React.createElement(domElement, _extends({
      'data-__type': type
    }, addDataToProps(props)));
  };
};

export var extractPropsFromWrapper = function extractPropsFromWrapper(wrapper) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return removeDataFromProps(wrapper.find('div').at(index).props());
};
