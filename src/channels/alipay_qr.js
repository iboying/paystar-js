/**
 * 支付宝扫码支付
 * channel: alipay_qr
 */
import callbackCenter from '../callback_center';

const hasOwn = {}.hasOwnProperty;

export default {
  handleCharge() {
    const credential = charge.credential[charge.channel];

    if (hasOwn.call(credential, 'transaction_no')) {
      this.tradePay(credential.transaction_no);
    } else {
      callbackCenter.fail(callbackCenter.error('invalid_credential', 'missing_field_transaction_no'));
    }
  },
  tradePay(tradeNO) {
    this.ready(() => {
      // 通过传入交易号唤起快捷调用方式(注意tradeNO大小写严格)
      AlipayJSBridge.call('tradePay', { tradeNO }, (data) => {
        if (data.resultCode === '9000') {
          callbackCenter.success();
        } else if (data.resultCode === '6001') {
          callbackCenter.cancel(callbackCenter.error('Canceled', data.result));
        } else {
          callbackCenter.fail(callbackCenter.error('Failed', data.result));
        }
      });
    });
  },
  ready(callback = () => { }) {
    if (window.AlipayJSBridge) {
      callback();
    } else {
      document.addEventListener('AlipayJSBridgeReady', callback, false);
    }
  },
};
