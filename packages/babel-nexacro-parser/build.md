nexacro-parser build command

- run build 
```shell
$ make build
```

- run test 
```shell
$ BABEL_ENV=test node_modules/.bin/jest -u packages/babel-parser/test/xscript.js
```

- run build for publish
```shell
$ make prepublish-build
```

