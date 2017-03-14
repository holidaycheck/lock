function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import Base from '../index';
import Login from './classic/login';
import SignUp from './classic/sign_up_screen';
import MFALoginScreen from './classic/mfa_login_screen';
import ResetPassword from '../connection/database/reset_password';
import { renderSSOScreens } from '../core/sso/index';
import { additionalSignUpFields, authWithUsername, databaseUsernameValue, defaultDatabaseConnection, defaultDatabaseConnectionName, getScreen, hasInitialScreen, hasScreen, initDatabase, overrideDatabaseOptions } from '../connection/database/index';
import { defaultEnterpriseConnection, defaultEnterpriseConnectionName, initEnterprise, isEnterpriseDomain, isHRDActive, isInCorpNetwork, quickAuthConnection } from '../connection/enterprise';
import { defaultDirectory, defaultDirectoryName } from '../core/tenant';
import { initSocial, useBigButtons } from '../connection/social/index';
import { setEmail } from '../field/email';
import { setUsername } from '../field/username';
import * as l from '../core/index';
import KerberosScreen from '../connection/enterprise/kerberos_screen';
import HRDScreen from '../connection/enterprise/hrd_screen';
import EnterpriseQuickAuthScreen from '../connection/enterprise/quick_auth_screen';
import { hasSkippedQuickAuth } from '../quick_auth';
import { lastUsedConnection } from '../core/sso/index';
import LoadingScreen from '../core/loading_screen';
import ErrorScreen from '../core/error_screen';
import LastLoginScreen from '../core/sso/last_login_screen';
import { hasError, isDone, isSuccess } from '../sync';
import { getFieldValue } from '../field/index';
import { swap, updateEntity } from '../store/index';

export function isSSOEnabled(m) {
  return matchesEnterpriseConnection(m, databaseUsernameValue(m));
}

export function matchesEnterpriseConnection(m, usernameValue) {
  return isEnterpriseDomain(m, usernameValue);
}

export function usernameStyle(m) {
  return authWithUsername(m) && !isADEnabled(m) ? "username" : "email";
}

export function hasOnlyClassicConnections(m) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  for (var _len = arguments.length, strategies = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    strategies[_key - 2] = arguments[_key];
  }

  return l.hasOnlyConnections.apply(l, [m, type].concat(strategies)) && !l.hasSomeConnections(m, "passwordless");
}

export function useBigSocialButtons(m) {
  return useBigButtons(m, hasOnlyClassicConnections(m, "social") ? 5 : 3);
}

function validateAllowedConnections(m) {
  var anyDBConnection = l.hasSomeConnections(m, "database");
  var anySocialConnection = l.hasSomeConnections(m, "social");
  var anyEnterpriseConnection = l.hasSomeConnections(m, "enterprise");

  if (!anyDBConnection && !anySocialConnection && !anyEnterpriseConnection) {
    var error = new Error("At least one database, enterprise or social connection needs to be available.");
    error.code = "no_connection";
    m = l.stop(m, error);
  } else if (!anyDBConnection && hasInitialScreen(m, "forgotPassword")) {
    var _error = new Error("The `initialScreen` option was set to \"forgotPassword\" but no database connection is available.");
    _error.code = "unavailable_initial_screen";
    m = l.stop(m, _error);
  } else if (!anyDBConnection && !anySocialConnection && hasInitialScreen(m, "signUp")) {
    var _error2 = new Error("The `initialScreen` option was set to \"signUp\" but no database or social connection is available.");
    _error2.code = "unavailable_initial_screen";
    m = l.stop(m, _error2);
  }

  if (defaultDirectoryName(m) && !defaultDirectory(m)) {
    l.error(m, 'The account\'s default directory "' + defaultDirectoryName(m) + '" is not enabled.');
  }

  if (defaultDatabaseConnectionName(m) && !defaultDatabaseConnection(m)) {
    l.warn(m, 'The provided default database connection "' + defaultDatabaseConnectionName(m) + '" is not enabled.');
  }

  if (defaultEnterpriseConnectionName(m) && !defaultEnterpriseConnection(m)) {
    l.warn(m, 'The provided default enterprise connection "' + defaultEnterpriseConnectionName(m) + '" is not enabled or does not allow email/password authentication.');
  }

  return m;
}

var setPrefill = function setPrefill(m) {
  var _l$prefill$toJS = l.prefill(m).toJS(),
      email = _l$prefill$toJS.email,
      username = _l$prefill$toJS.username;

  if (typeof email === "string") m = setEmail(m, email);
  if (typeof username === "string") m = setUsername(m, username, "username", false);
  return m;
};

function createErrorScreen(m, stopError) {
  setTimeout(function () {
    swap(updateEntity, "lock", l.id(m), l.stop, stopError);
  }, 0);

  return new ErrorScreen();
}

var Classic = function () {
  function Classic() {
    _classCallCheck(this, Classic);
  }

  Classic.prototype.didInitialize = function didInitialize(model, options) {
    model = initSocial(model, options);
    model = initDatabase(model, options);
    model = initEnterprise(model, options);

    return model;
  };

  Classic.prototype.didReceiveClientSettings = function didReceiveClientSettings(m) {
    m = validateAllowedConnections(m);
    m = setPrefill(m);
    return m;
  };

  Classic.prototype.willShow = function willShow(m, opts) {
    m = overrideDatabaseOptions(m, opts);
    if (isSuccess(m, "client")) {
      m = validateAllowedConnections(m);
    }
    return m;
  };

  Classic.prototype.render = function render(m) {
    // TODO: remove the detail about the loading pane being pinned,
    // sticky screens should be handled at the box module.
    if (!isDone(m) || m.get("isLoadingPanePinned")) {
      return new LoadingScreen();
    }

    if (l.hasStopped(m)) {
      return new ErrorScreen();
    }

    if (hasScreen(m, "login")) {
      if (!hasSkippedQuickAuth(m) && hasInitialScreen(m, "login")) {

        if (isInCorpNetwork(m)) {
          return new KerberosScreen();
        }

        if (l.ui.rememberLastLogin(m)) {
          var conn = lastUsedConnection(m);
          if (conn && isSuccess(m, "sso")) {
            if (l.hasConnection(m, conn.get("name"))) {
              return new LastLoginScreen();
            }
          }
        }
      }

      if (quickAuthConnection(m)) {
        return new EnterpriseQuickAuthScreen();
      }

      if (isHRDActive(m)) {
        return new HRDScreen();
      }
    }

    if (!hasScreen(m, 'login') && !hasScreen(m, 'signUp') && !hasScreen(m, 'forgotPassword')) {
      var errorMessage = "No available Screen. You have to allow at least one of those screens: `login`, `signUp`or `forgotPassword`.";
      var noAvailableScreenError = new Error(errorMessage);
      noAvailableScreenError.code = "internal_error";
      noAvailableScreenError.description = errorMessage;
      return createErrorScreen(m, noAvailableScreenError);
    }

    var Screen = Classic.SCREENS[getScreen(m)];
    if (Screen) {
      return new Screen();
    }
    var noScreenError = new Error("Internal error");
    noScreenError.code = "internal_error";
    noScreenError.description = 'Couldn\'t find a screen "' + getScreen(m) + '"';
    return createErrorScreen(m, noScreenError);
  };

  return Classic;
}();

Classic.SCREENS = {
  login: Login,
  forgotPassword: ResetPassword,
  signUp: SignUp,
  mfaLogin: MFALoginScreen
};


export default new Classic();
