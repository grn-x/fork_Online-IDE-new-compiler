import { Klass } from "../../../common/interpreter/StepFunction";
import { SystemModule } from "../../runtime/system/SystemModule";
import { GenericTypeParameter } from "../../types/GenericTypeParameter";
import { JavaType } from "../../types/JavaType";
import { JavaTypeStore } from "../JavaTypeStore";
import { JavaLibraryModule, JavaTypeMap, LibraryKlassType } from "./JavaLibraryModule";
import { LibraryDeclarationParser } from "./LibraryDeclarationParser";

export class JavaLibraryModuleManager {

    libraryModules: JavaLibraryModule[] = [];
    javaTypes: JavaType[] = [];
    typestore: JavaTypeStore;
    systemModule: SystemModule;

    constructor(...additionalModules: JavaLibraryModule[]){
        this.systemModule = new SystemModule();
        this.libraryModules.push(this.systemModule)
        if(additionalModules){
            this.libraryModules.push(...additionalModules);
        }

        this.typestore = new JavaTypeStore();
        this.compileClassesToTypes();

        let ldp: LibraryDeclarationParser = new LibraryDeclarationParser(this.systemModule);
        ldp.parseClassOrEnumOrInterfaceDeclarationWithoutGenerics(this.systemModule.primitiveStringClass, this.systemModule);
        ldp.parseClassOrInterfaceDeclarationGenericsAndExtendsImplements(this.systemModule.primitiveStringClass, this.typestore, this.systemModule);
        ldp.parseFieldsAndMethods(this.systemModule.primitiveStringClass, this.typestore, this.systemModule);

        this.typestore.initFastExtendsImplementsLookup();

    }

    compileClassesToTypes(){
        let ldp: LibraryDeclarationParser = new LibraryDeclarationParser(this.systemModule);
        this.typestore.empty;
        this.javaTypes = [];

        ldp.currentTypeStore = this.typestore;
    
        for(let module of this.libraryModules){
            for (let klass of module.classes) {
                let npt = ldp.parseClassOrEnumOrInterfaceDeclarationWithoutGenerics(klass, module);
                this.typestore.addType(npt);
                this.javaTypes.push(npt);        
            }

            for(let type of module.types){
                this.typestore.addType(type);
                this.javaTypes.push(type);
            }

        }

        let classToGenericTypeParameterMap: Map<Klass, Record<string, GenericTypeParameter>> = new Map();

        for(let module of this.libraryModules){
            for(let klass of module.classes){
                let genericTypeParameterMap: Record<string, GenericTypeParameter> = {};
                classToGenericTypeParameterMap.set(klass, genericTypeParameterMap);
                ldp.genericParameterMapStack.push(genericTypeParameterMap);
                ldp.parseClassOrInterfaceDeclarationGenericsAndExtendsImplements(klass, this.typestore, module);
                ldp.genericParameterMapStack.pop();
            }
        }        

        for(let module of this.libraryModules){
            for(let klass of module.classes){
                ldp.genericParameterMapStack.push(classToGenericTypeParameterMap.get(klass)!);
                ldp.parseFieldsAndMethods(klass, this.typestore, module);
                ldp.genericParameterMapStack.pop();
            }
        }        

        for(let javaClass of this.typestore.getClasses()){
            javaClass.checkIfInterfacesAreImplementedAndSupplementDefaultMethods();
        }
    }

    getTypeCompletionItems(rangeToReplace: monaco.IRange): monaco.languages.CompletionItem[] {
        return this.typestore.getTypeCompletionItems(undefined, rangeToReplace, false, true);
    }


}