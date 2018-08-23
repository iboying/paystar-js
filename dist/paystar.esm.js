/**
 * paystar-js v0.1.5
 * (c) 2018 iboying(weboying@gmail.com)
 * @license MIT
 */
var callbackCenter$1 = {
  callback: undefined,
  urlReturnCallback: undefined,
  urlReturnChannels: [
    'alipay_pc_direct' ],
  success: function success() {
    this.callback('success');
    this.callback = undefined;
  },
  cancel: function cancel(err) {
    var errorObject = err || this.error('Canceled', '支付取消');
    this.callback('cancel', errorObject);
    this.callback = undefined;
  },
  fail: function fail(err) {
    var errorObject = err || this.error('failed', '支付失败');
    this.callback('fail', errorObject);
    this.callback = undefined;
  },
  error: function error(msg, extra) {
    return {
      msg: msg || '',
      extra: extra || '',
    };
  },
  triggerUrlReturnCallback: function triggerUrlReturnCallback(err, url) {
    if (typeof this.urlReturnCallback === 'function') {
      this.urlReturnCallback(err, url);
    }
  },
  shouldReturnUrlByCallback: function shouldReturnUrlByCallback(channel) {
    if (typeof this.urlReturnCallback !== 'function') {
      return false;
    }
    return this.urlReturnChannels.indexOf(channel) !== -1;
  },
};

var hasOwn = {}.hasOwnProperty;

var utils = {
  redirectTo: function redirectTo(url, channel) {
    if (callbackCenter$1.shouldReturnUrlByCallback(channel)) {
      callbackCenter$1.triggerUrlReturnCallback(null, url);
      return;
    }

    if (typeof window === 'undefined') {
      throw new Error(("\n Not a browser, redirect url: " + url + " \n"));
    }

    window.location.href = url;
  },
  queryStringify: function queryStringify(data, channel, parentKey) {
    var this$1 = this;
    if ( data === void 0 ) data = {};

    if (typeof data === 'object') {
      var array = Object.keys(data).map(function (k) {
        // Don't stringify data below these conditions
        if (k === 'channel_url') { return null; }
        if (!hasOwn.call(data, k) || typeof data[k] === 'function') { return null; }

        var _k = typeof k === 'string' ? k : '';
        var logicKey = parentKey ? (parentKey + "[" + _k + "]") : ("" + _k);
        return typeof data[k] === 'object'
          ? this$1.queryString(data[k], null, logicKey)
          : ((encodeURIComponent(logicKey)) + "=" + (encodeURIComponent(data[k])));
      });
      return array.filter(function (o) { return !!o; }).join('&');
    } else if (data.toString) {
      return data.toString();
    }
    return ("" + data);
  },
};

/**
 * 支付宝电脑网站支付
 */

var hasOwn$1 = {}.hasOwnProperty;
var ALIPAY_PC_DIRECT_URL = 'https://mapi.alipay.com/gateway.do';

var alipay_pc_direct = {
  handleCharge: function handleCharge(charge) {
    var credential = channel.credential[charge.channel];
    var baseUrl = ALIPAY_PC_DIRECT_URL;

    if (typeof charge.credential === 'string') {
      utils.redirectTo(charge.credential);
    } else if (typeof charge.credential === 'object') {
      if (hasOwn$1.call(credential, 'channel_url')) {
        baseUrl = credential.channel_url;
      }
      if (!hasOwn$1.call(credential, '_input_charset')) {
        if (hasOwn$1.call(credential, 'service')
          && credential.service === 'create_direct_pay_by_user') {
          credential._input_charset = 'utf-8';
        }
      }
      var query = utils.queryStringify(credential, charge.channel);
      utils.redirectTo((baseUrl + "?" + query), channel);
    } else {
      callbackCenter.fail(callbackCenter.error('invalid_credential', 'credential 格式不正确'));
    }
  },
};

/**
 * 支付宝扫码支付
 * channel: alipay_qr
 */

var hasOwn$2 = {}.hasOwnProperty;

var alipay_qr = {
  handleCharge: function handleCharge() {
    var credential = charge.credential[charge.channel];

    if (hasOwn$2.call(credential, 'transaction_no')) {
      this.tradePay(credential.transaction_no);
    } else {
      callbackCenter$1.fail(callbackCenter$1.error('invalid_credential', 'missing_field_transaction_no'));
    }
  },
  tradePay: function tradePay(tradeNO) {
    this.ready(function () {
      // 通过传入交易号唤起快捷调用方式(注意tradeNO大小写严格)
      AlipayJSBridge.call('tradePay', { tradeNO: tradeNO }, function (data) {
        if (data.resultCode === '9000') {
          callbackCenter$1.success();
        } else if (data.resultCode === '6001') {
          callbackCenter$1.cancel(callbackCenter$1.error('Canceled', data.result));
        } else {
          callbackCenter$1.fail(callbackCenter$1.error('Failed', data.result));
        }
      });
    });
  },
  ready: function ready(callback) {
    if ( callback === void 0 ) callback = function () { };

    if (window.AlipayJSBridge) {
      callback();
    } else {
      document.addEventListener('AlipayJSBridgeReady', callback, false);
    }
  },
};

/**
 * 支付宝H5支付
 * channel: alipay_wap
 */

var hasOwn$3 = {}.hasOwnProperty;
var ALIPAY_WAP_URL = 'https://mapi.alipay.com/gateway.do';

