import channels from './channels';

class PayStar {
  constructor() {
    this.charge = {};
  }

  pay(charge) {
    this.charge = charge;
    const { channel } = charge;
    if (!channel) {
      throw new Error('The channel of charge is illegal.');
    }
    if (!channels[channel]) {
      throw new Error('The channel is not support.');
    }
    channels[channel].handleCharge(charge);
  }
}

export default new PayStar();
