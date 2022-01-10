import { declare } from "@babel/helper-plugin-utils";

export default declare((api, options) => {
  api.assertVersion(7);

  return {
    name: "syntax-xscript",

    manipulateOptions(opts, parserOpts) {

      parserOpts.plugins.push("xscript");
    },
  };
});
