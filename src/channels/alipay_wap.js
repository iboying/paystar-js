/**
 * 支付宝H5支付
 * channel: alipay_wap
 */
import utils from '../utils';
import callbackCenter from '../callback_center';

const hasOwn = {}.hasOwnProperty;
const ALIPAY_WAP_URL = 'https://mapi.alipay.com/gateway.do';

export default {
  handleCharge(charge) {
    const { credential } = charge;

    if (typeof credential === 'string') {
      utils.redirectTo(credential);
    } else if (typeof credential === 'object') {
      if (!hasOwn.call(credential, '_input_charset')) {
        if ((hasOwn.call(credential, 'service')
          && credential.service === 'alipay.wap.create.direct.pay.by.user')
          || hasOwn.call(credential, 'req_data')
        ) {
          credential._input_charset = 'utf-8';
        }
      }
      utils.redirectTo(`${ALIPAY_WAP_URL}?${utils.queryStringify(credential)}`);
    } else {
      callbackCenter.fail(callbackCenter.error('invalid_credential', 'credential 格式不正确'));
    }
  },
};
