import ipfsAPI from 'ipfs-api';
import IPFSSet from '../../lib/storage/IPFSSet.js';

let ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002');

describe('IPFSSet', function () {
  let ipfsSet;
  let testData = ['test1', 'test2', 'test3', 'test4', 'test5'];

  describe('Add to new set', () => {

    before(async () => {
      let ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002');
      ipfsSet = await new IPFSSet(ipfs).init();
    });

    it('add elements', async () => {
      let hash1 = await ipfsSet.add(testData[0]);
      let hash2 = await ipfsSet.add(testData[1]);
      let links = ipfsSet.keys();
      let data = await ipfsSet.values();

      assert.equal(links.length, 2);
      assert.equal(data.length, 2);
      assert.deepEqual(data.sort(), [testData[0], testData[1]]);
      assert.deepEqual(links.map((l) => l.multihash).sort(), [hash1, hash2].sort());
    });
  });

  describe('Restore existing set', () => {
    let hash1, hash2;
    beforeEach(async () => {
      let ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002');
      ipfsSet = await new IPFSSet(ipfs).init();
      hash1 = await ipfsSet.add(testData[2]);
      hash2 = await ipfsSet.add(testData[3]);
    });

    it('resotore from hash', async () => {
      let restoredSet = await ipfsSet.initWithHash(ipfsSet.getOwnHash());
      let links = restoredSet.keys();
      let data = await restoredSet.values();

      assert.equal(links.length, 2);
      assert.equal(data.length, 2);
      assert.deepEqual(data.sort(), [testData[2], testData[3]]);
      assert.deepEqual(links.map((l) => l.multihash).sort(), [hash1, hash2].sort());
    });

    it('restore from hash and add new', async () => {
      let restoredSet = await ipfsSet.initWithHash(ipfsSet.getOwnHash());
      await restoredSet.add(testData[4]);
      let data = await restoredSet.values();
      assert.deepEqual(data.sort(), [testData[2], testData[3], testData[4]]);

    });

  });

  xdescribe('Adding large file', () => {
    function randomString(length) {
      let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      for (let i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      return result;
    }

    it('', async () => {
      let ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' });
      ipfsSet = await new IPFSSet(ipfs).init();
      let bigData = randomString(1000000);
      await ipfsSet.add(bigData);
      assert.deepEqual(await ipfsSet.first(), bigData);
    });
  });

  describe('Higher order functions', () => {

    beforeEach(async () => {
      let ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5002');
      ipfsSet = await new IPFSSet(ipfs).init();
      await ipfsSet.add(testData[2]);
      await ipfsSet.add(testData[3]);
    });

    it('map', async () => {
      assert.deepEqual(await ipfsSet.map(str => str.toUpperCase()),
        [testData[2], testData[3]].map(str => str.toUpperCase()));
    });

    it('filter', async () => {
      assert.deepEqual(await ipfsSet.filter((str) => str === testData[2]),
        [testData[2], testData[3]].filter((str) => str === testData[2]));
      assert.deepEqual(await ipfsSet.filter((str) => str === testData[0]),
        [testData[2], testData[3]].filter((str) => str === testData[0]));
    });

    it('first', async () => {
      assert.deepEqual(await ipfsSet.first((str) => str === testData[2]), testData[2]);
      assert.equal(await ipfsSet.first((str) => str === testData[0]), undefined);
    });

  });

});
