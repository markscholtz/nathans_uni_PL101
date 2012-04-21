var compiler = require('../mus/compiler.js');

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

parallel_melody_output = compiler.compile(parallel_melody_input);
console.log('----> PARALLEL melody output:');
console.log(parallel_melody_output);
console.log('');
console.log('----> PARALLEL melody expected output:');
console.log(parallel_melody_expected_output);
console.log('');
console.log('');
console.log('');
