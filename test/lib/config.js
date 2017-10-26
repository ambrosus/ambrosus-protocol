import Configuration from '../../lib/conf/Configuration';
import { Web3NotFoundError } from '../../lib/Errors';

contract('Config', (accounts) => {

  describe('Merge config options', () => {
    const DEFAULT_GAS = 4000000;

    it('get default', async () => {
      let options = await Configuration.getTransactionOptions();

      assert.deepEqual(options, { from: accounts[0], gas: DEFAULT_GAS });
    });

    it('overwrite default', async () => {
      let options = await Configuration.getTransactionOptions({from: accounts[1]});
      assert.deepEqual(options, { from: accounts[1], gas: DEFAULT_GAS });

    });

    it('add new option', async () => {
      let options = await Configuration.getTransactionOptions({gasLimit: 100});
      assert.deepEqual(options, { from: accounts[0], gas: DEFAULT_GAS, gasLimit: 100 });
    });

  });

  describe('Failing when no web3', () => {

    let oldWeb3;

    before(() => {
      oldWeb3 = web3;
    });

    it('no web3 when creating contract', async () => {
      web3 = undefined;
      Configuration._web3 = undefined;
      assert.throws(()=>Configuration.web3, Web3NotFoundError);
    });

    after(() => {
      web3 = oldWeb3;
    });

  });

});