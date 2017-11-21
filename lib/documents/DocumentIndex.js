import Ambrosus from '../Ambrosus';
import { EthereumError, NotImplementedError } from '../Errors';
import Configuration from '../conf/Configuration';

const DocumentIndexJson = require('../../build/contracts/DocumentIndex.json');

export default class DocumentIndex extends Ambrosus {
    constructor() {
        super();
        this.contract = new this.web3.eth.Contract(DocumentIndexJson.abi);
    }

    async deploy(options = {}) {
        return this.contract
            .deploy({
                data: DocumentIndexJson.bytecode
            })
            .send(await Configuration.getTransactionOptions(options))
            .then(contract => {
                this.contract = contract;
                return this;
            })
            .catch(e => {
                throw new EthereumError(e);
            });
    }

    registerDocument(document) {
        return new Promise((resolve, reject) => {
            resolve("abc", "123");
        });
    }

    retriveDocument(address, accessToken) {
        return new Promise((resolve, reject) => {
            resolve(new Document(
                0xFFFFFF,
                {
                    'ambrosus-title': 'Don\'t care',
                    'ambrosus-location': {
                        'type': 'gdrive',
                        'url': 'https://blabla.com'
                    }
                }));
        });
    }
}