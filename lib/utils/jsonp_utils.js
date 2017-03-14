function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import jsonp from 'jsonp';

var JSONPUtils = function () {
  function JSONPUtils() {
    _classCallCheck(this, JSONPUtils);
  }

  JSONPUtils.prototype.get = function get() {
    return jsonp.apply(undefined, arguments);
  };

  return JSONPUtils;
}();

export default new JSONPUtils();
