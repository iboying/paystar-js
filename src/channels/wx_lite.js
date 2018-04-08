/**
 * 微信小程序支付
 * channel: wx_lite
 */
import callback from '../callback';
import store from '../store';

const hasOwn = {}.hasOwnProperty;
const isWxProgramClient = typeof wx !== 'undefined' && wx.requestPayment;

export default {
  handleCharge(charge) {
    const { credential } = charge;
    const fields = ['appId', 'timeStamp', 'nonceStr', 'package', 'signType', 'paySign'];
    const missingFields =
      fields.reduce((ary, key) => (hasOwn.call(credential, key) ? ary : ary.concat(key)), []);
    if (missingFields.length > 0) {
      callback.fail(callback.error('invalid_credential', `Missing field： ${missingFields.join('、')}`));
    } else {
      store.wx_lite_credential = credential;
      this.beginPay(credential);
    }
  },
  beginPay() {
    if (!isWxProgramClient) {
      callback.fail(callback.error('invalid_client', '请在微信小程序中打开'));
      return;
    }
    const wx_lite = store.wx_lite_credential;
    delete wx_lite.appId;
    wx_lite.complete = (res) => {
      // 支付成功
      if (res.errMsg === 'requestPayment:ok') {
        callback.success();
      }
      // 取消支付
      if (res.errMsg === 'requestPayment:fail cancel') {
        callback.cancel();
      }
      // 支付验证签名失败
      if (!!res.err_code && !!res.err_desc) {
        callback.fail(callback.error(res.err_desc, res));
      }
    };
    wx.requestPayment(wx_lite);
  },
};
