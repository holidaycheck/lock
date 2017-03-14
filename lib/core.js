var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { EventEmitter } from 'events';
import { getEntity, observe, read } from './store/index';
import { remove, render } from './ui/box';
import webAPI from './core/web_api';
import { closeLock, resumeAuth as _resumeAuth, handleAuthCallback, openLock, removeLock, setupLock, updateLock } from './core/actions';
import * as l from './core/index';
import * as c from './field/index';
import * as idu from './utils/id_utils';
import * as i18n from './i18n';

import { go } from './sync';

var Base = function (_EventEmitter) {
  _inherits(Base, _EventEmitter);

  function Base(clientID, domain) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var engine = arguments[3];

    _classCallCheck(this, Base);

    if (typeof clientID != "string") {
      throw new Error("A `clientID` string must be provided as first argument.");
    }
    if (typeof domain != "string") {
      throw new Error("A `domain` string must be provided as second argument.");
    }
    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) != "object") {
      throw new Error("When provided, the third argument must be an `options` object.");
    }

    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    _this.validEvents = ['show', 'hide', 'unrecoverable_error', 'authenticated', 'authorization_error', 'hash_parsed', 'signin ready', 'signup ready'];

    _this.id = idu.incremental();
    _this.engine = engine;
    var hookRunner = _this.runHook.bind(_this);
    var emitEventFn = _this.emit.bind(_this);

    go(_this.id);

    var m = setupLock(_this.id, clientID, domain, options, hookRunner, emitEventFn);
    _this.on('newListener', function (type) {
      if (_this.validEvents.indexOf(type) === -1) {
        l.emitUnrecoverableErrorEvent(m, 'Invalid event "' + type + '".');
      }
    });

    if (l.auth.autoParseHash(m) && !Base.hasScheduledAuthCallback) {
      Base.hasScheduledAuthCallback = true;
      setTimeout(handleAuthCallback, 0);
    }

    observe("render", _this.id, function (m) {
      var partialApplyId = function partialApplyId(screen, handlerName) {
        var handler = screen[handlerName](m);
        return handler ? function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return handler.apply(undefined, [l.id(m)].concat(args));
        } : handler;
      };
      var avatar = l.ui.avatar(m) && m.getIn(["avatar", "transient", "syncStatus"]) === "ok" || null;

      if (l.rendering(m)) {
        (function () {

          var screen = _this.engine.render(m);

          var title = avatar ? i18n.str(m, "welcome", m.getIn(["avatar", "transient", "displayName"])) : screen.getTitle(m);

          var disableSubmitButton = screen.isSubmitDisabled(m);

          var i18nProp = {
            group: function group(keyPath) {
              return i18n.group(m, keyPath);
            },
            html: function html(keyPath) {
              for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }

              return i18n.html.apply(i18n, [m, keyPath].concat(args));
            },
            str: function str(keyPath) {
              for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                args[_key3 - 1] = arguments[_key3];
              }

              return i18n.str.apply(i18n, [m, keyPath].concat(args));
            }
          };

          var getScreenTitle = function getScreenTitle(m) {
            // if it is the first screen and the flag is enabled, it should hide the title
            return l.ui.hideMainScreenTitle(m) && screen.isFirstScreen(m) ? null : title;
          };

          var props = {
            avatar: avatar && m.getIn(["avatar", "transient", "url"]),
            auxiliaryPane: screen.renderAuxiliaryPane(m),
            autofocus: l.ui.autofocus(m),
            backHandler: partialApplyId(screen, "backHandler"),
            badgeLink: "https://auth0.com/?utm_source=lock&utm_campaign=badge&utm_medium=widget",
            closeHandler: l.ui.closable(m) ? function () {
              for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
              }

              return closeLock.apply(undefined, [l.id(m)].concat(args));
            } : undefined,
            contentComponent: screen.render(),
            contentProps: { i18n: i18nProp, model: m },
            disableSubmitButton: disableSubmitButton,
            error: l.globalError(m),
            isMobile: l.ui.mobile(m),
            isModal: l.ui.appendContainer(m),
            isSubmitting: l.submitting(m),
            logo: l.ui.logo(m),
            primaryColor: l.ui.primaryColor(m),
            screenName: screen.name,
            showBadge: l.showBadge(m) === true,
            success: l.globalSuccess(m),
            submitButtonLabel: l.ui.labeledSubmitButton(m) ? screen.submitButtonLabel(m) : null,
            submitHandler: partialApplyId(screen, "submitHandler"),
            tabs: screen.renderTabs(m),
            terms: screen.renderTerms(m, i18nProp.html("signUpTerms")),
            title: getScreenTitle(m),
            transitionName: screen.name === "loading" ? "fade" : "horizontal-fade"
          };
          render(l.ui.containerID(m), props);

          // TODO: hack so we can start testing the beta
          if (!_this.oldScreenName || _this.oldScreenName != screen.name) {
            if (screen.name === "main.login") {
              l.emitEvent(m, "signin ready");
            } else if (screen.name === "main.signUp") {
              l.emitEvent(m, "signup ready");
            }
          }
          _this.oldScreenName = screen.name;
        })();
      } else {
        remove(l.ui.containerID(m));
      }
    });
    return _this;
  }

  Base.prototype.resumeAuth = function resumeAuth(hash, callback) {
    _resumeAuth(hash, callback);
  };

  Base.prototype.show = function show() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    openLock(this.id, opts);
  };

  Base.prototype.hide = function hide() {
    closeLock(this.id, true);
  };

  Base.prototype.destroy = function destroy() {
    removeLock(this.id);
  };

  Base.prototype.getProfile = function getProfile(token, cb) {
    return webAPI.getProfile(this.id, token, cb);
  };

  Base.prototype.getUserInfo = function getUserInfo(token, cb) {
    return webAPI.getUserInfo(this.id, token, cb);
  };

  Base.prototype.logout = function logout() {
    var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    webAPI.signOut(this.id, query);
  };

  Base.prototype.update = function update(f) {
    return updateLock(this.id, f);
  };

  Base.prototype.setModel = function setModel(m) {
    return this.update(function () {
      return m;
    });
  };

  Base.prototype.runHook = function runHook(str, m) {
    var _engine;

    if (typeof this.engine[str] != "function") return m;

    for (var _len5 = arguments.length, args = Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
      args[_key5 - 2] = arguments[_key5];
    }

    return (_engine = this.engine)[str].apply(_engine, [m].concat(args));
  };

  return Base;
}(EventEmitter);

export default Base;
