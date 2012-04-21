var compiler = require('../mus/compiler.js');

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

sequential_melody_rests_output = compiler.compile(sequential_melody_rests_input);
console.log('----> SEQUENTIAL melody rests output:');
console.log(sequential_melody_rests_output);
console.log('');
console.log('----> SEQUENTIAL melody rests expected output:');
console.log(sequential_melody_rests_expected_output);
console.log('');
console.log('');
console.log('');
