var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import urljoin from 'url-join';
import Immutable, { List, Map, Set } from 'immutable';
import { isSmallScreen } from '../utils/media_utils';
import { endsWith } from '../utils/string_utils';
import { parseUrl } from '../utils/url_utils';
import * as i18n from '../i18n';
import trim from 'trim';
import * as gp from '../avatar/gravatar_provider';
import { dataFns } from '../utils/data_utils';
import { processSocialOptions } from '../connection/social/index';
import { clientConnections, hasFreeSubscription } from './client/index';

var _dataFns = dataFns(["core"]),
    get = _dataFns.get,
    init = _dataFns.init,
    remove = _dataFns.remove,
    reset = _dataFns.reset,
    set = _dataFns.set,
    tget = _dataFns.tget,
    tset = _dataFns.tset,
    tremove = _dataFns.tremove;

var _dataFns2 = dataFns(["social"]),
    tsetSocial = _dataFns2.tset;

export function setup(id, clientID, domain, options, hookRunner, emitEventFn) {
  var m = init(id, Immutable.fromJS({
    clientBaseUrl: extractClientBaseUrlOption(options, domain),
    tenantBaseUrl: extractTenantBaseUrlOption(options, domain),
    languageBaseUrl: extractLanguageBaseUrlOption(options, domain),
    auth: extractAuthOptions(options),
    clientID: clientID,
    domain: domain,
    emitEventFn: emitEventFn,
    hookRunner: hookRunner,
    useTenantInfo: options.__useTenantInfo || false,
    oidcConformant: options.oidcConformant || false,
    hashCleanup: options.hashCleanup === false ? false : true,
    allowedConnections: Immutable.fromJS(options.allowedConnections || []),
    ui: extractUIOptions(id, options),
    defaultADUsernameFromEmailPrefix: options.defaultADUsernameFromEmailPrefix === false ? false : true,
    prefill: options.prefill || {}
  }));

  m = i18n.initI18n(m);

  return m;
}

export function id(m) {
  return m.get("id");
}

export function clientID(m) {
  return get(m, "clientID");
}

export function domain(m) {
  return get(m, "domain");
}

export function clientBaseUrl(m) {
  return get(m, "clientBaseUrl");
}

export function tenantBaseUrl(m) {
  return get(m, "tenantBaseUrl");
}

export function useTenantInfo(m) {
  return get(m, "useTenantInfo");
}

export function oidcConformant(m) {
  return get(m, "oidcConformant");
}

export function languageBaseUrl(m) {
  return get(m, "languageBaseUrl");
}

export function setSubmitting(m, value) {
  var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

  m = tset(m, "submitting", value);
  m = clearGlobalSuccess(m);
  m = error && !value ? setGlobalError(m, error) : clearGlobalError(m);
  return m;
}

export function submitting(m) {
  return tget(m, "submitting", false);
}

export function setGlobalError(m, str) {
  return tset(m, "globalError", str);
}

export function globalError(m) {
  return tget(m, "globalError", "");
}

export function clearGlobalError(m) {
  return tremove(m, "globalError");
}

export function setGlobalSuccess(m, str) {
  return tset(m, "globalSuccess", str);
}

export function globalSuccess(m) {
  return tget(m, "globalSuccess", "");
}

export function clearGlobalSuccess(m) {
  return tremove(m, "globalSuccess");
}

export function rendering(m) {
  return tget(m, "render", false);
}

export function stopRendering(m) {
  return tremove(m, "render");
}

