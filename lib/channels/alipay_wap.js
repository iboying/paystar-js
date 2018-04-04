/**
 * 支付宝H5支付
 * channel: alipay_wap
 */
import utils from '../utils';

const ALIPAY_WAP_URL = 'https://mapi.alipay.com/gateway.do';

export default {
  handleCharge(charge) {
    const { credential } = charge;
    utils.redirectTo(credential);
  },
};
