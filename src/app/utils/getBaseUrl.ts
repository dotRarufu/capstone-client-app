export const getBaseUrl = () => {
  const full = window.location.href;
  const path = window.location.pathname;
  const base = full.slice(0, full.indexOf(path));

  return base;
};
