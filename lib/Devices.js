import Ambrosus from './Ambrosus';
import { EthereumError } from './Errors';
import Configuration from './conf/Configuration';
import Web3PromiEvent from 'web3-core-promievent';
import { web3SendToPromiEvent } from './utils';

const DevicesJson = require('../build/contracts/Devices.json');

export default class Devices extends Ambrosus {
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(DevicesJson.abi);
  }

  deploy(devices = [], options = {}) {
    let promievent = new Web3PromiEvent();
    Configuration.getTransactionOptions(options).then((opt) => {
      web3SendToPromiEvent(
        this.contract.deploy({
          data: DevicesJson.bytecode,
          arguments: [devices],
        }).send(opt),
        promievent.eventEmitter)
        .catch(e => promievent.reject(new EthereumError(e)))
        .then(contract => {
          this.contract = contract;
          promievent.resolve(this);
        });
    });
    return promievent.eventEmitter;
  }

  async count() {
    return await this.contract.methods.count().call();
  }

  async getAll() {
    return (await this.contract.methods.getAll().call()).map(addr => addr.toLowerCase());
  }

  async isValid(deviceAddress) {
    return await this.contract.methods.isOnList(deviceAddress).call();
  }

  add(device, options) {
    let promievent = new Web3PromiEvent();
    Configuration.getTransactionOptions(options).then(opt =>
      web3SendToPromiEvent(this.contract.methods.add(device)
        .send(opt), promievent.eventEmitter)
        .then(promievent.resolve)
        .catch(e => promievent.reject(new EthereumError(e))));
    return promievent.eventEmitter;
  }

  remove(device, options) {
    let promievent = new Web3PromiEvent();
    Configuration.getTransactionOptions(options).then(opt =>
      web3SendToPromiEvent(this.contract.methods.remove(device)
        .send(opt), promievent.eventEmitter)
        .then(promievent.resolve)
        .catch(e => promievent.reject(new EthereumError(e))));
    return promievent.eventEmitter;
  }
}