export function isMobileRequest(req) {
  return /Dart.+|PostmanRuntime.+/i.test(req.headers["user-agent"] || "");
}
