import { Map } from 'immutable';
import { dataFns } from './utils/data_utils';

var _dataFns = dataFns(["sync"]),
    get = _dataFns.get,
    set = _dataFns.set;

import * as l from './core/index';

import { getEntity, observe, read, swap, updateEntity } from './store/index';

export default (function (m, key, opts) {
  if (get(m, key) !== undefined) return m;

  var status = opts.waitFn ? "waiting" : !opts.conditionFn || opts.conditionFn(m) ? "pending" : "no";

  return set(m, key, Map({
    conditionFn: opts.conditionFn,
    errorFn: opts.errorFn,
    recoverResult: opts.recoverResult,
    syncStatus: status,
    successFn: opts.successFn,
    syncFn: opts.syncFn,
    timeout: opts.timeout || 6000,
    waitFn: opts.waitFn
  }));
});

var syncStatusKey = function syncStatusKey(key) {
  return (global.Array.isArray(key) ? key : [key]).concat(["syncStatus"]);
};
var getStatus = function getStatus(m, key) {
  return get(m, syncStatusKey(key));
};
var setStatus = function setStatus(m, key, str) {
  return set(m, syncStatusKey(key), str);
};
var getProp = function getProp(m, key, name) {
  return get(m, key).get(name);
};

var findKeys = function findKeys(m) {
  return m.reduce(function (r, v, k) {
    var current = Map.isMap(v) && v.has("syncStatus") ? [k] : [];
    var nested = Map.isMap(v) ? findKeys(v).map(function (x) {
      return [k].concat(x);
    }) : [];
    return r.concat.apply(r, [current].concat([nested]));
  }, []);
};

function removeKeys(m, keys) {
  return keys.reduce(function (r, k) {
    return r.deleteIn(syncStatusKey(k));
  }, m);
}

var process = function process(m, id) {
  var keys = findKeys(get(m, [], Map()));
  // TODO timeout
  return keys.reduce(function (r, k) {
    if (typeof getProp(r, k, "syncFn") != "function") return r;
    if (getStatus(r, k) === "pending") {
      (function () {
        r = setStatus(r, k, "loading");
        var called = false;
        getProp(r, k, "syncFn")(r, function (error, result) {
          if (called) return;
          called = true;
          setTimeout(function () {
            swap(updateEntity, "lock", id, function (m) {
              var errorFn = getProp(r, k, "errorFn");

              if (error && typeof errorFn === "function") {
                setTimeout(function () {
                  return errorFn(m, error);
                }, 0);
              }

              var recoverResult = getProp(m, k, "recoverResult");

              if (error && recoverResult === undefined) {
                return handleError(m, k, error);
              } else {
                m = setStatus(m, k, "ok");
                return getProp(m, k, "successFn")(m, error ? recoverResult : result);
              }
            });
          }, 0);
        });
      })();
    } else if (getStatus(r, k) === "waiting") {
      if (getProp(r, k, "waitFn")(r)) {
        var conditionFn = getProp(r, k, "conditionFn");
        r = setStatus(r, k, !conditionFn || conditionFn(r) ? "pending" : "no");
      }
    }

    return r;
  }, m);
};

export var go = function go(id) {
  observe("sync", id, function (m) {
    setTimeout(function () {
      return swap(updateEntity, "lock", id, process, id);
    }, 0);
  });
};

export function isSuccess(m, key) {
  return getStatus(m, key) === "ok";
}

export function isDone(m) {
  var keys = findKeys(get(m, [], Map()));
  return keys.length > 0 && keys.reduce(function (r, k) {
    return r && !isLoading(m, k);
  }, true);
}

export function hasError(m) {
  var excludeKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var keys = findKeys(removeKeys(get(m, [], Map()), excludeKeys));
  return keys.length > 0 && keys.reduce(function (r, k) {
    return r || getStatus(m, k) === "error";
  }, false);
}

function isLoading(m, key) {
  return ["loading", "pending", "waiting"].indexOf(getStatus(m, key)) > -1;
}

function handleError(m, key, error) {
  var result = setStatus(m, key, "error");

  // TODO: this should be configurable for each sync
  if (key !== "sso") {
    var stopError = new Error("An error occurred when fetching data.");
    stopError.code = "sync";
    stopError.origin = error;
    result = l.stop(result, stopError);
  }

  return result;
}
