import { Buffer } from 'safe-buffer';

export default class IPFSSet {

  constructor(_ipfs, _ipfsObject) {
    this.node = _ipfs;
    this.catalog = _ipfsObject;
  }

  async init() {
    this.catalog = await this.node.object.put({
      Data: Buffer.from(' '),
      Links: [],
    });
    return this;
  }

  async initWithHash(_nodeHash) {
    this.catalog = await this.node.object.get(_nodeHash);
    return this;
  }

  getOwnHash() {
    return this.catalog.toJSON().multihash;
  }

  getUniqueId(dag) {
    return Date.now() + dag.toJSON().multihash;
  }

  async add(content) {
    let newItem = await this.node.object.put({
      Data: Buffer.from(content),
      Links: [],
    });
    this.catalog = await this.node.object.patch.addLink(this.catalog.multihash,
      {
        name: this.getUniqueId(newItem),
        size: newItem.toJSON().size,
        multihash: newItem.toJSON().multihash,
      });
    return newItem.toJSON().multihash;
  }

  keys() {
    return this.catalog.toJSON().links;
  }

  async values() {
    let collection = [];
    let keys = await this.keys();
    for (let key of keys) {
      collection.push((await this.node.object.data(key.multihash)).toString());
    }
    return collection;
  }

  async first(callback = () => true) {
    let keys = await this.keys();
    for (let key of keys) {
      let data = (await this.node.object.data(key.multihash)).toString();
      if (callback(data)) {
        return data;
      }
    }
    return undefined;
  }

  async filter(callback) {
    let collection = [];
    let keys = await this.keys();
    for (let key of keys) {
      let data = (await this.node.object.data(key.multihash)).toString();
      if (callback(data)) {
        collection.push(data);
      }
    }
    return collection;
  }

  async map(callback) {
    let collection = [];
    let keys = await this.keys();
    for (let key of keys) {
      let data = (await this.node.object.data(key.multihash)).toString();
      collection.push(callback(data));
    }
    return collection;
  }

}