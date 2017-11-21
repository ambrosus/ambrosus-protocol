export default class Document {
    constructor(proofOfContent, metadata) {
        this.proofOfContent = proofOfContent;
        this.metadata = metadata;
    }

    get title() {
        return this.metadata['ambrosus-title'];
    }

    get storageLocation() {
        return this.metadata['ambrosus-storage-location'];
    }
}