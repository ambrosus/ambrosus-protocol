import { NotImplementedError } from './Errors';
import Configuration from './conf/Configuration';

/*
Ambrosus base class
 */
export default class Ambrosus {

  deploy() {
    throw new NotImplementedError();
  }

  at(address) {
    this.contract.address = address;
    return this;
  }

  get address() {
    return this.contract.options.address.toLowerCase();
  }

  get web3() {
    return Configuration.web3;
  }
}