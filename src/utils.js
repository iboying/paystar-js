import callbackObject from './callback_center';

const hasOwn = {}.hasOwnProperty;

export default {
  redirectTo(url, channel) {
    if (callbackObject.shouldReturnUrlByCallback(channel)) {
      callbackObject.triggerUrlReturnCallback(null, url);
      return;
    }

    if (typeof window === 'undefined') {
      throw new Error(`\n Not a browser, redirect url: ${url} \n`);
    }

    window.location.href = url;
  },
  queryStringify(data = {}, channel, parentKey) {
    if (typeof data === 'object') {
      const array = Object.keys(data).map((k) => {
        // Don't stringify data below these conditions
        if (k === 'channel_url') return null;
        if (!hasOwn.call(data, k) || typeof data[k] === 'function') return null;

        const _k = typeof k === 'string' ? k : '';
        const logicKey = parentKey ? `${parentKey}[${_k}]` : `${_k}`;
        return typeof data[k] === 'object'
          ? this.queryString(data[k], null, logicKey)
          : `${encodeURIComponent(logicKey)}=${encodeURIComponent(data[k])}`;
      });
      return array.filter(o => !!o).join('&');
    } else if (data.toString) {
      return data.toString();
    }
    return `${data}`;
  },
};
