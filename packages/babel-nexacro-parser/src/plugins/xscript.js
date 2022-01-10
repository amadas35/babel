
import * as charCodes from "charcodes";

import type Parser from "../parser";
import { tt, type TokenType, tokenIsNexacroIncludeKeyword } from "../tokenizer/types";
import * as N from "../types";

import type { ExpressionErrors } from "../parser/util";
import { Errors, makeErrorTemplates, ErrorCodes } from "../parser/error";

const NexacroSyntaxErrors = makeErrorTemplates(
    {
      MissingIncludeSpecifier: "'include' specifier is required.",
      UnexpectedInclude: "'include' may only appear at the top level.",
    },
    /* code */ ErrorCodes.SyntaxError,
    /* syntaxPlugin */ "xscript",
  );

/* eslint-disable sort-keys */


function hasIncludeKind(node: N.Node): boolean {
  return node.includeKind === "value";
}

function isNexacroKeyword(type: TokenType): boolean {
  return tokenIsNexacroIncludeKeyword(type);
}

export default (superClass: Class<Parser>): Class<Parser> =>
  class extends superClass {
    shouldParseTypes(): boolean {
      return this.getPluginOption("xscript", "all");
    }

    // ==================================
    // Overrides
    // ==================================   
    parseStatementContent(context: ?string, topLevel: ?boolean): N.Statement {
        let starttype = this.state.type;
        const node = this.startNode();
        let kind;

        if (this.isLet(context)) {
            starttype = tt._var;
            kind = "let";
        }

        if (starttype === tt._include) {
            if (!topLevel) {
                this.raise(this.state.start, NexacroSyntaxErrors.UnexpectedInclude);
            }
                
            this.next();
                
            return this.parseNexacroInclude(node);
        }

        return super.parseStatementContent(context, topLevel);
    }

    /*parseNexacroInclude(node: N.Node): N.NexacroIncludeDeclaration {
        // include '...'
        //node.specifiers = [];
        if (!this.match(tt.string)) {
          throw this.raise(this.state.start, NexacroSyntaxErrors.MissingIncludeSpecifier);
        }
      
        node.source = this.parseNexacroIncludeSource();
      
        this.semicolon();
        return this.finishNode(node, "NexacroIncludeDeclaration");
    }*/
    parseNexacroInclude(node: N.Node): N.ImportDeclaration {
      // include '...'
      node.specifiers = [];
      if (!this.match(tt.string)) {
        throw this.raise(this.state.start, NexacroSyntaxErrors.MissingIncludeSpecifier);
      }
    
      node.source = this.parseNexacroIncludeSource();
      node.importKind = "include";
    
      this.semicolon();
      return this.finishNode(node, "ImportDeclaration");
  }
      
    parseNexacroIncludeSource(): N.StringLiteral {
        if (!this.match(tt.string)) this.unexpected();
        return this.parseStringLiteral(this.state.value);
    }

    parseTopLevel(file: N.File, program: N.Program): N.File {
       const fileNode = super.parseTopLevel(file, program);
    //   if (this.state.hasFlowComment) {
    //     this.raise(this.state.pos, FlowErrors.UnterminatedFlowComment);
    //   }
       return fileNode;
    }
  };
