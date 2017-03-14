import Immutable, { List, Map } from 'immutable';
import * as l from '../../core/index';
import { hideInvalidFields, clearFields, getFieldValue, setField, registerOptionField } from '../../field/index';
import { dataFns } from '../../utils/data_utils';
import sync from '../../sync';
import trim from 'trim';
import { defaultDirectory } from '../../core/tenant';
import { findADConnectionWithoutDomain } from '../../connection/enterprise';

var _dataFns = dataFns(["database"]),
    get = _dataFns.get,
    initNS = _dataFns.initNS,
    tget = _dataFns.tget,
    tset = _dataFns.tset;

export function initDatabase(m, options) {
  m = initNS(m, Immutable.fromJS(processDatabaseOptions(options)));
  m = resolveAdditionalSignUpFields(m);
  return m;
}

function assertMaybeBoolean(opts, name) {
  var valid = opts[name] === undefined || typeof opts[name] === "boolean";
  if (!valid) l.warn(opts, 'The `' + name + '` option will be ignored, because it is not a booelan.');
  return valid;
}

function assertMaybeEnum(opts, name, a) {
  var valid = opts[name] === undefined || a.indexOf(opts[name]) > -1;
  if (!valid) l.warn(opts, 'The `' + name + '` option will be ignored, because it is not one of the following allowed values: ' + a.map(function (x) {
    return JSON.stringify(x);
  }).join(", ") + '.');
  return valid;
}

function assertMaybeString(opts, name) {
  var valid = opts[name] === undefined || typeof opts[name] === "string" && trim(opts[name]).length > 0;
  if (!valid) l.warn(opts, 'The `' + name + '` option will be ignored, because it is not a non-empty string.');
  return valid;
}

function assertMaybeArray(opts, name) {
  var valid = opts[name] === undefined || global.Array.isArray(opts[name]);
  if (!valid) l.warn(opts, 'The `' + name + '` option will be ignored, because it is not an array.');
  return valid;
}

function processDatabaseOptions(opts) {
  var additionalSignUpFields = opts.additionalSignUpFields,
      defaultDatabaseConnection = opts.defaultDatabaseConnection,
      forgotPasswordLink = opts.forgotPasswordLink,
      loginAfterSignUp = opts.loginAfterSignUp,
      mustAcceptTerms = opts.mustAcceptTerms,
      signUpLink = opts.signUpLink,
      usernameStyle = opts.usernameStyle;

  var _processScreenOptions = processScreenOptions(opts),
      initialScreen = _processScreenOptions.initialScreen,
      screens = _processScreenOptions.screens;

  if (!assertMaybeEnum(opts, "usernameStyle", ["email", "username"])) {
    usernameStyle = undefined;
  }

  if (!assertMaybeString(opts, "defaultDatabaseConnection")) {
    defaultDatabaseConnection = undefined;
  }

  if (!assertMaybeString(opts, "forgotPasswordLink")) {
    forgotPasswordLink = undefined;
  }

  if (!assertMaybeString(opts, "signUpLink")) {
    signUpLink = undefined;
  }

  if (!assertMaybeBoolean(opts, "mustAcceptTerms")) {
    mustAcceptTerms = undefined;
  }

  if (!assertMaybeArray(opts, "additionalSignUpFields")) {
    additionalSignUpFields = undefined;
  } else if (additionalSignUpFields) {
    additionalSignUpFields = additionalSignUpFields.reduce(function (r, x) {
      var icon = x.icon,
          name = x.name,
          options = x.options,
          placeholder = x.placeholder,
          prefill = x.prefill,
          type = x.type,
          validator = x.validator;

      var filter = true;

      var reservedNames = ["email", "username", "password"];
      if (typeof name != "string" || !name.match(/^[a-zA-Z0-9_]+$/) || reservedNames.indexOf(name) > -1) {
        l.warn(opts, 'Ignoring an element of `additionalSignUpFields` because it does not contain valid `name` property. Every element of `additionalSignUpFields` must be an object with a `name` property that is a non-empty string consisting of letters, numbers and underscores. The following names are reserved, and therefore, cannot be used: ' + reservedNames.join(", ") + '.');
        filter = false;
      }

      if (typeof placeholder != "string" || !placeholder) {
        l.warn(opts, "Ignoring an element of `additionalSignUpFields` because it does not contain a valid `placeholder` property. Every element of `additionalSignUpFields` must have a `placeholder` property that is a non-empty string.");
        filter = false;
      }

      if (icon != undefined && (typeof icon != "string" || !icon)) {
        l.warn(opts, "When provided, the `icon` property of an element of `additionalSignUpFields` must be a non-empty string.");
        icon = undefined;
      }

      if (prefill != undefined && (typeof prefill != "string" || !prefill) && typeof prefill != "function") {
        l.warn(opts, "When provided, the `prefill` property of an element of `additionalSignUpFields` must be a non-empty string or a function.");
        prefill = undefined;
      }

      var types = ["select", "text", "checkbox"];
      if (type != undefined && (typeof type != "string" || types.indexOf(type) === -1)) {
        l.warn(opts, 'When provided, the `type` property of an element of `additionalSignUpFields` must be one of the following strings: "' + types.join("\", \"") + '".');
        type = undefined;
      }

      if (validator != undefined && type === "select") {
        l.warn(opts, "Elements of `additionalSignUpFields` with a \"select\" `type` cannot specify a `validator` function, all of its `options` are assumed to be valid.");
        validator = undefined;
      }

      if (validator != undefined && typeof validator != "function") {
        l.warn(opts, "When provided, the `validator` property of an element of `additionalSignUpFields` must be a function.");
        validator = undefined;
      }

      if (options != undefined && type != "select") {
        l.warn(opts, "The `options` property can only by provided for an element of `additionalSignUpFields` when its `type` equals to \"select\"");
        options = undefined;
      }

      if (options != undefined && !global.Array.isArray(options) && typeof options != "function" || type === "select" && options === undefined) {
        l.warn(opts, "Ignoring an element of `additionalSignUpFields` because it has a \"select\" `type` but does not specify an `options` property that is an Array or a function.");
        filter = false;
      }

      return filter ? r.concat([{ icon: icon, name: name, options: options, placeholder: placeholder, prefill: prefill, type: type, validator: validator }]) : r;
    }, []);

    additionalSignUpFields = Immutable.fromJS(additionalSignUpFields).map(function (x) {
      return x.filter(function (y) {
        return y !== undefined;
      });
    });
  }

  // TODO: add a warning if it is not a boolean, leave it undefined,
  // and change accesor fn.
  loginAfterSignUp = loginAfterSignUp === false ? false : true;

  return Map({
    additionalSignUpFields: additionalSignUpFields,
    defaultConnectionName: defaultDatabaseConnection,
    forgotPasswordLink: forgotPasswordLink,
    initialScreen: initialScreen,
    loginAfterSignUp: loginAfterSignUp,
    mustAcceptTerms: mustAcceptTerms,
    screens: screens,
    signUpLink: signUpLink,
    usernameStyle: usernameStyle
  }).filter(function (x) {
    return typeof x !== "undefined";
  }).toJS();
}

