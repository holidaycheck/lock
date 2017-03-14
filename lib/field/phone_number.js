import Immutable from 'immutable';
import { getField, getFieldValue, registerOptionField, setField } from './index';
import locations from './phone-number/locations';

var locationOptions = Immutable.fromJS(locations.map(function (x) {
  return {
    country: x[0],
    diallingCode: x[2],
    isoCode: x[1],
    label: x[2] + ' ' + x[1] + ' ' + x[0],
    value: x[2] + ' ' + x[1]
  };
}));

function findLocation(isoCode) {
  return locationOptions.find(function (x) {
    return x.get("isoCode") === isoCode;
  });
}

export function initLocation(m, isoCode) {
  var location = findLocation(isoCode) || findLocation("US");
  return registerOptionField(m, "location", locationOptions, location.get("value"));
}

export function validatePhoneNumber(str) {
  var regExp = /^[0-9]([0-9 -])*[0-9]$/;
  return regExp.test(str);
}

export function setPhoneNumber(m, str) {
  return setField(m, "phoneNumber", str, validatePhoneNumber);
}

export function phoneNumberWithDiallingCode(m) {
  return humanPhoneNumberWithDiallingCode(m).replace(/[\s-]+/g, '');
}

export function humanPhoneNumberWithDiallingCode(m) {
  var location = getField(m, "location");
  var code = location.get("diallingCode", "");
  var number = getFieldValue(m, "phoneNumber", "");
  return code ? code + ' ' + number : number;
}

export function humanLocation(m) {
  var location = getField(m, "location");
  return location.get("diallingCode") + ' ' + location.get("country");
}
