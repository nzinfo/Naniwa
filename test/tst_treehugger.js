var assert = require("assert");

var tree = require("../treehugger/lib/treehugger/tree");

/*
var requirejs = require("requirejs");
//var requirejs = require('../treehugger/lib/require');
requirejs.config({nodeRequire: require});
//console.log(requirejs);
var tree = requirejs('../treehugger/lib/treehugger/tree');
*/

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
      var node = tree.cons("Add", [tree.cons("Num", [tree.string("2")]),
            tree.cons("Mul", [tree.cons("Num", [tree.string("3")]),
                tree.cons("Num", [tree.string("1")])])]);
    })
  })
})

