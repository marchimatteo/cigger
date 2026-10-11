import { Cigger } from "./cigger.js";
import { Model } from "./model.js";
import { StorageManager} from "./storage-manager.js";
import { UI } from "./ui.js";

class ServiceContainer {
    constructor(xlsxLib, localforageLib) {
        this._cigger = null;
        this._model = null;
        this._storageManager = null;
        this._ui = null;

        this._xlsxLib = xlsxLib;
        this._localforageLib = localforageLib;
    }

    clear() {
        this._cigger = null;
        this._model = null;
        this._storageManager = null;
        this._ui = null;
    }

    /** @returns {Cigger} */
    getCigger() {
        if (!this._cigger) { this._cigger = new Cigger(this._xlsxLib, this.getStorageManager()); }

        return this._cigger;
    }

    /** @returns {Model} */
    getModel() {
        if (!this._model) { this._model = new Model(); }

        return this._model;
    }

    /**
     * @return {StorageManager}
     */
    getStorageManager() {
        if (!this._storageManager) { this._storageManager = new StorageManager(this._localforageLib); }

        return this._storageManager;
    }

    /** @returns {UI} */
    getUI() {
        if (!this._ui) { this._ui = new UI(this.getCigger()); }

        return this._ui;
    }
}

export { ServiceContainer }
