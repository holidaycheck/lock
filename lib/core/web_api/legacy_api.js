var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import IdTokenVerifier from 'idtoken-verifier';
import auth0 from 'auth0-js';
import CordovaAuth0Plugin from 'auth0-js/plugins/cordova';
import request from 'superagent';
import { normalizeError, loginCallback, normalizeAuthParams } from './helper';
import qs from 'qs';

var Auth0LegacyAPIClient = function () {
  function Auth0LegacyAPIClient(clientID, domain, opts) {
    _classCallCheck(this, Auth0LegacyAPIClient);

    this.client = null;
    this.authOpt = null;

    this.domain = domain;
    this.clientID = clientID;
    this.tokenIssuer = opts.overrides && opts.overrides.__token_issuer || 'https://' + domain + '/';

    var default_telemetry = {
      name: 'lock.js',
      version: '10.13.0',
      lib_version: auth0.version
    };

    this.client = new auth0.WebAuth({
      clientID: clientID,
      domain: domain,
      redirectUri: opts.redirectUrl,
      responseMode: opts.responseMode,
      responseType: opts.responseType,
      plugins: [new CordovaAuth0Plugin()],
      _sendTelemetry: opts._sendTelemetry === false ? false : true,
      _telemetryInfo: opts._telemetryInfo || default_telemetry,
      __tenant: opts.overrides && opts.overrides.__tenant,
      __token_issuer: opts.overrides && opts.overrides.__token_issuer,
      _disableDeprecationWarnings: true
    });

    this.authOpt = {
      popup: !opts.redirect,
      popupOptions: opts.popupOptions,
      sso: opts.sso,
      nonce: opts.nonce,
      state: opts.state
    };
  }

  Auth0LegacyAPIClient.prototype.logIn = function logIn(options, authParams, cb) {
    // TODO: for passwordless only, try to clean in auth0.js
    // client._shouldRedirect = redirect || responseType === "code" || !!redirectUrl;
    var f = loginCallback(!this.authOpt.popup, cb);
    var auth0Client = this.client;

    var loginOptions = normalizeAuthParams(_extends({}, options, this.authOpt, authParams));
    if (!options.username && !options.email) {
      if (this.authOpt.popup) {
        auth0Client.popup.authorize(_extends({}, loginOptions, { owp: true }), f);
      } else {
        auth0Client.authorize(loginOptions, f);
      }
    } else if (!this.authOpt.sso && this.authOpt.popup) {
      auth0Client.client.loginWithResourceOwner(loginOptions, f);
    } else if (this.authOpt.popup) {
      auth0Client.popup.loginWithCredentials(_extends({}, loginOptions, { owp: true }), f);
    } else {
      auth0Client.redirect.loginWithCredentials(loginOptions, f);
    }
  };

  Auth0LegacyAPIClient.prototype.signOut = function signOut(query) {
    this.client.logout(query);
  };

  Auth0LegacyAPIClient.prototype.signUp = function signUp(options, cb) {
    var _authOpt = this.authOpt,
        popup = _authOpt.popup,
        sso = _authOpt.sso;
    var autoLogin = options.autoLogin;


    delete options.autoLogin;

    var popupHandler = autoLogin && popup ? this.client.popup.preload() : null;

    this.client.signup(options, function (err, result) {
      return cb(err, result, popupHandler);
    });
  };

  Auth0LegacyAPIClient.prototype.resetPassword = function resetPassword(options, cb) {
    this.client.changePassword(options, cb);
  };

  Auth0LegacyAPIClient.prototype.startPasswordless = function startPasswordless(options, cb) {
    this.client.startPasswordless(options, function (err) {
      return cb(normalizeError(err));
    });
  };

  // for legacy, we should not verify the id_token so we reimplemented it here
  // to avoid adding dirt into auth0.js. At some point we will get rid of this.


  Auth0LegacyAPIClient.prototype.parseHash = function parseHash() {
    var hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var cb = arguments[1];

    var parsed_qs = qs.parse(hash.replace(/^#?\/?/, ''));
    var state = this.authOpt.state || parsed_qs.state;

    this.client.transactionManager.getStoredTransaction(state);

    if (parsed_qs.hasOwnProperty('error')) {
      var err = {
        error: parsed_qs.error,
        error_description: parsed_qs.error_description
      };

      if (parsed_qs.state) {
        err.state = parsed_qs.state;
      }

      return cb(err);
    }

    if (!parsed_qs.hasOwnProperty('access_token') && !parsed_qs.hasOwnProperty('id_token') && !parsed_qs.hasOwnProperty('refresh_token')) {
      return cb(null, null);
    }

    var prof;

    if (parsed_qs.hasOwnProperty('id_token')) {
      var invalidJwt = function invalidJwt(error) {
        var err = {
          error: 'invalid_token',
          error_description: error
        };
        return err;
      };

      var verifier = new IdTokenVerifier({});
      prof = verifier.decode(parsed_qs.id_token).payload;

      if (prof.aud !== this.clientID) {
        return cb(invalidJwt('The clientID configured (' + this.clientID + ') does not match with the clientID set in the token (' + prof.aud + ').'));
      }

      // iss should be the Auth0 domain (i.e.: https://contoso.auth0.com/)
      if (prof.iss !== this.tokenIssuer) {
        return cb(invalidJwt('The domain configured (' + this.tokenIssuer + ') does not match with the domain set in the token (' + prof.iss + ').'));
      }
    }

    cb(null, {
      accessToken: parsed_qs.access_token,
      idToken: parsed_qs.id_token,
      idTokenPayload: prof,
      refreshToken: parsed_qs.refresh_token,
      state: parsed_qs.state
    });
  };

  Auth0LegacyAPIClient.prototype.getUserInfo = function getUserInfo(token, callback) {
    return this.client.client.userInfo(token, callback);
  };

  // auth0.js does not supports this endpoint because it is deprecated for oidcConformat clients
  // we implemented it here to provide BC support, we will loose it in lock 11.


  Auth0LegacyAPIClient.prototype.getProfile = function getProfile(token, callback) {
    request.get('https://' + this.domain + '/tokeninfo?id_token=' + token).end(function (err, res) {
      if (err) {
        return callback({
          error: err.message,
          error_description: res.text || res.body
        });
      }

      return callback(null, res.body);
    });
  };

  Auth0LegacyAPIClient.prototype.getSSOData = function getSSOData() {
    var _client$client;

    return (_client$client = this.client.client).getSSOData.apply(_client$client, arguments);
  };

  Auth0LegacyAPIClient.prototype.getUserCountry = function getUserCountry(cb) {
    return this.client.getUserCountry(cb);
  };

  return Auth0LegacyAPIClient;
}();

export default Auth0LegacyAPIClient;
