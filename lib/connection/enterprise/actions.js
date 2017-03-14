import { getEntity, read, swap, updateEntity } from '../../store/index';
import { enterpriseActiveFlowConnection, isHRDActive, matchConnection, toggleHRD } from '../enterprise';
import { getFieldValue, hideInvalidFields } from '../../field/index';
import { emailLocalPart } from '../../field/email';
import { logIn as coreLogIn } from '../../core/actions';
import * as l from '../../core/index';

// TODO: enterprise connections should not depend on database
// connections. However, we now allow a username input to contain also
// an email and this information is in the database module. We should
// make this information flow from the UI (like we do for the startHRD
// function). Including this dependency here allows us to do that
// incrementally.
import { databaseLogInWithEmail } from '../database/index';

export function startHRD(id, email) {
  swap(updateEntity, "lock", id, toggleHRD, email);
}

export function cancelHRD(id) {
  swap(updateEntity, "lock", id, function (m) {
    m = toggleHRD(m, false);
    m = hideInvalidFields(m);
    return m;
  });
}

export function logIn(id) {
  var m = read(getEntity, "lock", id);
  var email = getFieldValue(m, databaseLogInWithEmail(m) ? "email" : "username");
  var ssoConnection = matchConnection(m, email);

  if (ssoConnection && !isHRDActive(m)) {
    return logInSSO(id, ssoConnection);
  }

  logInActiveFlow(id);
}

function logInActiveFlow(id) {
  var m = read(getEntity, "lock", id);
  var usernameField = isHRDActive(m) || !databaseLogInWithEmail(m) ? "username" : "email";

  var originalUsername = getFieldValue(m, usernameField);
  var connection = enterpriseActiveFlowConnection(m);

  var username = l.defaultADUsernameFromEmailPrefix(m) ? emailLocalPart(originalUsername) : originalUsername;

  coreLogIn(id, ["password", usernameField], {
    connection: connection ? connection.get("name") : null,
    username: username,
    password: getFieldValue(m, "password"),
    login_hint: username
  });
}

function logInSSO(id, connection) {
  var m = read(getEntity, "lock", id);
  var field = databaseLogInWithEmail(m) ? "email" : "username";
  coreLogIn(id, [field], {
    connection: connection.get("name"),
    login_hint: getFieldValue(m, field)
  });
}
