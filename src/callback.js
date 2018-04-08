export default {
  callback: undefined,
  success() {
    this.callback('success');
    this.callback = undefined;
  },
  cancel() {
    this.callback('cancel', this.error('用户取消支付'));
    this.callback = undefined;
  },
  fail(err = this.error()) {
    this.callback('fail', err);
    this.callback = undefined;
  },
  error(msg, extra) {
    return {
      msg: msg || '',
      extra: extra || '',
    };
  },
};
