export const redirectToLogin = (returnPath, navigateFn) => {
  if (!returnPath) {
    returnPath = "/";
  }
  navigateFn(`/login?redirect=${encodeURIComponent(returnPath)}`);
};

export const getRedirectPath = (location) => {
  const params = new URLSearchParams(location.search);
  return params.get("redirect") || "/";
};
