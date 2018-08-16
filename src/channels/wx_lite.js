/**
 * 微信小程序支付
 * channel: wx_lite
 */
import callbackCenter from '../callback_center';
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
      callbackCenter.fail(callbackCenter.error('invalid_credential', `Missing field： ${missingFields.join('、')}`));
    } else {
      store.wx_lite_credential = credential;
      this.beginPay(credential);
    }
  },
  beginPay() {
    if (!isWxProgramClient) {
      callbackCenter.fail(callbackCenter.error('invalid_client', '请在微信小程序中打开'));
      return;
    }
    const wx_lite = store.wx_lite_credential;
    delete wx_lite.appId;
    wx_lite.complete = (res) => {
      // 支付成功
      if (res.errMsg === 'requestPayment:ok') {
        callbackCenter.success();
      }
      // 取消支付
      if (res.errMsg === 'requestPayment:fail cancel') {
        callbackCenter.cancel();
      }
      // 支付验证签名失败
      if (!!res.err_code && !!res.err_desc) {
        callbackCenter.fail(callbackCenter.error(res.err_desc, res));
      }
    };
    wx.requestPayment(wx_lite);
  },
};
