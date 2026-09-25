class Model {
    constructor() {
    }

    /**
     * @param json
     * @returns {ApiV1ListaAppaltiRoot}
     */
    makeApiV1ListaAppaltiRoot(json) {
        return new ApiV1ListaAppaltiRoot(json);
    }

    /**
     * @param json
     * @returns {ApiV1ListaAppaltiSingolo}
     */
    makeApiV1ListaAppaltiSingolo(json) {
        return new ApiV1ListaAppaltiSingolo(json);
    }
}

class ApiV1ListaAppaltiRoot {
    constructor(json) {
        this._json = json;
        this._model = new Model();
    }

    /** @returns {number|null} */
    getElementiTotali() {
        return this._json?.elementiTotali ?? null;
    }

    /** @returns {number|null} */
    getPagineTotali() {
        return this._json?.pagineTotali ?? null;
    }

    /** @returns {ApiV1ListaAppaltiSingolo[]|null} */
    getLista() {
        const lista = this._json?.lista ?? null;
        const listaObjs = [];
        if (Array.isArray(lista)) {
            lista.forEach((el) => { listaObjs.push(this._model.makeApiV1ListaAppaltiSingolo(el)); });
        }

        return listaObjs;
    }
}

class ApiV1ListaAppaltiSingolo {
    constructor(json) {
        this._json = json;
    }

    /** @returns {string|null} */
    getID() {
        return this._json?._id ?? null;
    }

    /** @returns {string|null} */
    getCIG() {
        return this._json?.cig ?? null;
    }

    /** @returns {Date|null} */
    getDataPubblicazione() {
        return this._json?.data_pubblicazione ? new Date(this._json.data_pubblicazione) : null;
    }

    /** @returns {[{Object}]|null} */
    getCategorie() {
        return this._json?.categorie ?? null;
    }

    /** @returns {string|null} */
    getOggetto() {
        return this._json?.oggetto ?? null;
    }

    /** @returns {[{Object}]|null}*/
    getAggiudicazione() {
        return this._json?.aggiudicazione ?? null;
    }

    /** @returns {[{Object}]|null}*/
    getCollaudo() {
        return this._json?.collaudo ?? null;
    }

    /** @returns {[{Object}]|null}*/
    getFineContratto() {
        return this._json?.fine_contratto ?? null;
    }

    /** @returns {[{Object}]|null}*/
    getAvvioContratto() {
        return this._json?.avvio_contratto ?? null;
    }

    /** @returns {[{Object}]|null}*/
    getSubappalti() {
        return this._json?.subappalti ?? null;
    }

    /** @returns {[{Object}]|null}*/
    getStatiAvanzamento() {
        return this._json?.stati_avanzamento ?? null;
    }

    /** @returns {[{Object}]|null}*/
    getSospensioni() {
        return this._json?.sospensioni ?? null;
    }

    /** @returns {[{Object}]|null}*/
    getVarianti() {
        return this._json?.varianti ?? null;
    }

    /** @returns {number|null} */
    getCodTipoSceltaContraente() {
        return this._json?.cod_tipo_scelta_contraente ?? null;
    }

    /** @returns {number|null} */
    getImporto() {
        return this._json?.importo ?? null;
    }
}

export { Model };
