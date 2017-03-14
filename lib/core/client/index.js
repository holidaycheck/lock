var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Immutable, { List, Map } from 'immutable';
import { dataFns } from '../../utils/data_utils';
// TODO: this module should depend from social stuff
import { STRATEGIES as SOCIAL_STRATEGIES } from '../../connection/social/index';
import { STRATEGIES as ENTERPRISE_STRATEGIES } from '../../connection/enterprise';

var _dataFns = dataFns(["client"]),
    initNS = _dataFns.initNS,
    get = _dataFns.get;

var DEFAULT_CONNECTION_VALIDATION = { username: { min: 1, max: 15 } };

export function hasFreeSubscription(m) {
  return ["free", "dev"].indexOf(get(m, ["tenant", "subscription"])) > -1;
}

export function connection(m, strategyName, name) {
  // TODO: this function should take a client, not a map with a client
  // key.
  var connections = strategy(m, strategyName).get("connections", List());
  return connections.find(withName(name)) || Map();
}

function strategy(m, name) {
  // TODO: this function should take a client, not a map with a client
  // key.
  return m.getIn(["client", "strategies"], List()).find(withName(name)) || Map();
}

function withName(name) {
  return function (x) {
    return x.get("name") === name;
  };
}

function strategyNameToConnectionType(str) {
  if (str === "auth0") {
    return "database";
  } else if (str === "email" || str === "sms") {
    return "passwordless";
  } else if (SOCIAL_STRATEGIES[str]) {
    return "social";
  } else if (ENTERPRISE_STRATEGIES[str]) {
    return "enterprise";
  } else if (["oauth1", "oauth2"].indexOf(str) !== -1) {
    return "social";
  } else {
    return "unknown";
  }
}

function formatConnectionValidation() {
  var connectionValidation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (connectionValidation.username == null) {
    return null;
  }

  var validation = _extends({}, DEFAULT_CONNECTION_VALIDATION, connectionValidation);
  var defaultMin = DEFAULT_CONNECTION_VALIDATION.username.min;
  var defaultMax = DEFAULT_CONNECTION_VALIDATION.username.max;

  validation.username.min = parseInt(validation.username.min, 10) || defaultMin;
  validation.username.max = parseInt(validation.username.max, 10) || defaultMax;

  if (validation.username.min > validation.username.max) {
    validation.username.min = defaultMin;
    validation.username.max = defaultMax;
  }

  return validation;
}

var emptyConnections = Immutable.fromJS({
  database: [],
  enterprise: [],
  passwordless: [],
  social: [],
  unknown: [] // TODO: should be oauth2
});

export function initClient(m, client) {
  return initNS(m, formatClient(client));
}

function formatClient(o) {
  return new Immutable.fromJS({
    id: o.id,
    tenant: {
      name: o.tenant,
      subscription: o.subscription
    },
    connections: formatClientConnections(o)
  });
}

function formatClientConnections(o) {
  var result = emptyConnections.toJS();

  var _loop = function _loop() {
    var _result$connectionTyp;

    var strategy = o.strategies[i];
    var connectionType = strategyNameToConnectionType(strategy.name);

    if (connectionType === "passwordless") {
      return 'continue'; // disabled until lock supports passwordless connections within the same engine
    }

    var connections = strategy.connections.map(function (connection) {
      return formatClientConnection(connectionType, strategy.name, connection);
    });
    (_result$connectionTyp = result[connectionType]).push.apply(_result$connectionTyp, connections);
  };

  for (var i = 0; i < (o.strategies || []).length; i++) {
    var _ret = _loop();

    if (_ret === 'continue') continue;
  }

  return result;
}

function formatClientConnection(connectionType, strategyName, connection) {
  var result = {
    name: connection.name,
    strategy: strategyName,
    type: connectionType
  };

  if (connectionType === "database") {
    result.passwordPolicy = connection.passwordPolicy || "none";
    result.allowSignup = typeof connection.showSignup === "boolean" ? connection.showSignup : true;
    result.allowForgot = typeof connection.showForgot === "boolean" ? connection.showForgot : true;
    result.requireUsername = typeof connection.requires_username === "boolean" ? connection.requires_username : false;
    result.validation = formatConnectionValidation(connection.validation);
  }

  if (connectionType === "enterprise") {
    var domains = connection.domain_aliases || [];
    if (connection.domain) {
      domains.unshift(connection.domain);
    }
    result.domains = domains;
  }

  return result;
}

export function clientConnections(m) {
  return get(m, "connections", emptyConnections);
}
