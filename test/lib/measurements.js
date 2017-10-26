import Measurements from '../../lib/Measurements';
import * as Errors from '../../lib/Errors';


contract('Measurements Interface', (accounts) => {

  let measurements;
  let ownerAddress = accounts[0];
  let deviceAddresses = [accounts[3], accounts[4]];
  let defaultOptions = { from: ownerAddress };
  //IPFS client instance
  let ipfs;

  let deploy = async () => {
    await new Measurements(ipfs).deploy(defaultOptions);
  };

  describe('Creating', () => {

  });

  xdescribe('Reporting', () => {

    before(async () => {
      await deploy();
    });

    it('report new measurement', async () => {

    });

  });

  describe('Retreiving', () => {

  });

  xdescribe('Merging', () => {

  });

  xdescribe('Splitting', () => {

  });



});