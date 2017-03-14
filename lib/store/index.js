import atom from '../utils/atom';
import { Map } from 'immutable';

var store = atom(new Map({}));

export function observe(key, id, f) {
  subscribe(key + '-' + id, function (_, oldState, newState) {
    var m = getEntity(newState, "lock", id);
    var oldM = getEntity(oldState, "lock", id);
    if (m != oldM) f(m);
  });
}

export function subscribe(key, f) {
  store.addWatch(key, f);
}

export function unsubscribe(key) {
  store.removeWatch(key);
}

export function swap() {
  return store.swap.apply(store, arguments);
}

export function updateEntity(state, coll, id, f) {
  for (var _len = arguments.length, args = Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
    args[_key - 4] = arguments[_key];
  }

  return state.updateIn([coll, id], new Map({}), function (x) {
    return f.apply(undefined, [x].concat(args));
  });
}

export function setEntity(state, coll, id, m) {
  return state.setIn([coll, id], m);
}

export function read(f) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  return f.apply(undefined, [store.deref()].concat(args));
}

export function getEntity(state, coll) {
  var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  return state.getIn([coll, id]);
}

export function removeEntity(state, coll) {
  var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  return state.removeIn([coll, id]);
}

export function getCollection(state, coll) {
  return state.get(coll, Map()).toList();
}

// TODO: try to remove this fn
export function updateCollection(state, coll, f) {
  for (var _len3 = arguments.length, args = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
    args[_key3 - 3] = arguments[_key3];
  }

  return state.update(coll, function (xs) {
    return f.apply(undefined, [xs].concat(args));
  });
}

export function getState() {
  return store.deref();
}

// DEV
// store.addWatch("keepHistory", (key, oldState, newState) => {
//   if (!global.window.h) global.window.h = []; global.window.h.push(newState);
//   console.debug("something changed", newState.toJS());
// });
