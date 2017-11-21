import DocumentIndex from '../../lib/documents/DocumentIndex';
import Document from '../../lib/documents/Document';
import { EthereumError } from '../../lib/Errors';
import { assertThrowsEventually } from '../test_utils/utils';

var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);


contract('Documents Interface', (accounts) => {
    let testUserAddress = accounts[0];

    let documentIndex = null;    
    const defaultOptions = { from: testUserAddress };
    
    let deployDocumentIndex = async () => {
        documentIndex = await new DocumentIndex().deploy(defaultOptions);
    };

    const testDocumentHash = 0x123456;
    const testDocumentMetadata = { 
        'ambrosus-title' : 'Test document',
        'ambrosus-location' : {
            'type' : 'gdrive',
            'url' : 'https://docs.google.com/document/d/NotADocument123/edit?usp=sharing'
        }
    }

    describe('registering a document', () => {
        let documentUUID, documentAccessToken;

        before(async () => {
            await deployDocumentIndex();
            let document = new Document(testDocumentHash, testDocumentMetadata);
            const { documentUUID, documentAccessToken } = await documentIndex.registerDocument(document);
        });

        it('should retrun a UUID', async () => {
            expect(documentUUID).to.not.be.null;
        });
        
        it('should retrun a access token', async () => {
            expect(documentAccessToken).to.not.be.null;
        });
    });

    describe('retrieving a document', () => {
        const nonExistingDocumentUUID = "ac1cb7cb-1c9b-4816-8960-414f168c2152";
        const counterfeitAccessToken = {};

        beforeEach(deployDocumentIndex);

        it('should fail for a unregistered document', async () => {
            await (documentIndex.retriveDocument(nonExistingDocumentUUID, {})).should.be.rejected;
        });

        describe('for a registered document', () => {
            let documentUUID, documentAccessToken;

            before(async () => {
                await deployDocumentIndex();
                let document = new Document(testDocumentHash, testDocumentMetadata);
                const { documentUUID, documentAccessToken } = await documentIndex.registerDocument(document);
            });

            it('should fail with a invalid access token', async () => {
                await (documentIndex.retriveDocument(documentUUID, counterfeitAccessToken)).should.be.rejected;
            }); 

            describe('with valid access token', () => {
                it('should have matching proofOfContent', async () => {
                    let document = await documentIndex.retriveDocument(documentUUID, documentAccessToken);
                    expect(document.proofOfContent).to.equal(testDocumentHash);
                });
        
                it('should properly decode the metadata', async () => {
                    let document = await documentIndex.retriveDocument(documentUUID, documentAccessToken);
                    expect(document.title()).to.equal(testDocumentMetadata['ambrosus-title']);
                    expect(document.storageLocation()['type']).to.equal(testDocumentMetadata['ambrosus-location']['type']);
                    expect(document.storageLocation()['url']).to.equal(testDocumentMetadata['ambrosus-location']['url']);
                });
            });
        });        
    });
});