function extractUIOptions(id, options) {
  var closable = options.container ? false : undefined === options.closable ? true : !!options.closable;
  var theme = options.theme || {};
  var labeledSubmitButton = theme.labeledSubmitButton,
      hideMainScreenTitle = theme.hideMainScreenTitle,
      logo = theme.logo,
      primaryColor = theme.primaryColor,
      authButtons = theme.authButtons;


  var avatar = options.avatar !== null;
  var customAvatarProvider = options.avatar && typeof options.avatar.url === "function" && typeof options.avatar.displayName === "function" && options.avatar;
  var avatarProvider = customAvatarProvider || gp;

  return new Immutable.fromJS({
    containerID: options.container || 'auth0-lock-container-' + id,
    appendContainer: !options.container,
    autoclose: undefined === options.autoclose ? false : closable && options.autoclose,
    autofocus: undefined === options.autofocus ? !(options.container || isSmallScreen()) : !!options.autofocus,
    avatar: avatar,
    avatarProvider: avatarProvider,
    logo: typeof logo === "string" ? logo : undefined,
    closable: closable,
    hideMainScreenTitle: !!hideMainScreenTitle,
    labeledSubmitButton: undefined === labeledSubmitButton ? true : !!labeledSubmitButton,
    language: undefined === options.language ? "en" : trim(options.language || "").toLowerCase(),
    dict: _typeof(options.languageDictionary) === "object" ? options.languageDictionary : {},
    disableWarnings: options.disableWarnings === undefined ? false : !!options.disableWarnings,
    mobile: undefined === options.mobile ? false : !!options.mobile,
    popupOptions: undefined === options.popupOptions ? {} : options.popupOptions,
    primaryColor: typeof primaryColor === "string" ? primaryColor : undefined,
    rememberLastLogin: undefined === options.rememberLastLogin ? true : !!options.rememberLastLogin,
    authButtonsTheme: (typeof authButtons === 'undefined' ? 'undefined' : _typeof(authButtons)) === "object" ? authButtons : {}
  });
}

var _dataFns3 = dataFns(["core", "ui"]),
    getUI = _dataFns3.get,
    setUI = _dataFns3.set;

var _dataFns4 = dataFns(["core", "transient", "ui"]),
    tgetUI = _dataFns4.get,
    tsetUI = _dataFns4.set;

var getUIAttribute = function getUIAttribute(m, attribute) {
  return tgetUI(m, attribute) || getUI(m, attribute);
};

export var ui = {
  containerID: function containerID(lock) {
    return getUIAttribute(lock, "containerID");
  },
  appendContainer: function appendContainer(lock) {
    return getUIAttribute(lock, "appendContainer");
  },
  autoclose: function autoclose(lock) {
    return getUIAttribute(lock, "autoclose");
  },
  autofocus: function autofocus(lock) {
    return getUIAttribute(lock, "autofocus");
  },
  avatar: function avatar(lock) {
    return getUIAttribute(lock, "avatar");
  },
  avatarProvider: function avatarProvider(lock) {
    return getUIAttribute(lock, "avatarProvider");
  },
  closable: function closable(lock) {
    return getUIAttribute(lock, "closable");
  },
  dict: function dict(lock) {
    return getUIAttribute(lock, "dict");
  },
  disableWarnings: function disableWarnings(lock) {
    return getUIAttribute(lock, "disableWarnings");
  },
  labeledSubmitButton: function labeledSubmitButton(lock) {
    return getUIAttribute(lock, "labeledSubmitButton");
  },
  hideMainScreenTitle: function hideMainScreenTitle(lock) {
    return getUIAttribute(lock, "hideMainScreenTitle");
  },
  language: function language(lock) {
    return getUIAttribute(lock, "language");
  },
  logo: function logo(lock) {
    return getUIAttribute(lock, "logo");
  },
  mobile: function mobile(lock) {
    return getUIAttribute(lock, "mobile");
  },
  popupOptions: function popupOptions(lock) {
    return getUIAttribute(lock, "popupOptions");
  },
  primaryColor: function primaryColor(lock) {
    return getUIAttribute(lock, "primaryColor");
  },
  authButtonsTheme: function authButtonsTheme(lock) {
    return getUIAttribute(lock, "authButtonsTheme");
  },
  rememberLastLogin: function rememberLastLogin(m) {
    return tget(m, "rememberLastLogin", getUIAttribute(m, "rememberLastLogin"));
  }
};

var _dataFns5 = dataFns(["core", "auth"]),
    getAuthAttribute = _dataFns5.get;

export var auth = {
  connectionScopes: function connectionScopes(m) {
    return getAuthAttribute(m, "connectionScopes");
  },
  params: function params(m) {
    return tget(m, "authParams") || getAuthAttribute(m, "params");
  },
  autoParseHash: function autoParseHash(lock) {
    return getAuthAttribute(lock, "autoParseHash");
  },
  redirect: function redirect(lock) {
    return getAuthAttribute(lock, "redirect");
  },
  redirectUrl: function redirectUrl(lock) {
    return getAuthAttribute(lock, "redirectUrl");
  },
  responseType: function responseType(lock) {
    return getAuthAttribute(lock, "responseType");
  },
  sso: function sso(lock) {
    return getAuthAttribute(lock, "sso");
  }
};

