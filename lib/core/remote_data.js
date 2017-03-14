import Immutable from 'immutable';
import { fetchClientSettings, syncClientSettingsSuccess } from './client/settings';
import { fetchTenantSettings, syncTenantSettingsSuccess } from './tenant/settings';
import { fetchSSOData } from './sso/data';
import * as l from './index';
import { isADEnabled } from '../connection/enterprise'; // shouldn't depend on this
import sync, { isSuccess } from '../sync';

export function syncRemoteData(m) {

  if (l.useTenantInfo(m)) {
    m = sync(m, "client", {
      syncFn: function syncFn(m, cb) {
        return fetchTenantSettings(l.tenantBaseUrl(m), cb);
      },
      successFn: function successFn(m, result) {
        return syncTenantSettingsSuccess(m, l.clientID(m), result);
      }
    });
  } else {
    m = sync(m, "client", {
      syncFn: function syncFn(m, cb) {
        return fetchClientSettings(l.clientID(m), l.clientBaseUrl(m), cb);
      },
      successFn: syncClientSettingsSuccess
    });
  }

  m = sync(m, "sso", {
    conditionFn: function conditionFn(m) {
      return l.auth.sso(m) && !l.oidcConformant(m);
    },
    waitFn: function waitFn(m) {
      return isSuccess(m, "client");
    },
    syncFn: function syncFn(m, cb) {
      return fetchSSOData(l.id(m), isADEnabled(m), cb);
    },
    successFn: function successFn(m, result) {
      return m.mergeIn(["sso"], Immutable.fromJS(result));
    },
    errorFn: function errorFn(m, error) {
      // location.origin is not supported in all browsers
      var origin = location.protocol + "//" + location.hostname;
      if (location.port) {
        origin += ":" + location.port;
      }

      var appSettingsUrl = 'https://manage.auth0.com/#/applications/' + l.clientID(m) + '/settings';

      l.warn(m, 'There was an error fetching the SSO data. This could simply mean that there was a problem with the network. But, if a "Origin" error has been logged before this warning, please add "' + origin + '" to the "Allowed Origins (CORS)" list in the Auth0 dashboard: ' + appSettingsUrl);
    }
  });

  return m;
}
