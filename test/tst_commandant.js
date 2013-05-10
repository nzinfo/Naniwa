var assert = require("assert");

var Commandant = require('../commandant/builds/commandant');


describe('Commandant', function(){

    before(function(){
        var SceneCommandant = Commandant.define();

        // define the command.
        var tst_command =  {
            init: function (canvas, x, y) {
                return {
                    id: 1,
                    x: x,
                    y: y
                };
            },

            // Allow position to be changed while creating.
            update: function (canvas, data, x, y) {
                /*
                 var point = canvas.points[data.id];
                 point.x = x;
                 point.y = y;
                 return point;
                 */
                return "update";
            },

            run: function (canvas, data) {
                //var point = canvas.points[data.id] = { id: data.id, x: data.x, y: data.y };
                //return point;
                return "run"
            },

            undo: function (canvas, data) {
                return "undo";
            }
        }

        SceneCommandant.register('POINT_ADD', tst_command);

        var my_scene = {points: {}, id_counter: 0};
        var keen = new SceneCommandant(my_scene);

        this.keen = keen;

        var rs = this.keen.execute('POINT_ADD', 10,20);
    });

    describe('Test command ', function(){
        it('should execute command.', function(){
            //assert.equal(-1, [1,2,3].indexOf(5));
            //assert.equal(-1, [1,2,3].indexOf(0));
            /*
            var rs = this.keen.transient('POINT_ADD', 100, 100);
            keen.update(120, 80);
            keen.finishTransient();
            console.log(rs);
            */
            var rs = this.keen.execute('POINT_ADD', 10,20);

        })
    })
})