function processScreenOptions(opts) {
  var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { allowLogin: true, allowSignUp: true, allowForgotPassword: true, initialScreen: undefined };
  var allowForgotPassword = opts.allowForgotPassword,
      allowLogin = opts.allowLogin,
      allowSignUp = opts.allowSignUp,
      initialScreen = opts.initialScreen;


  var screens = [];

  if (allowLogin === true || !assertMaybeBoolean(opts, "allowLogin") && defaults.allowLogin || allowLogin === undefined && defaults.allowLogin) {
    screens.push("login");
  }

  if (allowSignUp === true || !assertMaybeBoolean(opts, "allowSignUp") && defaults.allowSignUp || allowSignUp === undefined && defaults.allowSignUp) {
    screens.push("signUp");
  }

  if (allowForgotPassword === true || !assertMaybeBoolean(opts, "allowForgotPassword") && defaults.allowForgotPassword || allowForgotPassword === undefined && defaults.allowForgotPassword) {
    screens.push("forgotPassword");
  }

  screens.push("mfaLogin");

  if (!assertMaybeEnum(opts, "initialScreen", screens)) {
    initialScreen = undefined;
  }

  if (initialScreen === undefined) {
    initialScreen = defaults.initialScreen || screens[0];
  }

  return { initialScreen: initialScreen, screens: new List(screens) };
}

export function overrideDatabaseOptions(m, opts) {
  var _processScreenOptions2 = processScreenOptions(opts, {
    allowLogin: availableScreens(m).contains("login"),
    allowSignUp: availableScreens(m).contains("signUp"),
    allowForgotPassword: availableScreens(m).contains("forgotPassword"),
    initialScreen: get(m, "initialScreen")
  }),
      initialScreen = _processScreenOptions2.initialScreen,
      screens = _processScreenOptions2.screens;

  m = tset(m, "initialScreen", initialScreen);
  m = tset(m, "screens", screens);
  return m;
}

export function defaultDatabaseConnection(m) {
  var name = defaultDatabaseConnectionName(m);
  return name && l.findConnection(m, name);
}

export function defaultDatabaseConnectionName(m) {
  return get(m, "defaultConnectionName");
}

export function databaseConnection(m) {
  return defaultDirectory(m) || defaultDatabaseConnection(m) || l.connection(m, "database");
}

export function databaseConnectionName(m) {
  return (databaseConnection(m) || Map()).get("name");
}

export function forgotPasswordLink(m) {
  var notFound = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

  return get(m, "forgotPasswordLink", notFound);
}

export function signUpLink(m) {
  var notFound = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

  return get(m, "signUpLink", notFound);
}

