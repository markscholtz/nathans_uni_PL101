//************************************************
// Helper functions
//************************************************

var endTime = function (time, expr) {
    // Base case
    if(expr.tag === 'note' || expr.tag === 'rest') {
        return time + expr.dur;
    }

    if(expr.tag === 'seq') {
        return endTime(time, expr.left) + endTime(time, expr.right);
    }

    if(expr.tag === 'par') {
        return Math.max(endTime(time, expr.left), endTime(time, expr.right));
    }
};

//************************************************
// Compiler
//************************************************

var compile = function(musexpr) {
    var noteArray = [];

    var getNotes = function(node, start) {
        var nextStart = 0;

        // Base case
        if(node.tag === 'note' || node.tag === 'rest') {
            node.start = start;
            start += node.dur;
            noteArray.push(node);
            return noteArray;
        }

        if(node.tag === 'seq') {
          nextStart = endTime(start, node.left);
        }

        if(node.tag === 'par') {
          // need to capture start time for next seq and then use the current start for
          // all subsequent par notes
          nextStart = start;
        }

        getNotes(node.left, start);
        getNotes(node.right, nextStart);

        return noteArray;
    };

    noteArray = getNotes(musexpr, 0);
    return noteArray;
};

//************************************************
// "Tests"
//************************************************

//************************************************
// "Tests: sequential"
//************************************************

var sequential_melody_input =
    { tag: 'seq',
      left:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

var sequential_melody_expected_output = [
    { tag: 'note', pitch: 'a4', dur: 250, start: 0 },
    { tag: 'note', pitch: 'b4', dur: 250, start: 250 },
    { tag: 'note', pitch: 'c4', dur: 500, start: 500 },
    { tag: 'note', pitch: 'd4', dur: 500, start: 1000 } ];

sequential_melody_output = compile(sequential_melody_input);
console.log('----> SEQUENTIAL melody output:');
console.log(sequential_melody_expected_output);
console.log('');
console.log('----> SEQUENTIAL melody expected output:');
console.log(sequential_melody_output);
console.log('');
console.log('');
console.log('');

//************************************************
// "Tests: sequential with rests"
//************************************************

var sequential_melody_rests_input =
    { tag: 'seq',
      left:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'rest', dur: 100 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

var sequential_melody_rests_expected_output = [
    { tag: 'note', pitch: 'a4', dur: 250, start: 0 },
    { tag: 'note', dur: 100, start: 250 },
    { tag: 'note', pitch: 'c4', dur: 500, start: 350 },
    { tag: 'note', pitch: 'd4', dur: 500, start: 850 } ];

sequential_melody_rests_output = compile(sequential_melody_rests_input);
console.log('----> SEQUENTIAL melody rests output:');
console.log(sequential_melody_rests_output);
console.log('');
console.log('----> SEQUENTIAL melody rests expected output:');
console.log(sequential_melody_rests_expected_output);
console.log('');
console.log('');
console.log('');

//************************************************
// "Tests: parallel"
//************************************************

var parallel_melody_input =
    { tag: 'seq',
      left:
       { tag: 'par',
         left: { tag: 'note', pitch: 'c3', dur: 250 },
         right: { tag: 'note', pitch: 'g4', dur: 500 } },
      right:
       { tag: 'par',
         left: { tag: 'note', pitch: 'd3', dur: 500 },
         right: { tag: 'note', pitch: 'f4', dur: 250 } } };

var parallel_melody_expected_output = [
    { tag: 'note', pitch: 'c3', dur: 250, start: 0 },
    { tag: 'note', pitch: 'g4', dur: 500, start: 0 },
    { tag: 'note', pitch: 'd3', dur: 500, start: 500 },
    { tag: 'note', pitch: 'f4', dur: 250, start: 500 } ];

parallel_melody_output = compile(parallel_melody_input);
console.log('----> PARALLEL melody output:');
console.log(parallel_melody_output);
console.log('');
console.log('----> PARALLEL melody expected output:');
console.log(parallel_melody_expected_output);
