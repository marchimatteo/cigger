class Cigger {
    constructor(xlsxLib) {
        this.xlsx = xlsxLib;
    }

    /**
     * @param {Date} inizio
     * @param {Date} fine
     */
    async getData(inizio, fine) {
        const start = Math.min(inizio.getFullYear(), fine.getFullYear());
        const end = Math.max(inizio.getFullYear(), fine.getFullYear());
        const yearList = Array.from({ length: end - start + 1 }, (_, i) => start + i);

        // Se la data di inizio e fine corrisponde con l'intero anno solare, non applica il filtro,
        // ma lascia che scarichi l'anno intero
        let filtraPerDataPubblicazione = true;
        if (
            inizio.getMonth() === 0
            && inizio.getDate() === 1
            && fine.getMonth() === 11
            && fine.getDate() === 31
        ) {
            filtraPerDataPubblicazione = false;
        }
        console.log(filtraPerDataPubblicazione);

        // Prima ottiene la lista degli appalti
        const appalti = [];
        for (let iYear = 0; iYear < yearList.length; iYear++) {
            const year = yearList[iYear];
            let currentPage = 0;
            let pagineTotali = 1;
            while (currentPage < pagineTotali) {
                const data = await this._fetchAppalti(year, currentPage);
                pagineTotali = data.pagineTotali;

                // Exclude cig outside the user's desired range
                for (const item of data.lista) {
                    const dataPubbAppalto = item?.data_pubblicazione ?? "";
                    if (
                        filtraPerDataPubblicazione
                        && dataPubbAppalto !== ""
                        && !isNaN((new Date(dataPubbAppalto)).valueOf())
                    ) {
                        if (
                            new Date(dataPubbAppalto) < inizio
                            || new Date(dataPubbAppalto) > fine
                        ) {
                            continue;
                        }
                    }

                    appalti.push(item);
                    window.dispatchEvent(new CustomEvent('updateCounterToDownload', {}));
                }

                currentPage++;
                await this._sleep(1000);
            }
        }

        // Poi scarica ogni singolo appalto
        const cigs = [];
        for (let iAppalti = 0; iAppalti < appalti.length; iAppalti++) {
            await this._sleep(1000);

            const cig = {}
            const idAppalto = appalti[iAppalti]._id;

            try {
                const data = await this._fetchAppalto(idAppalto);
                cig.cig = data.scheda?.BANDO?.CIG ?? "";

                const partecipantiSource = data.scheda?.PARTECIPANTI ?? "";
                const partecipantiArray = [];
                const partecipantiCFArray = [];
                if (partecipantiSource !== "") {
                    for (let iPartecipante = 0; iPartecipante < partecipantiSource.length; iPartecipante++) {
                        partecipantiArray.push(partecipantiSource[iPartecipante]?.DENOMINAZIONE ?? "");
                        partecipantiCFArray.push(partecipantiSource[iPartecipante]?.CODICE_FISCALE ?? "");
                    }
                }
                cig.partecipanti = partecipantiArray.join(", ");
                cig.partecipanti_cf = partecipantiCFArray.join(", ");

                const cpvSource = data.scheda?.BANDO?.CPV ?? "";
                const cpvCodArray = [];
                const cpvDescArray = [];
                if (cpvSource !== "") {
                    for (let iCpv = 0; iCpv < cpvSource.length; iCpv++) {
                        cpvCodArray.push(cpvSource[iCpv]?.COD_CPV ?? "");
                        cpvDescArray.push(cpvSource[iCpv]?.DESCRIZIONE_CPV ?? "");
                    }
                }
                cig.cpv = cpvCodArray.join(", ");
                cig.cpv_desc = cpvDescArray.join(", ");

                cig.data_pubblicazione = data.scheda?.PUBBLICAZIONI?.DATA_PUBBLICAZIONE ?? "";
                if (cig.data_pubblicazione !== "") {
                    cig.data_pubblicazione = new Date(cig.data_pubblicazione);
                }
                cig.data_aggiudicazione = data.scheda?.AGGIUDICAZIONE?.[0]?.DATA_AGGIUDICAZIONE_DEFINITIVA ?? "";
                if (cig.data_aggiudicazione !== "") {
                    cig.data_aggiudicazione = new Date(cig.data_aggiudicazione);
                }

                cig.importo_aggiudicazione = data.scheda?.AGGIUDICAZIONE?.[0]?.IMPORTO_AGGIUDICAZIONE ?? "";
                cig.importo_lotto = data.scheda?.BANDO?.IMPORTO_LOTTO ?? "";
                cig.oggetto_lotto = data.scheda?.BANDO?.OGGETTO_LOTTO ?? "";
                cig.oggetto_contratto = data.scheda?.BANDO?.OGGETTO_PRINCIPALE_CONTRATTO ?? "";
                cig.numero_gara = data.scheda?.BANDO?.NUMERO_GARA ?? "";
                cig.scheda = data.referenceExt?.cod_scheda_PCP ?? "";
                cig.incaricato = data.scheda?.INCARICATI?.[0]?.CODICE_FISCALE ?? "";


                cigs.push(cig);
                console.log(cig);
                window.dispatchEvent(new CustomEvent('updateCounterDownloaded', {}));
            } catch (e) {
                console.error(e);
                window.dispatchEvent(new CustomEvent('updateCounterErrored', {
                    detail: { value: idAppalto }
                }));
            }

            /*if (iAppalti > 10) {
                break;
            }*/
        }
        console.log(cigs);
        window.dispatchEvent(new CustomEvent('recuperaCigEnd', {}));
        this._exportToExcel(cigs);
    }

    /**
     * @param {String} cig
     * @return {Promise<String>}
     */
    async getAppaltoLinkFromCIG(cig) {
        const response = await fetch(`https://put.anticorruzione.it/put/appalti/api/v1/appalto/cig/${cig}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();

        if (json.length === 0) {
            throw new Error(`Appalto non trovato per il cig ${cig}`);
        }
        if (!json[0].hasOwnProperty('idAppalto')) {
            throw new Error(`ID appalto non trovato per il cig ${cig}`);
        }

        return `https://put.anticorruzione.it/put/appalti/api/v1/appalto/${json[0].idAppalto}`;
    }

    _exportToExcel (data) {
        // 1. Create a new workbook
        const workbook = this.xlsx.utils.book_new();

        // 2. Convert JSON array to a worksheet
        const worksheet = this.xlsx.utils.json_to_sheet(data);

        // 3. Append the worksheet to the workbook
        this.xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // 4. Export the file
        this.xlsx.writeFile(workbook, 'Export.xlsx');
    };

    /**
     * @param {String} anno
     * @param {Number} page
     */
    async _fetchAppalti(anno, page) {
        try {
            const response = await fetch(`https://put.anticorruzione.it/put/appalti/api/v1/appalti?codiceFiscaleEnte=00124430323&anno=${anno}&page=${page}&size=100&order=-1`);

            // Check if the request was successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Batch of bad news:', error);
        }
    }

    /**
     * @param {String} appalto
     */
    async _fetchAppalto(appalto) {
        try {
            const response = await fetch(`https://put.anticorruzione.it/put/appalti/api/v1/appalto/${appalto}`);

            // Check if the request was successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Batch of bad news:', error);
        }
    }

    async _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export { Cigger };
