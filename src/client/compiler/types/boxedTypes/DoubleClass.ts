import { Klass, Visibility } from "../Class.js";
import { Method, Parameterlist, Attribute, Value, Type, PrimitiveType } from "../Types.js";
import { intPrimitiveType, stringPrimitiveType, floatPrimitiveType, doublePrimitiveType, booleanPrimitiveType } from "../PrimitiveTypes.js";
import { RuntimeObject } from "../../../interpreter/RuntimeObject.js";


export class DoubleClass extends Klass {

    unboxableAs = [];

    constructor(baseClass: Klass) {
        super("Double", null, "Wrapper-Klasse, um double-Werte in Collections verenden zu können.");
        this.baseClass = baseClass;

        this.addAttribute(new Attribute("MAX_VALUE", doublePrimitiveType, (value) => { value.value = Number.MAX_VALUE }, true, Visibility.public, true, "Der größte Wert, den eine Variable vom Typ double annehmen kann"));
        this.addAttribute(new Attribute("MIN_VALUE", doublePrimitiveType, (value) => { value.value = Number.MIN_VALUE }, true, Visibility.public, true, "Der kleinste Wert, den eine Variable vom Typ double annehmen kann"));
        this.addAttribute(new Attribute("NaN_VALUE", doublePrimitiveType, (value) => { value.value = Number.NaN }, true, Visibility.public, true, "Der \"Not a Number\"-Wert vom Typ double"));
        this.addAttribute(new Attribute("NEGATIVE_INFINITY", doublePrimitiveType, (value) => { value.value = Number.NEGATIVE_INFINITY }, true, Visibility.public, true, "Der \"negative infinity\"-Wert vom Typ double"));
        this.addAttribute(new Attribute("POSITIVE_INFINITY", doublePrimitiveType, (value) => { value.value = Number.POSITIVE_INFINITY }, true, Visibility.public, true, "Der \"positive infinity\"-Wert vom Typ double"));
        this.staticClass.setupAttributeIndicesRecursive();

        this.staticClass.classObject = new RuntimeObject(this.staticClass);

    }

    canCastTo(type: Type): boolean {
        return this.unboxableAs.indexOf(type) >= 0 || super.canCastTo(type);
    }

