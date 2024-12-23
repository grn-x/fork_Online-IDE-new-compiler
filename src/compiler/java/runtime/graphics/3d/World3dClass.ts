
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { DOM } from '../../../../../tools/DOM';
import { CallbackParameter } from '../../../../common/interpreter/CallbackParameter';
import { Interpreter } from '../../../../common/interpreter/Interpreter';
import { Thread } from '../../../../common/interpreter/Thread';
import { ThreadState } from "../../../../common/interpreter/ThreadState";
import { JRC } from '../../../language/JavaRuntimeLibraryComments';
import { LibraryDeclarations } from '../../../module/libraries/DeclareType';
import { NonPrimitiveType } from '../../../types/NonPrimitiveType';
import { ObjectClass } from '../../system/javalang/ObjectClassStringClass';
import { ActorManager } from '../ActorManager';
import { ActorType, IActor } from '../IActor';
import { MouseManager } from '../MouseManager';
import { IWorld3d } from './IWorld3d';
import { GraphicSystem } from '../../../../common/interpreter/GraphicsManager';
import { ColorHelper } from '../../../lexer/ColorHelper';
import { ColorClass } from '../ColorClass';
import { NullPointerExceptionClass } from '../../system/javalang/NullPointerExceptionClass';
import { TextureManager3d } from './TextureManager3d';
import type { Object3dClass } from './Object3dClass';
import { CoordinateSystemHelper3d } from './CoordinateSystemHelper3d';
import type { Light3dClass } from './lights/Light3dClass';
import type { Camera3dClass } from './Camera3dClass';
// import { DirectionalLight3dClass } from './lights/DirectionalLight3dClass';
// import { AmbientLight3dClass } from './lights/AmbientLight3dClass';


export class World3dClass extends ObjectClass implements IWorld3d, GraphicSystem {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class World3d" },

        { type: "method", signature: "World3d()", java: World3dClass.prototype._cj$_constructor_$World$ },

        { type: "method", signature: "void setBackgroundColor(int colorAsRGBInt)", native: World3dClass.prototype._setBackgroundColor, comment: JRC.world3dSetBackgroundColorIntComment },
        { type: "method", signature: "void setBackgroundColor(String colorAsString)", native: World3dClass.prototype._setBackgroundColor, comment: JRC.world3dSetBackgroundColorStringComment },
        { type: "method", signature: "void setBackgroundColor(Color colorObject)", native: World3dClass.prototype._setBackgroundColor, comment: JRC.world3dSetBackgroundColorStringComment },

        { type: "method", signature: "void setCursor(string cursor)", native: World3dClass.prototype._setCursor, comment: JRC.world3dSetCursorComment },
        { type: "method", signature: "void clear()", native: World3dClass.prototype._clear, comment: JRC.world3dClearComment },

        { type: "method", signature: "void addMouseListener(MouseListener mouseListener)", template: `§1.mouseListener.addMouseListener(§2);`, comment: JRC.world3dAddMouseListenerComment },

        { type: "method", signature: "Light3d[] getLights()", template: `§1.lights.slice()`, comment: JRC.worldGetLightsComment },
        { type: "method", signature: "void destroyAllLights()", native: World3dClass.prototype._destroyAllLights, comment: JRC.worldDestroyAllLightsComment },

