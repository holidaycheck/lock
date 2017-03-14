import Immutable, { Map } from 'immutable';
import { getEntity, read, swap, updateEntity } from '../../store/index';
import webApi from '../../core/web_api';
import { closeLock, logIn as coreLogIn, logInSuccess, validateAndSubmit } from '../../core/actions';
import * as l from '../../core/index';
import * as c from '../../field/index';
import { databaseConnectionName, databaseConnectionRequiresUsername, databaseLogInWithEmail, hasScreen, setScreen, shouldAutoLogin, toggleTermsAcceptance as switchTermsAcceptance, additionalSignUpFields } from './index';
import * as i18n from '../../i18n';

export function logIn(id) {
  var needsMFA = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var m = read(getEntity, "lock", id);
  var usernameField = databaseLogInWithEmail(m) ? "email" : "username";
  var username = c.getFieldValue(m, usernameField);

  var params = {
    connection: databaseConnectionName(m),
    username: username,
    password: c.getFieldValue(m, "password")
  };

  var fields = [usernameField, "password"];

  var mfaCode = c.getFieldValue(m, "mfa_code");
  if (needsMFA) {
    params["mfa_code"] = mfaCode;
    fields.push("mfa_code");
  }

  coreLogIn(id, fields, params, function (id, error, fields, next) {
    if (error.error === "a0.mfa_required") {
      return showLoginMFAActivity(id);
    }

    return next();
  });
}

export function signUp(id) {
  var m = read(getEntity, "lock", id);
  var fields = ["email", "password"];
  if (databaseConnectionRequiresUsername(m)) fields.push("username");
  additionalSignUpFields(m).forEach(function (x) {
    return fields.push(x.get("name"));
  });

  validateAndSubmit(id, fields, function (m) {
    var params = {
      connection: databaseConnectionName(m),
      email: c.getFieldValue(m, "email"),
      password: c.getFieldValue(m, "password"),
      autoLogin: shouldAutoLogin(m)
    };

    if (databaseConnectionRequiresUsername(m)) {
      params.username = c.getFieldValue(m, "username");
    }

    if (!additionalSignUpFields(m).isEmpty()) {
      params.user_metadata = {};
      additionalSignUpFields(m).forEach(function (x) {
        params.user_metadata[x.get("name")] = c.getFieldValue(m, x.get("name"));
      });
    }

    webApi.signUp(id, params, function (error, result, popupHandler) {
      for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        args[_key - 3] = arguments[_key];
      }

      if (error) {
        if (!!popupHandler) {
          popupHandler._current_popup.kill();
        }
        setTimeout(function () {
          return signUpError(id, error);
        }, 250);
      } else {
        signUpSuccess.apply(undefined, [id, result, popupHandler].concat(args));
      }
    });
  });
}

function signUpSuccess(id, result, popupHandler) {
  var lock = read(getEntity, "lock", id);

  if (shouldAutoLogin(lock)) {
    swap(updateEntity, "lock", id, function (m) {
      return m.set("signedUp", true);
    });

    // TODO: check options, redirect is missing
    var options = {
      connection: databaseConnectionName(lock),
      username: c.email(lock),
      password: c.password(lock)
    };

    if (!!popupHandler) {
      options.popupHandler = popupHandler;
    }

    return webApi.logIn(id, options, l.auth.params(lock).toJS(), function (error) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      if (error) {
        setTimeout(function () {
          return autoLogInError(id, error);
        }, 250);
      } else {
        logInSuccess.apply(undefined, [id].concat(args));
      }
    });
  }

  var autoclose = l.ui.autoclose(lock);

  if (!autoclose) {
    swap(updateEntity, "lock", id, function (lock) {
      return l.setSubmitting(lock, false).set("signedUp", true);
    });
  } else {
    closeLock(id, false);
  }
}

function signUpError(id, error) {
  var m = read(getEntity, "lock", id);

  var invalidPasswordKeys = {
    PasswordDictionaryError: "password_dictionary_error",
    PasswordNoUserInfoError: "password_no_user_info_error",
    PasswordStrengthError: "password_strength_error"
  };

  var errorKey = error.code === "invalid_password" && invalidPasswordKeys[error.name] || error.code;

  var errorMessage = i18n.str(m, ["error", "signUp", errorKey]) || i18n.str(m, ["error", "signUp", "lock.fallback"]);

  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}

function autoLogInError(id, error) {
  swap(updateEntity, "lock", id, function (m) {
    var errorMessage = l.loginErrorMessage(m, error);
    if (hasScreen(m, "login")) {
      return l.setSubmitting(setScreen(m, "login"), false, errorMessage);
    } else {
      return l.setSubmitting(m, false, errorMessage);
    }
  });
}

export function resetPassword(id) {
  validateAndSubmit(id, ["email"], function (m) {
    var params = {
      connection: databaseConnectionName(m),
      email: c.getFieldValue(m, "email")
    };

    webApi.resetPassword(id, params, function (error) {
      if (error) {
        setTimeout(function () {
          return resetPasswordError(id, error);
        }, 250);
      } else {
        resetPasswordSuccess(id);
      }
    });
  });
}

function resetPasswordSuccess(id) {
  var m = read(getEntity, "lock", id);
  if (hasScreen(m, "login")) {
    swap(updateEntity, "lock", id, function (m) {
      return setScreen(l.setSubmitting(m, false), "login");
    });

    // TODO: should be handled by box
    setTimeout(function () {
      var successMessage = i18n.str(m, ["success", "forgotPassword"]);
      swap(updateEntity, "lock", id, l.setGlobalSuccess, successMessage);
    }, 500);
  } else {
    if (l.ui.autoclose(m)) {
      closeLock(id);
    } else {
      swap(updateEntity, "lock", id, function (m) {
        return l.setSubmitting(m, false).set("passwordResetted", true);
      });
    }
  }
}

function resetPasswordError(id, error) {
  var m = read(getEntity, "lock", id);

  var errorMessage = i18n.str(m, ["error", "forgotPassword", error.code]) || i18n.str(m, ["error", "forgotPassword", "lock.fallback"]);

  swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}

export function showLoginActivity(id) {
  var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["password"];

  swap(updateEntity, "lock", id, setScreen, "login", fields);
}

export function showSignUpActivity(id) {
  var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["password"];

  swap(updateEntity, "lock", id, setScreen, "signUp", fields);
}

export function showResetPasswordActivity(id) {
  var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["password"];

  swap(updateEntity, "lock", id, setScreen, "forgotPassword", fields);
}

export function cancelResetPassword(id) {
  return showLoginActivity(id);
}

export function cancelMFALogin(id) {
  return showLoginActivity(id);
}

export function toggleTermsAcceptance(id) {
  swap(updateEntity, "lock", id, switchTermsAcceptance);
}

export function showLoginMFAActivity(id) {
  var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["mfa_code"];

  swap(updateEntity, "lock", id, setScreen, "mfaLogin", fields);
}