    init() {

        this.unboxableAs = [doublePrimitiveType];

        this.addMethod(new Method("Double", new Parameterlist([
            { identifier: "double-value", type: doublePrimitiveType, declaration: null, usagePositions: null, isFinal: true }
        ]), null,
            (parameters) => {

                parameters[0].value = parameters[1].value;

            }, false, false, "Instanziert ein neues Double-Objekt", true));

        this.addMethod(new Method("Double", new Parameterlist([
            { identifier: "int-value", type: intPrimitiveType, declaration: null, usagePositions: null, isFinal: true }
        ]), null,
            (parameters) => {

                parameters[0].value = parameters[1].value;

            }, false, false, "Instanziert ein neues Double-Objekt", true));

        this.addMethod(new Method("Double", new Parameterlist([
            { identifier: "text", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: true }
        ]), null,
            (parameters) => {

                parameters[0].value = Number.parseFloat(parameters[1].value);

            }, false, false, "Instanziert ein neues Double-Objekt, indem die übergebene Zeichenkette in einen double-Wert umgewandelt wird.", true));


        this.addMethod(new Method("doubleValue", new Parameterlist([]), doublePrimitiveType,
            (parameters) => { return parameters[0].value; }, false, false, "Wandelt das Double-Objekt in einen double-Wert um."));
        this.addMethod(new Method("floatValue", new Parameterlist([]), floatPrimitiveType,
            (parameters) => { return parameters[0].value; }, false, false, "Wandelt das Double-Objekt in einen float-Wert um."));
        this.addMethod(new Method("intValue", new Parameterlist([]), intPrimitiveType,
            (parameters) => { return Math.trunc(parameters[0].value); }, false, false, "Wandelt das Double-Objekt durch Abrunden in einen int-Wert um."));

        this.addMethod(new Method("compareTo", new Parameterlist([
            { identifier: "anotherDouble", type: this, declaration: null, usagePositions: null, isFinal: true }
        ]), intPrimitiveType,
            (parameters) => {
                let v0 = parameters[0].value;
                let v1 = parameters[1].value;
                if (v0 > v1) return 1;
                if (v0 < v1) return -1;
                return 0;
            }, false, false, "Ist der Wert größer als der übergebene Wert, so wird +1 zurückgegeben. Ist er kleiner, so wird -1 zurückgegeben. Sind die Werte gleich, so wird 0 zurückgegeben."));

        this.addMethod(new Method("equals", new Parameterlist([
            { identifier: "anotherDouble", type: this, declaration: null, usagePositions: null, isFinal: true }
        ]), booleanPrimitiveType,
            (parameters) => {
                return parameters[0].value == parameters[1].value;
            }, false, false, "Gibt genau dann true zurück, wenn der Wert gleich dem übergebenen Wert ist."));

        this.addMethod(new Method("toString", new Parameterlist([
        ]), stringPrimitiveType,
            (parameters) => {
                return "" + parameters[0].value;
            }, false, false, "Gibt den Wert des Objekts als String-Wert zurück."));

        this.addMethod(new Method("hashCode", new Parameterlist([
        ]), intPrimitiveType,
            (parameters) => {
                return Math.trunc(parameters[0].value);
            }, false, false, "Gibt den hashCode des Objekts zurück."));

        this.addMethod(new Method("parseDouble", new Parameterlist([
            { identifier: "s", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: true }
        ]), doublePrimitiveType,
            (parameters) => {
                return Number.parseFloat(parameters[1].value);
            }, false, true, "Wandelt die Zeichenkette in einen double-Wert um"));

        this.addMethod(new Method("toString", new Parameterlist([
            { identifier: "f", type: doublePrimitiveType, declaration: null, usagePositions: null, isFinal: true }
        ]), stringPrimitiveType,
            (parameters) => {
                return "" + parameters[1].value;
            }, false, true, "Gibt die übergebene Zahl als String-Wert zurück."));

        this.addMethod(new Method("valueOf", new Parameterlist([
            { identifier: "f", type: doublePrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), this,
            (parameters) => {
                return parameters[1].value;
            }, false, true, "Gibt die übergebene Zahl als Double-Objekt zurück."));

        this.addMethod(new Method("valueOf", new Parameterlist([
            { identifier: "s", type: stringPrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), this,
            (parameters) => {
                return Number.parseFloat(parameters[1].value);
            }, false, true, "Interpretiert die übergebene Zeichenkette als Dezimalzahl und gib sie als Double-Objekt zurück."));

        this.addMethod(new Method("isNaN", new Parameterlist([
            { identifier: "f", type: doublePrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), booleanPrimitiveType,
            (parameters) => {
                return Number.isNaN(parameters[1].value)
            }, false, true, "Gibt genau dann true zurück, falls die übergebene double-Zahl NaN (not a Number) ist."));

        this.addMethod(new Method("isNaN", new Parameterlist([
        ]), booleanPrimitiveType,
            (parameters) => {
                return Number.isNaN(parameters[0].value)
            }, false, false, "Gibt genau dann true zurück, falls das Objekt NaN (not a Number) ist."));

        this.addMethod(new Method("isInfinite", new Parameterlist([
            { identifier: "f", type: doublePrimitiveType, declaration: null, usagePositions: null, isFinal: true },
        ]), booleanPrimitiveType,
            (parameters) => {
                return parameters[1].value == Infinity;
            }, false, true, "Gibt genau dann true zurück, falls die übergebene double-Zahl INFINTITY ist."));

        this.addMethod(new Method("isInfinite", new Parameterlist([
        ]), booleanPrimitiveType,
            (parameters) => {
                return parameters[0].value == Infinity;
            }, false, false, "Gibt genau dann true zurück, falls das Objekt INFINITY ist."));

    }

    public debugOutput(value: Value): string {
        return "" + <number>value.value;
    }


}
