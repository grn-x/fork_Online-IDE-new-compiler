import { BaseSymbol } from "../../common/BaseSymbolTable.ts";
import { BaseType } from "../../common/BaseType.ts";
import { Error } from "../../common/Error";
import { Program } from "../../common/interpreter/Program";
import { IRange } from "../../common/range/Range";
import { TokenType, TokenTypeReadable } from "../TokenType";
import { JavaBaseModule } from "../module/JavaBaseModule";
import { JavaCompiledModule } from "../module/JavaCompiledModule.ts";
import { GenericTypeParameters, GenericTypeParameter } from "./GenericTypeParameter";
import { JavaArrayType } from "./JavaArrayType.ts";
import { IJavaClass, JavaClass } from "./JavaClass";
import { JavaEnum } from "./JavaEnum";
import { IJavaInterface, JavaInterface } from "./JavaInterface";
import { JavaType } from "./JavaType";
import { NonPrimitiveType } from "./NonPrimitiveType";
import { JavaParameter } from "./JavaParameter";
import { Visibility } from "./Visibility";
import { JavaAnnotation } from "./JavaAnnotation.ts";

export class JavaMethod extends BaseSymbol {

    isStatic: boolean = false;
    isFinal: boolean = false;
    isAbstract: boolean = false;

    isConstructor: boolean = false;

    isDefault: boolean = false;

    isSynchronized: boolean = false;

    annotations: JavaAnnotation[] = [];

    program?: Program;

    parameters: JavaParameter[] = [];
    hasOuterClassParameter: boolean = false;            // constructors of non-static inner classes have invisible first parameter with identifier outerClassAttributeIdentifier

    template?: string;      // only for library Methods, i.e. Math.sin
    constantFoldingFunction?: (...parms: any) => any;

    /**
     * undefined, if null
     */
    returnParameterType?: JavaType;

    implementsInterfaceOrAbstractMethod: boolean = false;

    declare module: JavaCompiledModule;

    private signatureCache: { [callingConvention: string]: string } = {}
    private signatureCacheWithGenericParameterIdentifiers: { [callingConvention: string]: string } = {}

    public hasImplementationWithNativeCallingConvention: boolean = false;

    classEnumInterface!: IJavaClass | JavaEnum | IJavaInterface;

    programStub?: string;       // only for debugging purposes

    callbackAfterCodeGeneration: (() => void)[] = [];

    isCopyOf?: JavaMethod;

    constructor(identifier: string, identifierRange: IRange, module: JavaBaseModule,
        public visibility: Visibility = TokenType.keywordPublic) {
        super(identifier, identifierRange, module);

    }

    canTakeNumberOfParameters(n: number) {
        if (this.parameters.length == 0) return n == 0;
        if (this.parameters[this.parameters.length - 1].isEllipsis) {
            return n >= this.parameters.length - 1;
        } else {
            return n == this.parameters.length;
        }
    }

    getCopyWithConcreteType(typeMap: Map<GenericTypeParameter, NonPrimitiveType>, genericClassOrInterfaceOrEnum: IJavaClass | JavaEnum | IJavaInterface): JavaMethod {

        let copyNeeded: boolean = false;
        let newParameters: JavaParameter[] = [];
        for (let p of this.parameters) {
            let copy = p.getCopyWithConcreteType(typeMap);
            newParameters.push(copy);
            if (copy != p) copyNeeded = true;
        }

        let newReturnParameter = this.returnParameterType;
        if (this.returnParameterType && !this.returnParameterType.isPrimitive) {
            newReturnParameter = (<NonPrimitiveType>this.returnParameterType).getCopyWithConcreteType(typeMap);
        }

        if (newReturnParameter != this.returnParameterType) copyNeeded = true;

        if (!copyNeeded) return this;

        let newMethod = new JavaMethod(this.identifier, this.identifierRange, this.module, this.visibility);
        newMethod.isConstructor = this.isConstructor;
        newMethod.isFinal = this.isFinal;
        newMethod.isAbstract = this.isAbstract;
        newMethod.isDefault = this.isDefault;
        newMethod.hasOuterClassParameter = this.hasOuterClassParameter;
        newMethod.parameters = newParameters;
        newMethod.returnParameterType = newReturnParameter;
        newMethod.hasImplementationWithNativeCallingConvention = this.hasImplementationWithNativeCallingConvention;
        newMethod.template = this.template;
        newMethod.classEnumInterface = genericClassOrInterfaceOrEnum;
        newMethod.isCopyOf = this;
        newMethod.documentation = this.documentation;

        this.getInternalName("java");
        this.getInternalName("native");
        newMethod.signatureCacheWithGenericParameterIdentifiers = this.signatureCache;

        return newMethod;

    }

    getCopy(): JavaMethod {

        let newParameters: JavaParameter[] = [];
        for (let p of this.parameters) newParameters.push(p.getCopy());

        let newMethod = new JavaMethod(this.identifier, this.identifierRange, this.module, this.visibility);
        newMethod.isConstructor = this.isConstructor;
        newMethod.isFinal = this.isFinal;
        newMethod.isAbstract = this.isAbstract;
        newMethod.returnParameterType = this.returnParameterType;
        newMethod.parameters = newParameters;
        newMethod.isCopyOf = this;

        return newMethod;

    }

