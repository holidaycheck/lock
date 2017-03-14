var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Immutable, { List, Map } from 'immutable';
import { dataFns } from '../../utils/data_utils';
import * as l from '../index';

var _dataFns = dataFns(["client"]),
    initNS = _dataFns.initNS,
    get = _dataFns.get;

var DEFAULT_CONNECTION_VALIDATION = { username: { min: 1, max: 15 } };

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

export function initTenant(m, client_id, client) {
  return initNS(m, formatTenant(client_id, client));
}

function formatTenant(client_id, o) {
  return new Immutable.fromJS({
    connections: formatTenantConnections(client_id, o),
    defaultDirectory: o.defaultDirectory || null
  });
}

function formatTenantConnections(client_id, o) {
  var result = emptyConnections.toJS();
  var connectionTypes = Object.keys(o.connections).filter(function (name) {
    return name != 'passwordless';
  }); // disabled until lock supports passwordless connections within the same engine
  var connections_filter = null;

  if (o.clientsConnections && o.clientsConnections[client_id]) {
    connections_filter = o.clientsConnections[client_id];
  }

  connectionTypes.forEach(function (connectionTypeName) {
    var _result$connectionTyp;

    var connections = o.connections[connectionTypeName].map(function (connection) {
      return formatTenantConnection(connectionTypeName, connection);
    }).filter(function (connection) {
      return connections_filter === null || connections_filter.includes(connection.name);
    });
    (_result$connectionTyp = result[connectionTypeName]).push.apply(_result$connectionTyp, connections);
  });

  return result;
}

function formatTenantConnection(connectionType, connection) {
  var result = {
    name: connection.name,
    strategy: connection.strategy,
    type: connectionType
  };

  if (connectionType === "database") {
    if (connection.validation && connection.validation.passwordPolicy) {
      result.passwordPolicy = connection.validation.passwordPolicy;
    }

    result.passwordPolicy = result.passwordPolicy || "none";

    result.allowSignup = typeof connection.allowSignup === "boolean" ? connection.allowSignup : true;

    result.allowForgot = typeof connection.allowForgot === "boolean" ? connection.allowForgot : true;

    result.requireUsername = typeof connection.requiresUsername === "boolean" ? connection.requiresUsername : false;

    result.validation = formatConnectionValidation(connection.validation);
  }

  if (connectionType === "enterprise") {
    result.domains = connection.domains;
  }

  return result;
}

export function tenantConnections(m) {
  return get(m, "connections", emptyConnections);
}

export function defaultDirectory(m) {
  var name = defaultDirectoryName(m);
  return name && l.findConnection(m, name);
}

export function defaultDirectoryName(m) {
  return get(m, "defaultDirectory", null);
}