        { type: "method", signature: "void setCurrentCamera(Camera3d camera)", native: World3dClass.prototype._setCurrentCamera },
        { type: "method", signature: "void removeCoordinateAxes()", native: World3dClass.prototype._removeCoordinateAxes },
        { type: "method", signature: "void removeOrbitControls()", native: World3dClass.prototype._removeOrbitControls },


    ]

    static type: NonPrimitiveType;

    width: number = 800;
    height: number = 600;

    graphicsDiv?: HTMLDivElement;
    resizeObserver?: ResizeObserver;

    actorManager!: ActorManager;

    mouseManager!: MouseManager;

    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    currentCamera: Camera3dClass;
    orbitControls: OrbitControls;

    objects: Object3dClass[] = [];
    lights: Light3dClass[] = [];

    textureManager3d: TextureManager3d;

    coordinateSystemHelper: CoordinateSystemHelper3d;

    _cj$_constructor_$World$(t: Thread, callback: CallbackParameter) {

        let interpreter = t.scheduler.interpreter;

        interpreter.eventManager.once("resetRuntime", () => {
            this.destroyWorld(interpreter);
        })

        interpreter.graphicsManager?.registerGraphicSystem(this);

        let existingWorld = <World3dClass>interpreter.retrieveObject("World3dClass");
        if (existingWorld) {
            t.s.push(existingWorld);
            return existingWorld;
        }

        interpreter.storeObject("World3dClass", this);

        this.actorManager = new ActorManager(interpreter);


        let graphicsDivParent = <HTMLDivElement>interpreter.graphicsManager?.graphicsDiv;

        let oldGraphicsDivs = graphicsDivParent.getElementsByClassName('world3d');
        for (let i = 0; i < oldGraphicsDivs.length; i++) {
            oldGraphicsDivs[i].remove();
        }

        this.graphicsDiv = DOM.makeDiv(undefined, 'world3d');
        graphicsDivParent.prepend(this.graphicsDiv);

        let pixiDiv = graphicsDivParent.getElementsByClassName('pixiWorld');
        if (pixiDiv.length > 0) (<HTMLDivElement>pixiDiv[0]).style.pointerEvents = "none";

        this.graphicsDiv.style.overflow = "hidden";
        this.graphicsDiv.innerHTML = "";

        this.scene = new THREE.Scene();
        let cameraThree = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.currentCamera = new t.classes["PerspectiveCamera3d"]();
        this.currentCamera.camera3d = cameraThree;

        this.changeResolution(interpreter, this.width, this.height);
        // size of 1 pixel: see https://discourse.threejs.org/t/solved-how-do-we-size-something-using-screen-pixels/1177

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.graphicsDiv.appendChild(this.renderer.domElement);

        this.renderer.domElement.style.width = "100%";
        this.renderer.domElement.style.height = "100%";

        cameraThree.position.set(2, 2, 2);
        cameraThree.lookAt(new THREE.Vector3(0, 0, 0));

        this.startAnimationLoop(interpreter);
        // this.renderer.setAnimationLoop(animate);

        this.resizeObserver = new ResizeObserver(() => {
            this.changeResolution(interpreter, this.width, this.height);
        });

        this.resizeObserver.observe(this.graphicsDiv!.parentElement!.parentElement!);

        this.orbitControls = new OrbitControls(this.currentCamera.camera3d, this.renderer.domElement);

        const light1 = new t.classes["DirectionalLight3d"]();
        light1.world3d = this;
        light1.light.position.set(10, 5, 3);
        light1.light.intensity = 1.5;
        this.scene.add(light1.light);
        this.lights.push(light1);
        
        const light2 = new t.classes["AmbientLight3d"]();
        light2.world3d = this;
        light2.light.intensity = 0.5;
        this.scene.add(light2.light);
        this.lights.push(light2);

        this.scene.background = new THREE.Color(0, 0, 0);

        // interpreter.isExternalTimer = true;
        this.addCallbacks(interpreter);

        // this.mouseManager = new MouseManager(this);


        this.textureManager3d = new TextureManager3d();

        t.state = ThreadState.waiting;
        this.textureManager3d.init(interpreter).then(() => {
            this.coordinateSystemHelper = new CoordinateSystemHelper3d(this).show();
            t.state = ThreadState.runnable;
            t.s.push(this);
            if (callback) callback();
        })

    }

    startAnimationLoop(interpreter: Interpreter) {
        interpreter.isExternalTimer = true;

        var frameLengthMS = 1000 / 30;//30 fps
        var previousTime = performance.now() - frameLengthMS;

        let render = () => {
            let time = performance.now();
            if (time - previousTime >= frameLengthMS) {
                previousTime = time;
                if(!this.renderer) return;
                this.renderer.render(this.scene, this.currentCamera.camera3d);
                time = performance.now();
                let timeLeft = frameLengthMS - (time - previousTime);
                this.tick(timeLeft * 0.8, interpreter);
            }
            requestAnimationFrame(render);
        }

        render();
    }


    tick(msLeft: number, interpreter: Interpreter) {
        this.actorManager.callActMethods(33);
        interpreter.timerFunction(msLeft);
    }

    addCallbacks(interpreter: Interpreter) {
        let onResetRuntimeCallback = () => {
            interpreter.deleteObject("World3dClass");
            interpreter.eventManager.off(onResetRuntimeCallback);
            interpreter.eventManager.off(onProgramStoppedCallback);
            this.destroyWorld(interpreter);
        }

        let onProgramStoppedCallback = () => {
            this.onProgramStopped();
            interpreter.eventManager.off(onProgramStoppedCallback);
            // this.mouseManager.unregisterListeners();
        }

        interpreter.eventManager.on("resetRuntime", onResetRuntimeCallback)
        interpreter.eventManager.on("stop", onProgramStoppedCallback)

    }

    destroyWorld(interpreter: Interpreter) {
        this.objects.forEach(obj => obj.destroy());
        this.resizeObserver?.disconnect();
        this.renderer.dispose();
        this.renderer = undefined;
        this.graphicsDiv?.remove();
    }

    changeResolution(interpreter: Interpreter, width: number, height: number) {
        this.width = width;
        this.height = height;

        // prevent graphicsDiv from overflowing
        // this.app!.canvas.style.width = "10px";
        // this.app!.canvas.style.height = "10px";

        // this.app?.renderer.resize(width, height, 1);

        let rect = this.graphicsDiv!.parentElement!.parentElement!.getBoundingClientRect();
        if (rect.width == 0 || rect.height == 0) rect = this.graphicsDiv!.parentElement!.getBoundingClientRect();

        let newCanvasWidth: number;
        let newCanvasHeight: number;
        if (width / height > rect.width / rect.height) {
            newCanvasWidth = rect.width;
            newCanvasHeight = rect.width / width * height;
        } else {
            newCanvasHeight = rect.height;
            newCanvasWidth = rect.height / height * width;
        }

        newCanvasHeight = Math.min(newCanvasHeight, rect.height);
        newCanvasWidth = Math.min(newCanvasWidth, rect.width);

        // this.graphicsDiv.style.width = newCanvasWidth + "px";
        // this.graphicsDiv.style.height = newCanvasHeight + "px";

        if (this.currentCamera?.camera3d instanceof THREE.PerspectiveCamera) {
            this.currentCamera.camera3d.aspect = newCanvasWidth / newCanvasHeight;
            this.currentCamera.camera3d.updateProjectionMatrix();
        }

        this.currentCamera.updateViewport();

        this.renderer?.setSize(newCanvasWidth, newCanvasHeight);

        interpreter.graphicsManager?.resizeGraphicsDivHeight();

        // this.app!.canvas.style.width = newCanvasWidth + "px";
        // this.app!.canvas.style.height = newCanvasHeight + "px";

    }

    onProgramStopped() {
        // TODO: Render to bitmap and set bitmap instead of webgl-canvas


    }

    registerActor(actor: IActor, type: ActorType): void {
        this.actorManager.registerActor(actor, type);
    }

    unregisterActor(actor: IActor): void {
        this.actorManager.unregisterActor(actor);
    }

    hasActors(): boolean {
        return this.actorManager.hasActors();
    }


    _setBackgroundColor(color: string | number | ColorClass) {
        // let renderer = (<PIXI.Renderer>(this.app.renderer));
        // if (typeof color == "string") {
        //     let c = ColorHelper.parseColorToOpenGL(color);
        //     if (!c.color) return;
        //     renderer.background.color.setValue(c.color);
        // } else {
        //     renderer.background.color.setValue(color);
        // }
        if (color === null) {
            throw new NullPointerExceptionClass(JRC.world3dColorNull())
        }
        if (typeof color === "number") {
            this.scene.background = new THREE.Color(color);
        }
        if (typeof color === "string") {
            let c = ColorHelper.parseColorToOpenGL(color);
            this.scene.background = new THREE.Color(c.color);
        }
        if (typeof color === "object") {
            this.scene.background = new THREE.Color(color.red, color.green, color.blue);
        }
    }


    _setCursor(cursor: string) {
        this.graphicsDiv.style.cursor = cursor;
    }

    _clear() {
        this.objects.forEach((o) => {
            o.destroy();
        })
        this.scene.clear();
        //TODO: set all Object3d-instances to destroyed
    }

    getIdentifier(): string {
        return "World3d";
    }

    addLight(light: Light3dClass) {
        this.lights.push(light);
        this.scene.add(light.light);
    }

    removeLight(light: Light3dClass) {
        this.scene.remove(light.light);
        let index = this.lights.indexOf(light);
        if (index >= 0) this.lights.splice(index, 1);
    }

    _destroyAllLights() {
        while (this.lights.length > 0) this.scene.remove(this.lights.pop().light)
    }

    _setCurrentCamera(camera: Camera3dClass) {
        this.currentCamera = camera;
    }

    _removeCoordinateAxes() {
        this.coordinateSystemHelper.hide();
    }

    _removeOrbitControls() {
        this.orbitControls.dispose();
    }
}

