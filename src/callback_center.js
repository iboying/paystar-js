export default {
  callback: undefined,
  urlReturnCallback: undefined,
  urlReturnChannels: [
    'alipay_pc_direct', // 默认只开启 alipay_pc_direct 使用 callback 返回 URL
  ],
  success() {
    this.callback('success');
    this.callback = undefined;
  },
  cancel(err) {
    const errorObject = err || this.error('Canceled', '支付取消');
    this.callback('cancel', errorObject);
    this.callback = undefined;
  },
  fail(err) {
    const errorObject = err || this.error('failed', '支付失败');
    this.callback('fail', errorObject);
    this.callback = undefined;
  },
  error(msg, extra) {
    return {
      msg: msg || '',
      extra: extra || '',
    };
  },
  triggerUrlReturnCallback(err, url) {
    if (typeof this.urlReturnCallback === 'function') {
      this.urlReturnCallback(err, url);
    }
  },
  shouldReturnUrlByCallback(channel) {
    if (typeof this.urlReturnCallback !== 'function') {
      return false;
    }
    return this.urlReturnChannels.indexOf(channel) !== -1;
  },
};
