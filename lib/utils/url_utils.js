export function parseUrl(str) {
  var parser = global.document.createElement("a");
  parser.href = str;
  return parser;
}
