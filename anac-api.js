class AnacApi {
    /**
      * @param {Window['fetch']} customFetch
     */
    constructor(customFetch) {
        this._customFetch = customFetch;

        this._baseUrl = 'https://put.anticorruzione.it/put/appalti/api/v1/';
    }

    /** @param {Window['fetch']} anotherFetch */
    setFetch(anotherFetch) {
        this._customFetch = anotherFetch;
    }

    /**
     * @param {string} url
     * @param {Object} params
     * @return {Promise<any>}
     * @throws {TypeError} If a network error occurs, the request fails to execute, or the URL is invalid (thrown by fetch).
     * @throws {Error} If the server responds with an HTTP error status code (e.g., 404, 500).
     */
    async fetchJson(url, params) {
        const response = await this._customFetch(url, params);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
}

export { AnacApi };
