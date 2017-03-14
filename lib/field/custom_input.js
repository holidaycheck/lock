var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import { changeField, startOptionSelection } from './actions';
import { getFieldInvalidHint, getFieldLabel, getFieldValue, isFieldVisiblyInvalid } from './index';
import TextInput from '../ui/input/text_input';
import SelectInput from '../ui/input/select_input';
import CheckboxInput from '../ui/input/checkbox_input';
import * as l from '../core/index';

var CustomInput = function CustomInput(_ref) {
  var iconUrl = _ref.iconUrl,
      model = _ref.model,
      name = _ref.name,
      placeholder = _ref.placeholder,
      type = _ref.type,
      validator = _ref.validator;

  var props = {
    iconUrl: iconUrl,
    isValid: !isFieldVisiblyInvalid(model, name),
    name: name,
    placeholder: placeholder
  };

  switch (type) {
    case "select":
      return React.createElement(SelectInput, _extends({}, props, {
        label: getFieldLabel(model, name),
        onClick: function onClick() {
          return startOptionSelection(l.id(model), name, iconUrl);
        }
      }));
    case "checkbox":
      return React.createElement(CheckboxInput, _extends({
        onChange: function onChange(e) {
          return changeField(l.id(model), name, '' + e.target.checked, validator);
        },
        checked: getFieldValue(model, name)
      }, props));
    default:
      return React.createElement(TextInput, _extends({
        invalidHint: getFieldInvalidHint(model, name),
        onChange: function onChange(e) {
          return changeField(l.id(model), name, e.target.value, validator);
        },
        value: getFieldValue(model, name)
      }, props));
  }
};

export default CustomInput;
