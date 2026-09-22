class UI {
    /**
     * @param {Cigger} cigger
     */
    constructor(cigger) {
        this._cigger = cigger;
        this._stazioneAppaltanteInputForm = new StazioneAppaltanteInputForm(this);

        /** @type {HTMLFormElement} */
        this._elFormSeeCig = document.getElementById('form-see-cig');
        /** @type {HTMLInputElement} */
        this._elInputCigToSee = document.getElementById('input-cig-to-see');
        /** @type {HTMLButtonElement} */
        this._elButtonSeeCigPut = document.getElementById('button-see-cig-put');
        /** @type {HTMLButtonElement} */
        this._elButtonSeeCigBdncp = document.getElementById('button-see-cig-bdncp');
        /** @type {HTMLSpanElement} */
        this._elButtonSeeCigPutSpinner = document.getElementById('button-see-cig-put-spinner');

        /** @type {HTMLFormElement} */
        this._elFormGetCig = document.getElementById('form-get-cig');
        /** @type {HTMLDivElement} */
        this._elRowInputStazioneToAdd = document.getElementById('row-input-stazione-to-add');
        /** @type {HTMLButtonElement} */
        this._elButtonAddStazione = document.getElementById('button-add-stazione');
        /** @type {HTMLInputElement} */
        this._elInputStazioneToAdd = document.getElementById('input-stazione-to-add');
        /** @type {() => NodeListOf<HTMLInputElement>} */
        this._getElsInputStazioni = () => document.querySelectorAll('input.stazioni-appaltanti');
        /** @type {HTMLInputElement} */
        this._elInputRangeInizio = document.getElementById('input-range-inizio');
        /** @type {HTMLInputElement} */
        this._elInputRangeFine = document.getElementById('input-range-fine');
        /** @type {HTMLButtonElement} */
        this._elButtonGetCig = document.getElementById('button-get-cig');
        /** @type {HTMLSpanElement} */
        this._elButtonGetCigSpinner = document.getElementById('button-get-cig-spinner');
        /** @type {HTMLSpanElement} */
        this._elCounterToDownload = document.getElementById('counter-to-download');
        /** @type {HTMLSpanElement} */
        this._elCounterDownloaded = document.getElementById('counter-downloaded');
        /** @type {HTMLSpanElement} */
        this._elCounterErrored = document.getElementById('counter-errored');
        /** @type {HTMLDivElement} */
        this._elProgressBar = document.getElementById('progress-bar');

        // Add by default at least Burlo
        if (this._stazioneAppaltanteInputForm.isEmpty()) {
            this._stazioneAppaltanteInputForm.createRow('00124430323');
        }

        /**
         * EVENTS RELATED TO VISUALIZZA CIG
         */
        this._elFormSeeCig.addEventListener('submit', (event) => {
            event.preventDefault();
            this._elInputCigToSee.value = this._elInputCigToSee.value.toUpperCase();

            switch (event.submitter.id) {
                case this._elButtonSeeCigPut.id:
                    this._elButtonSeeCigPutSpinner.hidden = false;
                    this._cigger.getAppaltoLinkFromCIG(this._elInputCigToSee.value)
                        .then(link => window.open(link, '_blank', 'noreferrer'))
                        .catch(error => alert(`Errore: ${error}`))
                        .finally(() => this._elButtonSeeCigPutSpinner.hidden = true );
                    break;
                case this._elButtonSeeCigBdncp.id:
                    window.open(`https://dettaglio-cig.anticorruzione.it/cig/${this._elInputCigToSee.value}`, '_blank', 'noreferrer');
                    break;
                default:
                    alert('Errore, pulsante di visualizza CIG non identificato');
            }
        });

        /**
         * EVENTS RELATED TO ADD STAZIONE APPALTANTE
         */
        this._elInputStazioneToAdd.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this._elButtonAddStazione.click();
            }
        })
        this._elButtonAddStazione.addEventListener('click', (event) => {
            const value = this._elInputStazioneToAdd.value;
            if (value.length < 2) {
                alert('Codice fiscale troppo corto, non imbrogliare');

                return;
            }

            this._stazioneAppaltanteInputForm.createRow(value);
        });

        /**
         * EVENTS RELATED TO SCARICA CIG
         */
        this._elFormGetCig.addEventListener('submit', (event) => {
            event.preventDefault();
            const stazioni = this._stazioneAppaltanteInputForm.getCFs();
            if (stazioni.length < 1) {
                alert('Inserire almeno una stazione appaltante');

                return;
            }

            this._cigger.getData(
                new Date(this._elInputRangeInizio.value),
                new Date(this._elInputRangeFine.value),
                stazioni,
            );
            this._elButtonGetCig.disabled = true;
            this._elButtonGetCigSpinner.hidden = false;
        });
        window.addEventListener('updateCounterToDownload', () => {
            this._elCounterToDownload.innerText = `${Number(this._elCounterToDownload.innerText) + 1}`;
        });
        window.addEventListener('updateCounterDownloaded', () => {
            this._elCounterDownloaded.innerText = `${Number(this._elCounterDownloaded.innerText) + 1}`;
            this._updateProgressBar();
        });
        window.addEventListener('updateCounterErrored', () => {
            this._elCounterErrored.innerText = `${Number(this._elCounterErrored.innerText) + 1}`;
            this._updateProgressBar();
        });
        window.addEventListener('recuperaCigEnd', () => {
            this._elButtonGetCigSpinner.hidden = true;
        })
    }

    _setProgressBar(value) {
        this._elProgressBar.style.width = `${value}%`;
    }

    _updateProgressBar() {
        const total = Number(this._elCounterToDownload.innerText);
        const done = Number(this._elCounterDownloaded.innerText) + Number(this._elCounterErrored.innerText);

        this._setProgressBar(Math.floor(done*100/total));
    }

    /**
     * @param text
     */
    showAlert(text) {
        alert(text);
    }

    /**
     * @return {HTMLDivElement}
     */
    getRowInputStazioneToAdd() {
        return this._elRowInputStazioneToAdd;
    }

    cleanInputStazioneToAdd() {
        this._elInputStazioneToAdd.value = '';
    }

    /**
     * @return {string[]}
     */
    getStazioniCF() {
        return this._stazioneAppaltanteInputForm.getCFs();
    }
}