function extractAuthOptions(options) {
  var _ref = options.auth || {},
      audience = _ref.audience,
      connectionScopes = _ref.connectionScopes,
      params = _ref.params,
      autoParseHash = _ref.autoParseHash,
      redirect = _ref.redirect,
      redirectUrl = _ref.redirectUrl,
      responseMode = _ref.responseMode,
      responseType = _ref.responseType,
      sso = _ref.sso,
      state = _ref.state,
      nonce = _ref.nonce;

  var oidcConformant = options.oidcConformant;


  audience = typeof audience === "string" ? audience : undefined;
  connectionScopes = (typeof connectionScopes === 'undefined' ? 'undefined' : _typeof(connectionScopes)) === "object" ? connectionScopes : {};
  params = (typeof params === 'undefined' ? 'undefined' : _typeof(params)) === "object" ? params : {};
  // by default is null because we need to know if it was set when we curate the responseType
  redirectUrl = typeof redirectUrl === "string" && redirectUrl ? redirectUrl : null;
  autoParseHash = typeof autoParseHash === "boolean" ? autoParseHash : true;
  redirect = typeof redirect === "boolean" ? redirect : true;
  responseMode = typeof responseMode === "string" ? responseMode : undefined;
  state = typeof state === "string" ? state : undefined;
  nonce = typeof nonce === "string" ? nonce : undefined;
  // if responseType was not set and there is a redirectUrl, it defaults to code. Otherwise token.
  responseType = typeof responseType === "string" ? responseType : redirectUrl ? "code" : "token";
  // now we set the default because we already did the validation
  redirectUrl = redirectUrl || window.location.href;

  sso = typeof sso === "boolean" ? sso : true;

  if (!oidcConformant && trim(params.scope || "") === "openid profile") {
    warn(options, "Usage of scope 'openid profile' is not recommended. See https://auth0.com/docs/scopes for more details.");
  }

  if (oidcConformant && !redirect && responseType.indexOf('id_token') > -1) {
    throw new Error("It is not posible to request an 'id_token' while using popup mode.");
  }

  // for legacy flow, the scope should default to openid
  if (!oidcConformant && !params.scope) {
    params.scope = 'openid';
  }

  return Immutable.fromJS({
    audience: audience,
    connectionScopes: connectionScopes,
    params: params,
    autoParseHash: autoParseHash,
    redirect: redirect,
    redirectUrl: redirectUrl,
    responseMode: responseMode,
    responseType: responseType,
    sso: sso,
    state: state,
    nonce: nonce
  });
}

export function withAuthOptions(m, opts) {
  return Immutable.fromJS(opts).merge(get(m, "auth")).toJS();
}

function extractClientBaseUrlOption(opts, domain) {
  if (opts.clientBaseUrl && typeof opts.clientBaseUrl === "string") {
    return opts.clientBaseUrl;
  }

  if (opts.configurationBaseUrl && typeof opts.configurationBaseUrl === "string") {
    return opts.configurationBaseUrl;
  }

  if (opts.assetsUrl && typeof opts.assetsUrl === "string") {
    return opts.assetsUrl;
  }

  var domainUrl = "https://" + domain;
  var hostname = parseUrl(domainUrl).hostname;
  var DOT_AUTH0_DOT_COM = ".auth0.com";
  var AUTH0_US_CDN_URL = "https://cdn.auth0.com";
  if (endsWith(hostname, DOT_AUTH0_DOT_COM)) {
    var parts = hostname.split(".");
    return parts.length > 3 ? "https://cdn." + parts[parts.length - 3] + DOT_AUTH0_DOT_COM : AUTH0_US_CDN_URL;
  } else {
    return domainUrl;
  }
}

export function extractTenantBaseUrlOption(opts, domain) {
  if (opts.configurationBaseUrl && typeof opts.configurationBaseUrl === "string") {
    return urljoin(opts.configurationBaseUrl, 'info-v1.js');
  }

  if (opts.assetsUrl && typeof opts.assetsUrl === "string") {
    return opts.assetsUrl;
  }

  var domainUrl = "https://" + domain;
  var hostname = parseUrl(domainUrl).hostname;
  var DOT_AUTH0_DOT_COM = ".auth0.com";
  var AUTH0_US_CDN_URL = "https://cdn.auth0.com";

  var parts = hostname.split(".");
  var tenant_name = parts[0];
  var domain;

  if (endsWith(hostname, DOT_AUTH0_DOT_COM)) {
    domain = parts.length > 3 ? "https://cdn." + parts[parts.length - 3] + DOT_AUTH0_DOT_COM : AUTH0_US_CDN_URL;

    return urljoin(domain, 'tenants', 'v1', tenant_name + '.js');
  } else {
    return urljoin(domainUrl, 'info-v1.js');
  }
}

