import { Map } from 'immutable';
import { read, getEntity, swap, updateEntity } from '../../store/index';
import { closeLock, logIn as coreLogIn, validateAndSubmit } from '../../core/actions';
import webApi from '../../core/web_api';
import * as c from '../../field/index';
import * as l from '../../core/index';
import { isEmail, isSendLink, resend, restartPasswordless, send, setPasswordlessStarted, setResendFailed, setResendSuccess } from './index';
import { phoneNumberWithDiallingCode } from '../../field/phone_number';
import * as i18n from '../../i18n';

export function requestPasswordlessEmail(id) {
  validateAndSubmit(id, ["email"], function (m) {
    sendEmail(m, requestPasswordlessEmailSuccess, requestPasswordlessEmailError);
  });
}

export function requestPasswordlessEmailSuccess(id) {
  swap(updateEntity, "lock", id, function (lock) {
    return setPasswordlessStarted(l.setSubmitting(lock, false), true);
  });
}

function startPasswordlessErrorMessage(m, error, medium) {
  var key = error.error;

  if (error.error === "sms_provider_error" && (error.description || "").indexOf("(Code: 21211)") > -1) {
    key = "bad.phone_number";
  }

  return i18n.str(m, ["error", "passwordless", key]) || i18n.str(m, ["error", "passwordless", "lock.fallback"]);
}

export function requestPasswordlessEmailError(id, error) {
  var m = read(getEntity, "lock", id);
  var errorMessage = startPasswordlessErrorMessage(m, error, "email");
  return swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}

export function resendEmail(id) {
  swap(updateEntity, "lock", id, resend);
  var m = read(getEntity, "lock", id);
  sendEmail(m, resendEmailSuccess, resendEmailError);
}

function resendEmailSuccess(id) {
  swap(updateEntity, "lock", id, setResendSuccess);
}

function resendEmailError(id, error) {
  swap(updateEntity, "lock", id, setResendFailed);
}

function sendEmail(m, successFn, errorFn) {
  var params = {
    email: c.getFieldValue(m, "email"),
    send: send(m)
  };

  if (isSendLink(m) && !l.auth.params(m).isEmpty()) {
    params.authParams = l.auth.params(m).toJS();
  }

  webApi.startPasswordless(l.id(m), params, function (error) {
    if (error) {
      setTimeout(function () {
        return errorFn(l.id(m), error);
      }, 250);
    } else {
      successFn(l.id(m));
    }
  });
}

export function sendSMS(id) {
  validateAndSubmit(id, ["phoneNumber"], function (m) {
    var params = { phoneNumber: phoneNumberWithDiallingCode(m) };
    webApi.startPasswordless(id, params, function (error) {
      if (error) {
        setTimeout(function () {
          return sendSMSError(id, error);
        }, 250);
      } else {
        sendSMSSuccess(id);
      }
    });
  });
}

export function sendSMSSuccess(id) {
  swap(updateEntity, "lock", id, function (m) {
    m = l.setSubmitting(m, false);
    m = setPasswordlessStarted(m, true);
    return m;
  });
}

export function sendSMSError(id, error) {
  var m = read(getEntity, "lock", id);
  var errorMessage = startPasswordlessErrorMessage(m, error, "sms");
  return swap(updateEntity, "lock", id, l.setSubmitting, false, errorMessage);
}

export function logIn(id) {
  var m = read(getEntity, "lock", id);
  var params = { passcode: c.getFieldValue(m, "vcode") };
  if (isEmail(m)) {
    params.email = c.getFieldValue(m, "email");
  } else {
    params.phoneNumber = phoneNumberWithDiallingCode(m);
  }

  coreLogIn(id, ["vcode"], params);
}

export function restart(id) {
  swap(updateEntity, "lock", id, restartPasswordless);
}
