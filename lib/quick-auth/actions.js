import { skipQuickAuth as skip } from '../quick_auth';
import { getEntity, read, swap, updateEntity } from '../store/index';
import { logIn as coreLogIn } from '../core/actions';
import * as l from '../core/index';

export function skipQuickAuth(id) {
  swap(updateEntity, "lock", id, skip, true);
}

export function logIn(id, connection, loginHint) {
  var m = read(getEntity, "lock", id);
  var connectionScopes = l.auth.connectionScopes(m);
  var scopes = connectionScopes.get(connection.get("name"));
  var params = {
    connection: connection.get("name"),
    connection_scope: scopes ? scopes.toJS() : []
  };

  if (!l.auth.redirect(m) && connection.get("strategy") === "facebook") {
    params.display = "popup";
  }
  if (loginHint) {
    params.login_hint = loginHint;
  }
  coreLogIn(id, [], params);
}
