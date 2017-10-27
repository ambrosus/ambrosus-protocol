import Ambrosus from './Ambrosus';
import Configuration from './conf/Configuration';
import { EthereumError } from './Errors';
import IPFSSet from './storage/IPFSSet';

const MeasurementsJson = require('../build/contracts/Measurements.json');

export default class Measurements extends Ambrosus {

  constructor(ipfs) {
    super();
    this.ipfsSet = new IPFSSet(ipfs);
    this.contract = new this.web3.eth.Contract(MeasurementsJson.abi);
  }

  async deploy(deviceAddress, options = {}) {
    await this.ipfsSet.init();
    return this.contract.deploy({
      data: MeasurementsJson.bytecode,
      arguments: [this.web3.utils.fromAscii(this.ipfsSet.getOwnHash()), deviceAddress],
    })
      .send(await Configuration.getTransactionOptions(options))
      .then(contract => {
        this.contract = contract;
        return this;
      })
      .catch(e => { throw new EthereumError(e); });
  }

  async at(address) {
    super.at(address);
    let ipfsHash = await this.contract.methods.ipfsHash().call();
    await this.ipfsSet.initWithHash(ipfsHash);
    return this;
  }

  async report(measurement, options = {}) {
    let result = await this.contract.methods.validate(measurement.device).call();
    if (!result) {
      throw new EthereumError(`${measurement} is not valid`);
    }
    await this.ipfsSet.add(JSON.stringify(measurement));
    return this.contract.methods.setIpfsHash(this.web3.utils.fromAscii(this.ipfsSet.getOwnHash()))
      .send(await Configuration.getTransactionOptions(options))
      .catch(e => { throw new EthereumError(e); });

  }

  async count() {
    return (await this.ipfsSet.keys()).length;
  }

  async getAll() {
    return await this.ipfsSet.map(JSON.parse);
  }

  async getById(id) {
    return JSON.parse(
      await this.ipfsSet.first(
        measurement => JSON.parse(measurement).id.toLowerCase() === id.toLowerCase()));
  }

}