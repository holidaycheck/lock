var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import auth0 from 'auth0-js';
import CordovaAuth0Plugin from 'auth0-js/plugins/cordova';
import * as l from '../index';
import { getEntity, read } from '../../store/index';
import { normalizeError, loginCallback, normalizeAuthParams } from './helper';

var Auth0APIClient = function () {
  function Auth0APIClient(lockID, clientID, domain, opts) {
    _classCallCheck(this, Auth0APIClient);

    this.lockID = lockID;
    this.client = null;
    this.authOpt = null;

    var default_telemetry = {
      name: 'lock.js',
      version: '10.13.0',
      lib_version: auth0.version
    };

    this.client = new auth0.WebAuth({
      clientID: clientID,
      domain: domain,
      audience: opts.audience,
      redirectUri: opts.redirectUrl,
      responseMode: opts.responseMode,
      responseType: opts.responseType,
      leeway: opts.leeway || 1,
      plugins: [new CordovaAuth0Plugin()],
      _sendTelemetry: opts._sendTelemetry === false ? false : true,
      _telemetryInfo: opts._telemetryInfo || default_telemetry,
      __tenant: opts.overrides && opts.overrides.__tenant,
      __token_issuer: opts.overrides && opts.overrides.__token_issuer
    });

    this.authOpt = {
      popup: !opts.redirect,
      popupOptions: opts.popupOptions,
      sso: opts.sso,
      nonce: opts.nonce,
      state: opts.state
    };
  }

  Auth0APIClient.prototype.logIn = function logIn(options, authParams, cb) {
    // TODO: for passwordless only, try to clean in auth0.js
    // client._shouldRedirect = redirect || responseType === "code" || !!redirectUrl;
    var f = loginCallback(false, cb);
    var loginOptions = normalizeAuthParams(_extends({}, options, this.authOpt, authParams));

    if (!options.username && !options.email) {
      if (this.authOpt.popup) {
        this.client.popup.authorize(loginOptions, f);
      } else {
        this.client.authorize(loginOptions, f);
      }
    } else {
      loginOptions.realm = options.connection;
      this.client.client.login(loginOptions, f);
    }
  };

  Auth0APIClient.prototype.signOut = function signOut(query) {
    this.client.logout(query);
  };

  Auth0APIClient.prototype.signUp = function signUp(options, cb) {
    var _authOpt = this.authOpt,
        popup = _authOpt.popup,
        sso = _authOpt.sso;
    var autoLogin = options.autoLogin;


    delete options.autoLogin;

    this.client.signup(options, function (err, result) {
      return cb(err, result);
    });
  };

  Auth0APIClient.prototype.resetPassword = function resetPassword(options, cb) {
    this.client.changePassword(options, cb);
  };

  Auth0APIClient.prototype.startPasswordless = function startPasswordless(options, cb) {
    this.client.startPasswordless(options, function (err) {
      return cb(normalizeError(err));
    });
  };

  Auth0APIClient.prototype.parseHash = function parseHash() {
    var hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var cb = arguments[1];

    return this.client.parseHash({
      hash: hash,
      nonce: this.authOpt.nonce,
      state: this.authOpt.state
    }, cb);
  };

  Auth0APIClient.prototype.getUserInfo = function getUserInfo(token, callback) {
    return this.client.client.userInfo(token, callback);
  };

  Auth0APIClient.prototype.getProfile = function getProfile(token, callback) {
    var m = read(getEntity, "lock", this.lockID);
    l.emitUnrecoverableErrorEvent(m, '`getProfile` is deprecated for oidcConformant clients');
  };

  Auth0APIClient.prototype.getSSOData = function getSSOData() {
    var _client$client;

    return (_client$client = this.client.client).getSSOData.apply(_client$client, arguments);
  };

  Auth0APIClient.prototype.getUserCountry = function getUserCountry(cb) {
    return this.client.getUserCountry(cb);
  };

  return Auth0APIClient;
}();

export default Auth0APIClient;
