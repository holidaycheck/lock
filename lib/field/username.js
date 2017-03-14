import { setField } from './index';
import { validateEmail } from './email';
import { databaseConnection } from '../connection/database';
import trim from 'trim';

var DEFAULT_CONNECTION_VALIDATION = { username: { min: 1, max: 15 } };
var regExp = /^[a-zA-Z0-9_]+$/;

function validateUsername(str, validateFormat) {
  var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_CONNECTION_VALIDATION.username;


  // If the connection does not have validation settings, it should only check if the field is empty.
  // validateFormat overrides this logic to disable validation on login (login should never validate format)
  if (!validateFormat || settings == null) {
    return trim(str).length > 0;
  }

  var lowercased = trim(str.toLowerCase());

  // chekc min value matched
  if (lowercased.length < settings.min) {
    return false;
  }

  // check max value matched
  if (lowercased.length > settings.max) {
    return false;
  }

  // check allowed characters matched
  var result = regExp.exec(lowercased);
  return result && result[0];
}

export function getUsernameValidation(m) {
  var usernameValidation = databaseConnection(m).getIn(['validation', 'username']);
  return usernameValidation ? usernameValidation.toJS() : null;
}

export function setUsername(m, str) {
  var usernameStyle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "username";
  var validateUsernameFormat = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var usernameValidation = validateUsernameFormat ? getUsernameValidation(m) : null;

  var validator = function validator(value) {
    switch (usernameStyle) {
      case "email":
        return validateEmail(value);
      case "username":
        return validateUsername(value, validateUsernameFormat, usernameValidation);
      default:
        return usernameLooksLikeEmail(value) ? validateEmail(value) : validateUsername(value, validateUsernameFormat, usernameValidation);
    }
  };

  return setField(m, "username", str, validator);
}

export function usernameLooksLikeEmail(str) {
  return str.indexOf("@") > -1;
}
