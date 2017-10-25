import Web3 from 'web3';
import { Web3NotFoundError } from './Errors';

/*
Ambrosus base class
 */
export default class Ambrosus {

  constructor() {
    if (typeof web3 === 'undefined') {
      throw new Web3NotFoundError();
    }
    this.web3 = new Web3(web3.currentProvider);
  }

  deploy() {
    throw new NotImplementedError();
  }

  at(address) {
    this.contract.address = address;
    return this;
  }

  get address() {
    return this.contract.address;
  }
}