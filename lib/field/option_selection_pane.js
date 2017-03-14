import React from 'react';
import List from '../ui/list';
import { cancelOptionSelection, selectOption } from './actions';
// TODO: these actions should be passed as props

export default (function (_ref) {
  var icon = _ref.icon,
      iconUrl = _ref.iconUrl,
      model = _ref.model,
      name = _ref.name,
      items = _ref.items;
  return React.createElement(List, {
    icon: icon,
    iconUrl: iconUrl,
    items: items,
    onSelect: function onSelect(x) {
      return selectOption(model.get("id"), name, x);
    },
    onCancel: function onCancel() {
      return cancelOptionSelection(model.get("id"));
    }
  });
});
