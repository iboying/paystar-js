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
    if (!channel) {
      throw new Error('There is no channel in charge.');
    }
    if (!channels[channel]) {
      throw new Error('The channel is not support.');
    }
    if (!callback) {
      throw new Error('You should set a callback with "pay" method to process paying result.');
    } else if (typeof callback !== 'function') {
      throw new Error('Callback must be a function.');
    } else {
      callbackCenter.callback = callback;
    }
    channels[channel].handleCharge(charge);
  }
}

export default new PayStar();
