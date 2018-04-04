export default {
  redirectTo(url) {
    if (typeof window === 'undefined') {
      console.log(`Not a browser, redirect url: ${url}`);
      return;
    }
    window.location.href = url;
  },
};
