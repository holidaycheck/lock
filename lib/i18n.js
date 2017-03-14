var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import React from 'react';
import Immutable, { Map } from 'immutable';
import { format } from 'util';
import sync from './sync';
import * as l from './core/index';
import { dataFns } from './utils/data_utils';

var _dataFns = dataFns(["i18n"]),
    get = _dataFns.get,
    set = _dataFns.set;

import enDictionary from './i18n/en';
import { load, preload } from './utils/cdn_utils';

export function str(m, keyPath) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  return format.apply(undefined, [get(m, ["strings"].concat(keyPath), "")].concat(args));
}

export function html(m, keyPath) {
  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  var html = str.apply(undefined, [m, keyPath].concat(args));

  return html ? React.createElement("span", { dangerouslySetInnerHTML: { __html: html } }) : null;
}

export function group(m, keyPath) {
  return get(m, ["strings"].concat(keyPath), Map()).toJS();
}

export function initI18n(m) {
  var language = l.ui.language(m);
  var overrides = l.ui.dict(m);
  var defaultDictionary = Immutable.fromJS(enDictionary);

  var base = languageDictionaries[language] || Map({});

  if (base.isEmpty()) {
    base = overrides;
    m = sync(m, "i18n", {
      syncFn: function syncFn(_, cb) {
        return syncLang(m, language, cb);
      },
      successFn: function successFn(m, result) {
        registerLanguageDictionary(language, result);

        var overrided = Immutable.fromJS(result).mergeDeep(overrides);

        assertLanguage(m, overrided.toJS(), enDictionary);

        return set(m, "strings", defaultDictionary.mergeDeep(overrided));
      }
    });
  } else {
    assertLanguage(m, base.toJS(), enDictionary);
  }

  base = defaultDictionary.mergeDeep(base).mergeDeep(overrides);

  return set(m, "strings", base);
}

function assertLanguage(m, language, base) {
  var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";

  Object.keys(base).forEach(function (key) {
    if (!language.hasOwnProperty(key)) {
      l.warn(m, 'language does not have property ' + path + key);
    } else {
      if (_typeof(base[key]) === 'object') {
        assertLanguage(m, language[key], base[key], '' + path + key + '.');
      }
    }
  });
}

// sync

function syncLang(m, language, _cb) {
  load({
    method: "registerLanguageDictionary",
    url: l.languageBaseUrl(m) + '/js/lock/' + '10.13.0' + '/' + language + '.js',
    check: function check(str) {
      return str && str === language;
    },
    cb: function cb(err, _, dictionary) {
      _cb(err, dictionary);
    }
  });
}

var languageDictionaries = [];

function registerLanguageDictionary(language, dictionary) {
  languageDictionaries[language] = Immutable.fromJS(dictionary);
}

registerLanguageDictionary("en", enDictionary);

preload({
  method: "registerLanguageDictionary",
  cb: registerLanguageDictionary
});
