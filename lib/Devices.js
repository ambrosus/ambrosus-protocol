import Ambrosus from './Ambrosus';
import { EthereumError } from './Errors';
import Configuration from './conf/Configuration';

const DevicesJson = require('../build/contracts/Devices.json');

export default class Devices extends Ambrosus {
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(DevicesJson.abi);
  }

  async deploy(devices = [], options = {}) {
    return this.contract.deploy({
      data: DevicesJson.bytecode,
      arguments: [devices],
    })
      .send(await Configuration.getTransactionOptions(options))
      .then(contract => {
        this.contract = contract;
        return this;
      })
      .catch(e => { throw new EthereumError(e); });
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

  async add(device, options) {
    return this.contract.methods.add(device).send(await Configuration.getTransactionOptions(options))
      .catch(e => { throw new EthereumError(e); });
  }

  async remove(device, options) {
    return this.contract.methods.remove(device).send(await Configuration.getTransactionOptions(options))
      .catch(e => { throw new EthereumError(e); });
  }
}