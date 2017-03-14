import { Map } from 'immutable';
import { swap, updateEntity } from '../store/index';
import { cancelSelection, setField, setOptionField, startSelection } from './index';

export function changeField(id, name, value, validationFn) {
  for (var _len = arguments.length, validationExtraArgs = Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
    validationExtraArgs[_key - 4] = arguments[_key];
  }

  swap.apply(undefined, [updateEntity, "lock", id, setField, name, value, validationFn].concat(validationExtraArgs));
}

export function startOptionSelection(id, name, iconUrl, icon) {
  // TODO: should be transient
  swap(updateEntity, "lock", id, function (m) {
    return m.setIn(["field", "selecting", "name"], name).setIn(["field", "selecting", "iconUrl"], iconUrl).setIn(["field", "selecting", "icon"], icon);
  });
}

export function selectOption(id, name, option) {
  swap(updateEntity, "lock", id, function (m) {
    return setOptionField(m.deleteIn(["field", "selecting"]), name, option);
  });
}

export function cancelOptionSelection(id) {
  swap(updateEntity, "lock", id, function (m) {
    return m.deleteIn(["field", "selecting"]);
  });
}
