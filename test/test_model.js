class TestModel {
    /**
     * @param {Model} model
     */
    constructor(model) {
        this._model = model;
    }

    run() {
        this.testApiV1ListaAppaltiSingolo();
        this.testApiV1ListaAppaltiRoot();

        return 1;
    }

    testApiV1ListaAppaltiRoot() {
        const appaltiListaGood = this._model.makeApiV1ListaAppaltiRoot({
            "elementiTotali": 795,
            "pagineTotali": 1,
            "lista": [
                {
                    "_id": "6ab3bc75a48a7e8497e4d02f",
                    "cig": "BD1469EDDA",
                    "data_pubblicazione": "2026-09-24",
                    "categorie": [
                        {
                            "COD_TIPO_CATEGORIA": "P",
                            "DESCRIZIONE": "FORNITURA DI SERVIZI",
                            "DESCRIZIONE_TIPO_CATEGORIA": "PREVALENTE",
                            "ID_CATEGORIA": "FS"
                        }
                    ],
                    "oggetto": "NOLEGGIO PER 6 MESI DI DUE INCUBATORI DA BANCO CO2 E O2 PER LA SCR FISIOPATOLOGIA DELLA RIPRODUZIONE E PMA DELL'IRCCS BURLO GAROFOLO",
                    "aggiudicazione": [
                        {
                            "ASTA_ELETTRONICA": 0,
                            "COD_ESITO": 1,
                            "DATA_AGGIUDICAZIONE_DEFINITIVA": "2026-09-23",
                            "DATA_COMUNICAZIONE_ESITO": "2026-09-23",
                            "ESITO": "AGGIUDICATA",
                            "FLAG_PROC_ACCELERATA": 0,
                            "FLAG_SCOMPUTO": 0,
                            "ID_AGGIUDICAZIONE": -25157804,
                            "IMPORTO_AGGIUDICAZIONE": 29497.98,
                            "RIBASSO_AGGIUDICAZIONE": 0
                        }
                    ],
                    "collaudo": [],
                    "fine_contratto": [],
                    "avvio_contratto": [],
                    "subappalti": [],
                    "stati_avanzamento": [],
                    "sospensioni": [],
                    "varianti": [],
                    "cod_tipo_scelta_contraente": 24,
                    "importo": 29497.98
                }
            ],
        });
        const appaltiListaEmpty = this._model.makeApiV1ListaAppaltiRoot({})

        const testAppaltoRootResult = " Test appalti lista root";
        if (
            appaltiListaGood.getElementiTotali() === 795
            && appaltiListaGood.getPagineTotali() === 1
            && appaltiListaGood.getLista().length === 1
            && appaltiListaGood.getLista()[0].getID() === "6ab3bc75a48a7e8497e4d02f"
            && appaltiListaEmpty.getElementiTotali() === null
            && appaltiListaEmpty.getPagineTotali() === null
            && appaltiListaEmpty.getLista().length === 0
        ) {
            console.log("✔️" + testAppaltoRootResult);
        } else {
            console.log("❌" + testAppaltoRootResult);
        }
    }

    testApiV1ListaAppaltiSingolo() {
        const appaltoSingoloBad = this._model.makeApiV1ListaAppaltiSingolo({});
        const appaltoSingoloGood = this._model.makeApiV1ListaAppaltiSingolo({
            "_id": "6aad40baa48a7e8497e28e0c",
            "cig": "BD085C9C91",
            "data_pubblicazione": "2026-09-01",
            "categorie": [
                {
                    "COD_TIPO_CATEGORIA": "P",
                    "DESCRIZIONE": "OO.CC. - Categoria non definita",
                    "DESCRIZIONE_TIPO_CATEGORIA": "PREVALENTE",
                    "ID_CATEGORIA": "999"
                }
            ],
            "oggetto": "FORNITURA 20 DOCKING STATION LENOVO",
            "aggiudicazione": [
                {
                    "ASTA_ELETTRONICA": 0,
                    "COD_ESITO": 1,
                    "DATA_COMUNICAZIONE_ESITO": "2026-09-18",
                    "ESITO": "AGGIUDICATA",
                    "FLAG_PROC_ACCELERATA": 0,
                    "FLAG_SCOMPUTO": 0,
                    "ID_AGGIUDICAZIONE": 25097978,
                    "IMPORTO_AGGIUDICAZIONE": 2277,
                    "RIBASSO_AGGIUDICAZIONE": 0
                }
            ],
            "collaudo": [],
            "fine_contratto": [],
            "avvio_contratto": [],
            "subappalti": [],
            "stati_avanzamento": [],
            "sospensioni": [],
            "varianti": [],
            "cod_tipo_scelta_contraente": 0,
            "importo": 2277
        });

        const testAppaltoResult = " Test appalto singolo";
        if (
            appaltoSingoloGood.getID() === "6aad40baa48a7e8497e28e0c" && appaltoSingoloBad.getID() === null
            && appaltoSingoloGood.getCIG() === "BD085C9C91" && appaltoSingoloBad.getCIG() === null
            &&
                appaltoSingoloGood.getDataPubblicazione() instanceof Date
                && !isNaN(appaltoSingoloGood.getDataPubblicazione())
                && appaltoSingoloGood.getDataPubblicazione().getDate() === 1
                && appaltoSingoloBad.getDataPubblicazione() === null
            && appaltoSingoloGood.getCategorie().length === 1 && appaltoSingoloBad.getCategorie() === null
            && appaltoSingoloGood.getOggetto() === "FORNITURA 20 DOCKING STATION LENOVO" && appaltoSingoloBad.getOggetto() === null
            && appaltoSingoloGood.getAggiudicazione().length === 1 && appaltoSingoloBad.getAggiudicazione() === null
            && appaltoSingoloGood.getCollaudo().length === 0 && appaltoSingoloBad.getCollaudo() === null
            && appaltoSingoloGood.getFineContratto().length === 0 && appaltoSingoloBad.getFineContratto() === null
            && appaltoSingoloGood.getAvvioContratto().length === 0 && appaltoSingoloBad.getAvvioContratto() === null
            && appaltoSingoloGood.getSubappalti().length === 0 && appaltoSingoloBad.getSubappalti() === null
            && appaltoSingoloGood.getStatiAvanzamento().length === 0 && appaltoSingoloBad.getStatiAvanzamento() === null
            && appaltoSingoloGood.getSospensioni().length === 0 && appaltoSingoloBad.getSospensioni() === null
            && appaltoSingoloGood.getVarianti().length === 0 && appaltoSingoloBad.getVarianti() === null
            && appaltoSingoloGood.getCodTipoSceltaContraente() === 0 && appaltoSingoloBad.getCodTipoSceltaContraente() === null
            && appaltoSingoloGood.getImporto() === 2277 && appaltoSingoloBad.getImporto() === null
        ) {
            console.log("✔️" + testAppaltoResult);
        } else {
            console.log("❌" + testAppaltoResult);
        }
    }
}

export { TestModel };
