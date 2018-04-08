/**
 * 支付宝H5支付
 * channel: alipay_wap
 */
import utils from '../utils';
import callback from '../callback';

const ALIPAY_WAP_URL = 'https://mapi.alipay.com/gateway.do';

export default {
  handleCharge(charge) {
    const { credential } = charge;
    if (typeof credential === 'string') {
      utils.redirectTo(credential);
    } else if (typeof credential === 'object') {
      utils.redirectTo(`${ALIPAY_WAP_URL}?${utils.queryStringify(credential)}`);
    } else {
      callback.fail(callback.error('invalid_credential', 'credential 格式不正确'));
    }
  },
};