    getInternalName(callingConvention: CallingConvention): string {
        if (!this.signatureCache[callingConvention]) {
            let cc = callingConvention == "java" ? "j" : "n";

            let shorthand = this.isConstructor ? 'c' : 'm';
            let s = `_${shorthand}${cc}$${this.isConstructor ? "_constructor_" : this.identifier.replace(/\./g, "_")}$${this.returnParameterType ? this.returnParameterType.getInternalName() : 'void'}$`;
            s += this.parameters.map(p => p.type.getInternalName()).join("$");
            this.signatureCache[callingConvention] = s;
        }
        return this.signatureCache[callingConvention];
    }

    getInternalNameWithGenericParameterIdentifiers(callingConvention: CallingConvention): string {
        if (!this.signatureCacheWithGenericParameterIdentifiers[callingConvention]) {
            this.signatureCacheWithGenericParameterIdentifiers[callingConvention] = this.getInternalName(callingConvention);
        }
        return this.signatureCacheWithGenericParameterIdentifiers[callingConvention];
    }

    takeInternalJavaNameWithGenericParamterIdentifiersFrom(method: JavaMethod) {
        this.signatureCacheWithGenericParameterIdentifiers["java"] = method.getInternalNameWithGenericParameterIdentifiers("java");
    }


    getSignature() {
        if (this.isConstructor) {
            return this.identifier + "(" + this.parameters.map(p => p.type.identifier).join(", ") + ")";
        } else {
            return this.returnParameterType?.identifier + " " + this.identifier + "(" + this.parameters.map(p => p.type.identifier).join(", ") + ")";
        }
    }

    getSignatureWithoutReturnParameter() {
        if (this.isConstructor) {
            return this.identifier + "(" + this.parameters.map(p => p.type.identifier).join(", ") + ")";
        } else {
            return this.identifier + "(" + this.parameters.map(p => p.type.identifier).join(", ") + ")";
        }
    }

    getDeclaration(): string {
        let decl: string = TokenTypeReadable[this.visibility] + " ";
        if (this.isStatic) decl += "static ";
        if (this.isFinal) decl += "final ";
        decl += this.returnParameterType?.toString() + " " + this.identifier;
        return decl + "(" + this.parameters.map(p => p.getDeclaration()).join(", ") + ")";
    }

    getPathWithMethodIdentifier(): string {
        return this.classEnumInterface.pathAndIdentifier + "." + this.getInternalNameWithGenericParameterIdentifiers("java");
    }

    getCompletionLabel() {
        
        let label = "";
        
        if (this.returnParameterType != null && this.returnParameterType.identifier != "void") {
            label += this.returnParameterType.toString() + " ";
        }

        label += this.identifier + "(";

        let parameters = this.parameters;
        for (let i = 0; i < parameters.length; i++) {

            let p = parameters[i];
            if (p.isEllipsis) {
                let arrayType: JavaArrayType = <any>p.type;
                label += arrayType.getElementType().toString() + "... " + p.identifier;
            } else {
                label += p.type.toString() + " " + p.identifier;
            }

            if (i < parameters.length - 1) {
                label += ", ";
            }

        }

        label += ")";

        return label;
    }

    getCompletionSnippet(leftBracketAlreadyThere: boolean) {

        if (leftBracketAlreadyThere) return this.identifier + "($0";

        let snippet = "";

        snippet += this.identifier + "(";

        let isVoidReturn = this.returnParameterType == null || this.returnParameterType.identifier == "void";
        let isVoidReturnDelta = isVoidReturn ? 1 : 0;

        let parameters = this.parameters;
        for (let i = 0; i < parameters.length; i++) {

            let p = parameters[i];
            snippet += "${" + ((i + 1) % (parameters.length + isVoidReturnDelta)) + ":" + p.identifier + "}";

            if (i < parameters.length - 1) {
                snippet += ", ";
            }

        }

        snippet += ")";

        if (this.returnParameterType == null || this.returnParameterType.identifier == "void") {
            snippet += ";$0";
        }

        return snippet;
    }


    hasAnnotation(identifier: string) {
        return this.annotations.find(a => a.identifier == identifier) != null;
    }
    
    getAnnotation(identifier: string){
        return this.annotations.find(a => a.identifier == identifier);
    }

    setAnnotations(annotations: JavaAnnotation[]) {
        this.annotations = annotations;
    }

    getType(): BaseType {
        return this.returnParameterType!;
    }


}


export class GenericMethod extends JavaMethod {

    constructor(identifier: string, identifierRange: IRange, module: JavaBaseModule,
        visibility: Visibility = TokenType.keywordPublic, public genericTypeParameters: GenericTypeParameters) {
        super(identifier, identifierRange, module, visibility);

    }

    initCatches() {
        for (let p of this.genericTypeParameters) {
            p.catches = [];
        }
    }

    checkCatches(methodCallPosition: IRange): Error[] {
        let errors: Error[] = [];
        for (let gp of this.genericTypeParameters) {
            gp.checkCatches(errors, methodCallPosition);
        }
        return errors;
    }

    getCopyWithConcreteTypes(): JavaMethod {

        let typeMap: Map<GenericTypeParameter, NonPrimitiveType> = new Map();

        for (let gp of this.genericTypeParameters) {
            typeMap.set(gp, gp.catches![0]);
        }

        return this.getCopyWithConcreteType(typeMap, this.classEnumInterface);

    }

    getDeclaration(): string {
        let decl: string = TokenTypeReadable[this.visibility] + " ";
        if (this.isStatic) decl += "static ";
        if (this.isFinal) decl += "final ";
        decl += "<" + this.genericTypeParameters.map(p => p.identifier).join(", ") + "> ";
        decl += this.returnParameterType?.toString() + " " + this.identifier;
        return decl + "(" + this.parameters.map(p => p.getDeclaration()).join(", ") + ")";
    }


}