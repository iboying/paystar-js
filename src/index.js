import channels from './channels/index';
import callbackObject from './callback';

class PayStar {
  constructor() {
    this.charge = {};
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
      callbackObject.callback = callback;
    }
    channels[channel].handleCharge(charge);
  }
}

export default new PayStar();
