import { Web3NotFoundError } from '../Errors';
import Web3 from 'web3';

export default class Configuration {

  static async getTransactionOptions(options = {}) {
    let defaultOptions = {
      from: (await Configuration.web3.eth.getAccounts())[0].toLowerCase(),
      gas: 4000000,
    };
    return { ...defaultOptions, ...options };
  }

  static get web3() {
    if (this._web3) return this._web3;
    if (typeof web3 === 'undefined') {
      throw new Web3NotFoundError();
    }
    this._web3 = new Web3(web3.currentProvider);
    return this._web3;
  }
}