import { declare } from "@babel/helper-plugin-utils";
import syntaxXScript from "@babel/plugin-syntax-xscript";
import { types as t, template } from "@babel/core";
import type { NodePath, Visitor } from "@babel/traverse";

const transform_template = function transform_include(source) {
  return `this.executeIncludeScript("${source}")`;
};

/*export default declare(api => {
  api.assertVersion(7);

  return {
    name: "transform-xscript",

    visitor: {
      NexacroIncludeDeclaration(path) {
          const source = path.node.source;
          if (!source) return;

          path.replaceWith(transform_template(source));
      },
    },
  };
});*/

export default declare(api => {
  api.assertVersion(7);

  return {
    name: "transform-xscript",

    pre(state) {
      this.includeList = new Array();
    },
    visitor: {
      ImportDeclaration(path) {
          const kind = path.node.importKind;
          const source = path.node.source;
          if (kind !== "include" || !source) return;

          this.includeList.push(source.value);
          //path.scope.parent.push({ id, init: path.node })

          path.replaceWithSourceString(transform_template(source.value));
      },
    },
    post(state) {
      console.log(this.includeList);
    }
  };
});