function extractLanguageBaseUrlOption(opts, domain) {
  if (opts.languageBaseUrl && typeof opts.languageBaseUrl === "string") {
    return opts.languageBaseUrl;
  }

  if (opts.assetsUrl && typeof opts.assetsUrl === "string") {
    return opts.assetsUrl;
  }

  return "https://cdn.auth0.com";
}

export function render(m) {
  return tset(m, "render", true);
}

export { reset };

export function setLoggedIn(m, value) {
  return tset(m, "loggedIn", value);
}

export function loggedIn(m) {
  return tget(m, "loggedIn", false);
}

export function defaultADUsernameFromEmailPrefix(m) {
  return get(m, "defaultADUsernameFromEmailPrefix", true);
}

export function prefill(m) {
  return get(m, "prefill", {});
}

export function warn(x, str) {
  var shouldOutput = Map.isMap(x) ? !ui.disableWarnings(x) : !x.disableWarnings;

  if (shouldOutput && console && console.warn) {
    console.warn(str);
  }
}

export function error(x, str) {
  var shouldOutput = Map.isMap(x) ? !ui.disableWarnings(x) : !x.disableWarnings;

  if (shouldOutput && console && console.error) {
    console.error(str);
  }
}

export function allowedConnections(m) {
  return tget(m, "allowedConnections") || get(m, "allowedConnections");
}

export function connections(m) {
  for (var _len = arguments.length, strategies = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    strategies[_key - 2] = arguments[_key];
  }

  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  if (arguments.length === 1) {
    return tget(m, "connections", Map()).filter(function (v, k) {
      return k !== "unknown";
    }).valueSeq().flatten(true);
  }

  var xs = tget(m, ["connections", type], List());
  return strategies.length > 0 ? xs.filter(function (x) {
    return ~strategies.indexOf(x.get("strategy"));
  }) : xs;
}

export function connection(m) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  for (var _len2 = arguments.length, strategies = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    strategies[_key2 - 2] = arguments[_key2];
  }

  return connections.apply(undefined, [m, type].concat(strategies)).get(0);
}

export function hasOneConnection(m) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  var xs = connections(m);
  return xs.count() === 1 && (!type || xs.getIn([0, "type"]) === type);
}

export function hasOnlyConnections(m) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  var all = connections(m).count();

  for (var _len3 = arguments.length, strategies = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    strategies[_key3 - 2] = arguments[_key3];
  }

  var filtered = connections.apply(undefined, [m, type].concat(strategies)).count();
  return all > 0 && all === filtered;
}

export function hasSomeConnections(m) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  for (var _len4 = arguments.length, strategies = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    strategies[_key4 - 2] = arguments[_key4];
  }

  return countConnections.apply(undefined, [m, type].concat(strategies)) > 0;
}

export function countConnections(m) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  for (var _len5 = arguments.length, strategies = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
    strategies[_key5 - 2] = arguments[_key5];
  }

  return connections.apply(undefined, [m, type].concat(strategies)).count();
}

export function findConnection(m, name) {
  return connections(m).find(function (m1) {
    return m1.get("name") === name;
  });
}

export function hasConnection(m, name) {
  return !!findConnection(m, name);
}

export function filterConnections(m) {
  var allowed = allowedConnections(m);

  var order = allowed.count() === 0 ? function (_) {
    return 0;
  } : function (c) {
    return allowed.indexOf(c.get("name"));
  };

  return tset(m, "connections", clientConnections(m).map(function (cs) {
    return cs.filter(function (c) {
      return order(c) >= 0;
    }).sort(function (c1, c2) {
      return order(c1) - order(c2);
    });
  }));
}

export function runHook(m, str) {
  for (var _len6 = arguments.length, args = Array(_len6 > 2 ? _len6 - 2 : 0), _key6 = 2; _key6 < _len6; _key6++) {
    args[_key6 - 2] = arguments[_key6];
  }

  return get(m, "hookRunner").apply(undefined, [str, m].concat(args));
}

