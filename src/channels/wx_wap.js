/**
 * 微信H5支付
 */
import callback from '../callback';
import utils from '../utils';

const hasOwn = {}.hasOwnProperty;

export default {
  handleCharge(charge) {
    const { credential } = charge;
    if (typeof credential === 'string') {
      utils.redirectTo(credential);
    } else if (typeof credential === 'object' && hasOwn.call(credential, 'url')) {
      utils.redirectTo(`${credential.url}?${utils.queryStringify(credential, { encode: true })}`);
    } else {
      callback.fail(callback.error('invalid_credential', 'credential 格式不正确'));
    }
  },
};
