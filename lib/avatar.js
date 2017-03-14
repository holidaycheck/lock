import { getEntity, read, swap, updateEntity } from './store/index';
import { dataFns } from './utils/data_utils';
import * as preload from './utils/preload_utils';
import * as f from './utils/fn_utils';
import * as l from './core/index';

var _dataFns = dataFns(["avatar"]),
    tget = _dataFns.tget,
    tset = _dataFns.tset;

var cache = {};

export function requestAvatar(id, src) {
  if (cache[src]) {
    return update(id, src, cache[src].url, cache[src].displayName, true);
  }

  var provider = l.ui.avatarProvider(read(getEntity, "lock", id)).toJS();

  swap(updateEntity, "lock", id, function (m) {
    m = tset(m, "syncStatus", "loading");
    m = tset(m, "src", src);
    return m;
  });

  var url = void 0,
      displayName = void 0;

  provider.url(src, function (error, str) {
    if (error) return handleError(id, src);

    preload.img(str, function (error, img) {
      if (error) return handleError(id, src);
      url = img.src;
      if (displayName !== undefined) handleSuccess(id, src, url, displayName);
    });
  });

  provider.displayName(src, function (error, str) {
    if (error) return handleError(id);
    displayName = str;
    if (url !== undefined) handleSuccess(id, src, url, displayName);
  });
}

export var debouncedRequestAvatar = f.debounce(requestAvatar, 300);

function handleSuccess(id, src, url, displayName) {
  cache[src] = { url: url, displayName: displayName };
  update(id, src, url, displayName);
}

function update(id, src, url, displayName) {
  var force = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  swap(updateEntity, "lock", id, function (m) {
    if (force || tget(m, "src") === src) {
      m = tset(m, "syncStatus", "ok");
      m = tset(m, "url", url);
      m = tset(m, "src", src);
      m = tset(m, "displayName", displayName);
    }
    return m;
  });
}

function handleError(id, src) {
  swap(updateEntity, "lock", id, function (m) {
    return tget(m, "src") === "src" ? tset(m, "syncStatus", "error") : m;
  });
}
