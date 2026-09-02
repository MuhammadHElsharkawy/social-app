export function getSafeReturnUrl(
  url: string | null | undefined,
  defaultUrl: string = '/home',
): string {
  if (!url) {
    return defaultUrl;
  }

  const isRelativeUrl = url.startsWith('/') && !url.startsWith('//');
  const hasNoProtocol = !url.includes(':');

  return isRelativeUrl && hasNoProtocol ? url : defaultUrl;
}
