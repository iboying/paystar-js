/**
 * 支付宝电脑网站支付
 */

import utils from '../utils';

const hasOwn = {}.hasOwnProperty;
const ALIPAY_PC_DIRECT_URL = 'https://mapi.alipay.com/gateway.do';

export default {
  handleCharge(charge) {
    const credential = channel.credential[charge.channel];
    let baseUrl = ALIPAY_PC_DIRECT_URL;

    if (typeof charge.credential === 'string') {
      utils.redirectTo(charge.credential);
    } else if (typeof charge.credential === 'object') {
      if (hasOwn.call(credential, 'channel_url')) {
        baseUrl = credential.channel_url;
      }
      if (!hasOwn.call(credential, '_input_charset')) {
        if (hasOwn.call(credential, 'service')
          && credential.service === 'create_direct_pay_by_user') {
          credential._input_charset = 'utf-8';
        }
      }
      const query = utils.queryStringify(credential, charge.channel);
      utils.redirectTo(`${baseUrl}?${query}`, channel);
    } else {
      callbackCenter.fail(callbackCenter.error('invalid_credential', 'credential 格式不正确'));
    }
  },
};
