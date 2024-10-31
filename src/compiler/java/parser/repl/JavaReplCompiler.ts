import { Executable } from "../../../common/Executable.ts";
import { Program } from "../../../common/interpreter/Program.ts";
import { TypeResolver } from "../../TypeResolver/TypeResolver.ts";
import { JavaSymbolTable } from "../../codegenerator/JavaSymbolTable.ts";
import { Lexer } from "../../lexer/Lexer.ts";
import { JavaReplCodeGenerator } from "./JavaReplCodeGenerator.ts";
import { JavaReplCompiledModule } from "./JavaReplCompiledModule.ts";
import { JavaReplParser } from "./JavaReplParser.ts";

export class JavaReplCompiler {

    compile(code: string, symbolTable: JavaSymbolTable, executable: Executable, withToStringCall: boolean): {module: JavaReplCompiledModule, program: Program | undefined} {
        let replCompiledModule: JavaReplCompiledModule = new JavaReplCompiledModule(code);

        let lexerOutput = new Lexer().lex(code);
        replCompiledModule.setLexerOutput(lexerOutput);

        let replParser = new JavaReplParser(replCompiledModule);
        replParser.parse();

        let libraryTypestore = executable.libraryModuleManager.typestore;
        let compiledTypesTypestore = executable.moduleManager.typestore;

        let typeResolver = new TypeResolver(executable.moduleManager, executable.libraryModuleManager);
        typeResolver.dirtyModules = [replCompiledModule];

        if(typeResolver.resolve()){

            let replCodeGenerator = new JavaReplCodeGenerator(replCompiledModule, libraryTypestore,
                compiledTypesTypestore, executable.exceptionTree);

            let program = replCodeGenerator.start(symbolTable, withToStringCall);
            return {
                module: replCompiledModule,
                program: program
            }

        }

        return {
            module: replCompiledModule,
            program: undefined
        }

    }



}