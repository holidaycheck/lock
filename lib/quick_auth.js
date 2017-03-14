import { dataFns } from './utils/data_utils';

var _dataFns = dataFns(["quickAuth"]),
    tget = _dataFns.tget,
    tset = _dataFns.tset;

export function skipQuickAuth(m, b) {
  return tset(m, "skipped", b);
}

export function hasSkippedQuickAuth(m) {
  return tget(m, "skipped", false);
}
