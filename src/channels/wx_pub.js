/**
 * 微信公众号支付
 * channel: wx_pub
 */
import callbackCenter from '../callback_center';
import store from '../store';

const hasOwn = {}.hasOwnProperty;

export default {
  handleCharge(charge) {
    const { credential } = charge;
    const fields = ['appId', 'timeStamp', 'nonceStr', 'package', 'signType', 'paySign'];
    const missingFields =
      fields.reduce((ary, key) => (hasOwn.call(credential, key) ? ary : ary.concat(key)), []);
    if (missingFields.length > 0) {
      callbackCenter.fail(callbackCenter.error('invalid_credential', `Missing field： ${missingFields.join('、')}`));
    } else {
      store.credential = credential;
      this.prePayLogic();
    }
  },
  prePayLogic() {
    if (typeof WeixinJSBridge === 'undefined') {
      const payCallback = this.beginPay.bind(this);
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', payCallback, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', payCallback);
        document.attachEvent('onWeixinJSBridgeReady', payCallback);
      }
    } else {
      this.beginPay();
    }
  },
  beginPay() {
    if (hasOwn.call(store, 'credential')) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        store.credential,
        (res) => {
          delete store.credential;
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            callbackCenter.success();
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            callbackCenter.cancel();
          } else {
            callbackCenter.fail(callbackCenter.error('wx_result_fail', res.err_msg));
          }
        },
      );
    }
  },
};
