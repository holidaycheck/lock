import webAPI from '../web_api';
import Cache from '../../utils/cache';

var cache = new Cache(function () {
  return webAPI.getSSOData.apply(webAPI, arguments);
});

export function fetchSSOData(id, withAD, cb) {
  cache.get(id, withAD, cb);
}
