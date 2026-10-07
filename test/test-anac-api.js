class TestAnacApi {
    /**
     * @param { AnacApi } anacApi
     */
    constructor(anacApi) {
        this._anacApi = anacApi;
    }

    run() {
        this.testFetch()
            .then(result => { console.log("✔️ Test fetch") })
            .catch((err) => { console.log("❌ Test fetch") });
        return 1;
    }

    async testFetch() {
        this._anacApi.setFetch(async (url) => new Response(JSON.stringify({ id: 1, name: 'Alice' })));
        const result = await this._anacApi.fetchJson("bla", {});
        if (result.name !== "Alice") {
            throw new Error('Should have return Alice');
        }
        //console.assert(result.name === 'Alice', 'Should return Alice');
    }
}

export { TestAnacApi };
