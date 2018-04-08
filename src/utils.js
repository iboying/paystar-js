export default {
  redirectTo(url) {
    if (typeof window === 'undefined') {
      throw new Error(`\n Not a browser, redirect url: ${url} \n`);
    }
    window.location.href = url;
  },
  queryStringify(data) {
    return Object
      .entries(data || {})
      .reduce((res, item) => (res.concat([`${item[0]}=${encodeURIComponent(item[1])}`])), [])
      .join('&');
  },
};