class StazioneAppaltanteInputForm {
    /**
     * @param ui {UI}
     */
    constructor(ui) {
        this._ui = ui;
        this._els = {}
    }

    /**
     * @return {boolean}
     */
    isEmpty() {
        return Object.keys(this._els).length === 0;
    }

    /**
     * @return {string[]}
     */
    getCFs() {
        return Object.keys(this._els);
    }

    /**
     *
     * @param cf {string}
     */
    createRow(cf) {
        if (cf in this._els) {
            alert('Codice fiscale già presente');

            return;
        }

        const newRow = document.createElement('div');
        newRow.className = "row mb-2";

        newRow.innerHTML = `
            <div class="input-group">
                <button class="btn btn-danger" type="button" id="button-remove-stazione-${cf}">Elimina</button>
                <input
                    type="text"
                    id="input-stazione-${cf}"
                    class="form-control stazioni-appaltanti"
                    data-cf="${cf}"
                    placeholder=""
                    value="${cf}"
                    aria-label="Stazioni appaltanti"
                    disabled
                >
            </div>
        `;

        newRow.querySelector(`button#button-remove-stazione-${cf}`).addEventListener('click', (event) => {
            this.removeRow(cf);
        })

        this._els[cf] = newRow;
        this._ui.getRowInputStazioneToAdd().before(newRow);
        this._ui.cleanInputStazioneToAdd();
    }

    removeRow(cf) {
        this._els[cf].remove();
        delete this._els[cf];
    }
}

export { UI };
