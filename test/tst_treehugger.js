var assert = require("assert");

var tree = require("../treehugger/lib/treehugger/tree");

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      var node = tree.cons("Add", [tree.cons("Num", [tree.string("2")]),
            tree.cons("Mul", [tree.cons("Num", [tree.string("3")]),
                tree.cons("Num", [tree.string("1")])])]);
    })
  })
})

