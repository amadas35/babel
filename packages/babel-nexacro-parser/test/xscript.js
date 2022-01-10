import { parse } from '../lib/index.js';

function getParser(code) {
  return () => parse(code, { 
    sourceType: 'script',
    
    plugins: [
      /*"typescript",*/
      "xscript"
    ]
  });
}

describe('nexacro xscript syntax', function() {
  it('should parse', function() {
    expect(getParser(`include 'test.xjs';`)()).toMatchSnapshot();
  });
});

// run test
// Run in Ubuntu
// $>TEST_ONLY=babel-parser TEST_GREP="curry function" make test-only
//   or (for direct call this test)
// $>BABEL_ENV=test node_modules/.bin/jest -u packages/babel-parser/test/xscript.js