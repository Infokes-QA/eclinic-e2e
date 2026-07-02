export function formatNoErmForDisplay(noRm: string, digits = 8): string {
  const normalized = noRm.replace(/\D/g, "");

  return normalized.slice(-digits).padStart(digits, "0");
}

export function normalizeNoRmForUrl(noRm: string): string {
  return noRm.replace(/\D/g, "");
}
