class StorageManager {
    constructor(localforage) {
        this._lf = localforage;
        this._storeEnti = this._lf.createInstance({
            name: 'dbEnti',
            storeName: 'tbEnti',
            description: 'Lista degli enti da monitorare',
        });
    }

    addEnte() {

    }

    removeEnte() {

    }
}

export { StorageManager };
