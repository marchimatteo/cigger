class UI {
    /**
     * @param {Cigger} cigger
     */
    constructor(cigger) {
        this._cigger = cigger;

        /** @type {HTMLFormElement} */
        this._elFormGetCig = document.getElementById('form-get-cig');
        /** @type {HTMLInputElement} */
        this._elInputRangeInizio = document.getElementById('input-range-inizio');
        /** @type {HTMLInputElement} */
        this._elInputRangeFine = document.getElementById('input-range-fine');
        /** @type {HTMLButtonElement} */
        this._elButtonGetCig = document.getElementById('button-get-cig');
        /** @type {HTMLSpanElement} */
        this._elCounterToDownload = document.getElementById('counter-to-download');
        /** @type {HTMLSpanElement} */
        this._elCounterDownloaded = document.getElementById('counter-downloaded');
        /** @type {HTMLSpanElement} */
        this._elCounterErrored = document.getElementById('counter-errored');
        /** @type {HTMLDivElement} */
        this._elProgressBar = document.getElementById('progress-bar');

        this._elFormGetCig.addEventListener('submit', (event) => {
            event.preventDefault();
            this._cigger.getData(
                new Date(this._elInputRangeInizio.value),
                new Date(this._elInputRangeFine.value)
            );
            this._elButtonGetCig.disabled = true;
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
