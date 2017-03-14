import { setField } from './index';
import { validateEmail } from './email';
import { databaseConnection } from '../connection/database';
import trim from 'trim';

var DEFAULT_VALIDATION = { mfa_code: { length: 6 } };
var regExp = /^[0-9]+$/;

function validateMFACode(str) {
  var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_VALIDATION.mfa_code;

  var value = trim(str);

  // check min value matched
  if (value.length < settings.length) {
    return false;
  }

  // check max value matched
  if (value.length > settings.length) {
    return false;
  }

  // check allowed characters matched
  var result = regExp.exec(value);
  return result && result[0];
}

export function setMFACode(m, str) {
  return setField(m, "mfa_code", str, validateMFACode);
}

export function getMFACodeValidation(m) {
  return DEFAULT_VALIDATION.mfa_code;
}
