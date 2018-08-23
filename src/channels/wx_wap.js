/**
 * 微信H5支付
 */
import callbackCenter from '../callback_center';
import utils from '../utils';

const hasOwn = {}.hasOwnProperty;

export default {
  handleCharge(charge) {
    const { credential } = charge;
    if (typeof credential === 'string') {
      utils.redirectTo(credential);
    } else if (typeof credential === 'object' && hasOwn.call(credential, 'mweb_url')) {
      utils.redirectTo(`${credential.mweb_url}?${utils.queryStringify(credential, { encode: true })}`);
    } else {
      callbackCenter.fail(callbackCenter.error('invalid_credential', 'credential 格式不正确'));
    }
  },
};