export function emitEvent(m, str) {
  for (var _len7 = arguments.length, args = Array(_len7 > 2 ? _len7 - 2 : 0), _key7 = 2; _key7 < _len7; _key7++) {
    args[_key7 - 2] = arguments[_key7];
  }

  setTimeout(function () {
    var emitEventFn = get(m, "emitEventFn");
    var hadListener = emitEventFn.apply(undefined, [str].concat(args));
    // Handle uncaught custom error
    if (str === "unrecoverable_error" && !hadListener) {
      throw new (Function.prototype.bind.apply(Error, [null].concat(args)))();
    }
  }, 0);
}

export function loginErrorMessage(m, error, type) {
  // NOTE: previous version of lock checked for status codes and, at
  // some point, if the status code was 401 it defaults to an
  // "invalid_user_password" error (actually the
  // "wrongEmailPasswordErrorText" dict entry) instead of checking
  // explicitly. We should figure out if there was a reason for that.

  if (error.status === 0) {
    return i18n.str(m, ["error", "login", "lock.network"]);
  }

  // Custom rule error (except blocked_user)
  if (error.code === "rule_error") {
    return error.description || i18n.str(m, ["error", "login", "lock.fallback"]);
  }

  var INVALID_MAP = {
    code: "lock.invalid_code",
    email: "lock.invalid_email_password",
    username: "lock.invalid_username_password"
  };

  var code = error.error || error.code;
  if (code === "invalid_user_password" && INVALID_MAP[type]) {
    code = INVALID_MAP[type];
  }

  if (code === "a0.mfa_registration_required") {
    code = "lock.mfa_registration_required";
  }

  if (code === "a0.mfa_invalid_code") {
    code = "lock.mfa_invalid_code";
  }

  return i18n.str(m, ["error", "login", code]) || i18n.str(m, ["error", "login", "lock.fallback"]);
}

// TODO: rename to something less generic that is easier to grep
export function stop(m, error) {
  if (error) {
    setTimeout(function () {
      return emitEvent(m, "unrecoverable_error", error);
    }, 17);
  }

  return set(m, "stopped", true);
}

export function hasStopped(m) {
  return get(m, "stopped");
}

export function hashCleanup(m) {
  return get(m, "hashCleanup");
}

export function emitHashParsedEvent(m, parsedHash) {
  emitEvent(m, "hash_parsed", parsedHash);
}

export function emitAuthenticatedEvent(m, result) {
  emitEvent(m, "authenticated", result);
}

export function emitAuthorizationErrorEvent(m, error) {
  emitEvent(m, "authorization_error", error);
}

export function emitUnrecoverableErrorEvent(m, error) {
  emitEvent(m, "unrecoverable_error", error);
}

export function showBadge(m) {
  return hasFreeSubscription(m) || false;
}

export function overrideOptions(m, opts) {
  if (!opts) opts = {};

  if (opts.allowedConnections) {
    m = tset(m, "allowedConnections", Immutable.fromJS(opts.allowedConnections));
  }

  if (opts.socialButtonStyle) {
    var curated = processSocialOptions(opts);
    m = tsetSocial(m, "socialButtonStyle", curated.socialButtonStyle);
  }

  if (opts.flashMessage) {
    var key = "success" === opts.flashMessage.type ? "globalSuccess" : "globalError";
    m = tset(m, key, opts.flashMessage.text);
  }

  if (opts.auth && opts.auth.params) {
    m = tset(m, "authParams", Immutable.fromJS(opts.auth.params));
  }

  if (opts.theme) {
    if (opts.theme.primaryColor) {
      m = tset(m, ["ui", "primaryColor"], opts.theme.primaryColor);
    }

    if (opts.theme.logo) {
      m = tset(m, ["ui", "logo"], opts.theme.logo);
    }
  }

  if (opts.language || opts.languageDictionary) {

    if (opts.language) {
      m = tset(m, ["ui", "language"], opts.language);
    }

    if (opts.languageDictionary) {
      m = tset(m, ["ui", "dict"], opts.languageDictionary);
    }

    m = i18n.initI18n(m);
  }

  if (typeof opts.rememberLastLogin === "boolean") {
    m = tset(m, "rememberLastLogin", opts.rememberLastLogin);
  }

  return m;
}
