import Immutable, { List } from 'immutable';
import * as l from '../core/index';
import * as c from '../field/index';
import { dataFns } from '../utils/data_utils';
import { emailDomain, emailLocalPart } from '../field/email';
import { setUsername } from '../field/username';
import { getFieldValue } from '../field/index';
import { isEmail } from '../field/email';
import { isSSOEnabled, matchesEnterpriseConnection } from '../engine/classic';
import { databaseUsernameValue } from './database/index';

import { swap, updateEntity } from '../store/index';

var _dataFns = dataFns(["enterprise"]),
    get = _dataFns.get,
    initNS = _dataFns.initNS,
    tget = _dataFns.tget,
    tremove = _dataFns.tremove,
    tset = _dataFns.tset;

var _dataFns2 = dataFns(["core"]),
    tremoveCore = _dataFns2.tremove,
    tsetCore = _dataFns2.tset,
    tgetCore = _dataFns2.tget;

// TODO: Android version also has "google-opendid" in the list, but we
// consider it to be a social connection. See
// https://github.com/auth0/Lock.Android/blob/98262cb7110e5d1c8a97e1129faf2621c1d8d111/lock/src/main/java/com/auth0/android/lock/utils/Strategies.java


export var STRATEGIES = {
  "ad": "AD / LDAP",
  "adfs": "ADFS",
  "auth0-adldap": "AD/LDAP",
  "custom": "Custom Auth",
  "google-apps": "Google Apps",
  "ip": "IP Address",
  "mscrm": "Dynamics CRM",
  "office365": "Office365",
  "pingfederate": "Ping Federate",
  "samlp": "SAML",
  "sharepoint": "SharePoint Apps",
  "waad": "Windows Azure AD"
};

export function initEnterprise(m, opts) {
  return initNS(m, Immutable.fromJS(processOptions(opts)));
}

function processOptions(opts) {
  var defaultEnterpriseConnection = opts.defaultEnterpriseConnection;


  if (defaultEnterpriseConnection != undefined && typeof defaultEnterpriseConnection !== "string") {
    l.warn(options, "The `defaultEnterpriseConnection` option will be ignored, because it is not a string.");
    defaultEnterpriseConnection = undefined;
  }

  return defaultEnterpriseConnection === undefined ? {} : { defaultConnectionName: defaultEnterpriseConnection };
}

export function defaultEnterpriseConnection(m) {
  var name = defaultEnterpriseConnectionName(m);
  return name && findADConnectionWithoutDomain(m, name);
}

export function defaultEnterpriseConnectionName(m) {
  return get(m, "defaultConnectionName");
}

export function enterpriseActiveFlowConnection(m) {
  if (isHRDActive(m)) {
    // HRD is active when an email matched or there is only one
    // connection and it is enterprise
    var email = tget(m, "hrdEmail", "");
    return matchConnection(m, email) || findActiveFlowConnection(m);
  } else {
    return defaultEnterpriseConnection(m) || findADConnectionWithoutDomain(m);
  }
}

export function matchConnection(m, email) {
  var strategies = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var target = emailDomain(email);
  if (!target) return false;
  return l.connections.apply(l, [m, "enterprise"].concat(strategies)).find(function (x) {
    return x.get("domains").contains(target);
  });
}

export function isEnterpriseDomain(m, email) {
  var strategies = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  return !!matchConnection(m, email, strategies);
}

export function enterpriseDomain(m) {
  return isSingleHRDConnection(m) ? l.connections(m, "enterprise").getIn([0, "domains", 0]) : emailDomain(tget(m, "hrdEmail"));
}

export function quickAuthConnection(m) {
  return !isADEnabled(m) && l.hasOneConnection(m, "enterprise") ? l.connections(m, "enterprise").get(0) : null;
}

// ad / adldap
// https://github.com/auth0/Lock.Android/blob/0145b6853a8de0df5e63ef22e4e2bc40be97ad9e/lock/src/main/java/com/auth0/android/lock/utils/Strategy.java#L67

export function isADEnabled(m) {
  return l.hasSomeConnections(m, "enterprise", "ad", "auth0-adldap");
}

export function findADConnectionWithoutDomain(m) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  return l.connections(m, "enterprise", "ad", "auth0-adldap").find(function (x) {
    return x.get("domains").isEmpty() && (!name || x.get("name") === name);
  });
}

function findActiveFlowConnection(m) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  return l.connections(m, "enterprise", "ad", "auth0-adldap").find(function (x) {
    return !name || x.get("name") === name;
  });
}

// kerberos

export function isInCorpNetwork(m) {
  return corpNetworkConnection(m) !== undefined;
}

export function corpNetworkConnection(m) {
  // Information about connection is stored in to flat properties connection and strategy.
  // If connection is present, strategy will always be present as defined by the server.
  var name = m.getIn(["sso", "connection"]);
  var strategy = m.getIn(["sso", "strategy"]);

  return name && strategy && Immutable.Map({ name: name, strategy: strategy });
}

// hrd

export function isSingleHRDConnection(m) {
  return isADEnabled(m) && l.connections(m).count() === 1;
}

export function isHRDDomain(m, email) {
  return isEnterpriseDomain(m, email, ["ad", "auth0-adldap"]);
}

export function toggleHRD(m, email) {
  if (email) {
    var username = l.defaultADUsernameFromEmailPrefix(m) ? emailLocalPart(email) : email;

    m = setUsername(m, username, "username", false);
    m = tset(m, "hrdEmail", email);
  } else {
    m = tremove(m, "hrdEmail");
  }

  return tset(m, "hrd", !!email);
}

export function isHRDActive(m) {
  return tget(m, "hrd", isSingleHRDConnection(m));
}

export function isHRDEmailValid(m, str) {
  if (isEmail(str) && !l.hasSomeConnections(m, "database") && !findADConnectionWithoutDomain(m) && !matchesEnterpriseConnection(m, str)) {

    return false;
  }

  return true;
}
