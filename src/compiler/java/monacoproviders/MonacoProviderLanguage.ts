import { lm } from "../../../tools/language/LanguageManager";

export class MonacoProviderLanguage {

    static accessToFieldOrMethodOfThisClass = () => lm({
    "de": "Zugriff auf Attribut oder Methode dieser Klasse",
    "en": `Acces to a field or a method of this class`,
    })

    static useSuperToCallBaseClassMethod = () => lm({
    "de": `Benutze das Schlüsselwort 'super' um eine Methode der Oberklasse aufzurufen.`,
    "en": `Use keyword 'super' to call a base class method.`,
    })

    static definitionOfClass = (identifier: string) => lm({
    "de": `Definition der Klasse ${identifier}`,
    "en": `definition of class ${identifier}`,
    })

    static numberOfElementsInThisArray = () => lm({
    "de": `Anzahl der Elemente in diesem Array`,
    "en": `number of elements in this array`,
    })

    static countingForLoop = () => lm({
    "de": `Zählende for-loop`,
    "en": `counting for-loop`,
    })

    static switchStatement = () => lm({
    "de": `switch-Anweisung`,
    "en": `switch statement`,
    })

    static ifClause = () => lm({
    "de": `Bedingung (if-clause)`,
    "en": `if clause`,
    })

    static doubleSidedIfClause = () => lm({
    "de": `Zweiseitige Bedingung (if-else-clause)`,
    "en": `if-else clause`,
    })

    static printStatement = () => lm({
    "de": "Ausgabe (ggf. mit Farbe \nals zweitem Parameter)",
    "en": `print statement (with color as optional second parameter)`,
    })

    static printlnStatement = () => lm({
    "de": "Ausgabe (ggf. mit Farbe \nals zweitem Parameter) gefolgt von einem Zeilenumbruch",
    "en": `print statement (with color as optional second parameter) followed by line break`,
    })

    static identifier = () => lm({
    "de": `Bezeichner`,
    "en": `identifier`,
    })

    static classDefinition = () => lm({
    "de": `Definition einer Klasse`,
    "en": `class definition`,
    })

    static parameter = () => lm({
    "de": `Parameter`,
    "en": `parameter`,
    })

    static methodDefinition = () => lm({
    "de": `Definition einer Methode`,
    "en": `method definition`,
    })

    //(m.isAbstract ? "Implementiere " : "Überschreibe ") + "die Methode " + label + " der Basisklasse."
    static implementOverrideMethod = (isAbstract: boolean, methodIdentifier: string) => lm({
    "de": (isAbstract ? "Implementiere " : "Überschreibe ") + `die Methode ${methodIdentifier} der Oberklasse.`,
    "en": (isAbstract ? "implement " : "override ") + `method ${methodIdentifier} of base class.`,
    })

    

}