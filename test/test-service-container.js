import { Cigger } from "../cigger.js";
import { Model } from "../model.js";
import { UI } from "../ui.js";

class TestServiceContainer {
    /**
     * @param {ServiceContainer} container
     */
    constructor(container) {
        this._container = container;
    }

    run() {
        this.testServiceCreation();
        return 1;
    }

    testServiceCreation() {
        const testServiceCreationResult = " Test service creation";
        try {
            this._container.clear();
            if (!(this._container.getModel() instanceof Model)) {
                throw new Error();
            }

            this._container.clear();
            if (!(this._container.getCigger() instanceof Cigger)) {
                throw new Error();
            }

            this._container.clear();
            if (!(this._container.getUI() instanceof UI)) {
                throw new Error();
            }

            console.log("✔️" + testServiceCreationResult);
        } catch {
            console.log("❌" + testServiceCreationResult);
        }
    }
}

export { TestServiceContainer };
