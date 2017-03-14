var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import React from 'react';
import { Map } from 'immutable';
import trim from 'trim';
import OptionSelectionPane from './option_selection_pane';
import * as l from '../core/index';

export function setField(m, field, value) {
  var validator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (str) {
    return trim(str).length > 0;
  };

  var prevValue = m.getIn(["field", field, "value"]);
  var prevShowInvalid = m.getIn(["field", field, "showInvalid"], false);

  for (var _len = arguments.length, args = Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
    args[_key - 4] = arguments[_key];
  }

  var validation = validate.apply(undefined, [validator, value].concat(args));

  return m.mergeIn(["field", field], validation, Map({
    value: value,
    showInvalid: prevShowInvalid && prevValue === value
  }));
}

function validate(validator, value) {
  if (typeof validator != "function") return Map({ valid: true });

  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  var validation = validator.apply(undefined, [value].concat(args));
  return validation && (typeof validation === 'undefined' ? 'undefined' : _typeof(validation)) === "object" ? Map({ valid: validation.valid, invalidHint: validation.hint }) : Map({ valid: !!validation });
}

// TODO: this should handle icons, and everything.
// TODO: also there should be a similar fn for regular fields.
export function registerOptionField(m, field, options, initialValue) {
  var valid = true,
      hasInitial = !initialValue,
      initialOption = void 0;
  options.forEach(function (x) {
    valid = valid && x.get("label") && typeof x.get("label") === "string" && x.get("value") && typeof x.get("value") === "string";

    if (!hasInitial && x.get("value") === initialValue) {
      initialOption = x;
      hasInitial = true;
    }
  });

  if (!valid || !options.size) {
    var stopError = new Error('The options provided for the "' + field + '" field are invalid, they must have the following format: {label: "non-empty string", value: "non-empty string"} and there has to be at least one option.');
    stopError.code = "invalid_select_field";
    // TODO: in the future we might want to return the result of the
    // operation along with the model insteand of stopping the
    // rendering, like [false, m] in the case of failure and [true, m]
    // in the case of success.
    return l.stop(m, stopError);
  }

  if (!initialOption) initialOption = Map({});

  return m.mergeIn(["field", field], initialOption, Map({
    options: options,
    showInvalid: false,
    valid: !initialOption.isEmpty()
  }));
}

export function setOptionField(m, field, option) {
  return m.mergeIn(["field", field], option.merge(Map({
    valid: true,
    showInvalid: false
  })));
}

export function isFieldValid(m, field) {
  return m.getIn(["field", field, "valid"]);
}

export function getFieldInvalidHint(m, field) {
  return m.getIn(["field", field, "invalidHint"], "");
}

export function isFieldVisiblyInvalid(m, field) {
  return m.getIn(["field", field, "showInvalid"], false) && !m.getIn(["field", field, "valid"]);
}

export function showInvalidField(m, field) {
  return m.setIn(["field", field, "showInvalid"], !isFieldValid(m, field));
}

export function hideInvalidFields(m) {
  return m.update("field", function (fields) {

    return fields && fields.map(function (field) {
      return field.set("showInvalid", false);
    });
  });
}

// TODO: only used in passwordless, when we update it to use
// validateAndSubmit this won't be needed anymore.
export function setFieldShowInvalid(m, field, value) {
  return m.setIn(["field", field, "showInvalid"], value);
}

export function clearFields(m, fields) {
  var keyPaths = void 0;

  if (!fields || fields.length === 0) {
    keyPaths = [["field"]];
  } else {
    keyPaths = fields.map(function (x) {
      return ["field", x];
    });
  }

  return keyPaths.reduce(function (r, v) {
    return r.removeIn(v);
  }, m);
}

export function getField(m, field) {
  var notFound = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Map({});

  return m.getIn(["field", field], notFound);
}

export function getFieldValue(m, field) {
  var notFound = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

  return getField(m, field).get("value", notFound);
}

export function getFieldLabel(m, field) {
  var notFound = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

  return getField(m, field).get("label", notFound);
}

// phone number

export function phoneNumber(lock) {
  return lock.getIn(["field", "phoneNumber", "value"], "");
}

// email

export function email(m) {
  return getFieldValue(m, "email");
}

// vcode

export function vcode(m) {
  return getFieldValue(m, "vcode");
}

// password

export function password(m) {
  return getFieldValue(m, "password");
}

// username

export function username(m) {
  return getFieldValue(m, "username");
}

// mfa_code

export function mfaCode(m) {
  return getFieldValue(m, "mfa_code");
}

// select field options

export function isSelecting(m) {
  return !!m.getIn(["field", "selecting"]);
}

export function renderOptionSelection(m) {
  var name = m.getIn(["field", "selecting", "name"]);
  return isSelecting(m) ? React.createElement(OptionSelectionPane, {
    model: m,
    name: name,
    icon: m.getIn(["field", "selecting", "icon"]),
    iconUrl: m.getIn(["field", "selecting", "iconUrl"]),
    items: m.getIn(["field", name, "options"])
  }) : null;
}
