import { declare } from "@babel/helper-plugin-utils";
import transformTypeScript from "@babel/plugin-transform-xscript";
import normalizeOptions from "./normalize-options";

export default declare((api, opts) => {
  api.assertVersion(7);

  const {
  } = normalizeOptions(opts);

  return {
  };
});
