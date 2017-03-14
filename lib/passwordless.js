function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Core from './core';
import passwordless from './engine/passwordless';

var Auth0LockPasswordless = function (_Core) {
  _inherits(Auth0LockPasswordless, _Core);

  function Auth0LockPasswordless(clientID, domain, options) {
    _classCallCheck(this, Auth0LockPasswordless);

    return _possibleConstructorReturn(this, _Core.call(this, clientID, domain, options, passwordless));
  }

  return Auth0LockPasswordless;
}(Core);

export default Auth0LockPasswordless;