export function setScreen(m, name) {
  var fields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  // TODO: the lock/index module should provide a way to clear
  // everything that needs the be cleared when changing screens, other
  // modules should not care.
  m = l.clearGlobalError(m);
  m = l.clearGlobalSuccess(m);
  m = hideInvalidFields(m, fields);
  m = clearFields(m, fields);

  return tset(m, "screen", name);
}

export function getScreen(m) {
  var screen = tget(m, "screen");
  var initialScreen = getInitialScreen(m);
  var screens = [screen, initialScreen, "login", "signUp", "forgotPassword", "mfaLogin"];
  var availableScreens = screens.filter(function (x) {
    return hasScreen(m, x);
  });
  return availableScreens[0];
}

export function availableScreens(m) {
  return tget(m, "screens") || get(m, "screens", new List());
}

export function getInitialScreen(m) {
  return tget(m, "initialScreen") || get(m, "initialScreen");
}

export function hasInitialScreen(m, str) {
  return getInitialScreen(m) === str;
}

export function databaseConnectionRequiresUsername(m) {
  return (databaseConnection(m) || Map()).toJS().requireUsername;
}

export function databaseUsernameStyle(m) {
  if (l.hasSomeConnections(m, "database")) {
    return databaseConnectionRequiresUsername(m) ? get(m, "usernameStyle", "any") : "email";
  }

  return l.hasSomeConnections(m, "enterprise") && findADConnectionWithoutDomain(m) ? 'username' : 'email';
}

export function databaseLogInWithEmail(m) {
  return databaseUsernameStyle(m) === "email";
}

export function databaseUsernameValue(m) {
  return getFieldValue(m, databaseLogInWithEmail(m) ? "email" : "username");
}

export function authWithUsername(m) {
  return databaseConnectionRequiresUsername(m) || get(m, "usernameStyle", "email") === "username";
}

export function hasScreen(m, s) {
  var _toJS = (databaseConnection(m) || Map()).toJS(),
      allowForgot = _toJS.allowForgot,
      allowSignup = _toJS.allowSignup;

  return !(allowForgot === false && s === "forgotPassword") && !(allowSignup === false && s === "signUp") && availableScreens(m).contains(s);
}

export function shouldAutoLogin(m) {
  return get(m, "loginAfterSignUp");
}

export function passwordStrengthPolicy(m) {
  return (databaseConnection(m) || Map()).get("passwordPolicy", "none");
}

export function additionalSignUpFields(m) {
  return get(m, "additionalSignUpFields", List());
}

export function mustAcceptTerms(m) {
  return get(m, "mustAcceptTerms", false);
}

export function termsAccepted(m) {
  return !mustAcceptTerms(m) || tget(m, "termsAccepted", false);
}

export function toggleTermsAcceptance(m) {
  return tset(m, "termsAccepted", !termsAccepted(m));
}

export function resolveAdditionalSignUpFields(m) {
  return additionalSignUpFields(m).reduce(function (r, x) {
    return x.get("type") === "select" ? resolveAdditionalSignUpSelectField(r, x) : resolveAdditionalSignUpTextField(r, x);
  }, m);
}

function resolveAdditionalSignUpSelectField(m, x) {
  var name = x.get("name");
  var keyNs = ["additionalSignUpField", name];
  var prefill = x.get("prefill");
  var options = x.get("options");

  var resolvedPrefill = typeof prefill === "function" ? undefined : prefill || "";
  var resolvedOptions = typeof options === "function" ? undefined : options;

  var register = function register(m) {
    return resolvedPrefill !== undefined && resolvedOptions !== undefined ? registerOptionField(m, name, Immutable.fromJS(resolvedOptions), resolvedPrefill) : m;
  };

  if (resolvedPrefill === undefined) {
    m = sync(m, keyNs.concat("prefill"), {
      recoverResult: "",
      successFn: function successFn(m, result) {
        resolvedPrefill = result;
        return register(m);
      },
      syncFn: function syncFn(m, cb) {
        return prefill(cb);
      }
    });
  }

  if (resolvedOptions === undefined) {
    m = sync(m, keyNs.concat("options"), {
      successFn: function successFn(m, result) {
        resolvedOptions = result;
        return register(m);
      },
      syncFn: function syncFn(m, cb) {
        return options(cb);
      }
    });
  }

  if (resolvedPrefill !== undefined && resolvedOptions !== undefined) {
    m = registerOptionField(m, name, Immutable.fromJS(resolvedOptions), resolvedPrefill);
  }

  return m;
}

function resolveAdditionalSignUpTextField(m, x) {
  var name = x.get("name");
  var key = ["additionalSignUpField", name, "prefill"];
  var prefill = x.get("prefill");
  var validator = x.get("validator");

  var resolvedPrefill = typeof prefill === "function" ? undefined : prefill || "";

  if (resolvedPrefill === undefined) {
    m = sync(m, key, {
      recoverResult: "",
      successFn: function successFn(m, result) {
        return setField(m, name, result, validator);
      },
      syncFn: function syncFn(m, cb) {
        return prefill(cb);
      }
    });
  } else {
    m = setField(m, name, resolvedPrefill, validator);
  }

  return m;
}
