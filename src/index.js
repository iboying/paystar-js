import channels from './channels/index';
import callbackCenter from './callback_center';

class PayStar {
  constructor() {
    this.charge = {};
  }

  setUrlReturnCallback(callback, urlReturnChannels) {
    if (typeof callback === 'function') {
      callbackCenter.urlReturnCallback = callback;
    } else {
      throw new Error('callback need to be a function');
    }

    if (typeof channels !== 'undefined') {
      if (Array.isArray(channels)) {
        callbackCenter.urlReturnChannels = urlReturnChannels;
      } else {
        throw new Error('channels need to be an array');
      }
    }
    return this;
  }

  pay(charge, callback) {
    this.charge = charge;
    const { channel } = charge;

    if (!callback) {
      console.error('You should set a callback with "pay" method to process paying result.');
      return;
    } else if (typeof callback !== 'function') {
      console.error('Callback must be a function.');
      return;
    }

    callbackCenter.callback = callback;

    if (!channel) {
      callbackCenter.fail(callbackCenter.error('Charge Error: ', 'There is no channel in charge object.'));
      return;
    }
    if (!channels[channel]) {
      callbackCenter.fail(callbackCenter.error('Channel Error: ', `The channel '${channel}' is not support.`));
      return;
    }

    channels[channel].handleCharge(charge);
  }
}

export default new PayStar();
