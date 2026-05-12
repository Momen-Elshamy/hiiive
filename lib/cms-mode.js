export function isCmsDbEnabled() {
  return process.env.PREMAST_DISABLE_DB !== "true";
}
