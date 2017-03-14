function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import * as l from './index';
import * as i18n from '../i18n';
import { getInitialScreen, hasScreen } from '../connection/database/index';

var Screen = function () {
  function Screen(name) {
    _classCallCheck(this, Screen);

    this.name = name;
  }

  Screen.prototype.backHandler = function backHandler() {
    return null;
  };

  Screen.prototype.escHandler = function escHandler() {
    return null;
  };

  Screen.prototype.submitButtonLabel = function submitButtonLabel(m) {
    return i18n.str(m, ["submitLabel"]);
  };

  Screen.prototype.isFirstScreen = function isFirstScreen(m) {
    var firstScreenName = getInitialScreen(m);
    var currentScreenNameParts = this.name.split('.');
    var currentScreenName = currentScreenNameParts[1] || currentScreenNameParts[0];

    // if signup and login is enabled, both are the first screen in this scenario and
    // neither of them should show the title
    if (currentScreenName === 'signUp' && hasScreen(m, "login")) {
      return true;
    }

    var initialScreens = [firstScreenName, 'loading', 'lastLogin'];

    return initialScreens.indexOf(currentScreenName) !== -1;
  };

  Screen.prototype.getTitle = function getTitle(m) {
    if (this.isFirstScreen(m)) {
      return i18n.str(m, "title");
    }

    return this.getScreenTitle(m);
  };

  Screen.prototype.getScreenTitle = function getScreenTitle(m) {
    return i18n.str(m, "title");
  };

  Screen.prototype.submitHandler = function submitHandler() {
    return null;
  };

  Screen.prototype.isSubmitDisabled = function isSubmitDisabled(m) {
    return false;
  };

  Screen.prototype.renderAuxiliaryPane = function renderAuxiliaryPane() {
    return null;
  };

  Screen.prototype.renderTabs = function renderTabs() {
    return false;
  };

  Screen.prototype.renderTerms = function renderTerms() {
    return null;
  };

  return Screen;
}();

export default Screen;
