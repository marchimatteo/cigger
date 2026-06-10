class UI {
    /**
     * @param {Cigger} cigger
     */
    constructor(cigger) {
        this._cigger = cigger;

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
         * EVENTS RELATED TO SCARICA CIG
         */
        this._elFormGetCig.addEventListener('submit', (event) => {
            event.preventDefault();
            this._cigger.getData(
                new Date(this._elInputRangeInizio.value),
                new Date(this._elInputRangeFine.value)
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
}

export { UI };
