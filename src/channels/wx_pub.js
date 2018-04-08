/**
 * 微信公众号支付
 * channel: wx_pub
 */
import callback from '../callback';
import store from '../store';

const hasOwn = {}.hasOwnProperty;

export default {
  handleCharge(charge) {
    const { credential } = charge;
    const fields = ['appId', 'timeStamp', 'nonceStr', 'package', 'signType', 'paySign'];
    const missingFields =
      fields.reduce((ary, key) => (hasOwn.call(credential, key) ? ary : ary.concat(key)), []);
    if (missingFields.length > 0) {
      callback.fail(callback.error('invalid_credential', `Missing field： ${missingFields.join('、')}`));
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
            callback.success();
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            callback.cancel();
          } else {
            callback.fail(callback.error('wx_result_fail', res.err_msg));
          }
        },
      );
    }
  },
};
