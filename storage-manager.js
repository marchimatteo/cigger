class StorageManager {
    constructor(localforage) {
        this._lf = localforage;

        const dbName = "cigger";
        this._tableWebCache = this._lf.createInstance({
            name: dbName,
            storeName: 'tableWebCache',
            description: 'table to cache manually http calls',
        });
    }

    /**
     * @param {string} url
     * @param json
     * @throws Error
     */
    async setWebCacheItem(url, json) {
        return this._tableWebCache.setItem(url, json);
    }

    /**
     * @param {string} url
     * @return {Promise<*>} If the key does not exist, getItem() will return null
     */
    async getWebCacheItem(url) {
        return this._tableWebCache.getItem(url);
    }
}

export { StorageManager };