var alipay_wap = {
  handleCharge: function handleCharge(charge) {
    var credential = charge.credential;

    if (typeof credential === 'string') {
      utils.redirectTo(credential);
    } else if (typeof credential === 'object') {
      if (!hasOwn$3.call(credential, '_input_charset')) {
        if ((hasOwn$3.call(credential, 'service')
          && credential.service === 'alipay.wap.create.direct.pay.by.user')
          || hasOwn$3.call(credential, 'req_data')
        ) {
          credential._input_charset = 'utf-8';
        }
      }
      utils.redirectTo((ALIPAY_WAP_URL + "?" + (utils.queryStringify(credential))));
    } else {
      callbackCenter$1.fail(callbackCenter$1.error('invalid_credential', 'credential 格式不正确'));
    }
  },
};

var store = {};

/**
 * 微信公众号支付
 * channel: wx_pub
 */

var hasOwn$4 = {}.hasOwnProperty;

var wx_pub = {
  handleCharge: function handleCharge(charge) {
    var credential = charge.credential;
    var fields = ['appId', 'timeStamp', 'nonceStr', 'package', 'signType', 'paySign'];
    var missingFields =
      fields.reduce(function (ary, key) { return (hasOwn$4.call(credential, key) ? ary : ary.concat(key)); }, []);
    if (missingFields.length > 0) {
      callbackCenter$1.fail(callbackCenter$1.error('invalid_credential', ("Missing field： " + (missingFields.join('、')))));
    } else {
      store.credential = credential;
      this.prePayLogic();
    }
  },
  prePayLogic: function prePayLogic() {
    if (typeof WeixinJSBridge === 'undefined') {
      var payCallback = this.beginPay.bind(this);
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
  beginPay: function beginPay() {
    if (hasOwn$4.call(store, 'credential')) {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        store.credential,
        function (res) {
          delete store.credential;
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            callbackCenter$1.success();
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            callbackCenter$1.cancel();
          } else {
            callbackCenter$1.fail(callbackCenter$1.error('wx_result_fail', res.err_msg));
          }
        }
      );
    }
  },
};

/**
 * 微信H5支付
 */

var hasOwn$5 = {}.hasOwnProperty;

var wx_wap = {
  handleCharge: function handleCharge(charge) {
    var credential = charge.credential;
    if (typeof credential === 'string') {
      utils.redirectTo(credential);
    } else if (typeof credential === 'object' && hasOwn$5.call(credential, 'mweb_url')) {
      utils.redirectTo(((credential.mweb_url) + "?" + (utils.queryStringify(credential, { encode: true }))));
    } else {
      callbackCenter$1.fail(callbackCenter$1.error('invalid_credential', 'credential 格式不正确'));
    }
  },
};

/**
 * 微信小程序支付
 * channel: wx_lite
 */

var hasOwn$6 = {}.hasOwnProperty;
var isWxProgramClient = typeof wx !== 'undefined' && wx.requestPayment;

var wx_lite = {
  handleCharge: function handleCharge(charge) {
    var credential = charge.credential;
    var fields = ['appId', 'timeStamp', 'nonceStr', 'package', 'signType', 'paySign'];
    var missingFields =
      fields.reduce(function (ary, key) { return (hasOwn$6.call(credential, key) ? ary : ary.concat(key)); }, []);
    if (missingFields.length > 0) {
      callbackCenter$1.fail(callbackCenter$1.error('invalid_credential', ("Missing field： " + (missingFields.join('、')))));
    } else {
      store.wx_lite_credential = credential;
      this.beginPay(credential);
    }
  },
  beginPay: function beginPay() {
    if (!isWxProgramClient) {
      callbackCenter$1.fail(callbackCenter$1.error('invalid_client', '请在微信小程序中打开'));
      return;
    }
    var wx_lite = store.wx_lite_credential;
    delete wx_lite.appId;
    wx_lite.complete = function (res) {
      // 支付成功
      if (res.errMsg === 'requestPayment:ok') {
        callbackCenter$1.success();
      }
      // 取消支付
      if (res.errMsg === 'requestPayment:fail cancel') {
        callbackCenter$1.cancel();
      }
      // 支付验证签名失败
      if (!!res.err_code && !!res.err_desc) {
        callbackCenter$1.fail(callbackCenter$1.error(res.err_desc, res));
      }
    };
    wx.requestPayment(wx_lite);
  },
};

var channels = {
  wx_lite: wx_lite,
  alipay_pc_direct: alipay_pc_direct,
  alipay_qr: alipay_qr,
  alipay_wap: alipay_wap,
  wx_pub: wx_pub,
  wx_wap: wx_wap,
};

var PayStar = function PayStar() {
  this.charge = {};
};

PayStar.prototype.setUrlReturnCallback = function setUrlReturnCallback (callback, urlReturnChannels) {
  if (typeof callback === 'function') {
    callbackCenter$1.urlReturnCallback = callback;
  } else {
    throw new Error('callback need to be a function');
  }

  if (typeof channels !== 'undefined') {
    if (Array.isArray(channels)) {
      callbackCenter$1.urlReturnChannels = urlReturnChannels;
    } else {
      throw new Error('channels need to be an array');
    }
  }
  return this;
};

PayStar.prototype.pay = function pay (charge, callback) {
  this.charge = charge;
  var channel = charge.channel;

  if (!callback) {
    console.error('You should set a callback with "pay" method to process paying result.');
    return;
  } else if (typeof callback !== 'function') {
    console.error('Callback must be a function.');
    return;
  }

  callbackCenter$1.callback = callback;

  if (!channel) {
    callbackCenter$1.fail(callbackCenter$1.error('Charge Error: ', 'There is no channel in charge object.'));
    return;
  }
  if (!channels[channel]) {
    callbackCenter$1.fail(callbackCenter$1.error('Channel Error: ', ("The channel '" + channel + "' is not support.")));
    return;
  }

  channels[channel].handleCharge(charge);
};

var index = new PayStar();

export default index;
