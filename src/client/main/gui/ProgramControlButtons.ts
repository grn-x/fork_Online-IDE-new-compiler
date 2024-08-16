import jQuery from 'jquery';

import { SpeedControl } from "./SpeedControl.js";
import { ActionManager } from '../../../compiler/common/interpreter/ActionManager.js';
import { Interpreter } from '../../../compiler/common/interpreter/Interpreter.js';


type ButtonData = {
    actionIdentifier: string,
    title: string,
    iconClass: string,
    $button?: JQuery<HTMLElement>
}

export class ProgramControlButtons {

    speedControl: SpeedControl;


    buttonActiveMatrix: { [buttonName: string]: boolean[] } = {
        "start": [false, false, true, true, true, false],
        "pause": [false, true, false, false, false, false],
        "stop": [false, true, true, false, false, true],
        "stepOver": [false, false, true, true, true, false],
        "stepInto": [false, false, true, true, true, false],
        "stepOut": [false, false, true, false, false, false],
        "restart": [false, true, true, true, true, true],
        "startTests": [false, true, true, true, true, true]
    }

    buttonData: ButtonData[] = [
        { actionIdentifier: "interpreter.start", title: "Start", iconClass: "img_start-dark jo_button" },
        { actionIdentifier: "interpreter.pause", title: "Pause", iconClass: "img_pause-dark jo_button" },
        { actionIdentifier: "interpreter.stop", title: "Stop", iconClass: "img_stop-dark jo_button" },
        { actionIdentifier: "interpreter.stepOver", title: "Step Over", iconClass: "img_step-over-dark jo_button" },
        { actionIdentifier: "interpreter.stepInto", title: "Step Into", iconClass: "img_step-into-dark jo_button" },
        { actionIdentifier: "interpreter.stepOut", title: "Step Out", iconClass: "img_step-out-dark jo_button" },
        { actionIdentifier: "interpreter.restart", title: "Restart", iconClass: "img_restart-dark jo_button" },
        { actionIdentifier: "interpreter.startTests", title: "Alle JUnit-Tests im Workspace ausführen", iconClass: "img_test-start jo_button jo_start-test-button" },
    ]

    constructor($buttonsContainer: JQuery<HTMLElement>, interpreter: Interpreter, actionManager: ActionManager) {


        for (let bd of this.buttonData) {
            let $button = jQuery(`<div title="${bd.title}" class="${bd.iconClass}"></div>`);
            bd.$button = $button;
            $buttonsContainer.append($button);
            actionManager.registerButton(bd.actionIdentifier, $button);
            if (bd.actionIdentifier == 'interpreter.pause') $button.hide();
        }

        this.speedControl = new SpeedControl($buttonsContainer, interpreter);
        this.speedControl.initGUI();

    }

    getButton(actionIdentifier: string): JQuery<HTMLElement>{
        return this.buttonData.find(bd => bd.actionIdentifier == actionIdentifier)?.$button;
    }

}