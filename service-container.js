import { Cigger } from "./cigger.js";
import { Model } from "./model.js";
import { UI } from "./ui.js";

class ServiceContainer {
    constructor(xlsxLib) {
        this._cigger = null;
        this._model = null;
        this._ui = null;

        this.xlsxLib = xlsxLib;
    }

    clear() {
        this._cigger = null;
        this._model = null;
        this._ui = null;
    }

    /** @returns {Model} */
    getModel() {
        if (!this._model) { this._model = new Model(); }

        return this._model;
    }

    /** @returns {Cigger} */
    getCigger() {
        if (!this._cigger) { this._cigger = new Cigger(this.xlsxLib); }

        return this._cigger;
    }

    /** @returns {UI} */
    getUI() {
        if (!this._ui) { this._ui = new UI(this.getCigger()); }

        return this._ui;
    }
}

export { ServiceContainer }
